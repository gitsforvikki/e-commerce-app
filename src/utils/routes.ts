export const routes = {
  HOME: "/",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCTS: "/products",
  ABOUT: "/about",
  CONTACT: "/contact",
  SPECIFIC_PRODUCT: (slug: string) => `product/${slug}`,
};
