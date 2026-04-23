import { PaginationMetaProps } from "@branda/ui/lib/types/index";
import { useCallback, useEffect, useState } from "react";

export function usePagination(
  initial: Partial<PaginationMetaProps>,
  onFetch?: (pageSize: number, page: number) => void,
  onUrlChange?: (page: number, pageSize: number) => void
) {
  const [page, setPage] = useState(initial.page ?? 1);
  const [pageSize, setPageSize] = useState(initial.pageSize ?? 10);
  const [total, setTotal] = useState(initial.total ?? 0);

  const pageCount = Math.max(Math.ceil(total / pageSize), 1);

  /** --- Re-fetch whenever pagination changes --- */
  useEffect(() => {
    if (onFetch) onFetch(page, pageSize);
    if (onUrlChange) onUrlChange(page, pageSize);
  }, [page, pageSize]);

  const nextPage = useCallback(() => {
    if (page < pageCount) setPage((p) => p + 1);
  }, [page, pageCount]);

  const prevPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  const firstPage = useCallback(() => setPage(1), []);
  const lastPage = useCallback(() => setPage(pageCount), [pageCount]);

  return {
    page,
    pageSize,
    total,
    pageCount,

    setPage,
    setPageSize,
    setTotal,

    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
}

export type UsePaginationReturn = ReturnType<typeof usePagination>;
