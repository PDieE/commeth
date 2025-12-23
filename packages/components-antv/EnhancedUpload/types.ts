import { UploadProps } from "ant-design-vue";
import { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";

/** 上传属性 */
export interface EnhancedUploadProps extends Omit<
  UploadProps,
  | "fileList"
  | "customRequest"
  | "action"
  | "name"
  | "method"
  | "headers"
  | "withCredentials"
> {
  /**
   * 自定义上传请求
   * @param options 上传选项
   */
  request: (options: UploadRequestOption) => void;
  /** 上传文件大小限制，单位为字节 */
  sizeLimit?: number;
  /** 图片最小尺寸限制，单位为像素 */
  minImageSize?: number | [number, number];
  /** 图片最大尺寸限制，单位为像素 */
  maxImageSize?: number | [number, number];
  /** 图片比例 */
  imageRatio?: [number, number];
}
