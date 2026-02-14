import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output", "manual");

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  const server = spawn("node", ["server.js"], {
    cwd: root,
    stdio: "ignore"
  });

  try {
    await wait(1200);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.click("#start-adventure");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(outputDir, "platformer-page.png"), fullPage: true });
    const platformerState = await page.evaluate(() => window.render_game_to_text?.() ?? "");
    await fs.writeFile(path.join(outputDir, "platformer-state.json"), platformerState);

    await page.keyboard.down("b");
    await page.waitForTimeout(120);
    await page.keyboard.up("b");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(80);
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(outputDir, "symbols-page.png"), fullPage: true });
    const symbolsState = await page.evaluate(() => window.render_game_to_text?.() ?? "");
    await fs.writeFile(path.join(outputDir, "symbols-state.json"), symbolsState);

    await page.keyboard.down("b");
    await page.waitForTimeout(120);
    await page.keyboard.up("b");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(80);
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(outputDir, "final-page.png"), fullPage: true });
    const finalState = await page.evaluate(() => window.render_game_to_text?.() ?? "");
    await fs.writeFile(path.join(outputDir, "final-state.json"), finalState);

    await browser.close();
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
