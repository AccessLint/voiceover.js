import { test, webkit } from '@playwright/test';
import { activate, VoiceOver } from '../lib';

test.describe('twitter.com', () => {
  test.use({ storageState: "storageState.json" });
  test.setTimeout(120000);

  test("headings test", async () => {
    const voiceOver = new VoiceOver();
    await voiceOver.launch();
    voiceOver.tail();
    const browser = await webkit.launch({ headless: false });

    try {
      const page = await browser.newPage();
      await page.goto('https://www.twitter.com', { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);

      await voiceOver.rotor({ menu: "Window Spots", find: "conten" });
      await page.waitForTimeout(1000)

      await voiceOver.rotor({ menu: "Landmarks", find: "sear" });
      await page.waitForTimeout(1000)

      await voiceOver.execute(activate);
      await voiceOver.keyStrokes({ text: "voiceover.js", submit: true });
      await page.waitForTimeout(1000)

      await voiceOver.rotor({ menu: "Landmarks", find: "Timel" });
      await page.waitForTimeout(1000)

      await voiceOver.seek({ text: "ckundo", tries: 25 })
      await page.waitForTimeout(1000)

      await voiceOver.clickNext({ text: "retweet", role: "button", tries: 25 });
      
      await page.waitForTimeout(1000)
      await voiceOver.cancel();


      await page.waitForTimeout(3000);
    } catch (error) {
      console.warn(error);
    } finally {
      await voiceOver.quit();
      await browser.close();
    }
  });
});
