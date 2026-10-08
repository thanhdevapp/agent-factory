import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

const modalSizes = {
  sm: "max-w-[400px]",
  md: "max-w-[550px]",
  lg: "max-w-[750px]",
  xl: "max-w-[950px]",
  full: "w-[96vw] max-w-[1550px] h-[92vh] max-h-[92vh]",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px] animate-in fade-in duration-150"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={cn(
          "relative w-full bg-[var(--bg-editor)] border border-[var(--border-card)] rounded-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[var(--text-main)]",
          modalSizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <div className="flex flex-col gap-0.5">
              {title && (
                <h3 className="text-[13px] font-semibold text-[var(--text-bright)] m-0 tracking-normal">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-[11px] text-[var(--text-muted)] m-0">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-hover)]"
              title="Close (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 text-[12px]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
