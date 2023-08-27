import Browser from './lib/browser';
import { createLogger } from './util/logger';

let browserPath: string;
const logger = createLogger();
if (process.platform === 'darwin') {
    browserPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
} else {
    browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

async function scrapWebsite(path: string) {
    const browser = new Browser(path);
    await browser.init();

    logger.info(['ashhad']);

    try {

        const page = await browser.getPage();
        await page.setRequestInterception(true);
        // @ts-ignore
        page.on('request', (request) => {
            if (request.resourceType() === 'image') {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto('https://www.carvana.com/cars', { waitUntil: 'domcontentloaded' });

        // await new Promise((resolve) => { setTimeout(resolve, 5000); });

        const cars = await page.evaluate(() => {
            const carElements = Array.from(document.querySelectorAll('.result-tile'));

            return carElements.map((carElement) => {
                const makeModelElement = carElement.querySelector('.make-model');
                const yearMakeModel = makeModelElement.querySelector('.year-make').textContent;
                const [year, make, model] = yearMakeModel.split(' ');

                const priceElement = carElement.querySelector('[data-qa="price"]');
                const price = priceElement.textContent.trim();

                const inventoryTypeElement = carElement.querySelector('.inventory-type');
                const inventoryType = inventoryTypeElement.textContent.trim();

                const termsElement = carElement.querySelector('.terms');
                const monthlyPaymentElement = termsElement.querySelector('[data-qa="monthly-payment-tooltip"]');
                const monthlyPayment = monthlyPaymentElement.textContent.trim();

                const downPaymentElement = termsElement.querySelector('.down-payment');
                const downPayment = downPaymentElement.textContent.trim();

                return {
                    year,
                    make,
                    model,
                    price,
                    inventoryType,
                    monthlyPayment,
                    downPayment,
                };
            });
        });

        logger.info(cars);
    } catch (e) {
        console.log(e);
    } finally {
        await browser.close();
    }
}

scrapWebsite(browserPath);
