<template>
  <client-only>
    <quill-editor class="rounded-b-lg" ref="editorContent" content-type="html" v-model:content="content" theme="snow"
      :toolbar="toolbar" :modules="modules" @textChange="updateContent" style="height: 300px;"  />
  </client-only>
</template>
<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, defineEmits } from 'vue';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

const props = defineProps<{
  content: string,
}>();

const { content } = toRefs(props);
const emit = defineEmits(['update']);
const editorContent = ref('');

// ... (rest of your code)

const updateContent = () => {

  emit('update', document.querySelector(".ql-editor").innerHTML);
};

let toolbar = [
  ["bold", "italic", "underline", "strike"],
  ["link", "blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ direction: "rtl" }],
  ['image']
]

let modules: {}
  if (!process.server) {
    const { QuillEditor, Quill } = await import('@vueup/vue-quill')
    const { vueApp } = useNuxtApp()
    if (!vueApp._context.components.QuillEditor)
      vueApp.component('QuillEditor', QuillEditor)

    const ImageUploader = await import('quill-image-uploader')
    // const BlotFormatter = await import('quill-blot-formatter')

    modules = [
      {
        name: 'imageUploader',
        module: ImageUploader.default, //add .default
        upload: (file: any) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('image', file)
          })
        }
      },
      {
        name: 'blotFormatter',
        module: BlotFormatter,
        options: {}
      }
    ]
  }
</script>