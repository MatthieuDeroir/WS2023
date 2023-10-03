const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchExpirationDateFromWebsite(serialNumber, manufacturer) {
    const browser = await puppeteer.launch({ headless: false });

    try {
        console.log('Launching browser...')
        const page = await browser.newPage();

        if (manufacturer === 'HP') {
            console.log('Fetching expiration date from HP website...');
            // Check if the cookie banner exists
            const cookieBannerSelector = '#onetrust-banner-sdk';
            const cookieAcceptButtonSelector = '#onetrust-accept-btn-handler';


            await page.goto('https://support.hp.com/fr-fr/check-warranty').then(() => console.log('Navigated to HP website'));

            await sleep(5000);

            if (await page.$(cookieBannerSelector) !== null) {
                // Click on the accept cookies button to close the banner
                await page.click(cookieAcceptButtonSelector).then(() => console.log('Clicked on accept cookies button'));

                // Optionally, wait a moment to ensure the banner is closed
                await sleep(2000);
            }

            await page.click('#closeAlert');

            // Input serial number into the search box
            await page.type('#inputtextpfinder', serialNumber).then(() => console.log('Typed serial number'));

            sleep(2000).then(() => console.log('Waited 2 seconds'));
            // Submit the search
            await Promise.all([
                page.click('#FindMyProduct'),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);

            // Wait for the results page to load and display the results.
            // const selectorForExpirationDate = '\'div[class^="text ng-tns-c69-"]\''; // Replace with the actual selector
            // await page.waitForSelector(selectorForExpirationDate);

            // The selector points directly to the fifth "info-item" child's "text" div inside the "info-section"
            const dateSelector = '.info-section.ng-tns-c69-0 .info-item.ng-tns-c69-0:nth-child(5) .text.ng-tns-c69-0';
            try {
                const endDate = await page.$eval(dateSelector, element => element.textContent);
                console.log(endDate); // Should print "June 27, 2022"
            } catch (error) {
                console.log(error);
            }


            // Extract the expiration date

            // console.log(`Expiration date: ${expirationDate}`);
            // return expirationDate;
        } else {
            throw new Error(`Manufacturer ${manufacturer} not supported.`);
        }
    } catch (error) {
        console.error(`Error fetching expiration date: ${error.message}`);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = fetchExpirationDateFromWebsite;
