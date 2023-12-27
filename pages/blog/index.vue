<template>
    
    <v-container>
        <v-row align="center">
            <v-col cols="4">
                <v-locale-provider rtl>
                <v-text-field v-model="search_text" @update:model-value="searchData" label="جستجو" rounded="lg" persistent-hint variant="outlined" color="primary" dense
                    class="mt-5 text-body-2">
                    <template v-slot:prepend-inner>

                    <SearchIcon color="gray" />
                    </template>
                    <template v-slot:prepend>
                    <v-btn @click="order = !order;searchData()"  variant="tonal" color="primary" rounded="lg" size="50">
                        <SortDescending2Icon v-if="order" />              
                        <SortAscending2Icon  v-if="!order"/>
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
        <div class="d-flex justify-center">
        <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="7" color="primary"
            indeterminate></v-progress-circular>
        </div>
        <v-alert v-if="data.length == 0 && loading == false"  color="primary" icon="fa fa-info" variant="tonal" border="start"  class="rtl border-opacity-100 my-10">
            <div class="text-sm  font-weight-black irsa">
            محصولی وجود ندارد
            </div>
        </v-alert>
        <v-locale-provider rtl>
            <v-row>
                <v-col  v-for="blog in data"
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
import {PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon, ArticleIcon } from 'vue-tabler-icons';

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
    SortAscending2Icon,
    BoxIcon,
    SearchIcon,
    FilterCogIcon,
    ArticleIcon,
    AddService
 },
 data() {
   return {
        data: [],
        loading: true,
        search_text:'', 
        order : false,
   };
 },
 methods: {
    searchData() {
      this.loading = true
      axios.get(`http://192.168.1.107:8000/api/product/Products_list_admin_search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
        this.loading = false
        this.data = response.data
      })
    }
  }, async mounted() {
    this.searchData()
  }
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
 