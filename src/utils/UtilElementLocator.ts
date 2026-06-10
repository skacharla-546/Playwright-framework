import { expect, Locator, Page } from '@playwright/test';
import { getLogger } from '@utils/logger';
import type winston from 'winston';

export const DEFAULT_ACTION_TIMEOUT_MS = 30000;
export type Flex = string | Locator;

export class UtilElementLocator {
    private readonly page: Page;
    private readonly log: winston.Logger;

    constructor(page: Page, scope: string = 'UtilElementLocator') {
        this.page = page;
        this.log = getLogger(scope);
    }

    private toLocator(target: Flex): Locator {
        return typeof target === 'string' ? this.page.locator(target) : target;
    }

    async click(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`click: ${target}`);
        const loc = this.toLocator(target);
        await loc.click({ timeout, noWaitAfter: true });
    }

    async doubleClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`doubleClick: ${target}`);
        const loc = this.toLocator(target);
        await loc.dblclick({ timeout });
    }

    async rightClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`rightClick: ${target}`);
        const loc = this.toLocator(target);
        await loc.click({ button: 'right', timeout });
    }

    async hover(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`hover: ${target}`);
        const loc = this.toLocator(target);
        await loc.hover({ timeout });
    }

    async fill(target: Flex, value: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`fill: ${target} = "${value}"`);
        const loc = this.toLocator(target);
        await loc.fill(value, { timeout });
    }

    async type(target: Flex, value: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`type: ${target} = "${value}"`);
        // Playwright deprecated .type() in favour of .pressSequentially().
        const loc = this.toLocator(target);
        await loc.pressSequentially(value, { timeout });
    }

    async clear(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`clear: ${target}`);
        const loc = this.toLocator(target);
        await loc.clear({ timeout });
    }
    
    async pressSequentially(
        target: Flex,
        value: string,
        timeout: number = DEFAULT_ACTION_TIMEOUT_MS,
    ): Promise<void> {
        this.log.debug(`pressSequentially: ${target} = "${value}"`);
        const loc = this.toLocator(target);
        await loc.pressSequentially(value, { timeout });
    }

    // ---------- text & content getters ----------

    async getText(target: Flex): Promise<string> {
        const loc = this.toLocator(target);
        const txt = ((await loc.textContent()) ?? '').trim();
        this.log.debug(`getText: ${target} => "${txt}"`);
        return txt;
    }

    async getInnerText(target: Flex): Promise<string> {
        const loc = this.toLocator(target);
        const txt = (await loc.innerText()).trim();
        this.log.debug(`getInnerText: ${target} => "${txt}"`);
        return txt;
    }

    async getAllTexts(target: Flex): Promise<string[]> {
        const loc = this.toLocator(target);
        const texts = (await loc.allTextContents()).map((t) => t.trim());
        this.log.debug(`getAllTexts: ${target} => [${texts.join(', ')}]`);
        return texts;
    }

    async getAttr(target: Flex, name: string): Promise<string | null> {
        const loc = this.toLocator(target);
        const value = await loc.getAttribute(name);
        this.log.debug(`getAttr: ${target} [${name}] => "${value}"`);
        return value;
    }

    async getValue(target: Flex): Promise<string> {
        const loc = this.toLocator(target);
        const value = await loc.inputValue();
        this.log.debug(`getValue: ${target} => "${value}"`);
        return value;
    }

    // ---------- count ----------

    async count(target: Flex): Promise<number> {
        const loc = this.toLocator(target);
        const n = await loc.count();
        this.log.debug(`count: ${target} => ${n}`);
        return n;
    }

    // ---------- state checks ----------

    async isVisible(target: Flex): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isVisible();
        this.log.debug(`isVisible: ${target} => ${result}`);
        return result;
    }

    async isEnabled(target: Flex): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isEnabled();
        this.log.debug(`isEnabled: ${target} => ${result}`);
        return result;
    }

    async isChecked(target: Flex): Promise<boolean> {
        const loc = this.toLocator(target);
        const result = await loc.isChecked();
        this.log.debug(`isChecked: ${target} => ${result}`);
        return result;
    }

    // ---------- waits ----------

    async waitForVisible(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`waitForVisible: ${target}`);
        const loc = this.toLocator(target);
        await expect(loc).toBeVisible({ timeout });
    }

    async waitForHidden(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        this.log.debug(`waitForHidden: ${target}`);
        const loc = this.toLocator(target);
        await expect(loc).toBeHidden({ timeout });
    }

    async waitForPageLoad(): Promise<void> {
        this.log.debug('waitForPageLoad: waiting for domcontentloaded + networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle').catch(() => {
            // TTACart is static + localStorage so networkidle is fast,
            // but we swallow the rare timeout so the test isn't punished
            // by background analytics calls on the demo origin.
        });
        this.log.debug('waitForPageLoad: page ready');
    }

    // ---------- selects ----------

    async selectByText(target: Flex, text: string): Promise<void> {
        this.log.debug(`selectByText: ${target} = "${text}"`);
        const loc = this.toLocator(target);
        await loc.selectOption({ label: text });
    }

    async selectByValue(target: Flex, value: string): Promise<void> {
        this.log.debug(`selectByValue: ${target} = "${value}"`);
        const loc = this.toLocator(target);
        await loc.selectOption({ value });
    }

    async selectByIndex(target: Flex, index: number): Promise<void> {
        this.log.debug(`selectByIndex: ${target} = ${index}`);
        const loc = this.toLocator(target);
        await loc.selectOption({ index });
    }
}