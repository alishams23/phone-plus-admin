<template>
    <v-container>

        <v-row justify="center" v-if="loadingData == false">
            <v-col cols="12" md="9">

                <form class="px-md-3" @submit.prevent="sendData" enctype="multipart/form-data">
                    <v-locale-provider rtl>
                        <div class="mt-3 mb-5">

                            <v-text-field label="تیتر مقاله" v-model="title" rounded="lg" required persistent-hint
                                variant="outlined" color="primary" class="mt-10" />

                        </div>
                    </v-locale-provider>

                    <TextEditor @update="handleTextChange" :content="body"></TextEditor>

                    <v-locale-provider rtl>
                        <div class="my-4">
                            <div>دسته بندی</div>
                        </div>
                        <div>
                            <v-autocomplete label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined"
                                color="primary" clearable chips v-model="selectedCategories" :items="categories"
                                item-text="name" item-value="id" multiple>
                            </v-autocomplete>
                        </div>
                        <div class="my-4">
                            <div class="text-right fw-bold">انتخاب عکس مقاله</div>
                        </div>
                        {{ imageId }}
                        <div>

                            <v-file-input @change="sendImage" rounded="lg" accept=".png,.jpg" persistent-hint
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
                                اپدیت
                            </v-btn>
                        </div>
                    </v-locale-provider>
                </form>
            </v-col>
        </v-row>
        <div class="d-flex justify-center">
            <v-progress-circular v-if="loadingData" bg-color="transparent" :size="55" class="ma-10" :width="5"
                color="primary" indeterminate></v-progress-circular>
        </div>
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
            loadingData: true,
            imageId: null,
            fd: null,
            selectedCategories: [],
            categories: [],
            imagePreviews: [],
            editorOptions: {
                theme: "snow",

            },
        };
    },
    mounted() {
        this.getData()
        this.fetchCategories()

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
        async changeImage() {
            this.imagePreviews = [];
            this.photo.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
        getData() {

            axios.get(`${apiStore().address}/api/blog/blog_retrieve/${this.$route.params.id}/`, {
                headers: {

                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {

                this.loadingData = false
                this.title = response.data.title
                this.body = response.data.body
                this.imageId = response.data.imageBlog.id
                this.selectedCategories = response.data.category
            }
            )
        },
        async sendImage() {
            this.fd = new FormData();
            if (this.photo) {
                this.fd.append("photo", this.photo[0])
                this.fd.append("title_for_photo", this.title);
                console.log(this.photo)
                console.log('sendImg');
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
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        }
                    }).then((response) => {
                        console.log('sendImg', response.data.id);
                        this.imageId = response.data.id;

                    })
            } else {
                return null
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
            let data = {
                title: this.title,
                body: this.body,
                category: this.selectedCategories
            }
            if (this.photo) await this.sendImage()
            if (this.imageId) data['imageBlog'] = this.imageId
            await axios
                .put(
                    `${apiStore().address}/api/blog/seller-panel/blog-update/${this.$route.params.id}/`,
                    data,
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


            this.loading = false;
        },
    },
};
</script>