import { useNavigate, createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";

import { ProductService } from "@/services";

export const Route = createFileRoute("/products/create")({
  component: CreateProductPage,
});

function CreateProductPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await ProductService.add({ title, price, category });
      void navigate({
        to: "/products",
        search: {
          page: 1,
          pageSize: 10,
          sortBy: "title",
          sortDir: "asc",
          q: "",
          category: "",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
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
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <Link
            to="/products"
            search={{ page: 1, pageSize: 10, sortBy: "title", sortDir: "asc", q: "", category: "" }}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
