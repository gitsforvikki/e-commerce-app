"use client";

import Image from "next/image";
import { addProduct, ProductFormState } from "@/server-actions/product.actions";
import { useActionState, useState } from "react";

const initialState: ProductFormState = {
  success: false,
};

export const UploadProductForm = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, action] = useActionState(addProduct, initialState);
  async function handleImageUpload(file: File) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.url);
    setLoading(false);
  }

  return (
    <div className="mx-auto px-24">
      <form
        action={action}
        className="max-w-md mx-auto space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        {/* Product Name */}
        <input
          name="name"
          placeholder="Product name"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
        {/* Product brand */}
        <input
          name="brand"
          placeholder="Product brand"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.brand && (
          <p className="text-red-500">{state.errors.brand[0]}</p>
        )}
        {/* Price */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />

        {/* Product descrption */}
        <textarea
          name="description"
          placeholder="Product description"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.description && (
          <p className="text-red-500">{state.errors.description[0]}</p>
        )}

        {/* Product category */}
        <select
          name="category"
          className="w-full bg-gray-900 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select category</option>
          <option value="KIDS">KIDS</option>
          <option value="MEN">MEN</option>
          <option value="WOMEN">WOMEN</option>
        </select>
        {state.errors?.category && (
          <p className="text-red-500">{state.errors.category[0]}</p>
        )}

        {/* Product quantity */}
        <input
          name="qty"
          type="number"
          placeholder="Product quantity"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.qty && (
          <p className="text-red-500">{state.errors.qty[0]}</p>
        )}

        {/* Product usage */}
        <textarea
          name="usage"
          placeholder="Product usage"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.usage && (
          <p className="text-red-500">{state.errors.usage[0]}</p>
        )}

        {/* Product stock */}
        <input
          name="stock"
          type="number"
          placeholder="Product stock"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:text-white"
        />
        {state.errors?.stock && (
          <p className="text-red-500">{state.errors.stock[0]}</p>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files![0])}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:border-gray-700 dark:text-gray-400"
          />
        </div>

        {/* Uploading state */}
        {loading && (
          <p className="text-sm text-blue-600 animate-pulse">
            Uploading image...
          </p>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="flex justify-center">
            <Image
              src={imageUrl}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg border border-gray-200 object-cover shadow-sm dark:border-gray-700"
            />
          </div>
        )}

        {/* Hidden image url */}
        <input type="hidden" name="image" value={imageUrl} />

        {/* Submit */}
        <button
          type="submit"
          disabled={!imageUrl}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};
