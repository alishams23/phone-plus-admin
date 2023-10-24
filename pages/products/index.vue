<template>
   <v-container>
    <v-card elevation="10" v-for="n in 10" rounded="lg" class="my-8 rtl">
        <div class="d-flex flex-no-wrap justify-space-between">
            <div class="pa-5 d-flex align-start  flex-column ">
              <v-card-title class="text-h5 font-weight-bold">
                لپ تاپ ویژه
              </v-card-title>

              <div>
                
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi natus, soluta temporibus deleniti maxime neque ipsa hic sed, sint enim sunt esse quasi. Ad impedit, iste perspiciatis eius nisi minus!
              </div>

              <v-card-actions class="mt-auto">
                <v-btn
                  class=" px-10"
                  variant="flat"
                  rounded="xl"
                  color="primary"
                  
                >
                  ادیت
                  <template v-slot:append>
                    <PencilIcon size="15" />
                </template>
                </v-btn>
              </v-card-actions>
            </div>

            <v-avatar
              class=""
              size="230"
              rounded="0"
            >
              <v-img src="https://cdn.vuetifyjs.com/images/cards/foster.jpg"></v-img>
            </v-avatar>
          </div>

    </v-card>
   </v-container>
   <VLayoutItem model-value position="bottom" class="text-end"  size="88">
    <div class="ma-4">
      <v-btn  size="large" icon="" color="primary" elevation="8" >
        
          
                <PencilIcon/>
         
      
      </v-btn>
    </div>
  </VLayoutItem>
  </template>
  
  <script>
import { PencilIcon } from 'vue-tabler-icons';

  export default {
    components:{
        PencilIcon
    },
    name: "ProductCard",
    data() {
      return {
        productImage: "@/assets/images/products/s4.jpg",
      };
    },
  };
  </script>
  
  <style scoped>
  .product-image {
    height: 200px; /* Adjust the height as needed */
  }
  </style>
  