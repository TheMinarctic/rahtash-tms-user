import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { FormItem, FormMessage } from "./form";
import { Label } from "./label";

export type TextareaProps = {
  label?: string;
  error?: string;
  isRequired?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const textAreaStyles = cva("", {
  variants: {
    variant: {
      background: "bg-background",
      muted: "bg-muted",
    },
  },
  defaultVariants: {
    variant: "muted",
  },
});

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & VariantProps<typeof textAreaStyles>
>(({ className, label, isRequired, error, variant, ...props }, ref) => {
  return (
    <FormItem>
      {label && <Label isRequired={isRequired}>{label}</Label>}
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:transition-shadow disabled:cursor-not-allowed disabled:opacity-50",
          textAreaStyles({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
