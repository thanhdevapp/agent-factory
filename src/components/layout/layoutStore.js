/**
 * Layout Storage & Preferences for VS Code Workbench Layout
 */

export const WORKBENCH_LAYOUT_STORAGE_KEY = "agmon_workbench_layout";

export const DEFAULT_WORKBENCH_LAYOUT = {
  isLeftSidebarVisible: true,
  isBottomPanelVisible: true,
  isRightSidebarVisible: false,
  activeActivityView: "explorer",
  activeRightSidebarTab: "chat",
  activeBottomTab: "logs",
  activeEditorTab: "canvas",
  openedTabs: [
    { id: "canvas", title: "Virtual Office", type: "canvas", closable: false }
  ],
};

/**
 * Load layout preferences from localStorage with fallback to defaults
 */
export function loadWorkbenchLayout() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_WORKBENCH_LAYOUT };
  }
  try {
    const raw = localStorage.getItem(WORKBENCH_LAYOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_WORKBENCH_LAYOUT,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn("[layoutStore] Failed to load workbench layout:", err);
  }
  return { ...DEFAULT_WORKBENCH_LAYOUT };
}

/**
 * Save layout preferences to localStorage
 */
export function saveWorkbenchLayout(layout) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WORKBENCH_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (err) {
    console.warn("[layoutStore] Failed to save workbench layout:", err);
  }
}
