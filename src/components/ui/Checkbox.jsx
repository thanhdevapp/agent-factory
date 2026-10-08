import React, { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef(
  (
    {
      className,
      label,
      description,
      wrapperClassName,
      checked,
      disabled,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-2 cursor-pointer select-none text-[12px] text-[#cccccc]",
          disabled && "opacity-50 cursor-not-allowed",
          wrapperClassName
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "w-[14px] h-[14px] rounded-[2px] border border-[#3e3e42] bg-[#1e1e1e] transition-colors duration-150 flex items-center justify-center",
              "peer-focus-visible:ring-1 peer-focus-visible:ring-[#007acc]",
              "hover:border-[#007acc]",
              "peer-checked:bg-[#007acc] peer-checked:border-[#007acc] text-white",
              className
            )}
          >
            {checked && <Check className="w-2.5 h-2.5 stroke-[3] text-white" />}
          </div>
        </div>

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
  }
);

Checkbox.displayName = "Checkbox";
