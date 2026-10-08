import React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "w-full bg-[#1e1e1e] text-[#cccccc] placeholder:text-[#6e6e6e] border border-[#3e3e42] rounded-[3px] outline-none transition-colors duration-150 focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] disabled:bg-[#252526] disabled:text-[#6e6e6e] disabled:cursor-not-allowed",
  {
    variants: {
      inputSize: {
        sm: "h-[24px] px-2 text-[11px]",
        md: "h-[28px] px-2.5 text-[12px]",
        lg: "h-[32px] px-3 text-[13px]",
      },
      hasError: {
        true: "border-[#f44336] focus:border-[#f44336] focus:ring-[#f44336]",
      },
    },
    defaultVariants: {
      inputSize: "md",
    },
  }
);

export const Input = React.forwardRef(
  (
    {
      className,
      inputSize,
      hasError,
      error,
      helperText,
      leftIcon,
      rightIcon,
      clearable,
      onClear,
      value,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const isError = Boolean(hasError || error);
    const hasValue = value !== undefined && value !== "" && value !== null;

    return (
      <div className={cn("relative flex flex-col gap-1 w-full", wrapperClassName)}>
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-2 flex items-center pointer-events-none text-[#8c8c8c] z-10">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            value={value}
            disabled={disabled}
            className={cn(
              inputVariants({ inputSize, hasError: isError }),
              leftIcon && "pl-7",
              (rightIcon || (clearable && hasValue)) && "pr-7",
              className
            )}
            {...props}
          />
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 flex items-center justify-center p-0.5 text-[#8c8c8c] hover:text-[#cccccc] bg-transparent border-none cursor-pointer rounded z-10"
              title="Xóa nội dung"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {!clearable && rightIcon && (
            <div className="absolute right-2 flex items-center pointer-events-none text-[#8c8c8c] z-10">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";
