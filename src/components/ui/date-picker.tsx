// src/components/ui/date-picker.tsx
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showTime?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled = false,
  showTime = false,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [hours, setHours] = React.useState<string>(
    date ? date.getHours().toString().padStart(2, '0') : '00'
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? date.getMinutes().toString().padStart(2, '0') : '00'
  );

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setHours(date.getHours().toString().padStart(2, '0'));
      setMinutes(date.getMinutes().toString().padStart(2, '0'));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      onSelect?.(undefined);
      return;
    }

    // Preserve time when date changes
    const updatedDate = new Date(newDate);
    updatedDate.setHours(parseInt(hours), parseInt(minutes));
    setSelectedDate(updatedDate);
    onSelect?.(updatedDate);
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (!selectedDate) {
      const newDate = new Date();
      newDate.setHours(type === 'hours' ? parseInt(value) : 0, type === 'minutes' ? parseInt(value) : 0);
      setSelectedDate(newDate);
      if (type === 'hours') setHours(value);
      else setMinutes(value);
      onSelect?.(newDate);
      return;
    }

    const updatedDate = new Date(selectedDate);
    if (type === 'hours') {
      updatedDate.setHours(parseInt(value));
      setHours(value);
    } else {
      updatedDate.setMinutes(parseInt(value));
      setMinutes(value);
    }
    setSelectedDate(updatedDate);
    onSelect?.(updatedDate);
  };

  // Generate time options
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            showTime ? (
              format(selectedDate, "PPP HH:mm")
            ) : (
              format(selectedDate, "PPP")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTime && (
          <div className="flex items-center justify-center gap-2 p-3 border-t">
            <div className="flex items-center gap-1">
              <Select value={hours} onValueChange={(v) => handleTimeChange('hours', v)}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select value={minutes} onValueChange={(v) => handleTimeChange('minutes', v)}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}