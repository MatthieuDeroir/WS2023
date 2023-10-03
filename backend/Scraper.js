const axios = require('axios');
const cheerio = require('cheerio');

async function getWarrantyExpirationDate(serialNumber, manufacturer) {
    if (manufacturer === 'HypotheticalBrand') {
        const url = `https://hypotheticalbrand.com/warranty/${serialNumber}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const expirationDate = $('.warranty-expiration-date').text();

        return new Date(expirationDate);
    }

    return null;
}

module.exports = getWarrantyExpirationDate;
