<template>
    <form >        
        <v-locale-provider rtl  >
            <v-text-field
                label="نام محصول"
                rounded="lg"
                persistent-hint
                variant="outlined"
                color="primary"
                class="mt-10"/>
            
            <v-text-field
                label="توضیحات محصول"
                rounded="lg"
                persistent-hint
                variant="outlined"
                color="primary"
                class="mt-5"/>
            <v-text-field
                label="قیمت محصول"
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
                persistent-hint
                variant="outlined"
                color="primary"
                v-model="images"
                placeholder="Upload your documents"
                label="عکس‌های محصول"
                multiple
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
  export default {
    components:{PhotoIcon, VideoIcon},
    data: () => ({
        discount: false,
        images: [],
        video: null,
        value: 0,
    }),
  }
</script>