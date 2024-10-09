export const API_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : `http://localhost:4200`;
export const IS_CLIENT = typeof window !== "undefined";
