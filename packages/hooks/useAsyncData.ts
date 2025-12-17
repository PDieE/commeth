/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounceFn, DebounceFilterOptions } from "@vueuse/core";
import {
  computed,
  MaybeRefOrGetter,
  MultiWatchSources,
  ref,
  shallowRef,
  toValue,
  watch,
} from "vue";

/**
 * 仿 Nuxt 的 useAsyncData 钩子，只实现了一些常用功能，不支持服务端渲染
 * @param handler 处理函数
 * @param opt.immediate 是否立即执行
 * @param opt.watch 监听依赖
 */
export function useAsyncData<T = any>(
  /** 处理函数 */
  handler: () => Promise<T>,
  /** 选项 */
  opt?: {
    /** 是否立即执行 */
    immediate?: boolean;
    /** 监听依赖 */
    watch?: MultiWatchSources;
    /** 防抖 */
    debounce?:
      | boolean
      | { ms?: MaybeRefOrGetter<number>; options?: DebounceFilterOptions };
  },
) {
  const { immediate, debounce = false } = { immediate: true, ...opt };

  if (opt?.watch) {
    watch(
      opt.watch,
      () => {
        execute();
      },
      { deep: true },
    );
  }

  const data = ref<T | undefined>();
  const error = ref<any>();
  const status = shallowRef<"idle" | "pending" | "success" | "error">("idle");

  /** 执行 */
  function execute() {
    if (debounce) {
      return debouncedFetch();
    }

    return fetch();
  }
  if (immediate) execute();

  const debounceMs = computed(() => {
    if (!debounce || typeof debounce === "boolean") {
      return 1000;
    }
    return toValue(debounce.ms) || 1000;
  });
  const debounceOptions = computed(() => {
    if (!debounce || typeof debounce === "boolean") {
      return { maxWait: 5000 };
    }
    return { maxWait: 5000, ...debounce.options };
  });
  const debouncedFetch = useDebounceFn(
    fetch,
    debounceMs,
    debounceOptions.value,
  );

  async function fetch() {
    try {
      status.value = "pending";
      data.value = await handler();
      status.value = "success";
      return Promise.resolve(data.value);
    } catch (e) {
      error.value = e;
      status.value = "error";
      return Promise.reject(e);
    }
  }

  /** 清空数据 */
  function clear() {
    data.value = undefined;
    error.value = undefined;
    status.value = "idle";
  }

  return {
    data,
    execute,
    error,
    status,
    clear,
  };
}
