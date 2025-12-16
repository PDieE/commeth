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
