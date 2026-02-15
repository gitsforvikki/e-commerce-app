import { Cart } from "@/models/Cart-model";
import { Order } from "@/models/Order-model";
import { Product } from "@/models/Product";
import mongoose, { Types } from "mongoose";

export interface ShippingAddressType {
  name: string;
  phone: string;
  city: string;
  home: string;
  state: string;
  pincode: string;
}

export const createOrderService = async ({
  userId,
  shippingAddress,
}: {
  userId: string;
  shippingAddress: ShippingAddressType;
}) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //get cart
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    //collect products ids
    const productIds = cart?.items?.map((i: any) => i.productId);

    //find products from DB
    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    if (!products.length) {
      throw new Error("Product not found");
    }

    // Build Order Snapshot Items
    const orderITems = [];
    let totalAmount = 0;

    for (let cartItem of cart.items) {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString(),
      );
      if (!product) {
        throw new Error(`${product.name} not found`);
      }

      //stock validation
      if (cartItem.qty > product.qty) {
        throw new Error(`${product.name} is out of stock`);
      }
      //calculate total amount of order
      const itemTotal = product?.price * cartItem.qty;
      totalAmount += itemTotal;

      orderITems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: cartItem.qty,
      });
    }
    //create order
    const order = new Order({
      userId: new Types.ObjectId(userId),
      items: orderITems,
      totalAmount,
      shippingAddress,

      payment: {
        status: "PENDING",
        method:"Razorpay"
      },

      status: "CREATED",
    });

    await order.save({ session });

    await session.commitTransaction();
    return {
      success: true,
      order: order,
    };
  } catch (err: any) {
    console.log(err);
    await session.abortTransaction();
    throw new Error(err.message || "Order creation failed");
  } finally {
    session.endSession();
  }
};
