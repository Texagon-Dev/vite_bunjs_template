import { getUserById, updateUser, type User } from "@services";
import { useNavigate, useParams, Link, createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

import { DefaultURLSearchPaginationParamters } from "@/types";

export const Route = createFileRoute("/dynammic/$userId")({
  component: ViewEditUserPage,
});

function ViewEditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/dynammic/$userId" });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void getUserById(userId).then((u: User | undefined) => {
      if (u) setUser(u);
    });
  }, [userId]);

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!user) return;
    await updateUser(user);
    navigate({
      to: "/dynammic",
      search: DefaultURLSearchPaginationParamters,
    });
  };

  if (!user) return <div className="p-6">Loading user...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit User</h1>

      <form
        onSubmit={(e) => {
          void handleSave(e);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="user-id" className="block mb-1 font-medium">
            ID
          </label>
          <input
            type="text"
            id="user-id"
            value={user.id}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="user-name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="user-name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="user-email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="user-email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
          <Link
            to="/dynammic"
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
            search={DefaultURLSearchPaginationParamters}
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
