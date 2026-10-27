import { expect, test } from "@playwright/test";

/**
 * End-to-end happy path:
 * register → add an application → drag it to the Interview column →
 * verify the move survived a reload → sign out → sign back in.
 *
 * Requires a running app with a reachable PostgreSQL database
 * (`npm run dev` + `DATABASE_URL`). The test creates its own user, so it does
 * not depend on seeded demo data.
 */
test("sign up, add an application, and move it across the board", async ({
  page,
}) => {
  const stamp = Date.now();
  const email = `e2e+${stamp}@example.com`;
  const password = "supersecret123";
  const company = `Acme ${stamp}`;
  const role = "Frontend Engineer";
  const cardLabel = `Open ${role} at ${company}`;

  // 1. Register (this also signs the user in).
  await page.goto("/register");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/board");
  await expect(page.getByRole("heading", { name: "Pipeline" })).toBeVisible();

  // 2. Add an application through the modal.
  await page.getByRole("button", { name: "Add application" }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/^Company/).fill(company);
  await dialog.getByLabel(/^Role/).fill(role);
  await dialog.getByLabel("Location").fill("Remote");
  await dialog.getByRole("button", { name: "Add application" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByLabel(cardLabel)).toBeVisible();

  // 3. Drag the card from Wishlist to Interview.
  const handle = page.getByRole("button", {
    name: `Reorder ${company} application`,
  });
  const interviewColumn = page.getByRole("region", { name: "Interview column" });

  const handleBox = await handle.boundingBox();
  const columnBox = await interviewColumn.boundingBox();
  expect(handleBox).not.toBeNull();
  expect(columnBox).not.toBeNull();

  await page.mouse.move(
    handleBox!.x + handleBox!.width / 2,
    handleBox!.y + handleBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(handleBox!.x + 12, handleBox!.y + 12, { steps: 4 });

  const reorderResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/applications/reorder") &&
      response.request().method() === "PATCH",
  );

  await page.mouse.move(
    columnBox!.x + columnBox!.width / 2,
    columnBox!.y + 90,
    { steps: 20 },
  );
  await page.mouse.up();

  expect((await reorderResponse).ok()).toBeTruthy();
  await expect(interviewColumn.getByLabel(cardLabel)).toBeVisible();

  // 4. The move must be persisted.
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Interview column" }).getByLabel(cardLabel),
  ).toBeVisible();

  // 5. Sign out and back in; the board is restored from the database.
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("/");

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/board");
  await expect(
    page.getByRole("region", { name: "Interview column" }).getByLabel(cardLabel),
  ).toBeVisible();
});
