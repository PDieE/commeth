import { defineConfig, presetAttributify, presetWind3 } from "unocss";

export default defineConfig({
  presets: [presetAttributify(), presetWind3()],
  theme: {
    animation: {
      keyframes: {
        "slide-upfade":
          "{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}",
        "slide-downfade":
          "{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:translateY(0)}}",
        "slide-leftfade":
          "{from{opacity:0;transform:translateX(2px)}to{opacity:1;transform:translateX(0)}}",
        "slide-rightfade":
          "{from{opacity:0;transform:translateX(-2px)}to{opacity:1;transform:translateX(0)}}",
      },
      durations: {
        "slide-upfade": "400ms",
        "slide-downfade": "400ms",
        "slide-leftfade": "400ms",
        "slide-rightfade": "400ms",
      },
      timingFns: {
        "slide-upfade": "cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-downfade": "cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-leftfade": "cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-rightfade": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
});
