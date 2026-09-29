/**
 * Inventory Service
 * -----------------
 * Handles all stock-related operations in one place:
 *
 *   1. validateStock    → Check if products have enough stock (pre-order)
 *   2. decrementStock   → Reduce stock atomically after payment success
 *   3. restoreStock     → Roll back stock if settlement fails mid-way
 *
 * Each function is small, testable, and used by the order service.
 */

import { Product } from "@/models/Product";
import { Types } from "mongoose";
import type mongoose from "mongoose";

// ── Types ──────────────────────────────────────────────────────────

export interface StockItem {
  productId: Types.ObjectId;
  name: string;
  qty: number;
}

// ── Errors ─────────────────────────────────────────────────────────

export class InsufficientStockError extends Error {
  public productName: string;

  constructor(productName: string) {
    super(`Insufficient stock for "${productName}"`);
    this.name = "InsufficientStockError";
    this.productName = productName;
  }
}

// ── 1. Validate Stock ──────────────────────────────────────────────

/**
 * Checks that every product in the list has enough stock.
 * Call this BEFORE creating an order to fail fast.
 *
 * @param items     - cart items with productId, name, and qty
 * @param products  - fetched product documents from DB
 * @throws {InsufficientStockError} if any product has insufficient stock
 */
export function validateStock(
  items: StockItem[],
  products: Array<{ _id: Types.ObjectId; name: string; qty: number }>,
) {
  for (const item of items) {
    const product = products.find(
      (p) => p._id.toString() === item.productId.toString(),
    );

    if (!product) {
      throw new Error(`Product "${item.name}" is no longer available`);
    }

    if (!Number.isInteger(item.qty) || item.qty < 1) {
      throw new Error(`Invalid quantity for "${item.name}"`);
    }

    if (item.qty > product.qty) {
      throw new InsufficientStockError(product.name);
    }
  }
}

// ── 2. Decrement Stock ─────────────────────────────────────────────

/**
 * Atomically decrements stock for each item using MongoDB's `$inc`.
 * Uses the condition `qty >= item.qty` to prevent going negative.
 *
 * If any item fails (e.g., stock was purchased by someone else
 * between order creation and payment), it rolls back all
 * previously decremented items automatically.
 *
 * @param items          - order items to decrement
 * @param session        - optional MongoDB session for transactions
 * @returns              - list of decremented items (for tracking)
 * @throws {InsufficientStockError} if any product ran out of stock
 */
export async function decrementStock(
  items: StockItem[],
  session?: mongoose.ClientSession,
): Promise<StockItem[]> {
  const decremented: StockItem[] = [];

  try {
    for (const item of items) {
      const query = Product.updateOne(
        { _id: item.productId, qty: { $gte: item.qty } },
        { $inc: { qty: -item.qty } },
      );

      if (session) query.session(session);
      const result = await query;

      // If modifiedCount !== 1, the stock wasn't enough
      if (result.modifiedCount !== 1) {
        throw new InsufficientStockError(item.name);
      }

      // Track what we've decremented (for rollback if needed)
      if (!session) {
        decremented.push(item);
      }
    }

    return decremented;
  } catch (error) {
    // If we're NOT inside a transaction, manually roll back
    // (transactions handle rollback automatically via abort)
    if (!session && decremented.length > 0) {
      await restoreStock(decremented);
    }

    throw error;
  }
}

// ── 3. Restore Stock ───────────────────────────────────────────────

/**
 * Adds stock back for each item (undo a decrement).
 * Used when settlement fails AFTER some stock was already deducted.
 *
 * @param items - items to restore
 */
export async function restoreStock(items: StockItem[]): Promise<void> {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.productId },
        { $inc: { qty: item.qty } },
      ),
    ),
  );
}
