<template>

    <form @submit.prevent="sendData">
        <v-locale-provider rtl>
            <v-text-field label="نام محصول" v-model="title" :maxlength="80" rounded="lg" required persistent-hint variant="outlined"
                color="primary" class="mt-10" />

            <div class="px-5 py-3 ">
                توضیحات محصول
            </div>
        </v-locale-provider>

        <TextEditor :content="description" @update="handleTextChange"></TextEditor>
        <v-locale-provider rtl>
            <v-row class="mt-10 mb-5">
                <!-- <v-col cols="12" md="6">
                    <v-text-field label="قیمت محصول(تومان)" v-model="price" min="1000" required rounded="lg" type="number"
                        persistent-hint variant="outlined" color="primary" />
                </v-col> -->
                <v-col cols="12" md="12">
                    <AddCategories @change="(data) => { selectedCategories = data }" :selected="selectedCategories"
                        url="/api/product/seller-panel/category-product-list-create/" />
                </v-col>
            </v-row>


            <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint :required="id?imageIds.length!=0?false:true:true" @change="sendImage"
                variant="outlined" :loading="loadingImage" :disabled="loadingImage" color="primary" v-model="images"
                placeholder="Upload your documents" label="عکس‌های محصول" multiple>
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
                     
                    <div v-for="(preview, index) in imageIds" :key="index">
    
                        <v-img :src="address + '/api/product/product-image/'+preview+'/ '" class="chip-image-preview object-cover " ><v-avatar size="30" class="ma-3"
                            @click="imageIds.splice(imageIds.indexOf(preview), 1)"
                            color="red-darken-2" icon="">
                            <TrashIcon size="15" />
                        </v-avatar></v-img>
                    </div>
                </div>   
            <v-text-field label="کد آی‌فریم ویدیو محصول" v-model="video" rounded="lg" variant="outlined" color="primary"
                class="mt-10" />
            <v-checkbox v-model="pin_profile" color="primary" label="پین بودن در صفحه ی پروفایل شما" />
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
                    <p class="text-red text-body-1 pt-2">{{ error }}</p>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-locale-provider>
        <AddDiscount :value="value" @change="(data) => { value = data }" />
        
        <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
            ثبت
        </v-btn>
        <v-btn rounded="lg" persistent-hint variant="outline" color="primary" :disabled="loadingImage"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5" @click="$emit('cancel')">
            برگشت
        </v-btn>
        
    </form>
</template>
<script>
import { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import AddCategories from '@/components/section/product/AddCategories.vue';
import AddColor from '@/components/section/product/AddColor.vue';
import AddSpecification from '@/components/section/product/AddSpecification.vue';
import AddDiscount from '@/components/section/product/AddDiscount.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
    components: { PhotoIcon, VideoIcon, CheckIcon, TrashIcon, CheckboxIcon, AddCategories, AddColor, AddSpecification, AddDiscount },
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
        description: null,
        images: [],
        video: null,
        imageUrl: [],
        value: 0,
        pin_profile: false,
        imageIds: [],
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
            this.description = newText;
        },
        async sendDataFunc() {
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();
                    imageFormData.append(`photo`, file);
                    try {
                        axios.post(`${apiStore().address}/api/product/seller-panel/add-image/`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }).then((data) => {
                            this.imageIds.push(data.data.id)
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
            let list_specification_id = []
            let list_color_id = []
            this.list_specification.forEach(element => {
                list_specification_id.push(element.id)
            });

            if (this.list_color.length != 0) {
                this.list_color.forEach(element => {
                    list_color_id.push(element.id)
                });

                console.log('list_color_id: ',list_color_id)
                let formDic = {}
                formDic['category'] = this.selectedCategories
                formDic['image'] = this.imageIds
                formDic['video'] = this.video
                formDic['title'] = this.title
                formDic['description'] = this.description
                formDic['price'] = this.price
                formDic['discount'] = this.value
                formDic['pin_profile'] = this.pin_profile
                formDic['Specification'] = list_specification_id
                formDic['colors'] = list_color_id
                let header = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Token ${useUserStore().userToken}`
                    },
                }
                let url = this.id != null ? `/api/product/seller-panel/product-retrieve-update-destroy/${this.id}/` : '/api/product/seller-panel/add-product/'
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
            } else {
                this.error = 'اضافه کردن رنگ ضروری است'
            }
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/seller-panel/product-retrieve-update-destroy/${this.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {

                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                this.pin_profile = response.data.pin_profile
                response.data.image.forEach(element => {

                    this.imageIds.push(element.id)
                });
                response.data.image.forEach(element => {

                    this.imageUrl.push(element.id)
                });
                response.data.category.forEach(element => {
                    this.selectedCategories.push(element.id)
                });

                this.price = response.data.price
                this.value = response.data.discount
                this.list_specification = response.data.Specification
                this.list_color = response.data.colors != null ? response.data.colors : []
                if (response.data.discount) this.discount = true

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