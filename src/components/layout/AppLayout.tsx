import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  classNames?: {
    container?: string;
    containerParent?: string;
  };
}

const AppLayout = ({ classNames, children }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full">
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={cn(
          "flex-1 overflow-auto bg-white py-5 text-foreground dark:bg-muted md:h-screen",
          classNames?.containerParent,
        )}
      >
        <div className={cn("container", classNames?.container)}>{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
