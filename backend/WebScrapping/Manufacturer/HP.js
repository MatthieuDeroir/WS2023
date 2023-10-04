const puppeteer = require('puppeteer');

async function fetchHPExpirationDate(page, serialNumber) {
    console.log('Fetching expiration date from HP website...');

    // Check if the cookie banner exists
    const cookieBannerSelector = '#onetrust-banner-sdk';
    const cookieAcceptButtonSelector = '#onetrust-accept-btn-handler';

    await page.goto('https://support.hp.com/fr-fr/check-warranty');

    await new Promise(resolve => setTimeout(resolve, 5000)); // Sleep for 5 seconds

    if (await page.$(cookieBannerSelector) !== null) {
        // Click on the accept cookies button to close the banner
        await page.click(cookieAcceptButtonSelector);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Optionally, wait a moment to ensure the banner is closed
    }

    await page.click('#closeAlert');

    // Input serial number into the search box
    await page.type('#inputtextpfinder', serialNumber);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Sleep for 2 seconds

    // Submit the search
    await Promise.all([
        page.click('#FindMyProduct'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);


    let endDate;
    try {
        endDate = await page.$eval(dateSelector, element => element.textContent);
        console.log(endDate); // Should print "June 27, 2022"
    } catch (error) {
        console.error(`Error fetching expiration date from HP: ${error.message}`);
    }

    return endDate;
}

module.exports = fetchHPExpirationDate;
