import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import { CeRichEditor } from "../src";
import { createThemeColor } from "../src/createThemeColor";

test("CeRichEditor", async () => {
  const screen = render(CeRichEditor, {
    props: {
      modelValue: "<p>content</p>",
    },
  });

  await expect.element(screen.baseElement).toBeVisible();
});

test("createThemeColor", async () => {
  expect(createThemeColor("#123456")).toBeDefined();
});
