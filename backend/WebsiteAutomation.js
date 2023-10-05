// const puppeteer = require('puppeteer');
//
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// async function fetchExpirationDateFromWebsite(serialNumber, manufacturer) {
//     const browser = await puppeteer.launch({headless: true});
//     const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
//     let endDate = null;
//     let name = null;
//     console.log('Launching ED Fetch...')
//
//
//     try {
//         console.log('Launching browser...')
//
//         const page = await browser.newPage();
//
//         await page.setDefaultNavigationTimeout(120000); // 2 minutes in milliseconds
//         await page.setDefaultTimeout(120000); // 2 minutes in milliseconds
//
//         console.log('Selecting manufacturer :', manufacturer)
//         switch (manufacturer) {
//
//             case 'HP':
//                 console.log('Fetching expiration date from HP website...');
//                 // Check if the cookie banner exists
//                 const cookieBannerSelector = '#onetrust-banner-sdk';
//                 const cookieAcceptButtonSelector = '#onetrust-accept-btn-handler';
//
//
//                 await page.goto('https://support.hp.com/fr-fr/check-warranty').then(() => console.log('Navigated to HP website'));
//
//                 try {
//                     await page.click('#closeAlert');
//                 } catch (error){
//                     console.log(error)
//                 }
//
//                 await sleep(5000);
//
//                 if (await page.$(cookieBannerSelector) !== null) {
//                     // Click on the accept cookies button to close the banner
//                     await page.click(cookieAcceptButtonSelector).then(() => console.log('Clicked on accept cookies button'));
//
//                     // Optionally, wait a moment to ensure the banner is closed
//                     await sleep(2000);
//                 }
//
//                 // Input serial number into the search box
//                 await page.type('#inputtextpfinder', serialNumber).then(() => console.log('Typed serial number'));
//
//                 await Promise.all([
//                     page.click('#FindMyProduct'),
//                     page.waitForNavigation({waitUntil: 'networkidle0'}),
//                 ]);
//
//                 // // Check for the error message
//                 const errorMessageSelector = 'p.field-info.errorTxt.is-invalid-field';
//                 const errorMessageElements = await page.$x(`//${errorMessageSelector}[contains(text(), "Ce produit ne peut pas être identifié en utilisant uniquement le numéro de série. Veuillez ajouter un numéro de produit dans le champ ci-dessous :")]`);
//                 if (errorMessageElements.length > 0) {
//                     throw new Error("Error: Product could not be identified with serial number alone. Please provide a product number.");
//                 }
//
//                 // Wait for the results page to load and display the results.
//                 // const selectorForExpirationDate = '\'div[class^="text ng-tns-c69-"]\''; // Replace with the actual selector
//                 // await page.waitForSelector(selectorForExpirationDate);
//
//                 // The selector points directly to the fifth "info-item" child's "text" div inside the "info-section"
//                 const dateSelector = '.info-section.ng-tns-c69-0 .info-item.ng-tns-c69-0:nth-child(5) .text.ng-tns-c69-0';
//                 try {
//                     endDate = await page.$eval(dateSelector, element => element.textContent);
//                     // convert enDate (Month DD, YYYY) to DD/MM/YYYY
//                     const month = endDate.split(' ')[0].toLowerCase();
//                     // if month < 10, add a 0 before
//                     if (months.indexOf(month) < 10) {
//                         const day = endDate.split(' ')[1].replace(',', '');
//                         const year = endDate.split(' ')[2];
//                         endDate = `${day}/0${months.indexOf(month) + 1}/${year}`;
//                     }
//                     else {
//                         const day = endDate.split(' ')[1].replace(',', '');
//                         const year = endDate.split(' ')[2];
//                         endDate = `${day}/${months.indexOf(month) + 1}/${year}`;
//                     }
//                     console.log(endDate);
//                 } catch (error) {
//                     console.log(error);
//                 }
//
//                 const nameSelector = 'h2.ng-tns-c69-0';
//
//                 try {
//                     name = await page.$eval(nameSelector, element => element.textContent);
//                     console.log(name);
//                 } catch (error) {
//                     console.log(error);
//                 }
//                 return {endDate, name};
//
//                 break;
//             case 'Dell':
//                 console.log('Fetching expiration date from Dell website...');
//                 break;
//             case 'Lenovo':
//                 console.log('Fetching expiration date from Lenovo website...');
//                 break;
//             case 'default':
//                 throw new Error(`Manufacturer ${manufacturer} not supported.`);
//                 break;
//         }
//     } catch (error) {
//         console.error(`Error fetching expiration date: ${error.message}`);
//         throw error;
//     } finally {
//         // await updateProduct(serialNumber, manufacturer, endDate)
//         await browser.close();
//     }
//
// }
//
// module.exports = fetchExpirationDateFromWebsite;

const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchExpirationDateFromWebsite(serialNumber, manufacturer) {
    const browser = await puppeteer.launch({headless: true});
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    let endDate = null;
    let name = null;
    console.log('Launching ED Fetch...')


    try {
        console.log('Launching browser...')

        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(120000); // 2 minutes in milliseconds
        await page.setDefaultTimeout(120000); // 2 minutes in milliseconds

        console.log('Selecting manufacturer :', manufacturer)
        switch (manufacturer) {

            case 'HP':
                console.log('Fetching expiration date from HP website...');
                // Check if the cookie banner exists
                let cookieBannerSelector = '#onetrust-banner-sdk';
                let cookieAcceptButtonSelector = '#onetrust-accept-btn-handler';


                await page.goto('https://support.hp.com/fr-fr/check-warranty').then(() => console.log('Navigated to HP website'));

                try {
                    await page.click('#closeAlert');
                } catch (error){
                    console.log(error)
                }

                await sleep(5000);

                if (await page.$(cookieBannerSelector) !== null) {
                    // Click on the accept cookies button to close the banner
                    await page.click(cookieAcceptButtonSelector).then(() => console.log('Clicked on accept cookies button'));

                    // Optionally, wait a moment to ensure the banner is closed
                    await sleep(2000);
                }

                // Input serial number into the search box
                await page.type('#inputtextpfinder', serialNumber).then(() => console.log('Typed serial number'));

                await Promise.all([
                    page.click('#FindMyProduct'),
                    page.waitForNavigation({waitUntil: 'networkidle0'}),
                ]);

                // // Check for the error message
                let errorMessageSelector = 'p.field-info.errorTxt.is-invalid-field';
                let errorMessageElements = await page.$x(`//${errorMessageSelector}[contains(text(), "Ce produit ne peut pas être identifié en utilisant uniquement le numéro de série. Veuillez ajouter un numéro de produit dans le champ ci-dessous :")]`);
                if (errorMessageElements.length > 0) {
                    throw new Error("Error: Product could not be identified with serial number alone. Please provide a product number.");
                }

                // Wait for the results page to load and display the results.
                // const selectorForExpirationDate = '\'div[class^="text ng-tns-c69-"]\''; // Replace with the actual selector
                // await page.waitForSelector(selectorForExpirationDate);

                // The selector points directly to the fifth "info-item" child's "text" div inside the "info-section"
                let dateSelector = '.info-section.ng-tns-c69-0 .info-item.ng-tns-c69-0:nth-child(5) .text.ng-tns-c69-0';
                try {
                    endDate = await page.$eval(dateSelector, element => element.textContent);
                    // convert enDate (Month DD, YYYY) to DD/MM/YYYY
                    const month = endDate.split(' ')[0].toLowerCase();
                    // if month < 10, add a 0 before
                    if (months.indexOf(month) < 10) {
                        const day = endDate.split(' ')[1].replace(',', '');
                        const year = endDate.split(' ')[2];
                        endDate = `${day}/0${months.indexOf(month) + 1}/${year}`;
                    }
                    else {
                        const day = endDate.split(' ')[1].replace(',', '');
                        const year = endDate.split(' ')[2];
                        endDate = `${day}/${months.indexOf(month) + 1}/${year}`;
                    }
                    console.log(endDate);
                } catch (error) {
                    console.log(error);
                }

                let nameSelector = 'h2.ng-tns-c69-0';

                try {
                    name = await page.$eval(nameSelector, element => element.textContent);
                    console.log(name);
                } catch (error) {
                    console.log(error);
                }
                return {endDate, name};

                break;
            case 'LENOVO':
                console.log('Fetching expiration date from Lenovo website...');

                cookieBannerSelector = '.cookie-remind-content'
                cookieAcceptButtonSelector = '.cookie-operation-cancel-button'

                await page.goto('https://pcsupport.lenovo.com/fr/fr/warranty-lookup#/').then(() => console.log('Navigated to Lenovo website'));
                /*
                try {
                    await page.click('#closeAlert');
                } catch (error){
                    console.log(error)
                }


                await sleep(5000);

                if (await page.$(cookieBannerSelector) !== null){

                }
                */

                // Input serial number into the search box
                await page.type('.button-placeholder__input', serialNumber).then(() => console.log('Typed serial number'));

                await Promise.all([
                    page.click('.btn basic-search__suffix-btn text-uppercase btn-primary in-mobile'),
                    page.waitForNavigation({waitUntil: 'networkidle0'}),
                ]);

                // Check for the error message
                errorMessageSelector = 'p.basic-search__error-msg';
                errorMessageElements = await page.$x(`//${errorMessageSelector}[contains(text(), "Ce produit ne peut pas être identifié en utilisant uniquement le numéro de série. Veuillez ajouter un numéro de produit dans le champ ci-dessous :")]`);
                if (errorMessageElements.length > 0) {
                    throw new Error("Error: Product could not be identified with serial number alone. Please provide a product number.");
                }

                dateSelector = '.detail-content .detail-property .property-value';
                try{
                    endDate = await page.$eval(dateSelector, element => element.textContent);
                    const month = endDate.split(' ')[0].toLowerCase();
                    if (months.indexOf(months) < 10){
                        const day = endDate.split(' ')[1].replace(',', '');
                        const year = endDate.split(' ')[2];
                        endDate = `${day}/0${months.indexOf(month) + 1}/${year}`;
                    }
                    else {
                        const day = endDate.split(' ')[1].replace(',', '');
                        const year = endDate.split(' ')[2];
                        endDate = `${day}/${months.indexOf(month) + 1}/${year}`;
                    }
                    console.log(endDate);
                } catch (error) {
                    console.log(error);
                }

                nameSelector = '.prod-status-area .prod-name .h4';

                try {
                    name = await page.$eval(nameSelector, element => element.textContent);
                    console.log(name);
                } catch (error){
                    console.log(error);
                }
                return {endDate, name};

                break;
            case 'default':
                throw new Error(`Manufacturer ${manufacturer} not supported.`);
                break;
        }
    } catch (error) {
        console.error(`Error fetching expiration date: ${error.message}`);
        throw error;
    } finally {
        // await updateProduct(serialNumber, manufacturer, endDate)
        await browser.close();
    }

}

module.exports = fetchExpirationDateFromWebsite;