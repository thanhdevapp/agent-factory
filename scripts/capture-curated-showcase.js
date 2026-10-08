import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const ARTIFACT_DIR = "/Users/macmini/.gemini/antigravity-cli/brain/17d2113b-253a-4403-bc6b-08c9d5776434";

async function main() {
  console.log("Launching browser to capture curated items and staff shapes...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Visit Store and unlock VIP
  console.log("Navigating to Store view...");
  await page.goto("http://localhost:3030/?store=1", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Quick unlock VIP for previewing all curated items
  try {
    const quickUnlockBtn = page.locator('button:has-text("Unlock all"), button:has-text("VIP Demo"), button:has-text("Buff Dev")');
    if (await quickUnlockBtn.count() > 0) {
      await quickUnlockBtn.first().click();
      await page.waitForTimeout(500);
    }
  } catch (err) {
    console.log("Quick unlock note:", err.message);
  }

  // 2. Capture Store Skins Tab showing 5 distinct archetype staff uniforms & 3D cards
  console.log("Navigating to Store Skins Tab...");
  const skinsBtn = page.locator('button:has-text("Skins (50)"), button:has-text("Agent Skins 3D")');
  if (await skinsBtn.count() > 0) {
    await skinsBtn.first().click();
    await page.waitForTimeout(700);
  }

  console.log("Capturing Store Skins Tab with 5 Distinct Staff Archetypes...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "curated_store_staff_shapes.png"),
    fullPage: false,
  });

  // 3. Switch to Props Tab
  console.log("Navigating to Props tab in Store...");
  const propsTab = page.locator('button:has-text("Props (35)"), button:has-text("Tech Desk Props")');
  if (await propsTab.count() > 0) {
    await propsTab.first().click();
    await page.waitForTimeout(700);
    console.log("Capturing Store Props Tab with 7 Distinct Prop Archetypes...");
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "curated_store_props_deck.png"),
      fullPage: false,
    });
  }

  // 4. Open Fitting Room
  console.log("Opening Live Fitting Room Modal...");
  const fittingBtn = page.locator('button:has-text("Fitting Room (3D)"), button:has-text("Open 3D Fitting Room")');
  if (await fittingBtn.count() > 0) {
    await fittingBtn.first().click();
    await page.waitForTimeout(1000);

    // Try selecting a Mecha Pilot skin to showcase distinct heavy exoskeleton chassis
    try {
      const mechaSkin = page.locator('button:has-text("Apex Frame"), button:has-text("Iron Juggernaut")');
      if (await mechaSkin.count() > 0) {
        await mechaSkin.first().click();
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log("Skin selection note:", e.message);
    }

    console.log("Capturing Live Fitting Room with Distinct Staff Silhouettes...");
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "curated_fitting_room_staff_forms.png"),
      fullPage: false,
    });
  }

  // 5. Navigate to Factory Floor Canvas and activate Items Showcase
  console.log("Navigating to Factory Canvas and triggering Items Showcase...");
  await page.goto("http://localhost:3030", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const showcaseBtn = page.locator('button:has-text("Items Showcase")');
  if (await showcaseBtn.count() > 0) {
    await showcaseBtn.first().click();
    console.log("Clicked Items Showcase button on titlebar.");
    await page.waitForTimeout(3000);
  } else {
    // Fallback: click Mock button
    const mockBtn = page.locator('button:has-text("Mock")');
    if (await mockBtn.count() > 0) {
      await mockBtn.first().click();
      await page.waitForTimeout(3000);
    }
  }

  console.log("Capturing Factory Canvas Showcase Preset...");
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "curated_canvas_showcase.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("All curated showcase screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
