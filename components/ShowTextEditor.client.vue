<template>
    <client-only >

       <div class="quillCustom">
        <quill-editor
        class="rounded-b-lg quillCustom"
        ref="editorContent"
        :read-only="true"
         content-type="html"
         v-model:content="content"
     
         :toolbar="toolbar"
         :modules="modules"
       
       

        />
       </div>
      </client-only>
</template>
<script setup lang="ts">
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import EditIcon from '@/assets/icons/edit.svg'
  import { defineProps, reactive } from "vue";
  import SaveIcon from '@/assets/icons/save.svg'
  const props = defineProps<{
    content: string,
}>();

const { content } = toRefs(props);

  import { ref, defineEmits } from 'vue';


  const emit = defineEmits(['update']);
  const editorContent = ref('');

  // ... (rest of your code)

//   const updateContent = () => {
   
//     emit('update', document.querySelector(".ql-editor").innerHTML);
//   };

  let  toolbar: any[]= [
            
          ]

          let modules: {}
 
 
 const { QuillEditor, Quill } = await import('@vueup/vue-quill')
 const { vueApp } = useNuxtApp()

   vueApp.component('QuillEditor', QuillEditor)

 const ImageUploader = await import('quill-image-uploader')
 const BlotFormatter = await import('quill-blot-formatter/dist/BlotFormatter')



 modules = [

   {
     name: 'blotFormatter',
     module: BlotFormatter.default,
     options: {}
   }
 ]

</script>

<style >
.quillCustom.ql-container.ql-snow{
    border: none;
}

.quillCustom .ql-toolbar.ql-snow{
    display: none;
}
</style>