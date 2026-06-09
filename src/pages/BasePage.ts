import { Page } from '@playwright/test';
import { UtilElementLocator } from '@utils/UtilElementLocator';
import { getLogger } from '@utils/logger';
import type winston from 'winston';

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly el: UtilElementLocator;
    protected readonly log: winston.Logger;

    protected constructor(page: Page, scope: string) {
        this.page = page;
        this.el = new UtilElementLocator(page);
        this.log = getLogger(scope);
    }

    protected async goto(relativePath: string): Promise<void> {
        this.log.info(`Navigating to: ${relativePath}`);
        await this.page.goto(relativePath);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTitle(): Promise<string> {
        const title = await this.page.title();
        this.log.debug(`Page title: ${title}`);
        return title;
    }

    async getUrl(): Promise<string> {
        return this.page.url();
    }
}
