import { UploadFile } from "ant-design-vue";
import { RuleObject } from "ant-design-vue/es/form";

/**
 * 将 string | string[] | UploadFile[] 类型的值转换为 EnhancedUpload 支持的类型
 * @param value 原始值
 */
export function transToEnhancedUploadValue(
  value: string | string[] | UploadFile[],
): UploadFile[] {
  // 空字符串不处理
  if (typeof value === "string" && !value.trim()) {
    return [];
  }

  // UploadFile[] 类型的情况下，直接返回
  if (Array.isArray(value) && value.length && typeof value[0] === "object") {
    return value as UploadFile[];
  }

  // string 或 string[] 类型的情况下，转换为 UploadFile[] 类型
  let strArr: string[] = [];
  if (typeof value === "string") {
    strArr = value.split(",");
  } else if (Array.isArray(value)) {
    strArr = value as string[];
  }
  return strArr.map((url, i) => {
    const data: UploadFile = {
      uid: i.toString(),
      name: url.split("/").pop() || url,
      url,
      status: "done",
    };
    return data;
  });
}

/**
 * 将 EnhancedUpload 的值转换为 string[] 类型
 * @param value 原始值
 * @param unfinished 是否包含未完成的文件
 */
export function enhancedUploadValueToStringArr(
  value: UploadFile[],
  unfinished = false,
) {
  if (unfinished) {
    return value.map((v) => v.url || "");
  }
  return value
    .filter((v) => ["done", "success"].includes(v.status || "") && v.url)
    .map((v) => v.url || "");
}

/**
 * 将 EnhancedUpload 的值转换为 string 类型
 * @param value 原始值
 * @param separator 分隔符
 * @param unfinished 是否包含未完成的文件
 */
export function enhancedUploadValueToString(
  value: UploadFile[],
  separator = ",",
  unfinished = false,
) {
  const strArr = enhancedUploadValueToStringArr(value, unfinished);
  return strArr.filter(Boolean).join(separator);
}

/**
 * 校验 EnhancedUpload 的值是否符合规则
 * @param rule 校验规则
 * @param value 待校验的值
 * @param name 代称，报错文本使用, file: 文件; image: 图片; 默认值为: file
 * @returns
 */
export function enhancedUploadValueValidator(
  rule: RuleObject,
  value?: UploadFile[],
  name: "file" | "image" | string = "file",
) {
  if (!value || !value.length) {
    return Promise.resolve();
  }

  // 请确保值的类型为 UploadFile[]，以避免在生产环境出现以下错误
  if (typeof value[0] !== "object") {
    return Promise.reject("值类型错误");
  }

  const pronoun = { file: "文件", image: "图片" }[name] || name;

  // 'error' | 'success' | 'done' | 'uploading' | 'removed'
  // 未全部上传完成
  if (value.find((v) => v.status === "uploading")) {
    return Promise.reject(`尚有${pronoun}未上传完成`);
  }

  // 存在上传失败的文件
  if (value.find((v) => !["done", "success"].includes(v.status || ""))) {
    return Promise.reject(`存在上传失败的${pronoun}，请进行确认并处理`);
  }

  // 校验最小上传数量
  if (rule.min && value.length < rule.min) {
    return Promise.reject(`请至少上传${rule.min}个${pronoun}`);
  }

  // 检验最大上传数量
  if (rule.max && value.length > rule.max) {
    return Promise.reject(`最多上传${rule.max}个${pronoun}`);
  }

  return Promise.resolve();
}
