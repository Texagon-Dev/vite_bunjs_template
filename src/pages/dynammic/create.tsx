import { createUser } from "@services";
import { useNavigate, Link, createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";

import { DefaultURLSearchPaginationParamters } from "@/types";

export const Route = createFileRoute("/dynammic/create")({
  component: CreateUserPage,
});

function CreateUserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!user.name || !user.email) return alert("Name and Email are required");

    await createUser(user);
    navigate({
      to: "/dynammic",
      search: DefaultURLSearchPaginationParamters,
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="john@example.com"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save
          </button>
          <Link
            to="/dynammic"
            search={{
              page: 1,
              pageSize: 10,
              sortBy: "createdAt",
              sortDir: "desc",
              q: "",
            }}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
