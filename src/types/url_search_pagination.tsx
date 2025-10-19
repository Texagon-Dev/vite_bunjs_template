export interface URLSearchPagination {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  q?: string;
}
export type URLSearchPaginationRequired = Required<URLSearchPagination>;
export const DefaultURLSearchPaginationParamters: URLSearchPaginationRequired = {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortDir: "desc",
  q: "",
};
