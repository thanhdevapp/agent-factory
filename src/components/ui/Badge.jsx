import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-[3px] select-none leading-none tracking-tight whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#2d2d2d] text-[#cccccc] border border-[#3e3e42]",
        primary: "bg-[#0e639c]/20 text-[#4fc1ff] border border-[#0e639c]/50",
        secondary: "bg-[#252526] text-[#8c8c8c] border border-[#3c3c3c]",
        success: "bg-[#1b4721]/30 text-[#7ee787] border border-[#238636]/50",
        warning: "bg-[#5c3d00]/30 text-[#f2cc60] border border-[#9e6a03]/50",
        danger: "bg-[#5c1d1d]/30 text-[#f85149] border border-[#da3633]/50",
        type: "bg-[#161b22] text-[#79c0ff] font-mono border border-[#30363d]",
      },
      badgeSize: {
        xs: "h-[18px] px-1.5 text-[10px]",
        sm: "h-[20px] px-2 text-[11px]",
        md: "h-[22px] px-2.5 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      badgeSize: "sm",
    },
  }
);

export const Badge = React.forwardRef(
  ({ className, variant, badgeSize, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, badgeSize }),
          icon && "gap-1",
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
