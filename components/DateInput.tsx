import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ placeholder = "DD/MM/YYYY", value, onChange, className, ...restProps }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const lastEmittedValue = useRef<string>('');
    
    // Remove value and onChange from props to prevent conflicts
    const { value: _v, onChange: _o, ...safeProps } = restProps as any;

    // Convert YYYY-MM-DD to DD/MM/YYYY for display and Date object
    useEffect(() => {
      if (value && typeof value === 'string' && value.length > 0) {
        const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateMatch) {
          const day = dateMatch[3];
          const month = dateMatch[2];
          const year = dateMatch[1];
          const formattedDisplay = `${day}/${month}/${year}`;
          
          // Only update if the value is different from what we just sent
          // or if displayValue doesn't already match the formatted version
          if (value === lastEmittedValue.current && displayValue === formattedDisplay) {
            // Skip update - we just set this value ourselves
            return;
          }
          
          // Always update to DD/MM/YYYY format
          setDisplayValue(formattedDisplay);
          
          const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          setSelectedDate(dateObj);
        }
      } else if (!value || value === '') {
        setDisplayValue('');
        setSelectedDate(undefined);
      }
    }, [value]);

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Limit to 8 digits (DDMMYYYY)
      if (input.length > 8) {
        input = input.slice(0, 8);
      }

      // Format as DD/MM/YYYY
      let formatted = '';
      if (input.length > 0) {
        formatted = input.slice(0, 2);
        if (input.length >= 3) {
          formatted += '/' + input.slice(2, 4);
        }
        if (input.length >= 5) {
          formatted += '/' + input.slice(4, 8);
        }
      }

      setDisplayValue(formatted);

      // Convert DD/MM/YYYY to YYYY-MM-DD for form value
      if (input.length === 8) {
        const day = input.slice(0, 2);
        const month = input.slice(2, 4);
        const year = input.slice(4, 8);
        
        // Basic validation
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
          const isoDate = `${year}-${month}-${day}`;
          const dateObj = new Date(yearNum, monthNum - 1, dayNum);
          setSelectedDate(dateObj);
          lastEmittedValue.current = isoDate;
          
          // Create synthetic event with ISO format
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: isoDate
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          onChange?.(syntheticEvent);
        }
      } else {
        // Pass empty or partial value
        lastEmittedValue.current = '';
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange?.(syntheticEvent);
      }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const displayFormat = `${day}/${month}/${year}`;
        const isoDate = `${year}-${month}-${day}`;
        
        // Update display immediately and track what we're sending
        setDisplayValue(displayFormat);
        setSelectedDate(date);
        setIsOpen(false);
        lastEmittedValue.current = isoDate;
        
        // Create synthetic event with ISO format
        if (onChange) {
          const syntheticEvent = {
            target: {
              value: isoDate,
              name: safeProps.name
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          onChange(syntheticEvent);
        }
      }
    };

    return (
      <div className="relative flex items-center gap-2">
        <Input
          {...safeProps}
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleManualChange}
          maxLength={10}
          className={className}
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-[var(--radius-button)] transition-colors duration-[var(--transition-fast)]"
              aria-label="Open calendar"
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border shadow-[var(--elevation-md)]" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';