import {expect, Locator, test} from '@playwright/test';


function do_this() {
    console.log("this is my do this function");
}

test("Hello Test", do_this);

test("arrow hello test", () => {
    console.log("this is the body of Arrow function");
});

test("anonymous hello test", function () {
    console.log("anonymous function")
});


test('has title', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.


    await expect(page).toHaveTitle(/Playwright/);

    await expect(page).toHaveTitle("Fast and reliable end-to-end testing for modern web apps | Playwright");

    const title = await page.title();

    expect(title).toBe("Fast and reliable end-to-end testing for modern web apps | Playwright");

    expect(title).toEqual(expect.stringMatching(/Playwright/));


});


test('get started link', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    //  const link = page.getByRole('link', {name: 'Get started'});

     const link = page.locator("header").getByText('Get started');

    // getByText
    // const link = page.getByText('Get started');

    // xpath
    // const link = page.locator('//*[@class="getStarted_Sjon"]');



    await link.click();


    // await page.getByRole('link', {name: 'Get started'}).click();

    // Expects page to have a heading with the name of Installation.
    const headingLocator: Locator = page.getByRole('heading', {name: 'Installation'});
    await expect(headingLocator).toBeVisible();
});
