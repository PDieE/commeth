<template>
  <node-view-wrapper class="vue-component">
    <label>Vue Component</label>

    <div class="content">
      <button @click="increase">
        This button has been clicked {{ node.attrs.count }} times.
      </button>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import "@tiptap/extension-image";
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

// 使用defineProps定义组件属性
const { updateAttributes, node, editor, getPos } = defineProps(nodeViewProps);

/**
 * ====================
 *       基本逻辑
 * ====================
 */
// 定义方法
const increase = () => {
  if (node.attrs.count >= 1) {
    // 将自己替换为Image
    const pos = getPos()!;
    const imageNode = editor.schema.nodes.image.create({
      src: "https://public.house-keeper.cn/static/dev/8dbb6da349af4560b15d533e56a9e3ab.png",
    });
    editor.view.dispatch(editor.state.tr.replaceWith(pos, pos + 1, imageNode));
    return;
  }
  updateAttributes({
    count: node.attrs.count + 1,
  });
};
</script>

<style lang="scss"></style>
