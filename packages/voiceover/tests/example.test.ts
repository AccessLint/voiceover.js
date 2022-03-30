import { test, webkit, expect } from '@playwright/test';
import { startInteracting, VoiceOver } from '../lib';

test.describe('example.com', () => {
  test.setTimeout(30000);

  test("link test", async () => {
    const voiceOver = new VoiceOver();
    await voiceOver.launch();
    const browser = await webkit.launch({ headless: false });

    try {
      const page = await browser.newPage();
      await page.goto('https://www.example.com', { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      await voiceOver.rotor({ menu: "Window Spots", find: "conten" });
      await voiceOver.execute(startInteracting);
      const output = await voiceOver.advance({
        target: { text: "More information...", role: "link" },
        steps: 5,
      });
      expect(output).toEqual("link More information...");
    } catch (error) {
      console.warn(error);
    } finally {
      await voiceOver.quit();
      await browser.close();
    }
  });
});
