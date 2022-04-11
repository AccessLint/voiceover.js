import { test, expect } from '@playwright/test';
import { startInteracting, VoiceOver } from "../lib";

let voiceOver: VoiceOver;

test.beforeAll(async () => {
  voiceOver = new VoiceOver({ log: true, stepDelayMs: 2000 });
});

test.beforeEach(async ({ page }) => {
  voiceOver.record({ file: 'test-videos/recording.mov' });
  await page.waitForTimeout(3000);
  await voiceOver.launch();
  await page.waitForTimeout(3000);
  await page.goto("https://example.com");

  await voiceOver.rotor({ menu: "Window Spots", find: "content" });
  await voiceOver.execute(startInteracting);
});

test.afterEach(async () => {
  await voiceOver.quit();
});

test.describe("example.com", () => {
  test.setTimeout(30000);

  test("link test", async () => {
    const output = await voiceOver.advance({
      target: { text: "More information..." },
      steps: 5,
    });

    expect(output).toEqual("link More information...");
  });
});
