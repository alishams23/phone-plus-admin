<template>
    <form @submit.prevent="sendData">
        <v-locale-provider rtl>
            <v-text-field label="نام محصول" v-model="title" rounded="lg" required persistent-hint variant="outlined"
                color="primary" class="mt-10" />

            <div class="px-5 py-3 ">
                توضیحات محصول
            </div>
        </v-locale-provider>
        <TextEditor @update="handleTextChange"></TextEditor>
        <v-locale-provider rtl>
            <v-row class="mt-10 mb-5">
                <v-col cols="12" md="6">
                    <v-text-field label="قیمت محصول" v-model="price" required rounded="lg" type="number" persistent-hint
                        variant="outlined" color="primary" />
                </v-col>
                <v-col cols="12" md="6">
                    <AddCategories @change="(data) => {selectedCategories = data }" :selected="selectedCategories" url="/api/product/admin/category-list-create/" url-create="/api/product/admin/category-list-create/" />
                </v-col>
            </v-row>


            <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint required @change="sendImage"
                variant="outlined" :disabled="loadingImage" color="primary" v-model="images"
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
                <template v-for="(preview, index) in imagePreviews" :key="index">
                    <img :src="preview" class="chip-image-preview" />
                </template>
            </div>
            <v-text-field label="کد آی‌فریم ویدیو محصول" v-model="video" rounded="lg" variant="outlined" color="primary"
                class="mt-10" />

            <v-expansion-panels rounded="xl" class="mb-10 mt-5">
                <v-expansion-panel elevation="0">
                    <v-expansion-panel-title color="grey-lighten-4 rounded-lg">
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
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="عنوان ویژگی" rounded="lg" v-model="title_specification"
                                    variant="outlined" color="primary" class="mt-10" />
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex align-center justify-center">
                                <v-text-field label="مقدار ویژگی" rounded="lg" v-model="body_specification"
                                    variant="outlined" color="primary" class="mt-10" />
                                <v-btn @click="createSpecification" :loading="loadingSpecification" icon="" class="mt-4 mx-3" color="primary"
                                    variant="flat" size="small">
                                    <CheckIcon />
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-for="data in list_specification" align="center">
                            <v-col>عنوان : {{data.title}}</v-col>
                            <v-col class="d-flex justify-space-between align-center">
                                <div>
                                    مقدار : {{data.body}}
                                </div>
                                <v-btn
                                @click="list_specification.splice(data, 1)"
                                icon="" variant="tonal" class="mx-3" elevation="0" color="red" size="small" >
                                    <TrashIcon/>
                            </v-btn>
                            </v-col>
                         
                            
                        </v-row>
                    </v-expansion-panel-text>

                </v-expansion-panel>
            </v-expansion-panels>

            <v-checkbox @click="discount == false ? value = 0 : ''" v-model="discount" color="primary" label="دارای تخفیف">
            </v-checkbox>

        </v-locale-provider>

        <v-slide-y-transition>
            <v-slider v-if="discount" label="درصد تخفیف" variant="outlined" color="primary" class="mt-5" v-model="value"
                :min="0" :max="100" :step="1" thumb-label></v-slider>
        </v-slide-y-transition>

        <v-btn rounded="lg"  persistent-hint variant="flat" color="primary" :disabled="loadingImage"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
            ثبت
        </v-btn>
    </form>
</template>
<script>
import { PhotoIcon, VideoIcon, CheckboxIcon,TrashIcon, CheckIcon } from 'vue-tabler-icons';
import TextEditor from '@/components/shared/TextEditor.vue';
import AddCategories from '@/components/section/product/AddCategories.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
    components: { PhotoIcon, VideoIcon, CheckIcon,TrashIcon, CheckboxIcon, TextEditor,AddCategories },

    data: () => ({
        price: 0,
        title: null,
        description: null,
        discount: false,
        images: [],
        video: null,
        value: 0,
        imageIds: [],
        loadingImage: false,
        imagePreviews: [],
        selectedCategories: [],
        loadingSpecification: false,
        title_specification: null,
        body_specification: null,
        list_specification: [],
    }),

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
                            console.log('upload imge');
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
        async createSpecification() {
            this.loadingSpecification = true
            axios.post(`${apiStore().address}/api/product/admin/specification-list-create/`,
                {
                    title: this.title_specification,
                    body: this.body_specification
                }, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.loadingSpecification = false
                    this.list_specification.push({
                        title: this.title_specification,
                        body: this.body_specification,
                        id:response.data.id
                    })

                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
        async sendData() {
            let list_specification_id = []
            this.list_specification.forEach(element => {
                list_specification_id.push(element.id)
            });
            console.log(this.selectedCategories)
            let formDic = {}
            formDic['category'] = this.selectedCategories
            formDic['image'] = this.imageIds
            formDic['video'] = this.video
            formDic['title'] = this.title
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value
            formDic['Specification'] = list_specification_id

            axios.post(`${apiStore().address}/api/product/admin/add-product/`, formDic, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {

                    this.$emit('close')
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
    }
};
</script>

<style>
.ql-toolbar.ql-snow {
    border-radius: 13px 13px 0px 0px !important;
}
</style>