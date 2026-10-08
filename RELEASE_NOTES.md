# AGMon Release Notes

## Version: Mock Showcase & 1,000 3D Cosmetic Items System

### Overview
This release introduces a complete, high-fidelity mock showcase architecture for evaluating all **1,010 cosmetic items** and **24 visual archetypes** across 6 categories (Agent 3D Skins, Tech Desk Props, Pets & Companions, Particle Auras, Trophies & Badges, Office Themes).

---

### Highlights & Key Features

1. **All Items Mock Showcase (24 Workstations)**:
   - Added `preset=showcase` featuring 24 distinct workstations.
   - 100% coverage of all 24 visual archetypes rendering simultaneously in PixiJS.
   - Covers all 6 agent motion modes: `streaming` (typing), `happy` (celebrating), `pending` (thinking), `sleeping` (dozing off), `error` (shaking/smoke), `looping` (dizzy loop).
   - Instant 1-click access via the **"Items Showcase"** button on the TitleBar.

2. **Dedicated Category-Specific Mock Presets**:
   - `showcase_skins` (15 agents): Compares all 5 skin archetypes across 3 colorways.
   - `showcase_props` (14 workstations): Demonstrates all 7 tech desk props in single and paired setups.
   - `showcase_pets` (12 desks): Shows all 4 animated companion pets.
   - `showcase_auras` (12 agents): Radiates all 4 particle aura effects.
   - `showcase_trophies` (12 desks): Displays all 4 3D trophy models on obsidian pedestals.
   - `cases` (17 cases): Enriched edge-case deck with personality-matched items.

3. **Per-Workstation Cosmetic Transmission & Multi-Slot Equipment**:
   - Enhanced `office-layout.js` to preserve `skin`, `aura`, `pet`, `props`, and `trophy` per trace.
   - Enhanced `office-scene.js` so desks and characters render individual item gear with seamless fallback to supporter equipment.
   - Signature cache tracking prevents single-frame flickers on telemetry refreshes.

4. **Active Gear Inspector Card**:
   - Added **"EQUIPPED COSMETICS"** card to the RightSidebar Inspector.
   - Displays real-time details when clicking any workstation: Chassis Skin, Particle Aura, Tech Desk Props, Companion Pet, and Desk Trophy with color dots and archetype badges.

5. **Visual Gallery Showcase**:
   - High-resolution visual gallery available at `public/screenshots/gallery.html`.
   - Direct links to launch each preset directly on the local canvas.

6. **Comprehensive Test Suites (178/178 Passed)**:
   - `scripts/test-all-mock-items.js`: 22/22 passed.
   - `scripts/deep-test-catalog.js`: 74/74 passed.
   - `scripts/deep-test-store-state.js`: 82/82 passed.
