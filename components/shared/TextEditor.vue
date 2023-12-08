<template>
    <client-only >
        <quill-editor
        class="rounded-b-lg"
         content-type="html"
         theme="snow"
         :toolbar="toolbar"
         :modules="modules"
        />
      </client-only>
</template>
<script setup lang="ts">
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import EditIcon from '@/assets/icons/edit.svg'
  import SaveIcon from '@/assets/icons/save.svg'

  let  toolbar= [
            ["bold", "italic", "underline", "strike"],
            ["link", "blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ direction: "rtl" }],
            // ['image']
          ]
  let modules: {}
  if (!process.server) {
    const { QuillEditor, Quill } = await import('@vueup/vue-quill')
    const { vueApp } = useNuxtApp()
    if (!vueApp._context.components.QuillEditor)
      vueApp.component('QuillEditor', QuillEditor)

    const ImageUploader = await import('quill-image-uploader')
    const BlotFormatter = await import('quill-blot-formatter')

    let modules: any[] = !process.server
  ? [
      {
        name: 'imageUploader',
        module: ImageUploader.default,
        upload: (file: any) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            // You might want to resolve or reject here based on your implementation
          });
        },
      },
      {
        name: 'blotFormatter',
        module: BlotFormatter,
        options: {},
      },
    ]
  : [];

  }
</script>