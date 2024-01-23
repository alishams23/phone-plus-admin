<template>
    <form @submit.prevent="sendData" >      
        <v-locale-provider rtl  >
            <v-text-field
                label="نام محصول"
                v-model="title"
                rounded="lg"
                required
                persistent-hint
                variant="outlined"
                color="primary"
                class="mt-10"/>
            
        <div class="px-5 py-3 ">
            توضیحات محصول
        </div>
        </v-locale-provider>
            <TextEditor
            @update="handleTextChange" 
            ></TextEditor>
        <v-locale-provider rtl  >
        <v-row class="mt-10 mb-5">
        <v-col>
            <v-text-field
            label="قیمت محصول"
            v-model="price"
            required
            rounded="lg"
            type="number"
            persistent-hint
            variant="outlined"
            color="primary"
            />
        </v-col>
        <v-col>
            <v-autocomplete
                label="دسته بندی‌ها"
                rounded="lg"
                persistent-hint
                variant="outlined"
                color="primary"
                clearable
                chips
                v-model="selectedCategories"
                :items="categories"
                item-text="name"
                item-value="id" 
                multiple>
            </v-autocomplete>

        </v-col>
        </v-row>
       

        <v-file-input
            rounded="lg"
            accept=".png,.jpg"
            persistent-hint
            required
            @change="sendImage"
            variant="outlined"
            :disabled="loadingImage"
            color="primary"
            v-model="images"
            placeholder="Upload your documents"
            label="عکس‌های محصول"
            multiple
        >
            <template v-slot:prepend>
                <PhotoIcon style="margin-left: -20px;" class="text-grey" />
            </template>
            <template v-slot:selection="{ fileNames }">
                <template v-for="(preview, index) in imagePreviews" :key="index">
                    <v-chip
                        class="mx-1"
                        size="small"
                        label
                        color="primary"
                    >
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
            <v-file-input
                rounded="lg"
                accept=".mp4"
                persistent-hint
                variant="outlined"
                color="primary"
                v-model="video"
                placeholder="اضافه کردن ویدئو"
                label="فیلم محصول"
                multiple
               >
                <template v-slot:prepend>
                    <VideoIcon style="margin-left: -20px;" class="  text-grey" />
                </template>
                <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip
                            size="small"
                            label
                            color="primary"
                            >
                            {{ fileName }}
                        </v-chip>
                    </template>
                </template>
            </v-file-input>
            <v-checkbox
                    v-model="discount"
                    color="primary"
                    label="دارای تخفیف"
                >
            </v-checkbox>

        </v-locale-provider>

        <v-slide-y-transition>
            <v-slider
                v-if="discount"
                label="درصد تخفیف"
                variant="outlined"
                color="primary"
                class="mt-5"
                v-model="value"
                :min="0"
                :max="100"
                :step="1"
                thumb-label
            ></v-slider>
        </v-slide-y-transition>

        <v-btn
            rounded="lg"
            persistent-hint
            variant="flat"
            color="primary"
            :disabled="loadingImage"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5"
            type="submit">
            ثبت
        </v-btn>
    </form>
</template>
<script>
import {PhotoIcon, VideoIcon ,CheckboxIcon} from 'vue-tabler-icons';
import TextEditor from '@/components/shared/TextEditor.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';

  export default {
    components:{PhotoIcon, VideoIcon,CheckboxIcon,TextEditor},

    data: () => ({
        price: 0,
        title: null,
        description: null,
        discount: false,
        images: [],
        video: null,
        value: 0,
        imageIds : [],
        loadingImage:false,
        imagePreviews: [], 
        categories: [],
        selectedCategories: [],
    }),
    mounted() {
        this.fetchCategories();
    },
    methods: {
        handleTextChange(newText) {
            this.description = newText;
        },
        async fetchCategories() {
            try {
                const userToken = useUserStore().userToken; // Get the token from your user store
                const response = await axios.get('http://127.0.0.1:8000/api/product/ListCategories/', {
                    headers: {
                        Authorization: `Token ${userToken}`
                    }
                });
                this.categories = response.data; // Assuming the API returns an array
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async sendDataFunc(){
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();  
                    imageFormData.append(`photo`, file);
                    try {
                    axios.post('http://127.0.0.1:8000/api/product/AddImageApi/', imageFormData, {
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
            formDic['title'] = this.title
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value

            axios.post('http://127.0.0.1:8000/api/product/AddProductApi/', formDic, {
                headers: {
                
                Authorization: `Token ${useUserStore().userToken}`
                },
            })
            .then(response => {
                // handle success
                console.log(response.data);
            })
            .catch(error => {
                // handle error
                console.error('Error:', error);
            });
        },
    }
};
</script>

<style >
.ql-toolbar.ql-snow{
    border-radius: 13px 13px 0px 0px !important;
}

</style>