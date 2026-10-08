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
  TrendingUp,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Filter,
  Wrench,
  AlertCircle,
  HelpCircle,
  PiggyBank,
  Clock,
  ArrowUpDown,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Badge,
  Modal,
  DateRangePicker,
} from "@/components/ui";

export default function TokenReportView({ onClose, onStartReplay }) {
  // Time filters
  const [timeRange, setTimeRange] = useState("week"); // 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all' | 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [granularity, setGranularity] = useState("daily");

  // Multi-criteria filters
  const [providerFilter, setProviderFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [hasErrorFilter, setHasErrorFilter] = useState("all");

  // UI tabs & table state
  const [activeTab, setActiveTab] = useState("trends"); // 'trends' | 'breakdown' | 'table'
  const [chartMetric, setChartMetric] = useState("tokens"); // 'tokens' | 'cost' | 'requests'
  const [searchTable, setSearchTable] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        timeRange,
        granularity,
        provider: providerFilter,
        model: modelFilter,
        project: projectFilter,
        tool: toolFilter,
        hasError: hasErrorFilter,
      });

      if (timeRange === "custom") {
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
      }

      const res = await fetch(`/api/reports/tokens?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("[TokenReportView] Fetch failed:", err);
      setError(err.message || "Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, startDate, endDate, granularity, providerFilter, modelFilter, projectFilter, toolFilter, hasErrorFilter]);

  const summary = data?.summary || {
    totalTokens: 0,
    totalInput: 0,
    totalOutput: 0,
    totalCached: 0,
    cacheRate: 0,
    totalCost: 0,
    totalCostVnd: 0,
    totalSavings: 0,
    totalSavingsVnd: 0,
    sessionCount: 0,
    totalRequests: 0,
    avgCostPerSession: 0,
    avgTokensPerSession: 0,
    projectedMonthlyCost: 0,
  };

  const meta = data?.meta || {};
  const timeseries = data?.timeseries || [];
  const byModel = data?.byModel || [];
  const byProvider = data?.byProvider || [];
  const byProject = data?.byProject || [];
  const byTool = data?.byTool || [];
  const byDayOfWeek = data?.byDayOfWeek || [];
  const sessions = data?.sessions || [];

  // Filter & Sort sessions
  const sortedSessions = useMemo(() => {
    let list = [...sessions];
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.model.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.project.toLowerCase().includes(q) ||
          (s.tools && s.tools.some((t) => t.toLowerCase().includes(q)))
      );
    }

    list.sort((a, b) => {
      let valA, valB;
      if (sortField === "tokens") {
        valA = a.tokens.total;
        valB = b.tokens.total;
      } else if (sortField === "cost") {
        valA = a.cost;
        valB = b.cost;
      } else if (sortField === "model") {
        valA = a.model;
        valB = b.model;
      } else if (sortField === "project") {
        valA = a.project;
        valB = b.project;
      } else {
        valA = a.timestamp;
        valB = b.timestamp;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [sessions, searchTable, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatTokens = (num) => {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  // Max value in timeseries for scaling chart bars
  const maxTimeseriesValue = useMemo(() => {
    if (!timeseries.length) return 1;
    if (chartMetric === "cost") return Math.max(...timeseries.map((t) => t.cost), 0.01);
    if (chartMetric === "requests") return Math.max(...timeseries.map((t) => t.sessions || 1), 1);
    return Math.max(...timeseries.map((t) => t.total), 1);
  }, [timeseries, chartMetric]);

  // Export CSV
  const handleExportCsv = () => {
    if (!sortedSessions.length) return;
    const headers = [
      "Time",
      "Session ID",
      "Project",
      "Provider",
      "Client Type",
      "Model",
      "Input Tokens",
      "Output Tokens",
      "Cached Tokens",
      "Total Tokens",
      "Cost USD",
      "Savings USD",
      "Tools",
    ];
    const rows = sortedSessions.map((s) => [
      `"${s.date}"`,
      `"${s.id}"`,
      `"${s.project}"`,
      `"${s.provider}"`,
      `"${s.clientType}"`,
      `"${s.model}"`,
      s.tokens.input,
      s.tokens.output,
      s.tokens.cached,
      s.tokens.total,
      s.cost,
      s.savings,
      `"${(s.tools || []).join(";")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `agmon_token_report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `agmon_token_analytics_${timeRange}_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181818] text-[#cccccc] overflow-y-auto select-text font-sans">
      {/* Header & Breadcrumb */}
      <div className="sticky top-0 z-30 bg-[#1e1e1e] border-b border-[#2b2b2b] px-5 py-3 shadow-md space-y-3">
        {/* Top line: Title & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white flex items-center gap-2">
                Báo Cáo Token & Chi Phí AI
                <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  Multi-Criteria Analytics
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Phân tích sâu mức độ tiêu thụ token theo đa tiêu chí, mốc thời gian, model và provider
              </p>
            </div>
          </div>

          {/* Export & Refresh */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={fetchData}
              title="Làm mới dữ liệu"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCsv}
              title="Xuất file CSV"
              leftIcon={<Download className="w-3.5 h-3.5 text-cyan-400" />}
            >
              Xuất CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportJson}
              title="Xuất dữ liệu thô JSON"
              leftIcon={<FileCode className="w-3.5 h-3.5 text-purple-400" />}
            >
              <span className="hidden sm:inline">JSON</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar: Time Ranges & Granularity */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2a2c] text-xs">
          {/* Time Presets */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-slate-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Mốc thời gian:
            </span>
            {[
              { id: "today", label: "Hôm nay" },
              { id: "yesterday", label: "Hôm qua" },
              { id: "week", label: "7 Ngày (Tuần)" },
              { id: "month", label: "30 Ngày (Tháng)" },
              { id: "year", label: "Năm nay" },
              { id: "all", label: "Toàn bộ" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTimeRange(t.id);
                  setStartDate("");
                  setEndDate("");
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeRange === t.id
                    ? "bg-[#007acc] text-white shadow-sm"
                    : "bg-[#252526] text-slate-400 hover:text-slate-200 border border-[#3e3e42]"
                }`}
              >
                {t.label}
              </button>
            ))}

            {/* Custom Dark Date Range Picker (Radix UI Popover) */}
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#3e3e42]">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                isActive={timeRange === "custom"}
                onChange={({ startDate: s, endDate: e }) => {
                  setStartDate(s);
                  setEndDate(e);
                  if (s || e) {
                    setTimeRange("custom");
                  } else {
                    setTimeRange("week");
                  }
                }}
              />
              {timeRange === "custom" && (
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange("week");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="p-1 text-slate-400 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
                  title="Xóa khoảng ngày tùy chỉnh"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Granularity Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Gom nhóm:
            </span>
            <div className="flex items-center bg-[#252526] border border-[#3e3e42] rounded p-0.5 text-[11px]">
              {[
                { id: "hourly", label: "Theo Giờ" },
                { id: "daily", label: "Theo Ngày" },
                { id: "weekly", label: "Theo Tuần" },
                { id: "monthly", label: "Theo Tháng" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGranularity(g.id)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    granularity === g.id
                      ? "bg-[#333333] text-cyan-300 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Criteria Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2a2a2c] text-xs">
          <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Tiêu chí lọc:
          </span>

          {/* Provider Filter */}
          <Select
            selectSize="sm"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            wrapperClassName="w-auto"
          >
            <option value="all">Tất cả Provider</option>
            <option value="gemini (cli)">Gemini (CLI)</option>
            <option value="gemini (app)">Gemini (App)</option>
            <option value="claude">Claude Code</option>
          </Select>

          {/* Model Filter */}
          <Select
            selectSize="sm"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            wrapperClassName="w-auto"
          >
            <option value="all">Tất cả Model</option>
            {meta.availableModels?.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>

          {/* Project / Workspace Filter */}
          <Select
            selectSize="sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            wrapperClassName="w-auto max-w-[180px]"
          >
            <option value="all">Tất cả Dự Án</option>
            {meta.availableProjects?.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>

          {/* AI Tool Filter */}
          <Select
            selectSize="sm"
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value)}
            wrapperClassName="w-auto"
          >
            <option value="all">Tất cả Công cụ (Tools)</option>
            {meta.availableTools?.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          {/* Error state filter */}
          <Select
            selectSize="sm"
            value={hasErrorFilter}
            onChange={(e) => setHasErrorFilter(e.target.value)}
            wrapperClassName="w-auto"
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="false">Chỉ phiên Thành Công</option>
            <option value="true">Chỉ phiên Có Lỗi</option>
          </Select>

          {/* Reset filters button if any is active */}
          {(providerFilter !== "all" || modelFilter !== "all" || projectFilter !== "all" || toolFilter !== "all" || hasErrorFilter !== "all") && (
            <Button
              variant="danger"
              size="xs"
              onClick={() => {
                setProviderFilter("all");
                setModelFilter("all");
                setProjectFilter("all");
                setToolFilter("all");
                setHasErrorFilter("all");
              }}
              leftIcon={<X className="w-3 h-3" />}
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Tokens */}
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

          {/* Card 2: Cache Hit Rate & Savings */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Cache Hit & Tiết Kiệm</span>
              <PiggyBank className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 tracking-tight mb-2 flex items-baseline gap-1.5">
              {summary.cacheRate}%
              <span className="text-xs font-semibold text-emerald-400">
                (+${summary.totalSavings.toFixed(1)} tiết kiệm)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2 flex items-center justify-between">
              <span>Tiết kiệm VNĐ:</span>
              <strong className="text-emerald-400 font-mono">
                ~{summary.totalSavingsVnd.toLocaleString()} ₫
              </strong>
            </div>
          </div>

          {/* Card 3: Estimated Cost & Projection */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Chi Phí Ước Tính</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-300 tracking-tight mb-2">
              ${summary.totalCost.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-2">
                ({summary.totalCostVnd.toLocaleString()} ₫)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2 flex items-center justify-between">
              <span>Dự báo tháng (Run-rate):</span>
              <strong className="text-slate-200 font-mono">
                ${summary.projectedMonthlyCost.toFixed(1)}
              </strong>
            </div>
          </div>

          {/* Card 4: Session Metrics & Averages */}
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#007acc]/50 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Phiên & Lệnh Gọi</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-300 tracking-tight mb-2">
              {summary.sessionCount} <span className="text-sm font-normal text-slate-400">phiên</span>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-[#2b2b2b] pt-2 flex items-center justify-between">
              <span>TB: {formatTokens(summary.avgTokensPerSession)} token</span>
              <span>{summary.totalRequests.toLocaleString()} turns</span>
            </div>
          </div>
        </div>

        {/* View Tabs Selector */}
        <div className="flex items-center gap-1 border-b border-[#2b2b2b] pb-2 text-xs">
          <button
            onClick={() => setActiveTab("trends")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "trends"
                ? "bg-[#007acc] text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#252526]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Xu Hướng & Thời Gian</span>
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "breakdown"
                ? "bg-[#007acc] text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#252526]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Phân Bổ Đa Chiều (Model & Provider)</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === "table"
                ? "bg-[#007acc] text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#252526]"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Chi Tiết Từng Phiên ({sortedSessions.length})</span>
          </button>
        </div>

        {/* Tab 1: Trends & Timeseries */}
        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Biểu Đồ Tiêu Thụ Theo Mốc Thời Gian ({timeRange} · {granularity})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Phân tích biến động lượng token theo từng chu kỳ
                  </p>
                </div>

                {/* Metric switch for chart */}
                <div className="flex items-center rounded bg-[#252526] border border-[#3e3e42] p-0.5 text-xs">
                  <button
                    onClick={() => setChartMetric("tokens")}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      chartMetric === "tokens" ? "bg-[#007acc] text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Tokens
                  </button>
                  <button
                    onClick={() => setChartMetric("cost")}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      chartMetric === "cost" ? "bg-[#007acc] text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Chi Phí ($)
                  </button>
                  <button
                    onClick={() => setChartMetric("requests")}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      chartMetric === "requests" ? "bg-[#007acc] text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Số Phiên
                  </button>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-64 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-[#2b2b2b] overflow-x-auto">
                {timeseries.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs italic">
                    Không có dữ liệu trong khoảng thời gian đã chọn
                  </div>
                ) : (
                  timeseries.map((item, idx) => {
                    let val = item.total;
                    let labelVal = formatTokens(item.total);
                    if (chartMetric === "cost") {
                      val = item.cost;
                      labelVal = `$${item.cost.toFixed(2)}`;
                    } else if (chartMetric === "requests") {
                      val = item.sessions || 1;
                      labelVal = `${val} phiên`;
                    }

                    const heightPercent = Math.max(Math.round((val / maxTimeseriesValue) * 100), 5);
                    const cachedPercent = item.total > 0 ? Math.round((item.cached / item.total) * 100) : 0;

                    return (
                      <div
                        key={item.date || idx}
                        className="flex-1 min-w-[42px] flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-[#252526] border border-[#3e3e42] p-2 rounded shadow-xl text-[10px] text-slate-200 z-20 whitespace-nowrap pointer-events-none">
                          <strong className="text-white mb-1">{item.date}</strong>
                          <span>Tổng Token: <strong className="text-cyan-400">{formatTokens(item.total)}</strong></span>
                          <span>Prompt Cache: <strong className="text-emerald-400">{formatTokens(item.cached)} ({cachedPercent}%)</strong></span>
                          <span>In: {formatTokens(item.input)} | Out: {formatTokens(item.output)}</span>
                          <span>Chi phí: ${item.cost.toFixed(3)}</span>
                          <span>Số phiên: {item.sessions || 1}</span>
                        </div>

                        {/* Top bar value label */}
                        <span className="text-[9px] text-slate-400 font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {labelVal}
                        </span>

                        {/* Bar Pillar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[46px] bg-[#007acc]/70 hover:bg-[#007acc] rounded-t transition-all flex flex-col justify-end overflow-hidden cursor-pointer"
                        >
                          {chartMetric === "tokens" && (
                            <div
                              style={{ height: `${cachedPercent}%` }}
                              className="w-full bg-emerald-500/80"
                            />
                          )}
                        </div>

                        {/* X-axis date label */}
                        <span className="text-[10px] text-slate-400 truncate max-w-[48px] mt-2 font-mono">
                          {item.date.includes(" ") ? item.date.split(" ")[1] : item.date.slice(-5)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Day of Week Analysis */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Mật Độ Tiêu Thụ Theo Thứ Trong Tuần
              </h3>
              <p className="text-[11px] text-slate-400">
                Thống kê tần suất và lượng token được sử dụng nhiều nhất vào các ngày trong tuần
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
                {byDayOfWeek.map((d) => (
                  <div key={d.day} className="bg-[#252526] p-3 rounded-lg border border-[#333333] text-center space-y-1">
                    <span className="text-slate-400 text-xs font-semibold block">{d.day}</span>
                    <div className="text-sm font-bold text-white">{formatTokens(d.tokens)}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">${d.cost.toFixed(2)}</div>
                    <div className="text-[9px] text-slate-500">{d.sessions} phiên</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multi-Dimensional Breakdown */}
        {activeTab === "breakdown" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. By Model */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Phân Bổ Theo AI Model ({byModel.length})
              </h3>
              <div className="space-y-3">
                {byModel.map((m) => {
                  const pct = summary.totalTokens > 0 ? Math.round((m.total / summary.totalTokens) * 100) : 0;
                  return (
                    <div key={m.model} className="p-3 bg-[#252526] rounded-lg border border-[#333333] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white truncate max-w-[200px]">{m.model}</span>
                        <div className="text-right">
                          <span className="font-mono text-cyan-400 font-semibold">{formatTokens(m.total)}</span>
                          <span className="text-slate-500 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-[#2e2e30]">
                        <span>In: {formatTokens(m.input)} | Out: {formatTokens(m.output)}</span>
                        <span className="text-amber-400 font-mono">Chi phí: ${m.cost.toFixed(2)} ({m.sessions} phiên)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. By Provider */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Phân Bổ Theo Provider ({byProvider.length})
              </h3>
              <div className="space-y-3">
                {byProvider.map((p) => {
                  const pct = summary.totalTokens > 0 ? Math.round((p.total / summary.totalTokens) * 100) : 0;
                  const isApp = p.provider.includes("app");
                  const isClaude = p.provider.includes("claude");
                  return (
                    <div key={p.provider} className="p-3 bg-[#252526] rounded-lg border border-[#333333] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isApp
                              ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                              : isClaude
                              ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                              : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {p.provider}
                        </span>
                        <div className="text-right">
                          <span className="font-mono text-emerald-400 font-semibold">{formatTokens(p.total)}</span>
                          <span className="text-slate-500 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${
                            isApp ? "bg-purple-500" : isClaude ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-[#2e2e30]">
                        <span>Cache: {formatTokens(p.cached)}</span>
                        <span className="text-amber-400 font-mono">Chi phí: ${p.cost.toFixed(2)} ({p.sessions} phiên)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. By Projects */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Phân Bổ Theo Dự Án / Workspace ({byProject.length})
              </h3>
              <div className="space-y-3">
                {byProject.map((proj) => {
                  const pct = summary.totalTokens > 0 ? Math.round((proj.total / summary.totalTokens) * 100) : 0;
                  return (
                    <div key={proj.project} className="p-3 bg-[#252526] rounded-lg border border-[#333333] space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white truncate max-w-[200px]">{proj.project}</span>
                        <span className="font-mono text-cyan-400 font-semibold">{formatTokens(proj.total)} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-cyan-500 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>{proj.sessions} phiên làm việc</span>
                        <span className="text-amber-400">${proj.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. By Tools Used */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                Công Cụ Được Sử Dụng Nhiều Nhất ({byTool.length})
              </h3>
              <div className="space-y-2">
                {byTool.slice(0, 8).map((t) => (
                  <div key={t.tool} className="flex items-center justify-between p-2 bg-[#252526] rounded border border-[#333333] text-xs">
                    <span className="font-mono text-slate-200 text-[11px]">{t.tool}</span>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#333333] px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                        {t.count} lần gọi
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{formatTokens(t.tokens)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Sessions Ledger */}
        {activeTab === "table" && (
          <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-xl overflow-hidden shadow-sm">
            {/* Search Header */}
            <div className="p-4 bg-[#252526] border-b border-[#2b2b2b] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Sổ Lịch Sử Chi Tiết Từng Phiên ({sortedSessions.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Bấm vào tiêu đề cột để sắp xếp tăng / giảm dần
                </p>
              </div>

              {/* Table Search */}
              <Input
                inputSize="sm"
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-500" />}
                clearable
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                onClear={() => setSearchTable("")}
                placeholder="Tìm theo ID, model, tool, project..."
                wrapperClassName="w-48 sm:w-64"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-[#2b2b2b]">
                <thead className="bg-[#202022] text-slate-400 uppercase text-[10px] tracking-wider font-semibold select-none">
                  <tr>
                    <th onClick={() => handleSort("timestamp")} className="py-2.5 px-4 cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1">
                        <span>Thời Gian</span>
                        <ArrowUpDown className="w-2.5 h-2.5" />
                      </div>
                    </th>
                    <th onClick={() => handleSort("project")} className="py-2.5 px-4 cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1">
                        <span>Dự Án / Session ID</span>
                        <ArrowUpDown className="w-2.5 h-2.5" />
                      </div>
                    </th>
                    <th className="py-2.5 px-4">Provider</th>
                    <th onClick={() => handleSort("model")} className="py-2.5 px-4 cursor-pointer hover:text-white">
                      <div className="flex items-center gap-1">
                        <span>Model</span>
                        <ArrowUpDown className="w-2.5 h-2.5" />
                      </div>
                    </th>
                    <th className="py-2.5 px-4 text-right">Prompt Input</th>
                    <th className="py-2.5 px-4 text-right">Output</th>
                    <th className="py-2.5 px-4 text-right">Prompt Cache</th>
                    <th onClick={() => handleSort("tokens")} className="py-2.5 px-4 text-right cursor-pointer hover:text-white">
                      <div className="flex items-center justify-end gap-1">
                        <span>Tổng Token</span>
                        <ArrowUpDown className="w-2.5 h-2.5" />
                      </div>
                    </th>
                    <th onClick={() => handleSort("cost")} className="py-2.5 px-4 text-right cursor-pointer hover:text-white">
                      <div className="flex items-center justify-end gap-1">
                        <span>Chi Phí ($)</span>
                        <ArrowUpDown className="w-2.5 h-2.5" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center">Tác Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242426] text-slate-300">
                  {sortedSessions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500 italic">
                        Không tìm thấy phiên làm việc nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  ) : (
                    sortedSessions.map((s) => {
                      const isApp = s.clientType === "app";
                      const isClaude = s.provider.includes("claude");
                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedSessionDetail(s)}
                          className="hover:bg-[#252526] transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-2.5 px-4 max-w-[200px]">
                            <div className="font-semibold text-white truncate">{s.project}</div>
                            <div className="text-[10px] font-mono text-slate-500 truncate">{s.id.slice(0, 12)}...</div>
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <Badge
                              variant={isApp ? "primary" : isClaude ? "warning" : "success"}
                              badgeSize="xs"
                            >
                              {isApp ? "APP" : isClaude ? "CLAUDE" : "CLI"}
                            </Badge>
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
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartReplay?.(s.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-[#333333] transition-colors cursor-pointer"
                              title="Tua lại hành trình AI phiên này (Time-Machine Replay)"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Session Detail Popup */}
        <Modal
          isOpen={Boolean(selectedSessionDetail)}
          onClose={() => setSelectedSessionDetail(null)}
          title={`Chi Tiết Phiên: ${selectedSessionDetail?.project || ""}`}
          description={selectedSessionDetail ? `Session ID: ${selectedSessionDetail.id}` : undefined}
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              {onStartReplay && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const id = selectedSessionDetail.id;
                    setSelectedSessionDetail(null);
                    onStartReplay(id);
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Tua Lại Phiên (Replay)
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSessionDetail(null)}
              >
                Đóng
              </Button>
            </div>
          }
        >
          {selectedSessionDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">SESSION ID</span>
                  <span className="font-mono text-slate-300 truncate block">{selectedSessionDetail.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MODEL</span>
                  <span className="font-semibold text-emerald-400">{selectedSessionDetail.model}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PROVIDER</span>
                  <span className="font-semibold text-slate-200">{selectedSessionDetail.provider}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">THỜI GIAN</span>
                  <span className="text-slate-300">{new Date(selectedSessionDetail.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-[#1e1e1e] rounded-lg border border-[#333333] space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Input Tokens:</span>
                  <span className="font-mono text-white">{selectedSessionDetail.tokens.input.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Output Tokens:</span>
                  <span className="font-mono text-white">{selectedSessionDetail.tokens.output.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Prompt Cache:</span>
                  <span className="font-mono text-emerald-400">{selectedSessionDetail.tokens.cached.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-[#2b2b2b]">
                  <span>Tổng Token:</span>
                  <span className="font-mono text-cyan-400">{selectedSessionDetail.tokens.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Chi phí ước tính:</span>
                  <span className="font-mono">${selectedSessionDetail.cost.toFixed(3)} (~{Math.round(selectedSessionDetail.cost * 25400).toLocaleString()} ₫)</span>
                </div>
              </div>

              {selectedSessionDetail.tools && selectedSessionDetail.tools.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 text-xs font-semibold block">Công cụ đã thực thi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSessionDetail.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#3e3e42] text-[11px] font-mono text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
