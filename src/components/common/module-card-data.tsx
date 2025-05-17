import { cn } from "@/lib/utils";
import { mutate } from "swr";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, PackageSearch, RefreshCcw } from "lucide-react";

type ModuleCardDataProps = {
  className?: string;
  isValidating?: boolean;
  isLoading?: boolean;
  isDataEmpty?: boolean;
  error?: any;
  emptyAlertMessage?: ReactNode;
  emptyAlertSize?: "mini" | "full";
  skeleton?: ReactNode;
  children: ReactNode;
  skeletonRowCount?: number;
};

export const ModuleCardData = ({
  isLoading,
  isValidating,
  className,
  isDataEmpty,
  error,
  emptyAlertSize = "full",
  emptyAlertMessage = "No results found to show!",
  skeleton,
  children,
  skeletonRowCount = 15,
}: ModuleCardDataProps) => {
  if (isLoading)
    //FIXME:
    return skeleton || <ModuleCardSkeleton showTitle={false} tableRowsCount={skeletonRowCount} />;

  if (error) {
    console.error(error);

    return (
      <div
        className={cn(
          "flex min-h-32 flex-grow flex-col items-center justify-center gap-2 capitalize",
          emptyAlertSize === "mini" && "min-h-10 flex-row",
        )}
      >
        <AlertTriangle
          strokeWidth={2}
          className={cn("size-14 stroke-red-500", emptyAlertSize === "mini" && "size-8")}
        />

        <div className="flex flex-col items-center gap-2 text-red-500">
          <h2 className="text-sm font-bold">
            {error?.status == 403 ? "you can't access to this page!" : "an error occurred!"}
          </h2>

          <p
            onClick={() =>
              mutate((key: any) => {
                mutate(key);
              })
            }
            className="group flex cursor-pointer items-center gap-1 text-sm font-bold"
          >
            <span className="group-hover:underline">try again</span>
            <button className="mb-0.5">
              <RefreshCcw size={16} />
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (isDataEmpty)
    return (
      <div
        className={`flex flex-grow items-center gap-2 ${emptyAlertSize === "mini" ? "min-h-12 text-muted-foreground" : "min-h-32 flex-col justify-center text-muted-foreground"}`}
      >
        <PackageSearch
          strokeWidth={1}
          className={`${emptyAlertSize === "mini" ? "size-7 stroke-muted-foreground" : "size-14 stroke-muted-foreground"}`}
        />

        <h2 className="text-sm font-medium">{emptyAlertMessage}</h2>
      </div>
    );

  return (
    <div className={cn("relative", className)}>
      {/* {isValidating && (
				<div className="absolute size-2 rounded-full bg-primary " />
			)} */}
      {children}
    </div>
  );
};

type CardSkeletonProps = {
  filterButtonsCount?: number;
  tableRowsCount?: number;
  showTitle?: boolean;
  className?: string;
};

export const ModuleCardSkeleton = ({
  filterButtonsCount = 0,
  tableRowsCount = 0,
  showTitle = true,
  className,
}: CardSkeletonProps) => {
  return (
    <div>
      {showTitle && <Skeleton className="col-span-12 w-1/5" />}

      {(filterButtonsCount > 0 || tableRowsCount > 0) && showTitle && <hr />}

      {filterButtonsCount > 0 && (
        <div className={cn("mb-4 mt-2 flex w-1/2 gap-4 md:w-1/5 lg:w-1/6", !showTitle && "mt-4")}>
          {[...Array(filterButtonsCount)].map((_, key) => (
            <Skeleton className="size-full" key={key} />
          ))}
        </div>
      )}

      {tableRowsCount > 0 && (
        <div className="flex w-full flex-col gap-3">
          {[...Array(tableRowsCount)].map((_, key) => (
            <Skeleton key={key} className="!h-8 w-full" />
          ))}
        </div>
      )}
    </div>
  );
};
