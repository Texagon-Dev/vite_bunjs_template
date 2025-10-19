import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { ProductService } from "@/services/product/productService";
import type { Product, ProductListResponse, ProductQuery } from "@/types/product";

export type ProductState = {
  items: Product[];
  total: number;
  loading: boolean;
  error?: string;
  // query state
  limit: number;
  skip: number;
  sortBy?: ProductQuery["sortBy"];
  order?: ProductQuery["order"];
  q?: string;
  category?: string;
};

export type ProductActions = {
  fetch: (query?: Partial<ProductQuery>) => Promise<void>;
  get: (id: number | string) => Promise<Product | undefined>;
  search: (q: string, query?: Omit<ProductQuery, "q">) => Promise<void>;
  byCategory: (category: string, query?: Partial<ProductQuery>) => Promise<void>;
  categories: () => Promise<import("@/types/product").Category[]>;
  add: (payload: Partial<Product>) => Promise<Product>;
  update: (id: number | string, payload: Partial<Product>) => Promise<Product>;
  remove: (id: number | string) => Promise<void>;
  setQuery: (query: Partial<ProductQuery>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
};

const initialState: ProductState = {
  items: [],
  total: 0,
  loading: false,
  error: undefined,
  limit: 10,
  skip: 0,
  sortBy: undefined,
  order: undefined,
  q: undefined,
  category: undefined,
};

export const useProductStore = create<ProductState & ProductActions>()(
  devtools((set, get) => ({
    ...initialState,

    async fetch(query = {}) {
      const state = get();
      const merged: ProductQuery = {
        limit: state.limit,
        skip: state.skip,
        sortBy: state.sortBy,
        order: state.order,
        q: state.q,
        category: state.category,
        ...query,
      };
      set({ loading: true, error: undefined });
      try {
        let resp: ProductListResponse;
        if (merged.category) {
          resp = await ProductService.byCategory(merged.category, merged);
        } else if (merged.q) {
          resp = await ProductService.search(merged.q, merged);
        } else {
          resp = await ProductService.list(merged);
        }
        set({
          items: resp.products,
          total: resp.total,
          limit: resp.limit,
          skip: resp.skip,
          loading: false,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load products";
        set({ error: message, loading: false });
      }
    },

    async get(id) {
      try {
        return await ProductService.get(id);
      } catch {
        return undefined;
      }
    },

    async search(q, query = {}) {
      await get().fetch({ ...query, q });
    },

    async byCategory(category, query = {}) {
      await get().fetch({ ...query, category });
    },

    async categories() {
      return await ProductService.categories();
    },

    async add(payload) {
      const created = await ProductService.add(payload);
      set((s) => ({ items: [created, ...s.items], total: s.total + 1 }));
      return created;
    },

    async update(id, payload) {
      const updated = await ProductService.update(id, payload);
      set((s) => ({
        items: s.items.map((it) => (it.id === updated.id ? { ...it, ...updated } : it)),
      }));
      return updated;
    },

    async remove(id) {
      await ProductService.remove(id);
      set((s) => ({
        items: s.items.filter((it) => it.id !== Number(id)),
        total: Math.max(0, s.total - 1),
      }));
    },

    setQuery(query) {
      const next: Partial<ProductState> = {};
      if (query.limit != null) next.limit = query.limit;
      if (query.skip != null) next.skip = query.skip;
      if (query.sortBy !== undefined) next.sortBy = query.sortBy;
      if (query.order !== undefined) next.order = query.order;
      if (query.q !== undefined) next.q = query.q;
      if (query.category !== undefined) next.category = query.category;
      set(next as ProductState);
    },

    setPage(page) {
      const { limit } = get();
      const skip = Math.max(0, (page - 1) * limit);
      set({ skip });
    },

    setPageSize(pageSize) {
      set({ limit: pageSize, skip: 0 });
    },

    reset() {
      set({ ...initialState });
    },
  })),
);
