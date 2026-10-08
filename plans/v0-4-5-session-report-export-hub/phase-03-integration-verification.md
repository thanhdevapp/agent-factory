---
phase: 3
title: Integration & Verification
status: completed
effort: small
---

# Phase 3: Integration & Verification

## Overview
Connect the `SessionExportModal` into `SessionChatView.js`, verify seamless operation, test downloads/copies, and ensure build passes.

## Implementation Steps
1. In `src/components/chat/SessionChatView.js`:
   - Import `SessionExportModal`.
   - Add `isExportModalOpen` state.
   - Update the export header button to trigger `setIsExportModalOpen(true)`.
   - Render `SessionExportModal` with `session` and `turns` props.
2. Verify:
   - Run `npm run build` to confirm zero Next.js 16 / Turbopack build errors.
   - Test modal opening on both docked sidebar view and fullscreen/modal view.
   - Test HTML and Markdown downloads in browser.
   - Run test verification to ensure zero raw unicode emojis and 100% English UI text.

## Success Criteria
- [ ] Export button opens the new modal seamlessly.
- [ ] `npm run build` succeeds with zero errors.
- [ ] No regression on existing chat view features.
