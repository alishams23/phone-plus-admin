<template>
    <v-container>

        <form @submit.prevent="sendData" class="px-md-10">
            <v-locale-provider rtl>
                <v-text-field label="نام محصول" v-model="title" rounded="lg" required persistent-hint variant="outlined"
                    color="primary" class="mt-10" />
                <div class="px-5 py-3 ">
                    توضیحات محصول
                </div>
            </v-locale-provider>
            <TextEditor :content="description" @update="handleTextChange"></TextEditor>
            <v-locale-provider rtl>
                <v-row class="mt-10 mb-5">
                    <v-col>
                        <v-text-field label="قیمت محصول" v-model="price" required rounded="lg" type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col>
                        <v-autocomplete label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined" color="primary"
                            clearable chips v-model="selectedCategories" :items="categories" item-text="name"
                            item-value="id" multiple>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint @change="sendImage" variant="outlined"
                    :disabled="loadingImage" color="primary" v-model="images" placeholder="Upload your documents"
                    label="عکس‌های محصول" multiple>
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
                <div class="d-flex flex-wrap">
                    <!-- <template v-for="(preview, index) in imagePreviews" :key="index">
                        <v-img cover :src="preview" class="chip-image-preview" :aspect-ratio="1 / 1" />
                    </template> -->
                    <div class="image-preview-container">
                        <template v-for="(preview, index) in imagePreviews" :key="index">
                            <v-img :src="preview" class="chip-image-preview"></v-img>
                        </template>
                    </div>
                    
                    <div class="image-preview-container">
                        <template v-for="(preview, index) in imageUrl" :key="index">
                            <v-img :src="address + '/api/product/product-image/'+preview.id+'/ '" class="chip-image-preview">
                                <v-avatar size="30" class="ma-3"
                                    @click="imageIds.splice(imageIds.indexOf(preview), 1); imageUrl.splice(index, 1)"
                                    color="red-darken-2" icon="">
                                    <TrashIcon size="15" />
                                </v-avatar>
                            </v-img>
                        </template>
                    </div>
                    
                </div>

                <v-text-field
                label="ویدیو محصول"
                v-model="video"
                rounded="lg"

                variant="outlined"
                color="primary"
                class="mt-10"/>
               
                <v-expansion-panels rounded="xl" class="mb-10 mt-5  ">
                    <v-expansion-panel elevation="0">
                        <v-expansion-panel-title color="grey-lighten-4" class=" ">
                            <div class="d-flex w-100 justify-space-between align-center">
                                <div>
                                    ویژگی های محصول
                                </div>
                                <div class="font-weight-bold">
                                    +
                                </div>
                            </div>
    
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <AddSpecification :data="list_specification"
                                @change="(data) => { list_color = list_specification }" />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="0">
                        <v-expansion-panel-title color="grey-lighten-4" class="">
                            <div class="d-flex w-100 justify-space-between  align-center">
                                <div>
                                    افزودن رنگ
                                </div>
                                <div class="font-weight-bold">
                                    +
                                </div>
                            </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="border-b ">
                            <AddColor :data="list_color" @change="(data) => { list_color = data }" />
                        </v-expansion-panel-text>
    
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-locale-provider>
            <AddDiscount :value="value" @change="(data) => { value = data }" />

           
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage || list_color.length == 0"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
<script>
import { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon } from 'vue-tabler-icons';
import TextEditor from '@/components/shared/TextEditor.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import AddCategories from '@/components/section/product/AddCategories.vue';
import AddColor from '@/components/section/product/AddColor.vue';
import AddSpecification from '@/components/section/product/AddSpecification.vue';
import AddDiscount from '@/components/section/product/AddDiscount.vue';

export default {
    components: { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon, TextEditor ,AddCategories,
AddColor,
AddSpecification,
AddDiscount},
    computed:{
        address(){
            return apiStore().address
        }
    },
    data: () => ({
        price: 0,
        title: null,
        description: null,
        discount: false,
        images: [],
        imageUrl: [],
        video: null,
        value: 0,
        imageIds: [],
        loadingImage: false,
        imagePreviews: [],
        categories : [],
        selectedCategories: [],
        list_specification: [],
        list_color: [],
    }),
    mounted() {

        this.getData()
    },
    methods: {
        handleTextChange(newText) {
            this.description = newText;
        },
  
        async sendDataFunc() {
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();
                    imageFormData.append(`photo`, file);
                    try {
                        axios.post(`${apiStore().address}/api/product/admin/add-image/`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }).then((data) => {
                            this.imageIds.push(data.data.id)

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
            this.loadingImage = false;
        },
        async sendData() {
            console.log(this.selectedCategories)
            let formDic = {}
            formDic['category'] = this.selectedCategories
            formDic['image'] = this.imageIds
            formDic['video'] = this.video
            formDic['title'] = this.title
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value

            axios.put(`${apiStore().address}/api/product/admin/product-retrieve-update-destroy/${this.$route.params.id}/`, formDic, {
                headers: {
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.$router.push(`/products`);
                    // handle success
                    console.log(response.data);
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/admin/product-retrieve-update-destroy/${this.$route.params.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {

                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                response.data.image.forEach(element => {

                    this.imageIds.push(element)
                });
                response.data.image.forEach(element => {

                    this.imageUrl.push(element)
                });
                this.selectedCategories = response.data.category
           
                this.price = response.data.price
                this.value = response.data.discount
                 this.list_specification = response.data.Specification
                this.list_color = response.data.colors
                if (response.data.discount) this.discount = true

            }
            )
        },
    }
};
</script>

<style >
.ql-toolbar.ql-snow {
    border-radius: 13px 13px 0px 0px !important;
}
</style>