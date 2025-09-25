//https://www.dracmametales.com/precio-del-oro
// Check that the gold price is 3.238,98€/oz


import {expect, test} from "@playwright/test";


function parsePricePerOunce(input: string): number {
    return parseFloat(
        input
            .replace(/[^\d,.-]/g, "") // remove currency symbols and spaces
            .replace(/\./g, "")       // remove thousands separators
            .replace(",", ".")
            .replace("/oz", "")        // replace decimal comma with dot
    );
}


test("Check gold price", async ({page}) => {
    await page.goto("https://www.dracmametales.com/precio-del-oro");

    const priceLocator = page.getByTitle("Cotización del Oro por onza");

    const expectedGoldPrice = "3.236,09";

    await expect(priceLocator).toContainText(expectedGoldPrice + "€");
    await expect(priceLocator).toHaveText(expectedGoldPrice + "€/oz");

    const price: string = await priceLocator.innerText();

    //price = "3.237,93€/oz"

    expect(parsePricePerOunce(price)).toBeGreaterThan(3000);
})