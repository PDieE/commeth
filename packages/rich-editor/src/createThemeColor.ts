import { oklch, formatHex } from "culori";

/** 确保值在 min 和 max 之间 */
function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

/**
 * 创建主题色
 * @param color 颜色
 * @param options 选项
 */
export function createThemeColor(
  color: string,
  options: {
    mode?: "light" | "dark";
  } = {},
) {
  const { mode = "light" } = options;

  const base = oklch(color);
  if (!base) {
    throw new Error(`[createThemeColor] invalid color: ${color}`);
  }

  const isLight = mode === "light";

  return {
    /** 浅色 */
    light: formatHex({
      ...base,
      l: clamp(isLight ? 0.96 : 0.15),
      c: isLight ? base.c * 0.1 : base.c * 0.4,
    }),
    /** 焦点色 */
    focus: formatHex({
      ...base,
      l: clamp(base.l + (isLight ? 0.1 : -0.06)),
    }),
    /** 禁用色 */
    disabled: formatHex({
      ...base,
      c: base.c * 0.25,
      l: clamp(base.l + (isLight ? 0.2 : -0.2)),
    }),
    /** 悬停色 */
    hover: formatHex({
      ...base,
      l: clamp(base.l + (isLight ? 0.06 : -0.04)),
    }),
    /** 激活色 */
    active: formatHex({
      ...base,
      l: clamp(base.l + (isLight ? -0.08 : 0.06)),
    }),
    /** 1–10 色阶（类似 AntD） */
    palette: Array.from({ length: 10 }, (_, i) => {
      const step = (i - 5) * 0.07;
      return formatHex({
        ...base,
        l: clamp(base.l + step),
      });
    }),
  };
}
