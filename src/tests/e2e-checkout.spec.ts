/**
 * End-to-end checkout flow:
 *   1. Log in as a standard user (credentials from .env).
 *   2. Navigate to the inventory page.
 *   3. Add the first item to the cart.
 *   4. Navigate to the cart page.
 *   5. From the cart, proceed through checkout step one and checkout step two.
 *   6. Enter the customer details and complete the order.
 */

import { test, expect } from '@fixtures/test-base';
import { DataGenerator } from '@utils/DataGenerator';
import { credentials } from '@config/credentials';
import { getLogger } from '@utils/logger';
import path from 'path'
import { readCSV } from '@utils/csvReader';

const log = getLogger('e2e-checkout.spec');
const ITEM_ID = 'tta-bike-light';

test.describe('TTTA Cart - Checkout Flow', () => {

    // const testData = readCSV(path.join(__dirname, '../data/checkout-test-data.csv'));

    test.beforeEach(async ({ loginPage }) => {
        await test.step('Log in as standard_user', async () => {
            log.info('Logging in as standard_user');
            await loginPage.open();
            await loginPage.loginAs(credentials.standardUser, credentials.password);
        });
    });

    test('checkout flow @p0', async ({
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
    }) => {
        await test.step('Add an item to the cart', async () => {
            log.info(`Opening inventory page and adding item "${ITEM_ID}" to the cart`);
            await inventoryPage.open();
            await inventoryPage.addToCart(ITEM_ID);
        });

        await test.step('Go to the cart and start checkout', async () => {
            log.info('Opening cart and verifying contents');
            await inventoryPage.openCart();
            await cartPage.assertLoaded();
            expect(await cartPage.rowCount()).toBe(1);
            log.info('Proceeding to checkout');
            await cartPage.checkout();
        });

        await test.step('Fill in customer details', async () => {
            const guest = DataGenerator.checkoutCustomer();
            log.info(`Filling checkout step one with guest details: ${JSON.stringify(guest)}`);
            await checkoutStepOnePage.assertLoaded();
            await checkoutStepOnePage.fillGuest(guest);
            await checkoutStepOnePage.continue();
        });

        await test.step('Verify order summary and finish', async () => {
            log.info('Verifying order summary on checkout step two');
            await checkoutStepTwoPage.assertLoaded();
            log.info('Finishing the order');
            await checkoutStepTwoPage.finish();
        });

        await test.step('Verify the order confirmation page', async () => {
            log.info('Verifying order confirmation page');
            await checkoutCompletePage.assertOrderComplete();
        });
    });
});
