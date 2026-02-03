export interface ProductType {
  _id: string;

  name: string;
  brand: string;
  price: number;
  qty: number;
  stock: boolean;
  image: string;
  category: "KIDS" | "MEN" | "WOMEN" | "UNISEX";
  description: string;
  usage: string;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
