import { cn } from "@/lib/utils";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, memo, useState } from "react";
import TablePaginator from "./table-paginator";

type TableProps = {
  columns: ColumnDef<any, any>[];
  data: Array<any>;
  paginate?: boolean;
  trOnclick?: (data: any) => void;
  paginateAfter?: number;
  paginateStepsList?: number[];
  colGroup?: ReactNode;
  classNames?: {
    allTh?: string;
    allTd?: string;
    table?: string;
  };
  hasScroll?: boolean;
};

const TableV2 = ({
  columns,
  trOnclick,
  data,
  paginate = false,
  paginateAfter = 20,
  paginateStepsList,
  colGroup,
  classNames,
  hasScroll = true,
}: TableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginateAfter,
  });

  const table = useReactTable({
    columns,
    data,
    columnResizeDirection: "rtl",
    getFilteredRowModel: paginate ? getFilteredRowModel() : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginate ? getPaginationRowModel() : undefined,
    onPaginationChange: paginate ? setPagination : undefined,
    state: paginate
      ? {
          pagination,
        }
      : undefined,
  });

  return (
    <div
      className={cn(
        "max-w-ful group w-full rounded-lg border border-border",
        hasScroll && "relative max-w-none overflow-x-auto",
      )}
    >
      <table
        className={cn(
          "w-full max-w-full table-fixed overflow-hidden text-center print:table-auto",
          hasScroll && "w-max min-w-full max-w-none table-auto",
          classNames?.table,
        )}
      >
        {colGroup && colGroup}

        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="h-12 border-b border-border bg-gray-200 text-sm font-bold transition-colors duration-300 data-[state=selected]:bg-muted dark:bg-gray-800"
            >
              {headerGroup.headers.map((header) => (
                <th
                  style={{
                    width:
                      header.getSize() !== 150 /// 150 = default size
                        ? header.getSize()
                        : undefined,
                  }}
                  // colSpan={header.colSpan}
                  key={header.id}
                  className={cn(
                    "border-border p-3 capitalize print:border print:bg-muted print:p-0 print:py-2 print:text-[10px] print:font-bold",
                    (header.column.columnDef.meta as any)?.cellClassName,
                    classNames?.allTh,
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="text-sm font-semibold">
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              onClick={() => (trOnclick ? trOnclick(row.original) : undefined)}
              className={cn(
                `border-t bg-background text-accent-foreground even:bg-muted hover:text-primary *:hover:text-primary print:border-b print:border-t-0 print:first:border-b`,
                trOnclick && "cursor-pointer",
                row.original?.className,
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn(
                    "px-2 py-3 print:border-l print:px-[0.5px] print:py-0 print:text-[10px] print:first:border-r",
                    (cell.column.columnDef.meta as any)?.cellClassName,
                    classNames?.allTd,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {paginate && (
        <TablePaginator
          table={table}
          dataCount={data?.length || 0}
          paginateAfter={paginateAfter}
          paginateStepsList={paginateStepsList}
        />
      )}
    </div>
  );
};

export default memo(TableV2);
