import { Node } from "@tiptap/core";
import { mergeAttributes, VueNodeViewRenderer } from "@tiptap/vue-3";

import ImageUploadComponent from "./ImageUploadComponent.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: (opts: { file?: File }) => ReturnType;
    };
  }
}

/**
 * 基于Image扩展的Tiptap上传图片扩展，支持上传状态显示
 */
export const ImageUpload = Node.create({
  name: "imageUpload",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      count: { default: 0 },
      file: {
        rendered: true,
        validate: (file: File) => {
          // 判断是否是File类型
          if (!(file instanceof File)) {
            throw new Error("file must be a File instance");
          }
          // 判断是否是图片类型
          if (!file.type.startsWith("image/")) {
            throw new Error("file must be an image file");
          }
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "image-upload" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["image-upload", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageUploadComponent);
  },
  addCommands() {
    return {
      setImageUpload:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
