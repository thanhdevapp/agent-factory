"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  RotateCw,
  Search,
  FolderOpen,
  Folder,
  FileCode,
  ArrowUp,
  HardDrive,
} from "lucide-react";
import FileIcon from "../common/FileIcon";

function FileTreeNodeItem({
  entry,
  depth = 0,
  expandedPaths,
  toggleFolder,
  onOpenFile,
  searchQuery,
}) {
  const isExpanded = Boolean(expandedPaths[entry.path]);
  const [children, setChildren] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lazy load children on folder expand
  useEffect(() => {
    if (entry.isDirectory && isExpanded && children === null && !loading) {
      setLoading(true);
      fetch(`/api/workspace/files?path=${encodeURIComponent(entry.path)}`)
        .then((res) => res.json())
        .then((data) => {
          setChildren(data.entries || []);
        })
        .catch(() => setChildren([]))
        .finally(() => setLoading(false));
    }
  }, [entry.isDirectory, entry.path, isExpanded, children, loading]);

  // Match search query
  const matchesSearch = useMemo(() => {
    if (!searchQuery) return true;
    return entry.name.toLowerCase().includes(searchQuery.toLowerCase());
  }, [entry.name, searchQuery]);

  if (entry.isDirectory) {
    return (
      <div className="flex flex-col">
        <div
          onClick={() => toggleFolder(entry.path)}
          className="flex items-center gap-1.5 py-1 px-2 text-xs text-slate-300 hover:text-white hover:bg-[#2a2d2e] rounded cursor-pointer transition-colors select-none"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          title={entry.path}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <FileIcon isFolder={true} isOpen={isExpanded} size={14} />
          <span className="font-medium text-[11px] truncate">{entry.name}</span>
          {loading && <RotateCw className="w-2.5 h-2.5 animate-spin text-cyan-400 ml-auto" />}
        </div>

        {/* Children entries */}
        {isExpanded && children && (
          <div className="flex flex-col">
            {children.length === 0 ? (
              <div
                className="text-[10px] text-slate-500 italic py-0.5"
                style={{ paddingLeft: `${(depth + 1) * 14 + 18}px` }}
              >
                (Empty folder)
              </div>
            ) : (
              children.map((child) => (
                <FileTreeNodeItem
                  key={child.path}
                  entry={child}
                  depth={depth + 1}
                  expandedPaths={expandedPaths}
                  toggleFolder={toggleFolder}
                  onOpenFile={onOpenFile}
                  searchQuery={searchQuery}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  if (!matchesSearch) return null;

  return (
    <div
      onClick={() => onOpenFile?.(entry)}
      className="flex items-center gap-1.5 py-1 px-2 text-xs text-slate-300 hover:text-white hover:bg-[#2a2d2e] rounded cursor-pointer transition-colors select-none group"
      style={{ paddingLeft: `${depth * 14 + 20}px` }}
      title={`${entry.name} (${entry.size ? `${Math.round(entry.size / 1024)} KB` : ""})`}
    >
      <FileIcon filename={entry.name} size={14} />
      <span className="text-[11px] text-slate-300 group-hover:text-cyan-300 truncate">
        {entry.name}
      </span>
      {entry.size > 0 && (
        <span className="text-[9px] text-slate-600 font-mono ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          {entry.size > 1024 * 1024
            ? `${(entry.size / (1024 * 1024)).toFixed(1)}M`
            : `${Math.round(entry.size / 1024)}k`}
        </span>
      )}
    </div>
  );
}

export default function FileExplorer({ onOpenFile, initialPath = "" }) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [parentPath, setParentPath] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPaths, setExpandedPaths] = useState({});

  const loadDirectory = useCallback(async (dirPath) => {
    setLoading(true);
    try {
      const url = dirPath
        ? `/api/workspace/files?path=${encodeURIComponent(dirPath)}`
        : "/api/workspace/files";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries || []);
        setCurrentPath(data.currentPath || "");
        setParentPath(data.parentPath || null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDirectory(initialPath);
  }, [initialPath, loadDirectory]);

  const toggleFolder = useCallback((folderPath) => {
    setExpandedPaths((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  }, []);

  const handleNavigateUp = () => {
    if (parentPath) {
      loadDirectory(parentPath);
    }
  };

  const folderName = useMemo(() => {
    if (!currentPath) return "Workspace";
    return currentPath.split("/").pop() || currentPath;
  }, [currentPath]);

  return (
    <div className="flex flex-col h-full w-full bg-[#181818] text-slate-200 overflow-hidden text-xs">
      {/* 1. Header Toolbar */}
      <div className="h-[30px] min-h-[30px] px-2.5 bg-[#252526] border-b border-[#2b2b2b] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-slate-300 truncate" title={currentPath}>
            {folderName}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {parentPath && (
            <button
              onClick={handleNavigateUp}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
              title="Navigate up one directory"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => loadDirectory(currentPath)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
            title="Refresh file explorer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Quick Search input */}
      <div className="p-2 border-b border-[#2b2b2b] bg-[#1e1e1e]/60">
        <div className="flex items-center gap-1.5 bg-[#252526] border border-[#3e3e42] focus-within:border-[#007acc] rounded px-2 py-1">
          <Search className="w-3 h-3 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="bg-transparent text-[11px] text-slate-200 outline-none w-full placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* 3. Tree List */}
      <div className="flex-1 overflow-y-auto p-1 py-1.5 space-y-0.5">
        {loading && entries.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-xs">Loading files...</div>
        ) : entries.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-xs italic">No files found</div>
        ) : (
          entries.map((entry) => (
            <FileTreeNodeItem
              key={entry.path}
              entry={entry}
              depth={0}
              expandedPaths={expandedPaths}
              toggleFolder={toggleFolder}
              onOpenFile={onOpenFile}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>
    </div>
  );
}
