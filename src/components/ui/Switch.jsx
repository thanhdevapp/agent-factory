import React, { useId } from "react";
import { cn } from "@/lib/utils";

export const Switch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  wrapperClassName,
  id,
}) => {
  const generatedId = useId();
  const switchId = id || generatedId;

  return (
    <label
      htmlFor={switchId}
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer select-none text-[12px] text-[#cccccc]",
        disabled && "opacity-50 cursor-not-allowed",
        wrapperClassName
      )}
    >
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={cn(
          "relative inline-flex h-[16px] w-[30px] shrink-0 items-center rounded-full transition-colors duration-200 outline-none border-none p-0 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#007acc]",
          checked ? "bg-[#007acc]" : "bg-[#3e3e42]",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-[12px] w-[12px] rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[15px]" : "translate-x-[2px]"
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="font-normal leading-normal">{label}</span>}
          {description && (
            <span className="text-[11px] text-[#8c8c8c] leading-tight mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

Switch.displayName = "Switch";
