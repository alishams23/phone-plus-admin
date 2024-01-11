<script >
import {PhotoIcon,  } from 'vue-tabler-icons';

export default {
    
    components:{PhotoIcon,},
    methods: {
   
    },
    data: () => ({
        first_name: null,
        last_name: null,
  
        images: [],
    
        loadingImage:false,
        imagePreviews: [], 


  
        image: null,
     
        
       
       
    }),}
</script>
<template>
    <v-container>
        <form  >      
            <v-locale-provider rtl  >
                <v-text-field
                    label="نام فروشگاه"
                    v-model="shopName"
                    rounded="lg"
                    required
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    class="mt-10"/>
                
     
   
            <v-row class="mt-5 mb-5">
            <v-col>
                <v-text-field
                label=" نام"
                v-model="first_name"
                required
                rounded="lg"
               
                persistent-hint
                variant="outlined"
                color="primary"
                />
            </v-col>
            <v-col>
                <v-text-field
                label=" نام خانوادگی"
                v-model="last_name"
                required
                rounded="lg"
               
                persistent-hint
                variant="outlined"
                color="primary"
                />
    
            </v-col>
            </v-row>
           
    
            <v-file-input
                rounded="lg"
                accept=".png,.jpg"
                persistent-hint
                required
             
                variant="outlined"
                :disabled="loadingImage"
                color="primary"
                v-model="images"
                placeholder="Upload your documents"
                label="عکس‌ پروفایل فروشگاه"
                
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
          
    
            </v-locale-provider>
    
     
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
  
    </v-container>
</template>
