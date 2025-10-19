export type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function Pagination({
  page,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 15, 20, 25, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 border rounded ${!canPrev ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
        >
          Prev
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          className={`px-3 py-1 border rounded ${!canNext ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="pageSize">Rows per page</label>
        <select
          id="pageSize"
          className="border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600">Total: {totalItems}</span>
      </div>
    </div>
  );
}
