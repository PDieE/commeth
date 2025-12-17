import type { App, Component } from "vue";

/**
 * 为组件添加 install 方法，方便在 Vue 中全局注册
 * @param comp 组件
 * @returns 组件
 */
export const withInstall = <T extends Component>(comp: T) => {
  (comp as Record<string, unknown>).install = (app: App) => {
    const compName = comp.name;
    if (!compName) return;
    app.component(compName, comp);
  };
  return comp;
};
