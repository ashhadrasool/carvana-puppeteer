import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

class Browser {
    private exePath: any;

    private chrome: any;

    constructor(exePath: string) {
        this.exePath = exePath;
    }

    async init() {
        this.chrome = await chromium.launch({
            executablePath: this.exePath,
            headless: false,
        });
    }

    async close() {
        return this.chrome.close();
    }

    async getPage() {
        const context = await this.chrome.newContext();
        return context && context.newPage();
    }
}

export = Browser;
