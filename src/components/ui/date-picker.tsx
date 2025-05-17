import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import moment from "jalali-moment";
import { Calendar } from "./calendar";
import { CalendarIcon } from "lucide-react";
import SelectV2 from "./select/select-v2";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { format, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { Separator } from "./separator";

type Props = {
  fromYear?: number;
  toYear?: number;
  date?: Date | string | number;
  setDate: (date: Date | undefined) => void;
  variant?: "outline" | "default" | "ghost" | "muted";
};

const DatePicker = ({
  variant = "muted",
  setDate,
  date: propsDate,
  fromYear = 1920,
  toYear = new Date().getFullYear() + 5,
}: Props) => {
  const parsedDate = React.useMemo(() => {
    if (!propsDate) return undefined;
    const d = new Date(propsDate);
    return isNaN(d.getTime()) ? undefined : d;
  }, [propsDate]);

  const [month, setMonth] = React.useState<number>(() =>
    parsedDate ? parsedDate.getMonth() : new Date().getMonth(),
  );
  const [year, setYear] = React.useState<number>(() =>
    parsedDate ? parsedDate.getFullYear() : new Date().getFullYear(),
  );

  const years = React.useMemo(() => {
    return Array.from({ length: toYear - fromYear + 1 }, (_, i) => toYear - i);
  }, [fromYear, toYear]);

  const months = React.useMemo(() => {
    if (year === undefined) return [];
    return eachMonthOfInterval({
      start: startOfYear(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 0, 1)),
    });
  }, [year]);

  // اگر مقدار جدیدی از بیرون اومد، month/year رو هم باهاش sync کن
  React.useEffect(() => {
    if (parsedDate) {
      setMonth(parsedDate.getMonth());
      setYear(parsedDate.getFullYear());
    }
  }, [parsedDate]);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    if (parsedDate) {
      const updated = new Date(parsedDate);
      updated.setFullYear(newYear);
      setDate(updated);
    } else if (month !== undefined) {
      setDate(new Date(newYear, month, 1));
    }
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    if (parsedDate) {
      const updated = new Date(parsedDate);
      updated.setMonth(newMonth);
      setDate(updated);
    } else if (year !== undefined) {
      setDate(new Date(year, newMonth, 1));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "inline-flex h-9 w-full items-center justify-center gap-2 truncate text-start font-normal text-accent-foreground",
            !parsedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="!size-4" />

          {parsedDate ? (
            <div className="flex items-center gap-2">
              <span>{format(parsedDate, "PPP")}</span>
              <Separator className="h-5 bg-gray-300" orientation="vertical" />
              <span>{moment(parsedDate).locale("fa").format("jYYYY/jMM/jDD")}</span>
            </div>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-76 p-0">
        <div className="flex justify-between gap-x-4 p-3 *:flex-1">
          <SelectV2
            value={month}
            placeholder="Month"
            onValueChange={handleMonthChange}
            items={months.map((m, i) => ({ name: format(m, "MMMM"), value: i }))}
          />
          <SelectV2
            value={year}
            placeholder="Year"
            onValueChange={handleYearChange}
            items={years.map((y) => ({ name: y.toString(), value: y }))}
          />
        </div>

        <Calendar
          initialFocus
          mode="single"
          fromYear={fromYear}
          toYear={toYear}
          selected={parsedDate}
          onSelect={setDate}
          month={year !== undefined && month !== undefined ? new Date(year, month) : undefined}
          onMonthChange={(newDate) => {
            setMonth(newDate.getMonth());
            setYear(newDate.getFullYear());
          }}
          className="mt-0"
          captionLayout="dropdown-buttons"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
