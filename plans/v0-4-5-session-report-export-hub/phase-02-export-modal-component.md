---
phase: 2
title: Export Modal Component
status: completed
effort: medium
---

# Phase 2: Export Modal Component

## Overview
Build the interactive `SessionExportModal.jsx` component that allows users to configure content toggles, choose output formats, view a live document preview, and download or copy reports.

## Implementation Steps
1. Create `src/components/chat/SessionExportModal.jsx`.
2. Implement header with title, session badge, and close button.
3. Implement left-hand options panel:
   - Format selector tabs (`HTML Document`, `Markdown File`).
   - Content checkboxes/switches:
     - `Executive Summary`
     - `Include Thinking Process`
     - `Include Tool Outputs`
     - `Include Turn Timestamps`
4. Implement right-hand live preview:
   - Dynamic render of generated Markdown or HTML iframe/sandbox depending on selected format.
5. Implement action buttons:
   - `Copy to Clipboard` with animated checkmark confirmation.
   - `Download .html` / `Download .md`.
   - Browser Print button for instant PDF export when HTML is selected.
6. Ensure strict compliance with rules:
   - 100% English UI text.
   - Lucide icons only (no raw unicode emojis).

## Success Criteria
- [ ] Modal opens and closes smoothly with Esc key and backdrop click.
- [ ] Switching toggles immediately reflects in the live preview panel.
- [ ] Copy button copies valid text to system clipboard.
- [ ] Download buttons trigger file downloads with appropriate filenames.
