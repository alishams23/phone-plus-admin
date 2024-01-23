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
                :key="blog.id" cols="12">
                <v-card
                :loading="loadingItem == blog.id"
                    elevation="10"
                    rounded="xl"
                    class="  "
                   >
                    <template v-slot:loader="{ isActive }">
                        <v-progress-linear
                            :active="isActive"
                            color="deep-purple"
                            height="4"
                            indeterminate
                        ></v-progress-linear>
                    </template>
                   <div class="d-flex ">
                  <div>
                    <v-img
                    height="170"
                    width="250"
                    cover
                    :src="blog.imageBlog.photo">
                </v-img>
                  </div>
             <div class=" d-flex flex-column flex-fill ">
              <v-card-item>
                <v-card-title class="text-h6 ">{{blog.title}}</v-card-title>
                 <div v-html="blog.body" class="text-line-1  text-body-2"></div>
                
            </v-card-item>
                              
  
            <v-card-actions class="mt-auto mr-auto px-10" >
                <v-btn
                    class="px-10 ml-4"
                    variant="flat"
                    :to="'/blog/'+ blog.id"
                    rounded="xl"
                    size="small"
                    color="primary"
                >
                    ویرایش
                    <template v-slot:append>
                    <PencilIcon size="15" />
                    </template>
                </v-btn>
                <v-avatar
                size="30"
                variant="tonal"
                @click="removeItem(blog.id)"
              
                color="red-darken-2"
                icon=""
                
            >
                <TrashIcon size="15"  />
            </v-avatar>
            <v-sheet class="px-3  text-body-2" >
              {{blog.updated_at}}
            </v-sheet>
            </v-card-actions>
             </div>
                   </div>
                </v-card>      
            </v-col>
        </v-row>    
    </v-locale-provider>
    </v-container>
    <VLayoutItem model-value position="bottom" class="text-end" size="88">
      <VBtn to="/blog/add_blog" icon="" size="large" color="primary" elevation="8">
        <v-icon>
          <PlusIcon />
        </v-icon>
      </VBtn>
      </VLayoutItem>
</template>
<script>
import {PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon, ArticleIcon,TrashIcon } from 'vue-tabler-icons';


import AddBlog from '@/pages/blog/add_blog.vue';
import axios from "axios";
import ShowTextEditor from '~/components/shared/ShowTextEditor.vue';
import { useUserStore } from '~/store/user';

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
    AddBlog,
    ShowTextEditor,
    TrashIcon
 },
 data() {
   return {
        data: [],
        loading: true,
        search_text:'', 
        order : false,
        loadingItem : 0,
   };
 },
 methods: {
    searchData() {
      this.loading = true
      axios.get(`http://127.0.0.1:8000/api/blog/Blog_List/?search=${this.search_text}&ordering=${this.order == false ? '-id' : 'id'}`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
        this.loading = false
        this.data = response.data.results
      })
    }
    ,removeItem(id){
      this.loadingItem = id
      axios.delete(`http://127.0.0.1:8000/api/blog/BlogRemove/${id}/`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
       
        this.searchData()
        this.loadingItem = 0
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
 