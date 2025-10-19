export type SortDir = "asc" | "desc";

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function sortBy<T, K extends keyof T>(items: T[], key: K, dir: SortDir): T[] {
  const sorted = [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null && bv == null) return 0;
    if (av == null) return dir === "asc" ? -1 : 1;
    if (bv == null) return dir === "asc" ? 1 : -1;

    if (typeof av === "number" && typeof bv === "number") {
      return dir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    if (as < bs) return dir === "asc" ? -1 : 1;
    if (as > bs) return dir === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

export function textFilter<T extends Record<string, unknown>>(
  items: T[],
  q: string,
  keys: (keyof T)[],
): T[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    keys.some((k) =>
      String(item[k] ?? "")
        .toLowerCase()
        .includes(needle),
    ),
  );
}

export function totalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
