<template>
    <form >        
        <v-locale-provider rtl  >
            <v-text-field
                label="نام"
                rounded="lg"
                persistent-hint
                variant="outlined"
                color="primary"
                class="mt-10"/>
            
            <v-text-field
                label="توضیحات"
                rounded="lg"
                persistent-hint
                variant="outlined"
                color="primary"
                class="mt-5"/>

                <vue3-editor
                class="bg-white"
                v-model="body"
                :editorOptions="editorOptions"
              ></vue3-editor>
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
</template>
<script>
import {PhotoIcon, VideoIcon } from 'vue-tabler-icons';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
  export default {
    components:{PhotoIcon, VideoIcon},
    data: () => ({
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