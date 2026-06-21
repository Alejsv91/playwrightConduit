import { test, expect } from "../fixtures/auth.fixture";

test("Crear artículo sin login UI", async ({ authenticatedPage }) => {
  await expect(authenticatedPage.getByText('alejsv')).toBeVisible;
  console.log('test');
  await expect(authenticatedPage.getByText('Global Feed')).toBeVisible;
});
