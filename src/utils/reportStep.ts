import { Page, test } from '@playwright/test';

/**
 * Runs a `test.step` and, when it finishes, attaches a full-page screenshot
 * named after the step. The CustomReporter associates an attached screenshot
 * with a step by matching the attachment name to the step title, so this makes
 * the HTML report show a screenshot for every page/step in the flow — not just
 * the single end-of-test screenshot that `screenshot: 'on'` produces.
 *
 *   await stepWithShot('Add an item to the cart', page, async () => {
 *       await inventoryPage.open();
 *       await inventoryPage.addToCart(ITEM_ID);
 *   });
 */
export async function stepWithShot<T>(
    title: string,
    page: Page,
    body: () => Promise<T>,
): Promise<T> {
    return test.step(title, async () => {
        try {
            return await body();
        } finally {
            try {
                const screenshot = await page.screenshot({ fullPage: true });
                await test.info().attach(title, {
                    body: screenshot,
                    contentType: 'image/png',
                });
            } catch {
                // Page may already be closed (e.g. the step threw on navigation).
                // A missing screenshot shouldn't mask the real failure.
            }
        }
    });
}
