<template>
    <form class="px-3" @submit.prevent="sendData" enctype="multipart/form-data">
      <div class="mt-3 mb-5">
     
        <v-text-field
        label="تیتر مقاله"
        v-model="title"
        rounded="lg"
        required
        persistent-hint
        variant="outlined"
        color="primary"
        class="mt-10"/>
    
      </div>
      <TextEditor
      @update="handleTextChange" 
      ></TextEditor>
      <div class="my-4">
        <div class="text-right fw-bold">انتخاب عکس مقاله</div>
      </div>
      <div class="d-flex">

        <v-file-input
        rounded="lg"
        accept=".png,.jpg"
        persistent-hint
        required
      
        variant="outlined"
   
        color="primary"
        v-model="photo"
        placeholder="Upload your documents"
        label="عکس‌های هدر"
        
    >
        <template v-slot:prepend>
            <PhotoIcon style="margin-left: -20px;" class="text-grey" />
        </template>
       
    </v-file-input>

       
      
      </div>
      <p class="text-danger rtl pt-3">
        {{ error }}
      </p>
      <div class="d-flex rtl m-3 mt-5">
        <v-btn
        rounded="lg"
        persistent-hint
        variant="flat"
        color="primary"
    
        class="mx-2 px-10 text-body2 font-weight-bold mb-5"
        type="submit">
          افزودن
        </v-btn>
      </div>
      {{ body }}
    </form>
  </template>
  
  <script>

  import TextEditor from '@/components/shared/TextEditor.vue';
  import { useUserStore } from '~/store/user';
  import axios from "axios";
import {PhotoIcon, } from 'vue-tabler-icons';

  
  export default {
    components: {
        TextEditor,
        PhotoIcon
    },
    data() {
      return {
        loading: false,
        photo: null,
        title: "",
        error: "",
        body: "",
        imageId: null,
        fd: null,
        editorOptions: {
          theme: "snow",
     
        },
      };
    },
    methods: {
      handleTextChange(newText) {
        this.body = newText;
      },
      async sendData() {
        if (
          this.body == null ||
          this.body == "" 
        ) {
          this.error = "لطفا همه ی مقادیر را وارد کنید ";
          return 0;
        }
        this.loading = true;
        this.fd = new FormData();
        this.fd.append("photo", this.photo[0]);
        this.fd.append("title_for_photo", this.title);
        console.log(this.photo)
        await axios
          .post(
            `http://192.168.1.107:8000/api/blog/CreateImage/`,
            this.fd,
  
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${useUserStore().userToken}`
              },
            }
          )
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          })
          .then((response) => {
            this.imageId = response.data.id;
            axios
              .post(
                `http://192.168.1.107:8000/api/blog/createBlog/`,
                {
                  title: this.title,
                  body: this.body,
                  imageBlog: this.imageId,
                },
                {
                  headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                  },
                }
              )
              .catch(function (error) {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                }
              })
              .then((response) => {
                this.$router.push(`/blog`);
              });
          });
  
        this.loading = false;
      },
    },
  };
  </script>
  