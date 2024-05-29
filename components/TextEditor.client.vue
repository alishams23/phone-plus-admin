<template>
 
  <v-dialog width="900" v-model="dialog">
    <template v-slot:default="{ isActive }">
        <v-locale-provider rtl>
<v-card class="pa-5" rounded="lg" >
  <v-alert class="text-body-2">
    در سایت آپارات فیلم خود را بارگذاری کرده و در قسمت اشتراک گذاری ٫ کلید کد را انتخاب کرده و سپس کد iframe را در این قسمت پیست کنید .
  </v-alert>
  <v-textarea
  label="کد فیلم شما"
  rounded="lg"
  v-model="text"
  variant="outlined"
  color="primary"
  class="mt-5"/>
  <v-btn    rounded="lg"
  persistent-hint
  @click="doPaste"
  variant="flat"
  color="primary"
  :disabled="text == null"
  class="custom-btn mx-2 px-10 text-body2 font-weight-bold mb-5">
  ثبت
  </v-btn>
</v-card>
        </v-locale-provider>
       
    </template>
</v-dialog>
  <client-only>
    <quill-editor  @ready="onEditorReady($event)" class="rounded-b-lg" :ref="editorContent" content-type="html" v-model:content="content" theme="snow"
      :toolbar="toolbar"  :modules="modules" @textChange="updateContent"   />
  </client-only>
</template>
<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, defineEmits } from 'vue';
const props = defineProps<{
  content: string,
}>();

const { content } = toRefs(props);
const emit = defineEmits(['update']);
const editorContent = ref(null);
let dialog = ref();
let text = ref('');
let editor = null

// ... (rest of your code)

const updateContent = () => {

  emit('update', editor.container.querySelector(".ql-editor").innerHTML);
  
};
const doPaste  = () => {
  
  if (editor) {
    editor.pasteHTML(`${document.querySelector(".ql-editor").innerHTML} ${text.value}`);
    dialog.value = false;
  } else {
    console.error('Quill editor is not ready yet. Wait for onEditorReady event.');

  }
  

}


const onEditorReady = (data) =>  {
  editor = data
  const customButton = editor.getModule('toolbar').container.querySelector('.ql-custom');
  customButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-play-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/></svg>';
  if (customButton) {
   
    customButton.addEventListener('click', () => {
      // Handle custom button click
      // You can perform any custom action here
      console.log('Custom button clicked!');
      dialog.value = true;
    });}
    const rtlButton = editor.getModule('toolbar').container.querySelector('.ql-direction');
  if (rtlButton) {
    rtlButton.click();
  } else {
    console.error('RTL button not found');
  }

}

let toolbar = [
  ["bold", "italic", "underline", "strike"],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] },],
  ["link", "blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ direction: "rtl" }],
  ['image'],
  [{ custom: 'insert custom' }],
  

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
      },
      
      
    //   {
    //     name: 'quillEmoji',
    //     module: quillEmoji,
    //     options: {
    //       "emoji-toolbar": true,
    // "emoji-textarea": true,
    // "emoji-shortname": true,
    //     }
    //   },
   
     
      
      
      // {
      //   name: 'quillEmoji',
      //   module: quillEmoji,
      //   options: {}
      // }
    ]

 
</script>

<style >
.ql-editor{
    min-height:200px;
}
.ql-custom {
  width: 32px;
  height: 32px;
  background-color: #ccc;
  font-size: 13px;
 
  /* Add any other styles as needed */
}
.ql-toolbar{
  direction: rtl;
}
.ql-header.ql-picker{
  direction: ltr;
}
</style>