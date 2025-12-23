export interface RichEditorSelectOption {
  /** 标题 */
  label: string;
  /** 值 */
  value: string;
  /** 图标 */
  icon: string;
  /** 是否激活 */
  active: boolean;
  /** 选中动作 */
  action: () => void;
}
