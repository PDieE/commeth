import { ResultProps } from "ant-design-vue";

/** 简单包裹组件属性 */
export interface SimpleWrapProps {
  /** 加载状态, 优先级最高 */
  loading?: boolean;
  /** 错误状态, 优先级次于 `loading` */
  error?: boolean | (ResultProps & { class?: unknown });
  /** 空状态, 优先级最低 */
  empty?: boolean;
}
