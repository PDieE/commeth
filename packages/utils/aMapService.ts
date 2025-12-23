import AMapLoader from "@amap/amap-jsapi-loader";

declare global {
  interface Window {
    _AMap?: typeof AMap | undefined;
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}

/** 高德地图服务 */
export class AMapService {
  /**
   * 初始化高德地图
   * @describe 如果已经初始化，则不会再重新初始化，需要先调用`destroy`方法销毁实例
   * @param opts 初始化参数
   */
  public static init(opts: {
    /** 高德地图key */
    key: string;
    /** 高德地图安全密钥 */
    securityJsCode: string;
    /** 需要预加载的插件 */
    plugins?: string[];
  }): Promise<typeof window._AMap> {
    if (window._AMap) {
      return Promise.resolve(window._AMap);
    }

    const { key, securityJsCode, plugins = [] } = opts;
    window._AMapSecurityConfig = {
      securityJsCode,
    };
    return AMapLoader.load({
      key,
      version: "2.0",
      plugins,
    }).then((map) => {
      window._AMap = map;
      return map;
    });
  }

  /** 获取高德地图实例 */
  public static AMap() {
    if (!window._AMap) {
      throw new Error("请先初始化高德地图");
    }
    return window._AMap;
  }

  /** 销毁高德地图实例 */
  public static destroy() {
    window._AMap = undefined;
    window._AMapSecurityConfig = undefined;
  }

  /**
   * 加载高德地图插件
   * @param plugins 插件名称
   */
  public static plugin(plugins: string | string[]) {
    const aMap = this.AMap();
    return new Promise<void>((resolve) => {
      aMap.plugin(plugins, () => {
        resolve();
      });
    });
  }
}
