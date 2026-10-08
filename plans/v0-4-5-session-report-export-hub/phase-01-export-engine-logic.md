---
phase: 1
title: Export Engine Logic
status: completed
effort: small
---

# Phase 1: Export Engine Logic

## Overview
Implement pure helper functions in `src/lib/exportUtils.js` to transform raw session traces and turns into structured Markdown and self-contained HTML documents.

## Implementation Steps
1. Create `src/lib/exportUtils.js`.
2. Implement `generateSessionMarkdown(session, turns, options)`:
   - Metadata header (Session ID, CLI, Model, Timestamps, Tokens/Cost estimate).
   - Filterable sections based on `options` (`includeExecutiveSummary`, `includeThinking`, `includeToolOutputs`, `includeTimestamps`).
   - Clean GitHub-flavored Markdown tables and code blocks.
3. Implement `generateSessionHtml(session, turns, options)`:
   - Standalone HTML document structure (`<!DOCTYPE html><html><head>...`).
   - Embedded responsive CSS styling matching AGMon's dark VSCode palette.
   - `@media print` style definitions for crisp, page-break-aware PDF generation without dark background ink consumption.
4. Implement client-side download trigger helper `triggerDownload(filename, content, mimeType)`.

## Success Criteria
- [ ] `generateSessionMarkdown` handles missing metadata or turns gracefully without crashing.
- [ ] `generateSessionHtml` produces self-contained HTML (zero external script/CSS dependencies).
- [ ] Toggles for thinking and tool outputs correctly include/exclude corresponding content.
