import { definePreset, type Preset } from "unocss";

export const presetComponentsAntv = definePreset((): Preset => {
  return {
    name: "components-antv-preset",
    theme: {
      textColor: {
        primary: "var(--text-color)",
        brand: "var(--color-primary-text, #1677ff)",
        "brand-hover": "var(--color-primary-text-hover, #4096ff)",
      },
      backgroundColor: {
        primary: "var(--color-primary-bg, #e6f4ff)",
        "primary-hover": "var(--color-primary-bg-hover, #bae0ff)",
      },
    },
  };
});
