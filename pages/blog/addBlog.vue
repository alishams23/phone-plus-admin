<template>
  <v-container v-if="categories!=[]">
    <v-row justify="center">
      <v-col cols="12" md="9">
        <form class="px-3" @submit.prevent="sendData" enctype="multipart/form-data">
          <v-locale-provider rtl>
            <div class="mt-3 mb-5">
              <v-text-field label="تیتر مقاله" v-model="title" rounded="lg" required persistent-hint variant="outlined"
                color="primary" class="mt-10" />
            </div>
          </v-locale-provider>
          <TextEditor @update="handleTextChange"></TextEditor>
          <v-locale-provider rtl>
            <div class="my-4">
              <div>دسته بندی</div>
            </div>
            <div>
              <v-autocomplete label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined" color="primary"
                clearable chips v-model="selectedCategories" :items="categories" item-text="name" item-value="id"
                multiple>
              </v-autocomplete>
            </div>
            <div class="my-4">
              <div>انتخاب عکس مقاله</div>
            </div>
            <div>
              <v-file-input @change="changeImage" rounded="lg" accept=".png,.jpg" persistent-hint required
                variant="outlined" prepend-icon=""  color="primary" v-model="photo" placeholder="Upload your documents"
                label="عکس‌های هدر">
                <template v-slot:prepend>
                  <PhotoIcon  class="text-grey" />
                </template>
              </v-file-input>
              <div class="image-preview-container">
                <template v-for="(preview, index) in imagePreviews" :key="index">
                  <img :src="preview" class="chip-image-preview" />

                </template>
              </div>
            </div>
            <p class="text-danger rtl pt-3">
              {{ error }}
            </p>
            <div class="d-flex rtl m-3 mt-5">
              <v-btn :loading="loading" rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                افزودن
              </v-btn>
            </div>
          </v-locale-provider>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>

import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";
import { PhotoIcon, } from 'vue-tabler-icons';

  
  export default {
    components: {
        PhotoIcon
    },
    data() {
      return {
        loading: false,
        photo: null,
        title: "",
        error: "",
        body: "",
        categories: [],
        selectedCategories: [],
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
      async fetchCategories() {
        try {
            const userToken = useUserStore().userToken; // Get the token from your user store
            const response = await axios.get(`${apiStore().address}/api/blog/List_category/`, {
                headers: {
                    Authorization: `Token ${userToken}`
                }
            });
            this.categories = response.data; // Assuming the API returns an array
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
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
        await axios
          .post(
            `${apiStore().address}/api/blog/seller-panel/create-image/`,
            this.fd,
  
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${useUserStore().userToken}`
              },
            }
          )
          .catch(function (error) {
           
          })
          .then((response) => {
            this.imageId = response.data.id;
            axios
              .post(
                `${apiStore().address}/api/blog/seller-panel/create-blog-admin/`,
                {
                  title: this.title,
                  body: this.body,
                  imageBlog: this.imageId,
                  category : this.selectedCategories
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
                
              })
              .then((response) => {
                this.$router.push(`/blog`);
              });
          });
        this.loading = false;
      },
      
    },
    mounted() {
      this.fetchCategories()
    },
  };
  </script>
  