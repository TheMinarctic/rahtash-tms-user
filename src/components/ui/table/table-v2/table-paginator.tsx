import { ReactNode } from "react";
import { Table } from "@tanstack/react-table";
import SelectV2 from "../../select/select-v2";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

const TablePaginatorButton = ({
  disabled,
  onClick,
  icon,
}: {
  disabled?: boolean;
  onClick?: () => void;
  icon: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="center size-9 rounded-md border border-gray-200 bg-white p-1 *:size-5 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {icon}
    </button>
  );
};

const TablePaginator = ({
  table,
  dataCount,
  paginateAfter = 20,
  paginateStepsList = [20, 50, 100, 200, 500],
}: {
  table: Table<any>;
  dataCount: number;
  paginateAfter?: number;
  paginateStepsList?: number[];
}) => {
  if (dataCount <= paginateAfter) return;

  return (
    <div className="mt-4 flex justify-end gap-4">
      <div>
        <SelectV2
          trigger={{ variant: "background" }}
          classNames={{ trigger: "min-w-28" }}
          onValueChange={(value) => table.setPageSize(Number(value))}
          defaultValue={table.getState().pagination.pageSize.toString()}
          items={paginateStepsList.map((page) => ({ name: `نمایش ${page}`, value: page }))}
        />
      </div>

      <div className="flex items-center gap-2">
        <TablePaginatorButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          icon={<ChevronLast />}
        />
        <TablePaginatorButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          icon={<ChevronRight />}
        />

        <span dir="rtl" className="text flex items-center gap-2 font-semibold text-gray-700">
          <span>{Number(table.getState().pagination.pageIndex) + 1}</span>
          <span>از</span>
          <span>{table.getPageCount().toLocaleString()}</span>
        </span>

        <TablePaginatorButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          icon={<ChevronLeft />}
        />

        <TablePaginatorButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          icon={<ChevronFirst />}
        />

        {/* <span className="flex items-center gap-1">
					| رفتن به صفحه:
					<input
						type="number"
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value
								? Number(e.target.value) - 1
								: 0
							table.setPageIndex(page)
						}}
						className="w-16 rounded border p-1"
					/>
				</span> */}
      </div>

      {/* <div> */}
      {/* نمایش {table.getRowModel().rows.length.toLocaleString()} از{' '} */}
      {/* {table.getRowCount().toLocaleString()} Rows */}
      {/* </div> */}
    </div>
  );
};

export default TablePaginator;
