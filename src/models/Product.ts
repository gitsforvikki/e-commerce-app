import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    brand: { type: String, required: [true, "Brand is required"] },
    qty: { type: Number, required: [true, "Quantity is required"] },
    image: { type: String, required: [true, "Image URL is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    category: {
      type: String,
      enum: ["KIDS", "MEN", "WOMEN"],
      required: [true, "Category is required"],
    },
    stock: { type: Number, required: [true, "Stock is required"] },
    usage: { type: String, required: [true, "Usage is required"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
