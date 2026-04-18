import { UsePaginationReturn } from "@branda/ui/hooks/use-pagination";
import { Button } from "@branda/ui/components/button";
import { Label } from "@branda/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@branda/ui/components/select";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
    Table as RTable
} from "@tanstack/react-table";

export function PaginationMeta<TData>({
    table,
    pagination,
}: {
    table?: RTable<TData>;
    pagination?: UsePaginationReturn;
}) {
    // TABLE MODE
    const page = table
        ? table.getState().pagination.pageIndex + 1
        : pagination!.page;

    const pageCount = table
        ? table.getPageCount()
        : pagination!.pageCount;

    const pageSize = table
        ? table.getState().pagination.pageSize
        : pagination!.pageSize;

    const hasPrev = page > 1;
    const hasNext = page < pageCount;

    return (
        <div className="flex w-full items-center gap-8 lg:w-fit">
            {/* Page size selector */}
            <div className="hidden items-center gap-2 lg:flex">
                <Label className="text-sm font-medium">Result per page</Label>

                <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                        if (table) table.setPageSize(Number(value));
                        else pagination?.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger size="sm" className="w-20">
                        <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((v) => (
                            <SelectItem key={v} value={`${v}`}>
                                {v}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Page info */}
            <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {page} of {pageCount}
            </div>

            {/* Navigation */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => (table ? table.setPageIndex(0) : pagination?.firstPage())}
                    disabled={!hasPrev}
                >
                    <IconChevronsLeft />
                </Button>

                <Button
                    variant="outline"
                    className="size-8"
                    onClick={() => (table ? table.previousPage() : pagination?.prevPage())}
                    disabled={!hasPrev}
                >
                    <IconChevronLeft />
                </Button>

                <Button
                    variant="outline"
                    className="size-8"
                    onClick={() => (table ? table.nextPage() : pagination?.nextPage())}
                    disabled={!hasNext}
                >
                    <IconChevronRight />
                </Button>

                <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    onClick={() =>
                        table
                            ? table.setPageIndex(pageCount - 1)
                            : pagination?.lastPage()
                    }
                    disabled={!hasNext}
                >
                    <IconChevronsRight />
                </Button>
            </div>
        </div>
    );
}