import { Page, expect, test } from "@playwright/test";
import { HeaderComponent } from "../pages/component/header.component";

test.beforeEach(async ({ page }) => {
  await page.goto("https://conduit.bondaracademy.com/");
});

test("Navigate to Homepage", async ({ page }) => {
    const header = new HeaderComponent(page);
    await expect(header.webIcon).toBeVisible();
});
