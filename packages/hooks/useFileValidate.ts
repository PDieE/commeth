import { imageDimensionsFromData } from "image-dimensions";
import prettyBytes from "pretty-bytes";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

interface Accept {
  value: string;
  type: "mime" | "ext" | "all" | "mistake";
}

export interface FileValidateResult {
  valid: boolean;
  message?: string;
  type?: "size" | "accept" | "image-size" | "image-ratio";
}

/**
 * 文件校验钩子
 * @param options 校验选项
 */
export function useFileValidate(options: {
  /** 文件类型，与原生 accept 属性一致 */
  accept?: MaybeRefOrGetter<string | undefined>;
  /** 文件大小限制，单位为字节 */
  sizeLimit?: MaybeRefOrGetter<number | undefined>;
  /** 最小图片尺寸 */
  minImageSize?: MaybeRefOrGetter<number | [number, number] | undefined>;
  /** 最大图片尺寸 */
  maxImageSize?: MaybeRefOrGetter<number | [number, number] | undefined>;
  /** 图片比例 */
  imageRatio?: MaybeRefOrGetter<[number, number] | undefined>;
}) {
  /** 预烘焙的 */
  const acceptList = computed<Accept[]>(() => {
    const accept = toValue(options.accept);
    if (!accept) {
      return [{ value: "*", type: "all" }];
    }

    // 转为数组并去除空格
    const list = accept?.split(",")?.map((v) => {
      const value = v.trim();
      let type: Accept["type"] = "ext";
      if (value === "*") {
        type = "all";
      } else if (value.startsWith(".")) {
        type = "ext";
      } else if (/^[a-zA-Z0-9-]+\/(\*|[a-zA-Z0-9-._]+)$/.test(value)) {
        type = "mime";
      } else {
        type = "mistake";
      }
      const data: Accept = {
        value,
        type,
      };
      return data;
    });
    return list;
  });

  /**
   * 校验文件格式是否符合要求
   * @param file 要校验的文件
   */
  function acceptCheck(file: File) {
    const checkGate = {
      all: () => true,
      ext: (v: Accept) => {
        const ext = file.name.split(".").pop() || "";
        return ext === v.value.replace(".", "");
      },
      mime: (v: Accept) => {
        const [type, subtype] = v.value.split("/");
        const [fileType, fileSubtype] = file.type.split("/");
        if (type !== fileType) {
          return false;
        }
        return subtype === "*" || subtype === fileSubtype;
      },
      mistake: () => false,
    };
    for (const item of acceptList.value) {
      if (!checkGate[item.type]) {
        continue;
      }
      if (checkGate[item.type](item)) {
        return true;
      }
    }

    return false;
  }

  /** 预烘焙的文件尺寸限制 */
  const imageSize = computed(() => {
    const minImageSize = toValue(options.minImageSize);
    const maxImageSize = toValue(options.maxImageSize);

    if (!minImageSize && !maxImageSize) {
      return undefined;
    }
    let min: { width: number; height: number } | undefined = undefined;
    let max: { width: number; height: number } | undefined = undefined;
    if (typeof minImageSize === "number") {
      min = { width: minImageSize, height: minImageSize };
    }
    if (Array.isArray(minImageSize)) {
      min = { width: minImageSize[0], height: minImageSize[1] };
    }
    if (typeof maxImageSize === "number") {
      max = { width: maxImageSize, height: maxImageSize };
    }
    if (Array.isArray(maxImageSize)) {
      max = { width: maxImageSize[0], height: maxImageSize[1] };
    }
    return { min, max };
  });

  /**
   * 校验图片尺寸/比例是否符合要求
   * @param file 要校验的文件
   */
  async function imageSizeCheck(file: File): Promise<FileValidateResult> {
    const imageRatio = toValue(options.imageRatio);

    if (!imageSize.value && !imageRatio) {
      return { valid: true };
    }

    const arrayBuffer = await file.arrayBuffer();
    const image = imageDimensionsFromData(new Uint8Array(arrayBuffer));
    if (!image) {
      return { valid: true };
    }

    // 尺寸校验
    const { min, max } = imageSize.value || {};
    if (min && image?.width < min.width) {
      return {
        valid: false,
        message: `${file.name} 宽度小于 ${min.width}px`,
        type: "image-size",
      };
    }
    if (min && image?.height < min.height) {
      return {
        valid: false,
        message: `${file.name} 高度小于 ${min.height}px`,
        type: "image-size",
      };
    }
    if (max && image?.width > max.width) {
      return {
        valid: false,
        message: `${file.name} 宽度大于 ${max.width}px`,
        type: "image-size",
      };
    }
    if (max && image?.height > max.height) {
      return {
        valid: false,
        message: `${file.name} 高度大于 ${max.height}px`,
        type: "image-size",
      };
    }

    // 比例校验
    if (
      imageRatio &&
      image.width / image.height !== imageRatio[0] / imageRatio[1]
    ) {
      return {
        valid: false,
        message: `${file.name} 的比例不符合 ${imageRatio[0]}:${imageRatio[1]}`,
        type: "image-ratio",
      };
    }

    return { valid: true };
  }

  /**
   * 校验文件是否符合要求
   * @param file 要校验的文件
   */
  async function validateFile(file: File): Promise<FileValidateResult> {
    const sizeLimit = toValue(options.sizeLimit) || Infinity;

    // 尺寸校验
    if (file.size > sizeLimit) {
      return {
        valid: false,
        message: `${file.name} 超过 ${prettyBytes(sizeLimit, { binary: true }).replace("i", "")}`,
        type: "size",
      };
    }

    // 格式类型校验
    if (!acceptCheck(file)) {
      return {
        valid: false,
        message: `${file.name} 的类型不符合要求`,
        type: "accept",
      };
    }

    const imageCheckRes = await imageSizeCheck(file);
    if (!imageCheckRes.valid) {
      return imageCheckRes;
    }

    return { valid: true };
  }

  return { validateFile };
}
