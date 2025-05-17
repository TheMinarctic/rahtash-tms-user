import { ReactNode } from "react";
import { QUERY_PARAMS } from "@/utils/constants";
import { useSearchParams } from "react-router-dom";
import SelectV2 from "../ui/select/select-v2";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  total_results: number;
  per_page: number;
  page_now: number;
  showPerPage?: boolean;
  showTotalCounts?: boolean;
  onPerPageChange?: (value: string | number) => void;
  onPageChange?: (value: string | number) => void;
}

const DynamicPaginator = ({
  per_page,
  page_now,
  total_results,
  onPageChange,
  onPerPageChange,
  showPerPage = false,
  showTotalCounts = true,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastPage = Math.ceil(total_results / per_page);

  if (total_results <= per_page) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 capitalize sm:justify-end">
      {showTotalCounts ? (
        <span className="mt-0.5 text-sm font-semibold">total number : {total_results}</span>
      ) : null}

      {showPerPage ? (
        <div>
          <SelectV2
            trigger={{ variant: "background" }}
            classNames={{ trigger: "min-w-28 h-8 text-[12px] [&>span]:mt-0.5" }}
            onValueChange={(value) => {
              if (onPerPageChange) {
                onPerPageChange(value);
              } else {
                searchParams.set(QUERY_PARAMS.PER_PAGE, String(value));
                setSearchParams(searchParams);
              }
            }}
            value={per_page || searchParams.get(QUERY_PARAMS.PER_PAGE) || "15"}
            items={[15, 50, 100, 200].map((page) => ({
              name: `per page: ${page}`,
              value: page,
            }))}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <TablePaginatorButton
          onClick={() => {
            if (onPageChange) {
              onPageChange("1");
            } else {
              searchParams.set(QUERY_PARAMS.PAGE, "1");
              setSearchParams(searchParams);
            }
          }}
          disabled={page_now <= 1}
          icon={<ChevronFirst />}
        />
        <TablePaginatorButton
          onClick={() => {
            if (onPageChange) {
              onPageChange((page_now - 1).toString());
            } else {
              searchParams.set(QUERY_PARAMS.PAGE, (page_now - 1).toString());
              setSearchParams(searchParams);
            }
          }}
          disabled={page_now <= 1}
          icon={<ChevronLeft />}
        />

        <span className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground">
          <span>{page_now}</span>
          <span>from</span>
          <span>{total_results}</span>
        </span>

        <TablePaginatorButton
          onClick={() => {
            if (onPageChange) {
              onPageChange((page_now + 1).toString());
            } else {
              searchParams.set(QUERY_PARAMS.PAGE, (page_now + 1).toString());
              setSearchParams(searchParams);
            }
          }}
          disabled={page_now >= lastPage}
          icon={<ChevronRight />}
        />

        <TablePaginatorButton
          onClick={() => {
            if (onPageChange) {
              onPageChange(total_results.toString());
            } else {
              searchParams.set(QUERY_PARAMS.PAGE, lastPage.toString());
              setSearchParams(searchParams);
            }
          }}
          disabled={page_now >= lastPage}
          icon={<ChevronLast />}
        />
      </div>

      {/* <div> */}
      {/* نمایش {table.getRowModel().rows.length.toLocaleString()} از{' '} */}
      {/* {table.getRowCount().toLocaleString()} Rows */}
      {/* </div> */}
    </div>
  );
};

export default DynamicPaginator;

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
      className="center size-8 rounded-md border border-border bg-background p-1 *:size-4 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {icon}
    </button>
  );
};
