<template>
  <v-container>
    <v-row align="center">
      <v-col cols="4">
        <v-locale-provider rtl  >
        <v-text-field
        label="جستجو"
        rounded="lg"
        persistent-hint
        variant="outlined"
        color="primary"
        dense
        
       class="mt-5 text-body-2">
        <template v-slot:prepend-inner>
      
            <SearchIcon color="gray" />

          
        </template>
        <template v-slot:prepend>
          <v-btn v-bind="props" variant="tonal" color="primary"  rounded="lg" size="50"  >
            <SortDescending2Icon v-if="order" />              
            <SortAscending2Icon  v-if="!order"/>
          </v-btn>       
        </template>
        </v-text-field>
        </v-locale-provider>
      </v-col>
      <v-col cols="8" class="rtl d-flex align-center">
          <v-avatar color="primary" rounded="lg" size="50">
            <BoxIcon/>
          </v-avatar>
          <div class=" px-5 font-weight-bold text-h4">
            خدمات
          </div> 
      </v-col>
    </v-row>
    <v-row>
      <v-col  v-for="product in products"
      :key="product.id" cols="6">
        <v-card
        elevation="10"
        rounded="lg"
        class="my-5 rtl mx-3"
      >
          <div class="d-flex flex-no-wrap justify-space-between">
              <div class="pa-5 d-flex align-start flex-column ">
                <v-card-title class="text-h5 font-weight-bold">
                  {{ product.name }}
                </v-card-title>
                <v-card-text class="text-line-1">
                  {{ product.description }}
                </v-card-text>
                <v-card-actions class="mt-auto">
                  <v-btn
                    class="px-10"
                    variant="flat"
                    rounded="xl"
                    color="primary"
                  >
                    ویرایش
                    <template v-slot:append>
                      <PencilIcon size="15" />
                    </template>
                  </v-btn>
                </v-card-actions>
              </div>
              <v-avatar
                size="230"
                rounded="0"
              >
                <v-img :src="product.image"></v-img>
              </v-avatar>
          </div>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
   
    <v-dialog width="500">
  <template v-slot:activator="{ props }">
    <div class="ma-4">
      <VBtn v-bind="props"  icon="" size="large" color="primary" elevation="8" >
        <v-icon>
          <PlusIcon />
        </v-icon>
      </VBtn>
    </div>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card class="px-15 rounded-lg my-20 " title="">
      <AddService />
    </v-card>
  </template>
</v-dialog>
  </VLayoutItem>
</template>
<script>
import { PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon } from 'vue-tabler-icons';
import adsl from '@/assets/images/services/adsl.png';
import telephone from '@/assets/images/services/telephone.png';
import payment from '@/assets/images/services/payment.jpg';
import security from '@/assets/images/services/security.jpg';
import management from '@/assets/images/services/management.png';
import AddService from '@/pages/services/add_service.vue';

export default {
  components:{
    PencilIcon,
    PlusIcon,
    SortDescending2Icon,
    SortAscending2Icon,
    BoxIcon,
    SearchIcon,
    FilterCogIcon,
    AddService
  },
 name: "ProductCard",
 data() {
   return {
     products: [
    {
      id: 1,
      name: 'خدمات اینترنت پرسرعت',
      description: 'ارائه اینترنت پرسرعت با پوشش و سرعت مناسب به مشتریان شما.',
      image: adsl
    },
    {
      id: 2,
      name: 'خدمات تلفنی',
      description: 'مکالمات تلفنی با کیفیت صدا بالا و خدمات مخابراتی بین‌المللی.',
      image: telephone
    },

    {
      id: 3,
      name: 'خدمات پرداخت موبایلی',
      description: 'پرداخت‌های موبایلی و انجام تراکنش‌های مالی از طریق گوشی‌های همراه.',
      image: payment
    },
    {
      id: 4,
      name: 'خدمات امنیت موبایل',
      description: 'محافظت از داده‌ها و اطلاعات حساس در گوشی‌های همراه با خدمات امنیتی.',
      image: security
    },
    {
      id: 5,
      name: 'خدمات مدیریت حساب کاربری',
      description: 'مدیریت حساب کاربری و پروفایل مشتریان به صورت آنلاین و از طریق اپلیکیشن موبایل.',
      image: management
    },
       // ... اضافه کردن سایر خدمات
     ],
     order : false,
   };
 },
};
</script>

<style scoped>
.product-image {
 height: 200px; /* Adjust the height as needed */
}
.text-line-1 {
 display: block;/* or inline-block */
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
}
</style>
