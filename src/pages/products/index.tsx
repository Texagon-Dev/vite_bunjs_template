import { Link, useNavigate, useSearch, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Pagination } from "@/components/Pagination";
import { ProductService } from "@/services";
import { useProductStore } from "@/store/productstore/ProductStore";
import type { Category } from "@/types/product";

export type ProductsSearch = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  q?: string;
  category?: string;
};

const DefaultProductsSearchParams: Required<Omit<ProductsSearch, never>> = {
  page: 1,
  pageSize: 10,
  sortBy: "title",
  sortDir: "asc",
  q: "",
  category: "",
};

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
  validateSearch: (s: ProductsSearch) => ({
    page: Number(s.page ?? 1),
    pageSize: Number(s.pageSize ?? 10),
    sortBy: String(s.sortBy ?? "title"),
    sortDir: s.sortDir === "asc" || s.sortDir === "desc" ? s.sortDir : "asc",
    q: String(s.q ?? ""),
    category: String(s.category ?? ""),
  }),
});

function ProductsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/products/" });
  const { items, total, loading, fetch } = useProductStore();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void ProductService.categories().then((cats) => setCategories(cats));
  }, []);

  useEffect(() => {
    const limit = Number(search.pageSize) || 10;
    const page = Number(search.page) || 1;
    const skip = Math.max(0, (page - 1) * limit);
    void fetch({
      limit,
      skip,
      sortBy: search.sortBy as "title" | "price" | "rating" | "stock",
      order: search.sortDir,
      q: search.q || undefined,
      category: search.category ? search.category : undefined,
    });
  }, [
    search.page,
    search.pageSize,
    search.q,
    search.sortBy,
    search.sortDir,
    search.category,
    fetch,
  ]);

  const page = Number(search.page) || 1;
  const pageSize = Number(search.pageSize) || 10;

  const onPageChange = (next: number): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({ ...DefaultProductsSearchParams, ...prev, page: next }),
    });
  };
  const onPageSizeChange = (size: number): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({ ...DefaultProductsSearchParams, ...prev, pageSize: size, page: 1 }),
    });
  };
  const onQueryChange = (q: string): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({ ...DefaultProductsSearchParams, ...prev, q, page: 1 }),
    });
  };
  const onCategoryChange = (cat: string): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({ ...DefaultProductsSearchParams, ...prev, category: cat, page: 1 }),
    });
  };
  const onSortChange = (sortBy: string): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({ ...DefaultProductsSearchParams, ...prev, sortBy, page: 1 }),
    });
  };
  const onSortDirToggle = (): void => {
    void navigate({
      to: "/products",
      search: (prev) => ({
        ...DefaultProductsSearchParams,
        ...prev,
        sortDir: prev.sortDir === "asc" ? "desc" : "asc",
        page: 1,
      }),
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded px-3 py-2"
            value={search.q}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search products"
          />
          <select
            className="border rounded px-2 py-2"
            value={search.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-2"
            value={search.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort field"
          >
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="stock">Stock</option>
          </select>
          <button
            type="button"
            className="px-3 py-2 border rounded"
            onClick={() => onSortDirToggle()}
            aria-label="Toggle sort direction"
          >
            {search.sortDir === "asc" ? "Asc" : "Desc"}
          </button>
          <Link
            to="/products/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-3 py-4">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-4">
                  No products found
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link
                      to="/products/$productId"
                      params={{ productId: String(p.id) }}
                      className="text-blue-600 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">${p.price}</td>
                  <td className="px-3 py-2">{p.category ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
