<template>
    <v-btn rounded="pill" icon variant="outline" color="primary" :disabled="loadingImage"
        class="text-body2 hidden-sm-and-down font-weight-bold fixed-top-left" @click="$emit('cancel')">
        <XIcon size="24" />
    </v-btn>
    <v-btn rounded="pill" icon variant="outline" color="primary" :disabled="loadingImage"
        class="text-body2 font-weight-bold hidden-md-and-up" @click="$emit('cancel')">
        <XIcon size="24" />
    </v-btn>

    <form @submit.prevent="sendData">
        <v-locale-provider rtl>
            <v-text-field label="عنوان مقاله" v-model="title" :maxlength="80" rounded="lg" required persistent-hint
                variant="outlined" color="primary" class="mt-md-10" />

            <div class="px-5 py-3 ">
                بدنه مقاله
            </div>
        </v-locale-provider>
        <TextEditor :content="body" @update="handleTextChange"></TextEditor>
        <v-locale-provider rtl>
            <v-row class="mt-10 mb-5">
                <v-col cols="12" md="12">
                    <AddCategories @change="(data) => { selectedCategories = data }" :selected="selectedCategories"
                        url="/api/blog/seller-panel/category-blog-list-create/" />
                </v-col>
            </v-row>

            <v-file-input rounded="lg" :loading="loadingImage" accept=".png,.jpg" persistent-hint :required="id ? imageId != 0 ? false : true : true"
                @change="sendImage" variant="outlined" :disabled="loadingImage" color="primary" v-model="images"
                placeholder="Upload your documents" label="عکس‌ مقاله" multiple>
                <template v-slot:prepend>
                    <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                </template>
                <template v-slot:selection="{ fileNames }">
                    <template v-for="(preview, index) in imagePreviews" :key="index">
                        <v-chip class="mx-1" size="small" label color="primary">
                            {{ fileNames[index] }}
                        </v-chip>
                    </template>
                </template>
            </v-file-input>
            
            <div class="image-preview-container">
                <div v-if="imageId" :key="index">
                    <v-img 
                    :src="address + '/api/blog/blog-image/' + imageId + '/'"
                    class="chip-image-preview-wide" 
                    cover
                    >
                    <v-avatar 
                        size="30" 
                        class="ma-3" 
                        @click="imageId = null" 
                        color="red-darken-2" 
                        icon=""
                    >
                        <TrashIcon size="15" />
                    </v-avatar>
                    </v-img>
                </div>
            </div>


        </v-locale-provider>

        <div class="d-flex" >
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
            <v-btn rounded="lg" persistent-hint variant="outline" color="primary" :disabled="loadingImage"
                class=" px-10 text-body2  font-weight-bold mb-5" @click="$emit('cancel')">
                برگشت
            </v-btn>
        </div>
    </form>
</template>
<script>
import { XIcon, PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import AddCategories from '@/components/section/product/AddCategories.vue';
import AddColor from '@/components/section/product/AddColor.vue';
import AddSpecification from '@/components/section/product/AddSpecification.vue';
import AddDiscount from '@/components/section/product/AddDiscount.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
    components: { XIcon, PhotoIcon, VideoIcon, CheckIcon, TrashIcon, CheckboxIcon, AddCategories, AddColor, AddSpecification, AddDiscount },
    props: ['id'],
    emits:["close","cancel"],
    computed: {
        address() {
            return apiStore().address
        }
    },
    data: () => ({
        price: 0,
        title: null,
        body: null,
        images: [],
        video: null,
        imageUrl: [],
        value: 0,
        pin_profile: false,
        imageId: null,
        error: null,
        loadingImage: false,
        imagePreviews: [],
        selectedCategories: [],
        list_specification: [],
        list_color: [],
    }),
    mounted() {
        this.id != null ? this.getData() : ''
    },
    methods: {
        handleTextChange(newText) {
            this.body = newText;
        },
        async sendDataFunc() {
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();
                    imageFormData.append(`photo`, file);
                    imageFormData.append("title_for_photo", this.title);
                    try {
                        axios.post(`${apiStore().address}/api/blog/seller-panel/create-image/`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }).then((data) => {
                            console.log('upload image');
                            this.imageId = data.data.id
                            this.loadingImage = false;
                        })
                    } catch (error) {
                        console.error('Error uploading images:', error);
                        return;
                    }
                    return
                })
            }
        },
        async sendImage() {
            this.loadingImage = true;
            this.imagePreviews = [];
            this.images.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
            this.sendDataFunc();
            
        },
        async sendData() {
            let formDic = {}
            formDic['category'] = this.selectedCategories
            formDic['imageBlog'] = this.imageId
            formDic['title'] = this.title
            formDic['body'] = this.body
            let header = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }
            let url = this.id != null ? `/api/blog/seller-panel/blog-retrieve-update/${this.id}/` : '/api/blog/seller-panel/create-blog-admin/'
            if (this.id != null) {
                await axios.put(`${apiStore().address}${url}`, formDic, header).catch(error => {
                    // handle error
                    console.error('Error:', error);
                });

            } else {
                await axios.post(`${apiStore().address}${url}`, formDic, header).catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
            }
            this.$emit('close')

        },
        getData() {
            axios.get(`${apiStore().address}/api/blog/seller-panel/blog-retrieve-update/${this.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {

                this.loadingData = false
                this.title = response.data.title
                this.body = response.data.body
                this.imageId = response.data.imageBlog.id
                response.data.category.forEach(element => {
                    this.selectedCategories.push(element.id)
                });

            }
            )
        },
    }
};
</script>

<style>
.ql-toolbar.ql-snow {
    border-radius: 13px 13px 0px 0px !important;
}
</style>