<template>
     <div>
        {{ selectedCategories }}
        {{ categories }}
        <form  @submit.prevent="sendData" >        
            <v-locale-provider rtl  >
                <v-text-field
                    label="نام"
                    rounded="lg"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    class="mt-10"
                    v-model="title"
                    required/>
                    </v-locale-provider>
                    <TextEditor
                        @update="handleTextChange" 
                    ></TextEditor>
                    <v-locale-provider rtl>
                <v-text-field
                    label="قیمت"
                    rounded="lg"
                    v-model="price"
                    required
                    type="number"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    class="mt-5"/>
        
                <v-autocomplete
                    label="دسته بندی‌ها"
                    rounded="lg"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    class="mt-5"
                    v-model="selectedCategories"
                    clearable
                    chips
                    :items="categories"
                    multiple>
                </v-autocomplete>

                <v-file-input
                    rounded="lg"
                    accept=".png,.jpg"
                    :rules="rules"
                    required
                    multiple
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    @change="sendImage"
                    v-model="images"
                    placeholder="Upload your documents"
                    label="عکس‌"
                >
                    <template v-slot:prepend>
                    
                        <PhotoIcon style="margin-left: -20px;" class="  text-grey" />

                        
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
                <div class="image-preview-container">
                    <template v-for="(preview, index) in imagePreviews" :key="index">
                            <img :src="preview" class="chip-image-preview" />
                    </template>
                </div>

                <v-combobox
                    rounded="lg"
                    accept=".zip,.rar"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    v-model="file_type"
                    label="انتخاب نوع فایل"
                    :items="['لیست لایسنس‌ها', 'فایل زیپ']"
                ></v-combobox>

                <v-file-input
                    rounded="lg"
                    accept=".zip,.rar"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    v-if="file_type=='فایل زیپ'"
                    v-model="file"
                    placeholder="اضافه کردن فایل"
                    label="فایل محصول"
                    >
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
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
                <v-file-input
                        rounded="lg"
                        accept=".csv"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        v-if="file_type=='لیست لایسنس‌ها'"
                        @change="handleCsvUpload"
                        v-model="file"
                        placeholder="اضافه لیست"
                        label="لیست محصول"
                        >
                        <template v-slot:prepend>
                            <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
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
                <v-table
                v-if="csvData.length!=0"
                fixed-header
                height="300px"
                dense>
                    <thead>
                        <tr>
                            <th v-for="(header, index) in tableHeaders" :key="index" class="text-left">
                            {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in csvData" :key="row.id">
                            <td v-for="(value, key) in row" :key="key">{{ value }}</td>
                            <td class="text-center">
                                <v-avatar 
                                    small 
                                    color="red" 
                                    @click="deleteRow(index)"
                                    variant="tonal">
                                    <TrashIcon class="text-red"/>
                                </v-avatar>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <v-alert
                    v-if="file_type=='لیست لایسنس‌ها'"
                    class="mt-2 rounded-lg"
                    title="نکته"
                    text="برای ثبت لایسنس‌های خود، لطفاً فایل CSV را با دقت تکمیل کنید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند."
                ></v-alert>

                <v-checkbox
                    v-model="discount"
                    label="دارای تخفیف"
                ></v-checkbox>
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
                
                class="mx-2 px-10 text-body2 font-weight-bold mb-5"
                type="submit">
                ثبت
            </v-btn>
        </form>
     </div>
</template>
<script>
import Papa from 'papaparse';
import {PhotoIcon, VideoIcon, FileImportIcon, TrashIcon} from 'vue-tabler-icons';
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import TextEditor from '@/components/shared/TextEditor.vue';

  export default {
    components:{PhotoIcon, VideoIcon, FileImportIcon,TrashIcon, TextEditor, },
    props:["data"],
    data: () => ({
        price: 0,
        title: null,
        csvData: [],
        formattedDate:[],
        description: null,
        images: [],
        imageIds : [],
        loadingImage:false,
        imagePreviews: [], 
        categories: [],
        selectedCategories: [],
        file_type : null,
        tab: null,
        discount: false,
        images: [],
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
        tableHeaders() {
        return this.csvData.length > 0 ? Object.keys(this.csvData[0]) : [];
        }
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        convertDataToHtmlFormattedStrings() {
            return this.csvData.map(row => {
            // Dynamically constructing the string with all keys in the row object
            let formattedString = Object.keys(row).map(key => {
                // Assuming row[key] is the value for each column
                // Replace 'key' with your logic to transform key names if necessary
                return `${key}: ${row[key]}`;
            }).join('<br>'); // Joining all key-value pairs with HTML line breaks
            console.log(formattedString);
            this.formattedDate.push(formattedString);
            });
        },
        handleTextChange(newText) {
          this.body = newText;
        },
        deleteRow(index) {
            this.csvData.splice(index, 1);
        },
        handleCsvUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = (e) => {
                    Papa.parse(e.target.result, {
                        complete: (result) => {
                            this.csvData = result.data;
                        },
                        header: true,
                        skipEmptyLines: true,
                        error: (error) => {
                            console.error('Error parsing CSV:', error);
                        }
                    });
                };
                reader.onerror = (error) => {
                    console.error('Error reading file:', error);
                };
            }
        },
        async fetchCategories() {
            try {
                const userToken = useUserStore().userToken; // Get the token from your user store
                const response = await axios.get(`${apiStore().address}/api/product/list-digital-categories/`, {
                    headers: {
                        Authorization: `Token ${userToken}`
                    }
                });
                console.log('aspc',response.data);
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
                    axios.post(`${apiStore().address}/api/product/admin/add-image/`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${useUserStore().userToken}`
                    },
                    }).then((data) => {
                        console.log('upload image');
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
            this.convertDataToHtmlFormattedStrings()
            let formDic = {}
            formDic['category'] = this.selectedCategories
            formDic['image'] = this.imageIds
            formDic['title'] = this.title
            formDic['file'] = this.file
            formDic['list_subsets'] = this.formattedDate
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value

            axios.post(`${apiStore().address}/api/product/admin/digital-product-list-create/`, formDic, {
                headers: {
                "Content-type": "application/json",
                Authorization: `Token ${useUserStore().userToken}`
                },
            })
            .then(response => {
             
                // this.$emit('close')
            })
            .catch(error => {
                // handle error
                console.error('Error:', error);
            });
        },
    },
    
    
  }
</script>
