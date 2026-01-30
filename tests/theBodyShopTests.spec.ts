import{expect, test} from '@playwright/test';
import * as dotenv from 'dotenv';


test.beforeEach (async ({page}) => {
    await page.goto('https://www.thebodyshop.es/');
    const addCookiesButton = page.getByRole('button', {name: 'Permitir todas'});
    if (await addCookiesButton.isVisible()) {
        await addCookiesButton.click();
    }
    const closePopupButton = page.locator('button[title="Close"]');
    if(await closePopupButton.isVisible()) {
        await closePopupButton.click();
    }
});

test('login successfull', async ({page}) => {
     // wait for new tab in same browser context
    await page.locator('#login-link').click();

    dotenv.config();

    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    const usernameField = page.locator('#input-mail')
    const passwordField = page.locator('#input-password')
    await usernameField.fill(username);
    await passwordField.fill(password);
    await page.getByRole('button', { name: 'ACCEDER' }).click();

    await expect (page.getByRole('heading', {name: 'Bienvenido a tu cuenta'})).toBeVisible();

});

test('login invalid username', async ({page}) => {
        await page.locator('#login-link').click();

    dotenv.config();

    const password = process.env.PASSWORD;

    const usernameField = page.locator('#input-mail')
    const passwordField = page.locator('#input-password')
    await usernameField.fill('smth@smth.com');
    await page.keyboard.press('Tab'); //

    await passwordField.fill(password);
    await page.getByRole('button', { name: 'ACCEDER' }).click();

    await expect (page.getByRole('alert')).toHaveText(/Usuario o contraseña inválidas/i);
})


test('login invalid password', async ({page}) => {
    await page.locator('#login-link').click();

    dotenv.config();

    const username = process.env.USERNAME;

    const usernameField = page.locator('#input-mail')
    const passwordField = page.locator('#input-password')
    await usernameField.fill(username);
    await passwordField.fill('123');

    await passwordField.blur();

    await page.getByRole('button', { name: 'ACCEDER' }).click();

    await expect (page.getByRole('alert')).toHaveText(/Usuario o contraseña inválidas/i);
})



test('search item', async ({page}) => {
    const searchInput =  page.getByRole('combobox', {name: 'Buscar en el sitio web'});
    await searchInput.fill('cepillo');
    await searchInput.press('Enter');

    const img = page.getByAltText('Cepillo Redondo para el Cuerpo');
    await expect(img).toBeVisible();

})

test('add two products to the cart', async ({page}) => {
    const searchInput =  page.getByRole('combobox', {name: 'Buscar en el sitio web'});
    await searchInput.fill('cepillo');
    await searchInput.press('Enter');

    const productLink = page.getByText('Cepillo Redondo para el Cuerpo', { exact: true });
    await productLink.click();

    await page.getByLabel('Add one').click();

    const quantity = page.locator('input[id="input_quantity"]');
    await expect(quantity).toHaveAttribute('size', '2');

    const addButton = page.locator('a[id="button-cart"]');
    await addButton.click();

    const totalItems = page.locator('#cart-total')
    await expect(totalItems).toHaveText('2');

})