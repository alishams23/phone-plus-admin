<template>
    
    <v-container>
        <v-row align="center">
            <v-col cols="4">
                <v-locale-provider rtl>
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
                            <SortDescending2Icon />
                        </v-btn>       
                    </template>
                    </v-text-field>
                </v-locale-provider>
            </v-col>
            <v-col cols="8" class="rtl d-flex align-center">
                <v-avatar color="primary" rounded="lg" size="50">
                    <ArticleIcon/>
                </v-avatar>
                <div class=" px-5 font-weight-bold text-h4">
                    وبلاگ 
                </div> 
            </v-col>
        </v-row>
        <v-locale-provider rtl>
            <v-row>
                <v-col  v-for="blog in blogs"
                :key="blog.id" cols="4">
                <v-card
                :loading="loading"
                    elevation="10"
                    rounded="lg"
                    class="mx-auto my-5"
                    max-width="350">
                    <template v-slot:loader="{ isActive }">
                        <v-progress-linear
                            :active="isActive"
                            color="deep-purple"
                            height="4"
                            indeterminate
                        ></v-progress-linear>
                    </template>
                    <v-img
                        cover
                        height="250"
                        :src="blog.image">
                    </v-img>
                    <v-card-item>
                        <v-card-title>{{blog.title}}</v-card-title>

                        
                    </v-card-item>
                    <v-card-text>
                        <v-row
                            align="center"
                            class="mx-0"
                            >
                            <v-rating
                                :model-value="4.5"
                                color="amber"
                                density="compact"
                                half-increments
                                readonly
                                size="small"
                            ></v-rating>
                        </v-row>
                        <div>{{blog.description}}</div>
                    </v-card-text>
                    <v-divider class="mx-4 mb-1"></v-divider>
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
                </v-card>      
            </v-col>
        </v-row>    
    </v-locale-provider>
    </v-container>
</template>
<script>
import {PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, ArticleIcon } from 'vue-tabler-icons';

import image_1 from '@/assets/images/blog/1.png';
import image_2 from '@/assets/images/blog/2.png';
import image_3 from '@/assets/images/blog/3.png';
import image_4 from '@/assets/images/blog/4.png';
import AddService from '@/pages/services/add_service.vue';

export default {
 components:{
    PencilIcon,
    PlusIcon,
    SortDescending2Icon,
    BoxIcon,
    SearchIcon,
    FilterCogIcon,
    ArticleIcon,
    AddService
 },
 data() {
   return {
     blogs: [
    {
        id: 1,
        title: 'اهمیت بلاگ در تبلیغات آنلاین',
        description: 'بلاگ یک ابزار بسیار موثر برای تبلیغات آنلاین است. از طریق بلاگ می‌توانید محتوای ارزشمندی ...',
        image: image_1,
    },
    {
        id: 2,
        title: 'چگونه یک بلاگ موفق راه‌اندازی کنیم؟',
        description: 'راه‌اندازی یک بلاگ موفق نیاز به برنامه‌ریزی دقیق و تولید محتوای جذاب دارد. در ...',
        image: image_2,
    },
    {
        id: 3,
        title: 'چگونه برای بلاگ نویسی موفق محتوای عالی ایجاد کنیم؟',
        description: 'محتوای عالی کلید موفقیت بلاگ نویسی است. در این مقاله، به راهکارها و تکنیک‌هایی برای ا...',
        image: image_3,
    },
    {
        id: 4,
        title: 'سؤالات متداول در مورد بهینه‌سازی برای موتورهای جستجو',
        description: 'بهینه‌سازی مطالب برای موتورهای جستجو یکی از اصول مهم برای جلب ترافیک آگاهانه به وب‌سایت شماست ... ',
        image: image_4,
    }
       // ... اضافه کردن سایر خدمات
     ],
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
 