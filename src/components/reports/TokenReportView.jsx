"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Layers,
  Cpu,
  DollarSign,
  Zap,
  RotateCw,
  Download,
  Search,
  ArrowUpRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

export default function TokenReportView({ onClose }) {
  const [timeRange, setTimeRange] = useState("week"); // 'today' | 'week' | 'month' | 'year' | 'all'
  const [providerFilter, setProviderFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [searchTable, setSearchTable] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        timeRange,
        provider: providerFilter,
        model: modelFilter,
      });
      const res = await fetch(`/api/reports/tokens?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("[TokenReportView] Fetch failed:", err);
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, providerFilter, modelFilter]);

  const summary = data?.summary || {
    totalTokens: 0,
    totalInput: 0,
    totalOutput: 0,
    totalCached: 0,
    cacheRate: 0,
    totalCost: 0,
    totalCostVnd: 0,
    sessionCount: 0,
    totalRequests: 0,
  };

  const timeseries = data?.timeseries || [];
  const byModel = data?.byModel || [];
  const byProvider = data?.byProvider || [];
  const sessions = data?.sessions || [];

  // Filter sessions table
  const filteredSessions = useMemo(() => {
    if (!searchTable.trim()) return sessions;
    const q = searchTable.toLowerCase();
    return sessions.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.model.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.project.toLowerCase().includes(q)
    );
  }, [sessions, searchTable]);

  // Max value in timeseries for scaling chart bars
  const maxTimeseriesTotal = useMemo(() => {
    if (!timeseries.length) return 1;
    return Math.max(...timeseries.map((t) => t.total), 1);
  }, [timeseries]);

  const formatTokens = (num) => {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (!filteredSessions.length) return;
    const headers = ["Time", "Session ID", "Project", "Provider", "Model", "Input Tokens", "Output Tokens", "Cached Tokens", "Total Tokens", "Cost USD"];
    const rows = filteredSessions.map((s) => [
      `"${s.date}"`,
      `"${s.id}"`,
      `"${s.project}"`,
      `"${s.provider}"`,
      `"${s.model}"`,
      s.tokens.input,
      s.tokens.output,
      s.tokens.cached,
      s.tokens.total,
      s.cost,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agmon_token_report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181818] text-[#cccccc] overflow-y-auto select-text font-sans">
      {/* Top Filter & Toolbar */}
      <div className="sticky top-0 z-30 bg-[#1e1e1e] border-b border-[#2b2b2b] px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white flex items-center gap-2">
              Báo Cáo Token & Chi Phí AI
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                Realtime Analytics
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Tổng hợp lượng token tiêu thụ theo thời gian, model và provider
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time range buttons */}
          <div className="flex items-center rounded-lg bg-[#252526] border border-[#3e3e42] p-0.5 text-xs">
            {[
              { id: "today", label: "Hôm nay" },
              { id: "week", label: "Tuần này" },
              { id: "month", label: "Tháng này" },
              { id: "year", label: "Năm nay" },
              { id: "all", label: "Tất cả" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeRange === t.id
                    ? "bg-[#007acc] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Provider selector */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-[#252526] border border-[#3e3e42] text-xs text-slate-200 rounded px-2.5 py-1.5 outline-none cursor-pointer hover:border-[#007acc] transition-colors"
          >
            <option value="all">Tất cả Provider</option>
            <option value="gemini (cli)">Gemini CLI</option>
            <option value="gemini (app)">Gemini App</option>
            <option value="claude">Claude Code</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={fetchData}
            title="Làm mới báo cáo"
            className="flex items-center justify-center w-8 h-8 rounded bg-[#252526] border border-[#3e3e42] text-slate-400 hover:text-white hover:border-[#555555] transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            title="Xuất file CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#252526] hover:bg-[#2e2e30] border border-[#3e3e42] text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Tokens */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Tổng Token Tiêu Thụ</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight mb-2">
              {formatTokens(summary.totalTokens)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2">
              <span>In: <strong className="text-slate-200">{formatTokens(summary.totalInput)}</strong></span>
              <span>Out: <strong className="text-slate-200">{formatTokens(summary.totalOutput)}</strong></span>
              <span>Cache: <strong className="text-emerald-400">{formatTokens(summary.totalCached)}</strong></span>
            </div>
          </div>

          {/* 2. Cache Hit Rate */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Tỷ Lệ Cache Hit</span>
              <Percent className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 tracking-tight mb-2 flex items-baseline gap-1.5">
              {summary.cacheRate}%
              <span className="text-[11px] font-normal text-slate-400">của tổng token</span>
            </div>
            <div className="text-[11px] text-emerald-400 border-t border-[#2b2b2b] pt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tiết kiệm ~85% chi phí prompt</span>
            </div>
          </div>

          {/* 3. Estimated Cost */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Ước Tính Chi Phí</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-300 tracking-tight mb-2">
              ${summary.totalCost.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2 flex items-center justify-between">
              <span>Quy đổi VNĐ:</span>
              <strong className="text-slate-200 font-mono">
                {summary.totalCostVnd.toLocaleString()} ₫
              </strong>
            </div>
          </div>

          {/* 4. Requests & Sessions */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Phiên & Lệnh Gọi</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-300 tracking-tight mb-2">
              {summary.sessionCount} <span className="text-sm font-normal text-slate-400">phiên</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2 flex items-center justify-between">
              <span>Tổng requests/turns:</span>
              <strong className="text-slate-200 font-mono">
                {summary.totalRequests.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Charts Section: Timeseries Bar Chart & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Bar Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Xu Hướng Tiêu Thụ Token
                </h3>
                <p className="text-[11px] text-slate-400">
                  Lượng token tiêu thụ theo từng mốc thời gian ({timeRange})
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#007acc]" /> Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Cached
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-56 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-[#2b2b2b] overflow-x-auto">
              {timeseries.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs italic">
                  Không có dữ liệu trong khoảng thời gian đã chọn
                </div>
              ) : (
                timeseries.map((item, idx) => {
                  const heightPercent = Math.max(Math.round((item.total / maxTimeseriesTotal) * 100), 4);
                  const cachedPercent = item.total > 0 ? Math.round((item.cached / item.total) * 100) : 0;
                  return (
                    <div
                      key={item.date || idx}
                      className="flex-1 min-w-[36px] flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-[#252526] border border-[#3e3e42] p-2 rounded shadow-xl text-[10px] text-slate-200 z-20 whitespace-nowrap pointer-events-none">
                        <strong className="text-white mb-1">{item.date}</strong>
                        <span>Tổng: <strong className="text-cyan-400">{formatTokens(item.total)}</strong></span>
                        <span>Cache: <strong className="text-emerald-400">{formatTokens(item.cached)} ({cachedPercent}%)</strong></span>
                        <span>In: {formatTokens(item.input)} | Out: {formatTokens(item.output)}</span>
                        <span>Ước tính: ${item.cost.toFixed(2)}</span>
                      </div>

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] bg-[#007acc]/70 hover:bg-[#007acc] rounded-t transition-all flex flex-col justify-end overflow-hidden"
                      >
                        {/* Cached portion inside bar */}
                        <div
                          style={{ height: `${cachedPercent}%` }}
                          className="w-full bg-emerald-500/80"
                        />
                      </div>

                      {/* Date label */}
                      <span className="text-[10px] text-slate-400 truncate max-w-[44px] mt-2 font-mono">
                        {item.date.slice(-5)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Breakdown by Model & Provider (1 col) */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            {/* By Model */}
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-purple-400" />
                Phân Bổ Theo Model
              </h3>
              <div className="space-y-3">
                {byModel.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Chưa có dữ liệu</p>
                ) : (
                  byModel.slice(0, 5).map((m) => {
                    const pct = summary.totalTokens > 0 ? Math.round((m.total / summary.totalTokens) * 100) : 0;
                    return (
                      <div key={m.model} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-200 truncate max-w-[160px]">
                            {m.model}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {formatTokens(m.total)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#2a2d2e] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* By Provider */}
            <div className="pt-4 border-t border-[#2b2b2b]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                Phân Bổ Theo Provider
              </h3>
              <div className="space-y-3">
                {byProvider.map((p) => {
                  const pct = summary.totalTokens > 0 ? Math.round((p.total / summary.totalTokens) * 100) : 0;
                  const isApp = p.provider.includes("app");
                  const isClaude = p.provider.includes("claude");
                  return (
                    <div key={p.provider} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              isApp
                                ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                                : isClaude
                                ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                                : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            }`}
                          >
                            {p.provider}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {formatTokens(p.total)} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#2a2d2e] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${
                            isApp
                              ? "bg-purple-500"
                              : isClaude
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sessions Table */}
        <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl overflow-hidden shadow-sm">
          {/* Table Header Controls */}
          <div className="p-4 bg-[#252526] border-b border-[#2b2b2b] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Chi Tiết Từng Phiên Làm Việc ({filteredSessions.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Thống kê số lượng token và chi phí cụ thể từng phiên transcript
              </p>
            </div>

            {/* Table Search */}
            <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#3e3e42] rounded-lg px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                placeholder="Tìm session, model, project..."
                className="bg-transparent text-slate-200 outline-none w-48 sm:w-64 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[#2b2b2b]">
              <thead className="bg-[#202022] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Thời Gian</th>
                  <th className="py-2.5 px-4">Session / Project</th>
                  <th className="py-2.5 px-4">Provider</th>
                  <th className="py-2.5 px-4">Model</th>
                  <th className="py-2.5 px-4 text-right">Input</th>
                  <th className="py-2.5 px-4 text-right">Output</th>
                  <th className="py-2.5 px-4 text-right">Cached</th>
                  <th className="py-2.5 px-4 text-right">Tổng Token</th>
                  <th className="py-2.5 px-4 text-right">Ước Tính ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242426] text-slate-300">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                      Không tìm thấy phiên làm việc nào phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((s) => {
                    const isApp = s.clientType === "app";
                    const isClaude = s.provider.includes("claude");
                    return (
                      <tr key={s.id} className="hover:bg-[#252526] transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-4 max-w-[200px]">
                          <div className="font-semibold text-white truncate">{s.project}</div>
                          <div className="text-[10px] font-mono text-slate-500 truncate">{s.id.slice(0, 12)}...</div>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isApp
                                ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                                : isClaude
                                ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                                : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            }`}
                          >
                            {isApp ? "APP" : isClaude ? "CLAUDE" : "CLI"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {s.model}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                          {s.tokens.input.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                          {s.tokens.output.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-400 font-medium">
                          {s.tokens.cached.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-white font-bold">
                          {s.tokens.total.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-amber-300 font-medium">
                          ${s.cost.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
