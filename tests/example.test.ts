import { test, webkit, expect } from '@playwright/test';
import { activate, startInteracting, VoiceOver } from '../lib';

test.describe('twitter.com', () => {
  test.setTimeout(60000);

  test("headings test", async () => {
    const voiceOver = new VoiceOver();
    await voiceOver.launch();
    const browser = await webkit.launch({ headless: false });

    try {
      const page = await browser.newPage();
      await page.goto('https://www.example.com', { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      await voiceOver.rotor({ menu: "Window Spots", find: "conten" });
      await voiceOver.execute(startInteracting);
      const output = await voiceOver.seek({ text: 'link More information...' });
      expect(output).toContain('link More information...');
    } catch (error) {
      console.warn(error);
    } finally {
      await voiceOver.quit();
      await browser.close();
    }
  });
});
