import React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-[3px] select-none transition-colors duration-150 border-none outline-none focus-visible:ring-1 focus-visible:ring-[#007acc] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer leading-normal whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[#007acc] hover:bg-[#0062a3] active:bg-[#005085] text-white shadow-sm",
        secondary:
          "bg-[#2d2d2d] hover:bg-[#3c3c3c] active:bg-[#252526] text-[#cccccc] border border-[#3e3e42]",
        outline:
          "bg-transparent hover:bg-[#3c3c3c] active:bg-[#2a2d2e] text-[#cccccc] border border-[#3e3e42]",
        ghost:
          "bg-transparent hover:bg-[#3c3c3c] active:bg-[#2a2d2e] text-[#cccccc]",
        danger:
          "bg-[#c72e24] hover:bg-[#a0251d] active:bg-[#8a1f18] text-white shadow-sm",
        success:
          "bg-[#388e3c] hover:bg-[#2e7d32] active:bg-[#256628] text-white shadow-sm",
      },
      size: {
        xs: "h-[22px] px-2 text-[11px] gap-1",
        sm: "h-[24px] px-2.5 text-[11px] gap-1.5",
        md: "h-[28px] px-3 text-[12px] gap-1.5",
        lg: "h-[32px] px-4 text-[13px] gap-2",
        "icon-sm": "h-[24px] w-[24px] p-0 flex items-center justify-center",
        icon: "h-[28px] w-[28px] p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
