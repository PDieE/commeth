/** 筛选表单属性 */
export interface FilterFormProps {
  /**
   * 是否显示查询按钮
   * @default ```true```
   */
  showSearch?: boolean;
  /**
   * 表单项宽度
   * @default ```300```
   */
  itemWidth?: number;
  /**
   * 重置忽略字段
   * @default ```[]```
   */
  resetIgnore?: string[];
}
