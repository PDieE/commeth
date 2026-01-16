<template>
  <div
    v-if="editor"
    class="border border-solid rounded-3px overflow-hidden transition-all hover:border-brand"
    :class="{
      'border-[--brand-color-focus] shadow-[0_0_0_2px_var(--brand-color-light)]':
        editor?.isFocused,
      'border-[--component-border]': !editor?.isFocused,
    }"
    :style="{
      '--component-border': themeColor.border,
      '--brand-color-light': themeColor.brandLight,
      '--brand-color-focus': themeColor.brandFocus,
      '--brand-color-disabled': themeColor.brandDisabled,
      '--brand-color-hover': themeColor.brandHover,
      '--brand-color': themeColor.brand,
      '--brand-color-active': themeColor.brandActive,
    }"
  >
    <div
      class="flex flex-wrap items-center gap-2 p-2 border-0 border-b border-[--component-border] border-solid sticky top-0 bg-white z-1"
    >
      <!-- 撤销/重做 -->
      <RichEditorButton
        tip="撤销"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        <template #icon><Icon icon="tdesign:rollback" inline /></template>
      </RichEditorButton>
      <RichEditorButton
        tip="重做"
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
      >
        <template #icon><Icon icon="tdesign:rollfront" inline /></template>
      </RichEditorButton>
      <Divider class="!m-0" type="vertical" />
      <!-- 字体样式 -->
      <RichEditorSelect tip="段落/标题" :options="headingOptions">
        <template #icon><Icon icon="tdesign:clear" inline /></template>
      </RichEditorSelect>
      <RichEditorButton
        tip="加粗"
        :active="editor.isActive('bold')"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <template #icon>
          <Icon icon="tdesign:textformat-bold" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="斜体"
        :active="editor.isActive('italic')"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <template #icon>
          <Icon icon="tdesign:textformat-italic" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="删除线"
        :active="editor.isActive('strike')"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <template #icon>
          <Icon icon="tdesign:textformat-strikethrough" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="行内代码"
        :active="editor.isActive('code')"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <template #icon><Icon icon="tdesign:code-1" inline /></template>
      </RichEditorButton>
      <Divider class="!m-0" type="vertical" />
      <!-- 格式/节点清除 -->
      <RichEditorButton
        tip="清除格式"
        @click="editor.chain().focus().unsetAllMarks().run()"
      >
        <template #icon>
          <Icon icon="tdesign:clear-formatting" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="清除节点"
        @click="editor.chain().focus().clearNodes().run()"
      >
        <template #icon><Icon icon="tdesign:clear" inline /></template>
      </RichEditorButton>
      <Divider class="!m-0" type="vertical" />
      <!-- 其他样式 -->
      <RichEditorButton
        tip="无序列表"
        :active="editor.isActive('bulletList')"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <template #icon><Icon icon="tdesign:list" inline /></template>
      </RichEditorButton>
      <RichEditorButton
        tip="有序列表"
        :active="editor.isActive('orderedList')"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <template #icon>
          <Icon icon="tdesign:list-numbered" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="代码块"
        :active="editor.isActive('codeBlock')"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <template #icon><Icon icon="tdesign:code" inline /></template>
      </RichEditorButton>
      <RichEditorButton
        tip="块引用"
        :active="editor.isActive('blockquote')"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <template #icon><Icon icon="tdesign:quote" inline /></template>
      </RichEditorButton>
      <RichEditorButton
        tip="分割线"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <template #icon>
          <Icon icon="tdesign:component-divider-vertical" inline />
        </template>
      </RichEditorButton>
      <RichEditorButton
        tip="强制换行"
        @click="editor.chain().focus().setHardBreak().run()"
      >
        <template #icon><Icon icon="tdesign:enter" inline /></template>
      </RichEditorButton>
      <RichEditorColor
        icon="tdesign:textformat-color"
        :color="textColor"
        @confirm="setTextColor"
      />
      <RichEditorButton tip="添加图片" @click="addImage()">
        <template #icon><Icon icon="tdesign:image-add" inline /></template>
      </RichEditorButton>
      <input
        ref="imageUploadRef"
        class="hidden"
        type="file"
        :accept="imageUpload?.accept || 'image/*'"
        multiple
        @change="imageUploadChange"
      />
    </div>
    <editor-content
      class="p-2 min-h-[var(--content-min-height)] max-h-[var(--content-max-height)] h-[var(--content-height)] overflow-y-auto"
      :style="contentStyle"
      :editor="editor"
      placeholder="请输入内容"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Image from "@tiptap/extension-image";
import { ListItem } from "@tiptap/extension-list";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent, type EditorEvents } from "@tiptap/vue-3";
import { Divider } from "ant-design-vue";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue";

import type { RichEditorProps, RichEditorSelectOption } from "./types";

import RichEditorButton from "./Button.vue";
import RichEditorColor from "./Color.vue";
import { createThemeColor } from "./createThemeColor";
import { useProvideBridgeStore } from "./injectionState";
import { ImageUpload } from "./node/ImageUpload";
import RichEditorSelect from "./Select.vue";

const innerValue = defineModel<string>("modelValue", { default: "" });
watch(innerValue, (val) => {
  const isSame = editor.value?.getHTML() === val;
  if (isSame) {
    return;
  }

  editor.value?.commands.setContent(val);
});
const {
  contentHeight = { min: 200, max: 400 },
  imageUpload,
  theme,
} = defineProps<RichEditorProps>();

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  // 卸载前销毁编辑器
  editor.value?.destroy();
});

/**
 * ====================
 *       基本逻辑
 * ====================
 */
useProvideBridgeStore({ imageUpload });
const themeColor = computed(() => {
  const brand = theme?.brand || "#0052D9";
  let themeBrand = {
    light: theme?.brandLight,
    focus: theme?.brandFocus,
    disabled: theme?.brandDisabled,
    hover: theme?.brandHover,
    active: theme?.brandActive,
  };
  if (
    !themeBrand?.light ||
    !themeBrand?.focus ||
    !themeBrand?.disabled ||
    !themeBrand?.hover ||
    !themeBrand?.active
  ) {
    themeBrand = createThemeColor(brand);
  }
  return {
    border: theme?.border || "#cac9c9",
    brand,
    brandLight: themeBrand.light,
    brandFocus: themeBrand.focus,
    brandDisabled: themeBrand.disabled,
    brandHover: themeBrand.hover,
    brandActive: themeBrand.active,
  };
});
/** 内容主题样式 */
const contentStyle = computed(() => {
  if (typeof contentHeight === "number") {
    return {
      "--content-min-height": "auto",
      "--content-max-height": "auto",
      "--content-height": `${contentHeight}px`,
    };
  }
  if (typeof contentHeight === "string") {
    return {
      "--content-min-height": "auto",
      "--content-max-height": "auto",
      "--content-height": contentHeight,
    };
  }
  return {
    "--content-min-height": `${contentHeight.min}px`,
    "--content-max-height": `${contentHeight.max}px`,
    "--content-height": "auto",
  };
});
provide("contentStyle", contentStyle);
/** 编辑器实例 */
const editor = ref<Editor>();
/** 初始化编辑器 */
function init() {
  editor.value = new Editor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit,
      Image.configure({
        resize: {
          enabled: true,
          directions: [
            "top",
            "right",
            "bottom",
            "left",
            "top-right",
            "top-left",
            "bottom-right",
            "bottom-left",
          ],
          minWidth: 30,
          minHeight: 30,
          alwaysPreserveAspectRatio: true,
        },
      }),
      ImageUpload,
    ],
    content: innerValue.value,
    onUpdate: () => {
      innerValue.value = editor.value?.getHTML() || "";
    },
    onSelectionUpdate(props) {
      onTextColorSelectionUpdate(props);
    },
  });
}
/** 段落/标题选项 */
const headingOptions = computed<RichEditorSelectOption[]>(() => {
  if (!editor.value) {
    return [];
  }
  return [
    {
      label: "段落",
      value: "paragraph",
      icon: "hugeicons:paragraph",
      active: editor.value.isActive("paragraph"),
      action: () => editor.value?.chain().focus().setParagraph().run(),
    },
    {
      label: "标题 1",
      value: "heading-01",
      icon: "hugeicons:heading-01",
      active: editor.value.isActive("heading", { level: 1 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "标题 2",
      value: "heading-02",
      icon: "hugeicons:heading-02",
      active: editor.value.isActive("heading", { level: 2 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "标题 3",
      value: "heading-03",
      icon: "hugeicons:heading-03",
      active: editor.value.isActive("heading", { level: 3 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "标题 4",
      value: "heading-04",
      icon: "hugeicons:heading-04",
      active: editor.value.isActive("heading", { level: 4 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      label: "标题 5",
      value: "heading-05",
      icon: "hugeicons:heading-05",
      active: editor.value.isActive("heading", { level: 5 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      label: "标题 6",
      value: "heading-06",
      icon: "hugeicons:heading-06",
      active: editor.value.isActive("heading", { level: 6 }),
      action: () =>
        editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
    },
  ];
});

/**
 * ====================
 *       字体颜色
 * ====================
 */
const textColor = shallowRef<string>();
/**
 * 设定好字体颜色
 * @param color 字体颜色
 */
function setTextColor(color?: string) {
  textColor.value = color;
  if (!color) {
    editor.value?.chain().focus().unsetColor().run();
    return;
  }
  editor.value?.chain().focus().setColor(color).run();
}
/**
 * 选区变更回调 - 获取字体颜色
 * @param props 选区变更事件参数
 */
function onTextColorSelectionUpdate(props: EditorEvents["selectionUpdate"]) {
  textColor.value = props.editor.getAttributes("textStyle").color ?? undefined;
}

/**
 * ====================
 *       添加图片
 * ====================
 */
const imageUploadRef = useTemplateRef("imageUploadRef");
/** 添加图片 */
function addImage() {
  if (!imageUploadRef.value) {
    return;
  }
  imageUploadRef.value.value = "";
  imageUploadRef.value.click();
}
function imageUploadChange() {
  if (!imageUploadRef.value) {
    return;
  }
  const files = imageUploadRef.value.files;
  if (!files || !files.length) {
    return;
  }
  for (const file of files) {
    editor.value?.chain().focus().setImageUpload({ file }).run();
    editor.value
      ?.chain()
      .setTextSelection({
        from: editor.value.state.selection.from + 1,
        to: editor.value.state.selection.from + 1,
      })
      .run();
  }
}
</script>

<style lang="scss" scoped>
:deep(.tiptap) {
  min-height: var(--content-min-height);
  max-height: var(--content-max-height);
  height: var(--content-height);

  :first-child {
    margin-top: 0;
  }

  &:focus {
    outline: none;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: rgba(88, 5, 255, 0.05);
    border-radius: 0.4rem;
    color: #2e2b29;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: #2e2b29;
    border-radius: 0.5rem;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid rgba(61, 37, 20, 0.12);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(61, 37, 20, 0.08);
    margin: 2rem 0;
  }

  img {
    display: block;
    height: auto;
    max-width: 100%;
  }

  [data-resize-container] {
    &.ProseMirror-selectednode {
      [data-resize-wrapper] {
        border-radius: 3px;
        outline: 3px solid var(--brand-color);
      }
    }

    [data-resize-wrapper] {
      outline: 3px solid transparent;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        outline: 3px solid var(--brand-color);
        border-radius: 3px;

        [data-resize-handle] {
          opacity: 1;
        }
      }
    }
  }

  /* 图片尺寸控制 */
  [data-resize-handle] {
    position: absolute;
    z-index: 10;
    opacity: 0;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--brand-color);

    &:hover {
      background: var(--brand-color-active);
    }

    /* Corner handles */
    &[data-resize-handle="top-left"],
    &[data-resize-handle="top-right"],
    &[data-resize-handle="bottom-left"],
    &[data-resize-handle="bottom-right"] {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      border: 1px solid #fff;
    }

    &[data-resize-handle="top-left"] {
      top: -6px !important;
      left: -6px !important;
      cursor: nwse-resize;
    }

    &[data-resize-handle="top-right"] {
      top: -6px !important;
      right: -6px !important;
      cursor: nesw-resize;
    }

    &[data-resize-handle="bottom-left"] {
      bottom: -6px !important;
      left: -6px !important;
      cursor: nesw-resize;
    }

    &[data-resize-handle="bottom-right"] {
      bottom: -6px !important;
      right: -6px !important;
      cursor: nwse-resize;
    }

    /* Edge handles */
    &[data-resize-handle="top"],
    &[data-resize-handle="bottom"],
    &[data-resize-handle="right"],
    &[data-resize-handle="left"] {
      border-radius: 999px;
    }

    &[data-resize-handle="top"],
    &[data-resize-handle="bottom"] {
      height: 6px;
      left: 20% !important;
      right: 20% !important;
    }

    &[data-resize-handle="top"] {
      top: 10px !important;
      cursor: ns-resize;
    }

    &[data-resize-handle="bottom"] {
      bottom: 10px !important;
      cursor: ns-resize;
    }

    &[data-resize-handle="left"],
    &[data-resize-handle="right"] {
      width: 6px;
      top: 20% !important;
      bottom: 20% !important;
    }

    &[data-resize-handle="left"] {
      left: 10px !important;
      cursor: ew-resize;
    }

    &[data-resize-handle="right"] {
      right: 10px !important;
      cursor: ew-resize;
    }
  }
}
</style>
