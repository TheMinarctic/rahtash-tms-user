import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";

type ConfirmDialogProps = {
  loading?: boolean;
  title: string;
  onSubmit: () => any;
  bodyTitles?: {
    title?: string;
    description?: string;
  };
};

function ConfirmDialog({ title, onSubmit, bodyTitles, loading = false }: ConfirmDialogProps) {
  return (
    <DialogContent size="xl">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="w-8 fill-yellow-400 dark:fill-amber-500 dark:stroke-gray-700" />
            {title}
          </div>
        </DialogTitle>
      </DialogHeader>

      <DialogBody className="flex gap-2 px-4 text-start">
        <div className="text-sm">
          <h2 className="font-semibold">
            {bodyTitles?.title ? bodyTitles?.title : "Are you sure about deleting?"}
          </h2>

          <h3 className="mt-1 font-medium">
            {bodyTitles?.description
              ? bodyTitles?.description
              : "The operation cannot be reversed."}
          </h3>
        </div>
      </DialogBody>

      <DialogFooter>
        <DialogClose asChild>
          <div>
            <Button variant={"outline"}>Cancel</Button>
          </div>
        </DialogClose>

        <Button variant="destructive" disabled={loading} loading={loading} onClick={onSubmit}>
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default ConfirmDialog;
