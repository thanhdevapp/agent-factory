"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  X,
  ArrowRight,
} from "lucide-react";

/**
 * Helper to format Date object into YYYY-MM-DD (local timezone)
 */
function formatDate(d) {
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Helper to parse YYYY-MM-DD string into local Date object
 */
function parseDate(str) {
  if (!str || typeof str !== "string") return null;
  const parts = str.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const date = new Date(y, m, d);
  return isNaN(date.getTime()) ? null : date;
}

const PRESETS = [
  {
    label: "Hôm nay",
    getValue: () => {
      const now = new Date();
      const s = formatDate(now);
      return { startDate: s, endDate: s };
    },
  },
  {
    label: "Hôm qua",
    getValue: () => {
      const now = new Date();
      now.setDate(now.getDate() - 1);
      const s = formatDate(now);
      return { startDate: s, endDate: s };
    },
  },
  {
    label: "7 ngày qua",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    },
  },
  {
    label: "14 ngày qua",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 13);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    },
  },
  {
    label: "30 ngày qua",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    },
  },
  {
    label: "Tháng này",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: formatDate(start), endDate: formatDate(now) };
    },
  },
  {
    label: "Tháng trước",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: formatDate(start), endDate: formatDate(end) };
    },
  },
  {
    label: "Toàn bộ",
    getValue: () => ({ startDate: "", endDate: "" }),
  },
];

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function DarkDateRangePicker({
  startDate = "",
  endDate = "",
  isActive = false,
  onChange,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const [hoverDate, setHoverDate] = useState(null);

  // Month navigation state
  const [viewDate, setViewDate] = useState(() => {
    return parseDate(startDate) || parseDate(endDate) || new Date();
  });

  // Keep temporary dates in sync with parent props when opened
  useEffect(() => {
    if (open) {
      setTempStart(startDate);
      setTempEnd(endDate);
      const initial = parseDate(startDate) || parseDate(endDate) || new Date();
      setViewDate(new Date(initial.getFullYear(), initial.getMonth(), 1));
      setHoverDate(null);
    }
  }, [open, startDate, endDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    // Sunday is 0, Monday is 1... Adjust so Monday is 0, Sunday is 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateObj = new Date(year, month - 1, d);
      days.push({
        dateStr: formatDate(dateObj),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(year, month, d);
      days.push({
        dateStr: formatDate(dateObj),
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding days to complete grid (42 days or 35 days)
    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let d = 1; d <= remainingSlots; d++) {
      const dateObj = new Date(year, month + 1, d);
      days.push({
        dateStr: formatDate(dateObj),
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  const handleDayClick = (dateStr) => {
    if (!tempStart || (tempStart && tempEnd)) {
      // Start a fresh selection
      setTempStart(dateStr);
      setTempEnd("");
    } else {
      // We already have a tempStart, pick end date
      if (dateStr < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dateStr);
      } else {
        setTempEnd(dateStr);
      }
    }
  };

  const handleApply = () => {
    if (onChange) {
      onChange({ startDate: tempStart, endDate: tempEnd });
    }
    setOpen(false);
  };

  const handleReset = () => {
    setTempStart("");
    setTempEnd("");
    if (onChange) {
      onChange({ startDate: "", endDate: "" });
    }
    setOpen(false);
  };

  const handleSelectPreset = (preset) => {
    const val = preset.getValue();
    setTempStart(val.startDate);
    setTempEnd(val.endDate);
    if (onChange) {
      onChange(val);
    }
    setOpen(false);
  };

  const effectiveEnd = tempEnd || (hoverDate && tempStart && hoverDate > tempStart ? hoverDate : "");

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 px-2.5 py-1 ${
            isActive
              ? "bg-[#0e639c]/30 border-[#007acc] text-white ring-1 ring-[#007acc]/40"
              : "bg-[#1e1e1e] hover:bg-[#2a2d2e] border-[#3e3e42] hover:border-[#007acc] text-slate-200"
          } border rounded text-xs transition-colors shadow-sm focus:outline-none ${className}`}
        >
          <Calendar className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-[#007acc]"}`} />
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            {startDate ? (
              <span className="text-slate-100 font-medium">{startDate}</span>
            ) : (
              <span className="text-slate-400">Từ đầu</span>
            )}
            <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
            {endDate ? (
              <span className="text-slate-100 font-medium">{endDate}</span>
            ) : (
              <span className="text-slate-400">Hiện tại</span>
            )}
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg shadow-2xl p-0 text-slate-200 w-[520px] max-w-[95vw] overflow-hidden select-none animate-in fade-in-50 zoom-in-95"
          style={{ colorScheme: "dark" }}
        >
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#2d2d30]">
            {/* Left: Quick Presets */}
            <div className="w-full sm:w-36 bg-[#252526] p-2 flex flex-col gap-1 shrink-0">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider px-2 py-1">
                Khoảng nhanh
              </span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left px-2 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-[#094771] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Right: Calendar & Custom Inputs */}
            <div className="flex-1 p-3 bg-[#1e1e1e] flex flex-col gap-3">
              {/* Month Navigation Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#007acc]" />
                  Tháng {month + 1}, {year}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-[#2a2d2e] text-slate-400 hover:text-white rounded transition-colors"
                    title="Tháng trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-[#2a2d2e] text-slate-400 hover:text-white rounded transition-colors"
                    title="Tháng sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers (T2 - CN) */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((wd) => (
                  <div
                    key={wd}
                    className="text-[10px] font-semibold text-slate-400 py-0.5"
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => {
                  const isStart = tempStart && item.dateStr === tempStart;
                  const isEnd = effectiveEnd && item.dateStr === effectiveEnd;
                  const inRange =
                    tempStart &&
                    effectiveEnd &&
                    item.dateStr > tempStart &&
                    item.dateStr < effectiveEnd;

                  let cellClass =
                    "h-7 text-xs flex items-center justify-center transition-colors rounded relative ";

                  if (isStart && isEnd) {
                    cellClass += "bg-[#007acc] text-white font-bold rounded ";
                  } else if (isStart) {
                    cellClass +=
                      "bg-[#007acc] text-white font-bold rounded-l rounded-r-none ";
                  } else if (isEnd) {
                    cellClass +=
                      "bg-[#007acc] text-white font-bold rounded-r rounded-l-none ";
                  } else if (inRange) {
                    cellClass +=
                      "bg-[#0e639c]/30 text-white rounded-none ";
                  } else if (!item.isCurrentMonth) {
                    cellClass += "text-slate-600 hover:bg-[#2a2d2e]/50 ";
                  } else {
                    cellClass += "text-slate-300 hover:bg-[#2a2d2e] ";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDayClick(item.dateStr)}
                      onMouseEnter={() => setHoverDate(item.dateStr)}
                      className={cellClass}
                    >
                      {item.dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Manual Date Input Fields */}
              <div className="pt-2 border-t border-[#2d2d30] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Từ:</span>
                  <input
                    type="date"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="bg-[#252526] border border-[#3e3e42] text-slate-200 text-xs rounded px-2 py-1 outline-none w-32 focus:border-[#007acc]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Đến:</span>
                  <input
                    type="date"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="bg-[#252526] border border-[#3e3e42] text-slate-200 text-xs rounded px-2 py-1 outline-none w-32 focus:border-[#007acc]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white text-xs hover:bg-[#2a2d2e] rounded transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white text-xs hover:bg-[#2a2d2e] rounded transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex items-center gap-1 px-3 py-1 bg-[#007acc] hover:bg-[#0098ff] text-white text-xs font-medium rounded transition-colors shadow-sm"
                  >
                    <Check className="w-3 h-3" /> Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
