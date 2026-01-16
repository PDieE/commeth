/** 下拉选项 */
export interface RichEditorProps {
  /** 内容区域高度 */
  contentHeight?:
    | string
    | number
    | { min: string | number; max: string | number };
  /** 图片上传配置 */
  imageUpload?: {
    /**
     * 上传请求
     * @param option 上传选项
     */
    request?: (option: RichEditorUploadRequest) => void;
    /** 文件类型，与原生 accept 属性一致 */
    accept?: string;
    /** 上传文件大小限制，单位为字节 */
    sizeLimit?: number;
    /** 图片最小尺寸限制，单位为像素 */
    minImageSize?: number | [number, number];
    /** 图片最大尺寸限制，单位为像素 */
    maxImageSize?: number | [number, number];
    /** 图片比例 */
    imageRatio?: [number, number];
  };
}

/** 下拉选项 */
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

/** 上传请求 */
export interface RichEditorUploadRequest {
  /**
   * 上传进度
   * @param event 进度事件
   */
  onProgress?: (event: Partial<ProgressEvent> & { percent?: number }) => void;
  /**
   * 上传失败
   * @param event 错误事件
   */
  onError?: (event: Error) => void;
  /**
   * 上传成功
   * @param url 图片地址
   */
  onSuccess: (url: string) => void;
  /** 上传文件 */
  file: File;
}
