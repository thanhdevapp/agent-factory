---
phase: 4
title: "Desktop Notifications & Polish"
status: completed
effort: "medium"
---

# Phase 4: Desktop Notifications & Polish

## Overview
Implement native OS desktop push notifications via the Web Notification API, provide opt-in notification controls in the header, bump version to `v0.2.0`, update PWA manifest, and verify clean production build packaging.

## Touchpoints
- Create: `src/lib/notifications.js`
- Modify: `src/app/page.js` (notification toggle button)
- Modify: `package.json` (bump to v0.2.0)
- Modify: `README.md` (document new features)

## Implementation Steps
1. Create `src/lib/notifications.js`:
   - `requestNotificationPermission()`: Check and request Notification permission.
   - `notifyAgentDone(projectName, summary)`: Send system notification on task completion.
   - `notifyAgentAlert(projectName, reason)`: Send alert notification on loop/error.
   - Notification click handler: Bring AGMon browser tab to foreground (`window.focus()`).
2. Integrate into Header:
   - Bell icon (🔔 notifications on, 🔕 notifications off).
3. Production verification & Packaging:
   - Run `npm run prepack` to ensure production build passes with 0 errors.
   - Verify package size remains under 3.5MB.
   - Test both `npx` and global daemon execution.

## Success Criteria
- [ ] Desktop notifications trigger on task completion and runaway loop alerts.
- [ ] Clicking notification focuses AGMon tab.
- [ ] Package build passes prepack cleanly.
- [ ] Ready for npm publish v0.2.0.
