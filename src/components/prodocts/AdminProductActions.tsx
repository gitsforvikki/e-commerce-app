"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { deleteProductAction } from "@/server-actions/product.actions";
import { routes } from "@/utils/routes";
import { Pencil, Trash2, Loader2, Shield } from "lucide-react";

/**
 * AdminProductActions
 * -------------------
 * Edit & Delete buttons that only render for ADMIN users.
 * Placed on the product detail page alongside product info.
 */
export function AdminProductActions({
  productId,
  productName,
}: {
  productId: string;
  productName?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Close modal on Escape key
  useEffect(() => {
    if (!showConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        setShowConfirm(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirm, isPending]);

  // Only show for ADMIN users
  const isAdmin = !loading && user?.role?.toString().toUpperCase() === "ADMIN";
  if (!isAdmin) return null;

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result?.success) {
        router.push(routes.PRODUCTS);
        router.refresh();
      } else {
        setError(result?.error ?? "Failed to delete product");
        setShowConfirm(false);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/40 dark:bg-violet-950/20 p-4 space-y-3">
      {/* Admin Panel Header */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
          <Shield size={12} />
          Admin Controls
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Visible to administrators only
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Edit Button */}
        <button
          type="button"
          onClick={() => router.push(routes.EDIT_PRODUCT(productId))}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:border-violet-400 dark:hover:border-violet-600 shadow-2xs transition-colors cursor-pointer"
        >
          <Pencil size={15} />
          <span>Edit Product</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-400 dark:hover:border-rose-600 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Trash2 size={15} />
          <span>Delete Product</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <p
          role="alert"
          className="text-xs text-rose-600 dark:text-rose-400 font-medium"
        >
          {error}
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={() => !isPending && setShowConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <Trash2 className="text-rose-600 dark:text-rose-400" size={22} />
              </div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-bold text-center text-slate-900 dark:text-white"
              >
                Delete Product?
              </h3>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
                {productName ? (
                  <>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      &quot;{productName}&quot;
                    </span>
                    ? This action cannot be undone.
                  </>
                ) : (
                  "This action cannot be undone. The product will be permanently removed from the catalog."
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-rose-600/20"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

