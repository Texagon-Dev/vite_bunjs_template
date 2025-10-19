import { getUsers, deleteUser, type User } from "@services";
import { Link, useNavigate, useSearch, createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { URLSearchPagination, DefaultURLSearchPaginationParamters } from "@types";
import { useEffect, useMemo, useState } from "react";

import { Pagination } from "@/components/Pagination";
import { paginate, sortBy, textFilter } from "@/utils/pagination";

export const Route = createFileRoute("/dynammic/")({
  component: UserListPage,
  validateSearch: (s: URLSearchPagination) => ({
    page: Number(s.page ?? 1),
    pageSize: Number(s.pageSize ?? 10),
    sortBy: String(s.sortBy ?? "createdAt"),
    sortDir: s.sortDir === "asc" || s.sortDir === "desc" ? s.sortDir : "desc",
    q: String(s.q ?? ""),
  }),
});

function ActionsCell({ user, onDelete }: { user: User; onDelete: (id: number) => void }) {
  return (
    <div className="flex gap-2">
      <Link
        to="/dynammic/$userId"
        params={{ userId: user.id as unknown as string }}
        className="text-blue-600 hover:underline"
      >
        View/Edit
      </Link>
      <button
        onClick={() => {
          onDelete(user.id);
        }}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}

function UserListPage() {
  const [data, setData] = useState<User[]>([]);
  const navigate = useNavigate();
  const search = useSearch({ from: "/dynammic/" });

  useEffect(() => {
    void getUsers().then(setData);
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Delete this user?")) {
      await deleteUser(id);
      setData(await getUsers());
    }
  };

  const processed = useMemo(() => {
    const filtered = textFilter(data, search.q, ["name", "email"]);
    const allowed: (keyof User)[] = ["id", "name", "email"];
    const sortKey: keyof User = allowed.includes(search.sortBy as keyof User)
      ? (search.sortBy as keyof User)
      : "id";
    const sorted = sortBy(filtered, sortKey, search.sortDir);
    const paged = paginate(sorted, Number(search.page) || 1, Number(search.pageSize) || 10);
    return { filteredCount: filtered.length, items: paged };
  }, [data, search.page, search.pageSize, search.q, search.sortBy, search.sortDir]);

  const onPageChange = (page: number): void => {
    void navigate({
      to: "/dynammic",
      search: (prev) => ({
        ...DefaultURLSearchPaginationParamters,
        ...prev,
        page,
      }),
    });
  };
  const onPageSizeChange = (size: number): void => {
    void navigate({
      to: "/dynammic",
      search: (prev) => ({
        ...DefaultURLSearchPaginationParamters,
        ...prev,
        pageSize: size,
        page: 1,
      }),
    });
  };
  const onQueryChange = (q: string): void => {
    void navigate({
      to: "/dynammic",
      search: (prev) => ({
        ...DefaultURLSearchPaginationParamters,
        ...prev,
        q,
        page: 1,
      }),
    });
  };

  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <ActionsCell
          user={row.original}
          onDelete={(id) => {
            void handleDelete(id);
          }}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: processed.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User List</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            className="border rounded px-3 py-2"
            value={search.q}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <Link
            to="/dynammic/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add User
          </Link>
        </div>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border px-3 py-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={Number(search.page) || 1}
        pageSize={Number(search.pageSize) || 10}
        totalItems={processed.filteredCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
