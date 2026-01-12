import {expect, Locator, test} from '@playwright/test';


test.beforeEach (async ({page}) => {
    await page.goto('https://www.porcelanosa.com/');
    const addCookieButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    if (await addCookieButton.isVisible()) {
        await addCookieButton.click();
    };
    });

test.afterEach(async ({ context }) => {
  await context.close();
});

test('has title', async ({page}) => {

    await expect(page).toHaveTitle('Porcelanosa | Cerámica, baños, cocinas y pavimentos');

});


test('change language', async ({page}) => {

    await page.locator('.idiomaSelec').click();
    await page.getByRole('link', {name: 'Русский'}).click();

    await expect(page.getByRole('menuitem', {name:'Продукция'})).toBeVisible();
});


test('search item', async ({page, context}) => {
    // Promise.all() runs several asynchronous operations in parallel
    // and waits for all of them to finish
    const [newPage]  = await Promise.all([
        context.waitForEvent('page'), // wait for new tab in same browser context
        page.locator('.container').getByTitle('Buscador de productos').click(),
    ]);
    await newPage.waitForLoadState();
    await newPage.getByRole('button', {name: 'Aceptar todas'}).click();

    const searchField = newPage.getByRole('textbox', { name: '¿Qué está buscando?' });
    await searchField.fill('baño');
    await searchField.press('Enter');

    await newPage.locator("#prod1").click();
    await expect (newPage.getByRole('link', {name:'Baños'})).toBeVisible();
});

test('check products dropdown', async ({page}) => {
    await page.getByRole('menuitem', {name: 'Productos'}).click();
    await page.getByRole('link', {name: 'Cocinas'}).hover();
    await page.getByRole('link', {name: 'Encimeras de cocina'}).click();

    const breadCrumbList =  page.locator('//ul[@class="breadcrumbList xl-padding-bottom"]//li');

    await expect(breadCrumbList).toHaveCount(4);
    await expect(breadCrumbList).toHaveText(['Inicio', 'Productos', 'Cocinas', 'Encimeras']);
});


test('verify products parameters', async ({page, context}) => {
    const [newPage]  = await Promise.all([
        context.waitForEvent('page'), // wait for new tab in same browser context
        page.locator('.container').getByTitle('Buscador de productos').click(),
    ]);
    await newPage.waitForLoadState();
    await newPage.getByRole('button', {name: 'Aceptar todas'}).click();

    const searchField = newPage.getByRole('textbox', { name: '¿Qué está buscando?' });
    await searchField.fill('Cambridge Nogal');
    await searchField.press('Enter');

    await newPage.getByRole('heading', {name: 'Cambridge'}).click();
    await newPage.getByRole('button', {name:'Características'}).click();

    async function getFeatureValue( newPage,label: string): Promise<string> {
        const li = newPage.locator('#pgfixedfeatureslist li', { hasText: label }).first();
        const text = await li.innerText();
        return text.replace(new RegExp(`${label}\\s*`, 'i'), '').trim();
}

    const tipoA = await getFeatureValue(newPage, 'TIPO DE PRODUCTO - A');
    const material = await getFeatureValue(newPage, 'MATERIAL');

    expect(tipoA).toBe('PORCELÁNICO');
    expect(material).toBe('CERÁMICA');
});


