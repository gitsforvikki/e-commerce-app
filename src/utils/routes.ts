export const routes = {
  HOME: "/",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCTS: "/products",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  COOKIE: "/cookie",
  PROFILE: "/profile",
  ORDER: "/orders",
  CHECKOUT: "/checkout",
  SPECIFIC_PRODUCT: (category: string, slug?: string) => {
    if (slug) {
      const formattedCategory = category ? category.toLowerCase().trim() : "products";
      return `/${formattedCategory}/${slug}`;
    }
    return `/products/${category}`;
  },
};
