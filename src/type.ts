export interface ProductType {
  _id: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  stock: number;
  image: string;
  category: "KIDS" | "MEN" | "WOMEN" | "UNISEX";
  description: string;
  usage: string;

  createdAt: string;
  updatedAt: string;
}

export interface CartItemUiType {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  total: number;
}
export interface CartItemType {
  productId: string;
  qty: number;
}
