import { api } from "@/services/http/client";
import type { Product, ProductListResponse, ProductQuery, Category } from "@/types/product";

function toQuery(q: ProductQuery = {}): string {
  const params = new URLSearchParams();
  if (q.limit != null) params.set("limit", String(q.limit));
  if (q.skip != null) params.set("skip", String(q.skip));
  if (q.select) params.set("select", q.select);
  if (q.sortBy) params.set("sortBy", String(q.sortBy));
  if (q.order) params.set("order", q.order);
  if (q.q) params.set("q", q.q);
  return params.toString();
}

export const ProductService = {
  async list(query: ProductQuery = {}): Promise<ProductListResponse> {
    const qs = toQuery(query);
    return api.get<ProductListResponse>(`/products${qs ? `?${qs}` : ""}`);
  },

  async get(id: number | string): Promise<Product> {
    return api.get<Product>(`/products/${id}`);
  },

  async search(q: string, query: Omit<ProductQuery, "q"> = {}): Promise<ProductListResponse> {
    const qs = toQuery({ ...query, q });
    return api.get<ProductListResponse>(`/products/search${qs ? `?${qs}` : ""}`);
  },

  async categories(): Promise<Category[]> {
    return api.get<Category[]>("/products/categories");
  },

  async categoryList(): Promise<string[]> {
    return api.get<string[]>("/products/category-list");
  },

  async byCategory(category: string, query: ProductQuery = {}): Promise<ProductListResponse> {
    const qs = toQuery(query);
    return api.get<ProductListResponse>(
      `/products/category/${encodeURIComponent(category)}${qs ? `?${qs}` : ""}`,
    );
  },

  async add(payload: Partial<Product>): Promise<Product> {
    return api.post<Product>("/products/add", payload);
  },

  async update(id: number | string, payload: Partial<Product>): Promise<Product> {
    return api.put<Product>(`/products/${id}`, payload);
  },

  async remove(
    id: number | string,
  ): Promise<{ id: number; isDeleted: boolean; deletedOn?: string }> {
    return api.delete<{ id: number; isDeleted: boolean; deletedOn?: string }>(`/products/${id}`);
  },
};
