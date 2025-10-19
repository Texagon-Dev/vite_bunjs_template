import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

import { ProductService } from "@/services";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/products/$productId" });
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void ProductService.get(productId)
      .then((p) => setProduct(p))
      .finally(() => setLoading(false));
  }, [productId]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (product) {
      setTitle(product.title ?? "");
      setPrice(product.price ?? 0);
      setCategory(product.category ?? "");
    }
  }, [product]);

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!product) return;
    await ProductService.update(product.id, { title, price, category });
    void navigate({
      to: "/products",
      search: { page: 1, pageSize: 10, sortBy: "title", sortDir: "asc", q: "", category: "" },
    });
  };

  const handleDelete = async (): Promise<void> => {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    await ProductService.remove(product.id);
    void navigate({
      to: "/products",
      search: { page: 1, pageSize: 10, sortBy: "title", sortDir: "asc", q: "", category: "" },
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>

      <form
        onSubmit={(e) => {
          void handleSave(e);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-1 font-medium">
            Price
          </label>
          <input
            id="price"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Category
          </label>
          <input
            id="category"
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            className="text-red-600 px-4 py-2 border rounded hover:bg-red-50"
          >
            Delete
          </button>
          <Link
            to="/products"
            search={{ page: 1, pageSize: 10, sortBy: "title", sortDir: "asc", q: "", category: "" }}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
