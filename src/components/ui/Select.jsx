import React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const selectVariants = cva(
  "w-full appearance-none bg-[#1e1e1e] text-[#cccccc] border border-[#3e3e42] rounded-[3px] outline-none transition-colors duration-150 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] disabled:bg-[#252526] disabled:text-[#6e6e6e] disabled:cursor-not-allowed cursor-pointer pr-7",
  {
    variants: {
      selectSize: {
        sm: "h-[24px] px-2 text-[11px]",
        md: "h-[28px] px-2.5 text-[12px]",
        lg: "h-[32px] px-3 text-[13px]",
      },
      hasError: {
        true: "border-[#f44336] focus:border-[#f44336] focus:ring-[#f44336]",
      },
    },
    defaultVariants: {
      selectSize: "md",
    },
  }
);

export const Select = React.forwardRef(
  (
    {
      className,
      selectSize,
      hasError,
      error,
      helperText,
      options,
      children,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const isError = Boolean(hasError || error);

    return (
      <div className={cn("relative flex flex-col gap-1 w-full", wrapperClassName)}>
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(selectVariants({ selectSize, hasError: isError }), className)}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[#1e1e1e] text-[#cccccc] py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-2 flex items-center pointer-events-none text-[#8c8c8c]">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
        {typeof error === "string" && error && (
          <span className="text-[11px] text-[#f44336] leading-tight">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-[11px] text-[#8c8c8c] leading-tight">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
