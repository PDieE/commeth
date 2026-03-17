import { defineConfig, presetWind3 } from "unocss";

import { presetComponentsAntv } from "./preset";

export default defineConfig({
  presets: [presetWind3(), presetComponentsAntv()],
});
