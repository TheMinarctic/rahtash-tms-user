"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaSpinner } from "react-icons/fa";

type Value = string | number;

interface SelectItem {
  name: string;
  value: Value;
}

interface Props {
  value?: Value;
  onValueChange?: (val: Value) => void;
  items: SelectItem[];
  placeholder?: string;
  disabled?: boolean;
  variant?: "muted" | "outline" | "default";
  loading?: boolean;
}

export function Combobox({
  value,
  items,
  onValueChange,
  loading = false,
  placeholder = "",
  variant = "muted",
  ...props
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          variant={variant}
          disabled={props.disabled}
          className={cn(
            "h-9 w-full justify-between truncate",
            variant === "muted" && "text-accent-foreground hover:border-primary hover:bg-muted",
          )}
        >
          {value ? items.find((item) => item.value === value)?.name : placeholder}
          {loading ? (
            <FaSpinner className="animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="!size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search, keywords = []) => {
            const extendValue = value + " " + keywords.join(" ");
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found to show.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  keywords={[item.name]}
                  value={JSON.stringify(item.value)}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? null : JSON.parse(currentValue));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "me-2 size-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
