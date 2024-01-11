<template>



     <div>
        <v-tabs
    v-model="tab"
    align-tabs="center"
    color="primary"
    
    >
   
        <v-tab value="one">افزودن تکی </v-tab>
      <v-tab value="two">افزودن گروهی</v-tab>
   
    
</v-tabs>
        <v-window v-model="tab"  >
        <v-window-item value="one" style="overflow-y: scroll;">
            <form >        
                <v-locale-provider rtl  >
                    <v-text-field
                        label="نام"
                        rounded="lg"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        class="mt-10"/>
                    
                        </v-locale-provider>
                        <TextEditor
                            @update="handleTextChange" 
                        ></TextEditor>
                        <v-locale-provider rtl>
                    <v-text-field
                        label="قیمت"
                        rounded="lg"
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
                        clearable
                        chips
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                        multiple>
                    </v-autocomplete>

                    <v-file-input
                        rounded="lg"
                        accept=".png,.jpg"
                        :rules="rules"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        v-model="image"
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
                
                    <v-file-input
                        rounded="lg"
                        accept=".zip,.rar"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        
                        v-model="video"
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
        </v-window-item>

        <v-window-item value="two">
          
        
            <form >        
                <v-locale-provider rtl  >
                    <v-alert
                        class="mt-5 rounded-lg"
                        title="نکته"
                        text="برای ثبت لایسنس‌های خود، لطفاً فایل CSV را با دقت تکمیل کنید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند."
                    ></v-alert>
                    <v-text-field
                        label="نام"
                        rounded="lg"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        class="mt-10"/>
                </v-locale-provider>
                <TextEditor
                    @update="handleTextChange" 
                ></TextEditor>
                <v-locale-provider rtl>
                    <v-text-field
                        label="قیمت"
                        rounded="lg"
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
                        clearable
                        chips
                        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                        multiple>
                    </v-autocomplete>

                    <v-file-input
                        rounded="lg"
                        accept=".png,.jpg"
                        :rules="rules"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        v-model="image"
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

                    <v-file-input
                        rounded="lg"
                        accept=".csv"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        @change="handleCsvUpload"
                        v-model="video"
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
                </v-locale-provider>
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
                    <v-locale-provider rtl>

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
        </v-window-item>

      </v-window>
     </div>

</template>
<script>
import Papa from 'papaparse';
import {PhotoIcon, VideoIcon, FileImportIcon, TrashIcon} from 'vue-tabler-icons';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import TextEditor from '@/components/shared/TextEditor.vue';

  export default {
    components:{PhotoIcon, VideoIcon, FileImportIcon,TrashIcon, TextEditor, },
    computed: {
        tableHeaders() {
        return this.csvData.length > 0 ? Object.keys(this.csvData[0]) : [];
        }
    },
    methods: {
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

    },
    data: () => ({
        price: 0,
        title: null,
        csvData: [],
        description: null,
        images: [],
        imageIds : [],
        loadingImage:false,
        imagePreviews: [], 
        categories: [],
        selectedCategories: [],

        tab: null,
        discount: false,
        image: null,
        video: null,
        value: 0,
        body: '',
        editorOptions: {
        theme: "snow",
        rules: [
            files => !files || !files.some(file => file.size > 2_097_152) || 'Avatar size should be less than 2 MB!'
        ],
      },
    }),
    
  }
</script>
