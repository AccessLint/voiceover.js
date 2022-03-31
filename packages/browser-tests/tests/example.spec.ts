import { VoiceOver } from '@accesslint/voiceover';
import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const voiceOver = new VoiceOver(); 
    await voiceOver.launch();
    await page.waitForTimeout(1000);

    await voiceOver.advance({
      target: { text: "What needs to be done?", role: "" },
      steps: 10,
    });

    await voiceOver.keyStrokes({ text: TODO_ITEMS[0], submit: true });
    await voiceOver.keyStrokes({ text: TODO_ITEMS[1], submit: true });

    const todo = await voiceOver.advance({
      target: { text: TODO_ITEMS[0], role: null },
      steps: 10,
    });

    expect(todo).toMatch(TODO_ITEMS[0]);

    await checkNumberOfTodosInLocalStorage(page, 2);
    await voiceOver.quit();
  });

});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}
