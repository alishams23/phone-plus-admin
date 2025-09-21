<template>

  <v-dialog width="900" v-model="dialog">
    <template v-slot:default="{ isActive }">
      <v-locale-provider rtl>
        <v-card class="pa-5" rounded="lg">
          <v-alert class="text-body-2">
            در سایت آپارات فیلم خود را بارگذاری کرده و در قسمت اشتراک گذاری٫ کلید کد را انتخاب کرده و سپس کد iframe را
            در این قسمت پیست کنید .
          </v-alert>
          <v-textarea label="کد فیلم شما" rounded="lg" v-model="text" variant="outlined" color="primary" class="mt-5" />
          <v-btn rounded="lg" persistent-hint @click="doPaste" variant="flat" color="primary" :disabled="text == null"
            class="custom-btn mx-2 px-10 text-body2 font-weight-bold mb-5">
            ثبت
          </v-btn>
        </v-card>
      </v-locale-provider>

    </template>
  </v-dialog>
  <client-only>
    <quill-editor @ready="onEditorReady($event)" class="rounded-b-lg" :ref="editorContent" content-type="html"
      v-model:content="content" theme="snow" :toolbar="toolbar" :modules="modules" @textChange="updateContent" />
  </client-only>
</template>
<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, defineEmits } from 'vue';
import axios from 'axios'
const props = defineProps<{
  content: string,
}>();

const { content } = toRefs(props);
const emit = defineEmits(['update']);
const editorContent = ref(null);
let dialog = ref();
let text = ref('');
let editor: any = null

// ... (rest of your code)

const updateContent = () => {

  emit('update', editor.container.querySelector(".ql-editor").innerHTML);

};

const doPaste = () => {

  if (editor) {
    editor.pasteHTML(`${document.querySelector(".ql-editor")!.innerHTML} ${text.value}`);
    dialog.value = false;
  } else {
    console.error('Quill editor is not ready yet. Wait for onEditorReady event.');

  }


}


const onEditorReady = (data: any) => {
  editor = data
  const customButton = editor.getModule('toolbar').container.querySelector('.ql-custom');
  customButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-play-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6 6.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43V6.884z"/></svg>';
  if (customButton) {

    customButton.addEventListener('click', () => {
      // Handle custom button click
      // You can perform any custom action here
      console.log('Custom button clicked!');
      dialog.value = true;
    });
  }
  const rtlButton = editor.getModule('toolbar').container.querySelector('.ql-direction');
  if (rtlButton) {
    rtlButton.click();
  } else {
    console.error('RTL button not found');
  }
  const lineHeightPicker = editor.getModule('toolbar').container.querySelector('.ql-lineHeight').querySelector('.ql-picker-label');
  const lineHeightPickerOption = editor.getModule('toolbar').container.querySelector('.ql-lineHeight').querySelector('.ql-picker-options');
  if (lineHeightPicker) {
    lineHeightPicker.innerText = 'Line Height';
    lineHeightPickerOption.querySelectorAll('.ql-picker-item').forEach((span: any) => {
      console.log(span)
      span.innerText = span.getAttribute('data-value');
    });
    // Insert the label before the line height picker
    // lineHeightPicker.parentNode.insertBefore(label, lineHeightPicker);
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check if the mutation target is an <img> element
      if (mutation.target.tagName === 'IMG') {
        updateContent();  // Call updateContent only when an <img> element is modified
      }
    }
  });

  // Observe changes in the editor's `.ql-editor` element for any blot mutations
  observer.observe(editor.container.querySelector(".ql-editor")!, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style']
  });

const quillEditorEl = editor.container.querySelector('.ql-editor');

quillEditorEl.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (target && target.tagName === 'IMG') {
    const blot = Quill.find(target); // Get the image blot
    const index = editor.getIndex(blot);

    // Select the image
    editor.setSelection(index, 1, 'user');

    // Manually trigger the toolbar tooltip (link prompt)
    const toolbar = editor.getModule('toolbar');
    toolbar.handlers.link?.call(toolbar, true);
  }
});


}

const handleScroll = () => {
  const toolbar = editor.getModule('toolbar').container;
  const mainEditor = editor.container.querySelector(".ql-editor");

  if (toolbar && mainEditor) {
    const editorRect = mainEditor.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();


    // Check if the toolbar is within the editor bounds
    if (toolbarRect.top > editorRect.bottom) {
      toolbar.classList.add('hidden-toolbar');
    } else {
      toolbar.classList.remove('hidden-toolbar');
    }
  }
};


onMounted(() => {
  window.addEventListener('scroll', handleScroll, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

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
  [{ 'lineHeight': ['1.0', '1.5', '1.8', '2.0', '2.5', '3.0'] }],
  [{ size: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'] }],

]

let modules: {
  sticky_toolbar: true
}


const { QuillEditor, Quill } = await import('@vueup/vue-quill')
const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(SizeStyle, true);
const Parchment = Quill.import('parchment');
const LineHeightStyle = new Parchment.Attributor.Style('lineHeight', 'line-height', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1.0', '1.5', '1.8', '2.0', '2.5', '3.0']
});


Quill.register(LineHeightStyle, true);

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
  {
    name: 'imageUploader',
    module: ImageUploader.default,
    options: {
      upload: async (file: any) => {
        try {
          // Make an API request to upload the image
          const formData = new FormData();
          formData.append('image', file);

          // Assuming your API endpoint for uploading is '/api/upload'
          const response = await axios.post('https://phoneplus.ir/api/blog/seller-panel/quill-images/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          // Return the URL to insert into the editor
          return response.data.image; // Ensure your API response returns the image URL
        } catch (error) {
          console.error('Image upload failed:', error);
          throw error;
        }
      }
    }
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

<style>
.ql-snow {
  .ql-picker {
    &.ql-size {

      .ql-picker-label,
      .ql-picker-item {
        direction: ltr;

        &::before {
          content: attr(data-value) !important;
        }
      }
    }
  }
}

.ql-editor {
  min-height: 200px;
  background: white;
  border-radius: 0.7rem;
}

.ql-custom {
  width: 32px;
  height: 32px;
  background-color: #ccc;
  font-size: 13px;

  /* Add any other styles as needed */
}

.ql-toolbar {
  direction: rtl;

}

.ql-header.ql-picker {
  direction: ltr;
}

.ql-toolbar {
  position: sticky;
  top: 0;

  z-index: 1000;
  background: white;
  transition: opacity 0.3s ease, visibility 0.3s ease;

}

.hidden-toolbar {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>