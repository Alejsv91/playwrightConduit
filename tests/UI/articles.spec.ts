import { test, expect } from "../fixtures/auth.fixture";

test("Crear artículo sin login UI", async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByText('alejsv')).toBeVisible;
  console.log('test');
  await expect(authenticatedPage.getByText('Global Feed')).toBeVisible();
  await authenticatedPage.getByText(' New Article ').click();
  await authenticatedPage.waitForURL('https://conduit.bondaracademy.com/editor');
  await expect(authenticatedPage.getByRole('textbox', {name: 'Article Title'})).toBeVisible();
  await authenticatedPage.getByRole('textbox', {name: 'Article Title'}).fill('This is a test');
  await expect(authenticatedPage.getByRole('textbox', {name: 'Article Title'})).toHaveValue('This is a test');
});
