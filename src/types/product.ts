export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductQuery = {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: keyof Product | "title" | "price" | "rating" | "stock";
  order?: "asc" | "desc";
  q?: string;
  category?: string;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};
