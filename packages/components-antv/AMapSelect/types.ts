import { SelectProps } from "ant-design-vue";
import { MaybeRefOrGetter } from "vue";

/** 高德地图选择器值 */
export interface AMapValue {
  /** 地区编码 */
  adcode?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 区域 */
  district?: string;
  /** 街道 */
  township?: string;
  /** 详细地址 */
  address?: string;
  /** 格式化地址 (省市区街道) */
  formattedAddress?: string;
  /** 经度 */
  longitude?: number;
  /** 纬度 */
  latitude?: number;
}

/** 高德地图选择器属性 */
export interface AMapSelectProps {
  /** 选择器宽度 */
  width?: number | string;
  /** 选择器高度 */
  height?: number | string;
  /** 选择器的属性 */
  selectProps?: SelectProps;
  /**
   * 高德地图实例
   * @describe 如果不传入则会从`AMapService`中获取
   */
  aMap?: MaybeRefOrGetter<typeof AMap>;
}
