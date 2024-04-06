<template>
    <div>
        <form @submit.prevent="sendData">
            <v-locale-provider rtl>
                <v-text-field label="نام" rounded="lg" persistent-hint variant="outlined" color="primary" class="mt-10"
                    v-model="title" required />
            </v-locale-provider>
            <TextEditor :content="description" @update="handleTextChange"></TextEditor>

            <v-locale-provider rtl>
                <v-row class="mt-10 mb-5">
                    <v-col cols="12" md="6">
                        <v-text-field :label="file_type=='لایسنس اکانت کد یکتا'?' قیمت هر ردیف(تومان)':'قیمت(تومان)'" rounded="lg" v-model="price" required type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <AddCategories @change="(data) => { selectedCategories = data }" :selected="selectedCategories"
                            url="/api/product/seller-panel/category-digital-product-list-create/" />
                    </v-col>
                </v-row>
                <v-file-input :loading="loadingImage" :disabled="loadingImage" rounded="lg" accept=".png,.jpg" :rules="rules" :required="id?imageIds.length!=0?false:true:true" multiple persistent-hint
                    variant="outlined" color="primary" @change="sendImage" v-model="images"
                    placeholder="Upload your documents" label="عکس‌">
                    <template v-slot:prepend>

                        <PhotoIcon style="margin-left: -20px;" class="  text-grey" />


                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary">
                                {{ fileName }}
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

                <v-combobox 
                    v-if="id==null"
                    rounded="lg" 
                    accept=".zip,.rar" 
                    persistent-hint 
                    variant="outlined" 
                    color="primary"
                    v-model="file_type" 
                    :disabled="id?true:false"
                    :label="id?get_file? 'فایل' : 'لایسنس اکانت کد یکتا':'انتخاب نوع محصول'" 
                    :items="['لایسنس اکانت کد یکتا', 'فایل']">
                </v-combobox>

                <v-file-input 
                    rounded="lg" 
                    accept=".zip,.rar" persistent-hint 
                    variant="outlined" 
                    color="primary"
                    v-if="id?get_file:file_type == 'فایل'" 
                    v-model="file" placeholder="اضافه کردن فایل" 
                    :label="id?'تعویض فایل محصول':'فایل محصول'">
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary">
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>

                    <a v-if="get_file" :href="get_file" class="d-flex justify-start w-100 ps-15">
                        دانلود فایل فعلی
                    </a>

                <v-file-input 
                    rounded="lg" 
                    accept=".csv" 
                    persistent-hint variant="outlined" 
                    color="primary"
                    v-if="id?get_file==null:file_type == 'لایسنس اکانت کد یکتا'" 
                    @change="handleCsvUpload" 
                    placeholder="اضافه لیست"
                    :label="id? 'اضافه کردن به لیست محصول': 'لیست محصول'">
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary">
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>
                <!-- Show CSV data -->


                <v-table fixed-header>
                    <tbody >
                        <tr v-for="items in transformedData" :key="items" class="p\y-2">
                            <td class="bg-grey-lighten-5 rounded-pill text-center" v-for="item in items">{{ item.title }}: {{ item.body }}</td>
                            <v-btn class="mt-2" icon="" color="red" variant="tonal" size="small"
                                @click="transformedData.splice(transformedData.indexOf(items), 1)">
                                <TrashIcon size="18" />
                            </v-btn>
                        </tr>
                    </tbody>
                </v-table>
                <v-table fixed-header>
                    <tbody v-if="subset_product">
                        <tr v-for="items in subset_product" :key="items" class="" >
                            <td class="bg-red-lighten-5 rounded-pill text-center" v-for="item in items.data">{{ item.title }}: {{ item.body }}</td>
                            <v-btn class="mt-2" icon="" color="red" variant="tonal" size="small"
                                @click="subset_product.splice(subset_product.indexOf(items), 1) ; removeSubsetProduct(items)">
                                <TrashIcon size="18" />
                            </v-btn>
                        </tr>
                    </tbody>
                </v-table>


                <v-alert v-if="file_type == 'لایسنس اکانت کد یکتا'" class="mt-2 rounded-lg" title="نکته"
                    text="برای ثبت لایسنس‌های خود، لطفاً فایل CSV را با دقت تکمیل کنید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند."></v-alert>
                <v-checkbox  v-model="pin_profile" color="primary"
                label="پین بودن در صفحه ی پروفایل شما"/>

                <v-checkbox v-model="discount" label="دارای تخفیف"></v-checkbox>
            </v-locale-provider>
            <v-slide-y-transition>
                <v-row v-if="discount" class="mt-1 mb-5 rtl">
                    <v-col cols="12" md="3">
                        <v-text-field label="درصد تخفیف" rounded="lg" v-model="value" :max="100" min="1" required type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col cols="12" md="9" hidden>
                        <v-slider label="" variant="outlined" color="primary" class="mt-3"
                            v-model="value" :min="0" :max="100" :step="1" thumb-label></v-slider>
                    </v-col>
                </v-row>
            </v-slide-y-transition>

            
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
            <v-btn rounded="lg" persistent-hint variant="outline" color="primary" :disabled="loadingImage"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" @click="$emit('cancel')">
                برگشت
            </v-btn>
        </form>
    </div>
</template>
<script>
import Papa from 'papaparse';
import { PhotoIcon, VideoIcon, FileImportIcon, TrashIcon } from 'vue-tabler-icons';
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import AddCategories from '@/components/section/product/AddCategories.vue';
export default {
    components: { PhotoIcon, VideoIcon, FileImportIcon, TrashIcon, AddCategories },
    emits:["close","cancel"],
    props: ["id"],
    data: () => ({
        price: 0,
        title: null,
        csvData: [],
        formattedDate:[],
        transformedData: [],
        description: null,
        images: [],
        imageIds: [],
        loadingImage: false,
        imagePreviews: [],
        categories: [],
        selectedCategories: [],
        file_type: null,
        subset_product : null,
        tab: null,
        discount: false,
        images: [],
        pin_profile:false,
        get_file: null,
        file: null,
        value: 0,
        body: '',
        editorOptions: {
            theme: "snow",
            rules: [
                files => !files || !files.some(file => file.size > 2_097_152) || 'Avatar size should be less than 2 MB!'
            ],
        },
    }),
    computed: {
        address(){
            return apiStore().address
        },
    },
    mounted() {
        this.id != null ? this.getData() : ''
    },
    methods: {
        handleTextChange(newText) {
            this.description = newText;
        },
        handleCsvUpload(event) {
            // Ensure a file was selected
            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0]; // Get the first file

            // Use FileReader to read the file
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;

                // Parse the CSV content
                Papa.parse(content, {
                    complete: (results) => {
                        this.csvData = results.data; // Assuming you want to store the raw data
                        this.transformedData = this.transformCSVData(results.data);
                        console.log(this.transformedData);
                        // Here you can update your data properties or methods as needed
                    },
                    header: true // This will use the first row as headers
                });
            };
            reader.readAsText(file);
        },
        removeSubsetProduct(item){
            axios.delete(`${apiStore().address}/api/product/seller-panel/remove-row-subset-digital-product/${item.id}`,{
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        })
        },
        transformCSVData(data) {
            return data.map(row => {
                return Object.keys(row).map(key => ({ title: key, body: row[key] }))
            })
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
                            console.log('upload image');
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
        // async sendData() {

        //     let  formDic = {}
        //     let formData = new FormData();
        //     // this.imageIds.forEach((element , index) => {
        //     //     formData.append(`image`, element);
        //     //     formDic[`image`] = element
        //     // });
        //     formDic[`image`] = this.imageIds
            
        //     // this.selectedCategories.forEach(element => {
        //     //     formData.append(`category`, element);
        //     // });
        //     console.log(this.transformedData);
        //     formDic[`title`] =  this.title
        //     formDic[`price`] =  this.price
        //     formDic[`subsets_data`] =  this.transformedData
        //     formDic[`description`] =  this.description
        //     formDic[`discount`] =  this.value

        //     if(this.file != null)   formDic[`file`] =  this.file[0]
        //         let header = {headers: {
        //             'Content-Type': 'multipart/form-data',
        //             Authorization: `Token ${useUserStore().userToken}`
        //         },}
        //         let url = this.id != null ? `/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/` : '/api/product/seller-panel/digital-product-list-create/'
        //         if(this.id != null ){
        //         await  axios.patch(`${apiStore().address}${url}`, formDic, header).catch(error => {
        //             // handle error
        //             console.error('Error:', error);
        //         });

        //     }  else {
        //         await  axios.post(`${apiStore().address}${url}`, formDic, header).catch(error => {
        //             // handle error
        //             console.error('Error:', error);
        //         });                                                                                                                 
        //     }
        //     this.$emit('close')

        // },
        async sendData() {
            let formData = new FormData();

            // Add files to formData
            if (this.file != null) {
                formData.append('file', this.file[0]);
            }

            // Add other fields to formData
            formData.append('title', this.title);
            formData.append('price', this.price);
            formData.append('description', this.description);
            formData.append('discount', this.value);
            formData.append('pin_profile', this.pin_profile);

            // Assuming this.transformedData is an array or object
            formData.append('subsets_data', JSON.stringify(this.transformedData));

            // Assuming this.imageIds is an array
            console.log('send data image ids list', this.imageIds);
            this.imageIds.forEach((element) => {
                formData.append('image', element);
            });
             this.selectedCategories.forEach(element => {
                formData.append(`category`, element);
            });


            // Set headers for multipart/form-data
            let header = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${useUserStore().userToken}`
                },
            };

            let url = this.id != null ? `/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/` : '/api/product/seller-panel/digital-product-list-create/';
            try {
                if (this.id != null) {
                    await axios.patch(`${apiStore().address}${url}`, formData, header);
                } else {
                    await axios.post(`${apiStore().address}${url}`, formData, header).then((response)=> {
                        this.$emit('close');
                    });
                }
                this.$emit('close');
            } catch (error) {
                console.error('Error:', error);
            }
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log('getData',response)
                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                this.pin_profile = response.data.pin_profile
                response.data.image.forEach(element => {

                    this.imageIds.push(element.id)
                });
                console.log('images', this.imageIds);
                response.data.category.forEach(element => {
                    this.selectedCategories.push(element.id)
                })
           
                console.log(this.categories);
                this.price = response.data.price
                this.value = response.data.discount
                this.get_file = response.data.file
                this.subset_product = response.data.subset_product
                if (response.data.discount) this.discount = true

            }
            )
        },
    },


}
</script>
