<template>
    <v-row v-if="loading ==false">
        <v-col cols="12" lg="3" sm="6"  v-for="item in data.slice(-4)" :key="item.title">
          
            <v-card elevation="10" class="rtl" rounded="lg">
                <RouterLink :to="'/'">
                    <v-img :src="item.image[0].photo" height="100%" class="rounded-t-md"></v-img>
                </RouterLink>
                <div class="d-flex justify-end ml-4 mt-n5 " >
                  <v-dialog width="900" >
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn size="40" icon class="bg-primary d-flex" v-bind="activatorProps"
                          >
                          <v-avatar size="30" class="text-white">
                              <PencilIcon size="15" />
                          </v-avatar>
                          <v-tooltip
                              activator="parent"
                              location="bottom"
                              >ویرایش
                          </v-tooltip>
                      </v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card class="px-3 px-md-15 rounded-lg my-20 " title="">
                        <AddChangeProduct :id="item.id" @close="searchData()" />
                      </v-card>
                    </template>
                  </v-dialog>                                                                                                               
                
                   
                </div>
                <v-card-item  class="pt-0">
                    <v-card-title class="text-h6" v-text="item.title"></v-card-title>
                    <div class="d-flex align-center justify-space-between mt-1">
                        <div>
                            <span class="text-h6" v-text=" item.price"></span>
                            <span class="text-body-1 ml-2 text-medium-emphasis text-decoration-line-through" v-text="item.salesPrice"></span>
                        </div>
                        <v-rating density="compact" color="warning" size="small" v-model="item.rating" readonly></v-rating>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>

import {TrashIcon, PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon} from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import AddChangeProduct from '@/components/section/AddChangeProduct.vue';

import axios from "axios";

export default {
  components: {
    PencilIcon,
    PlusIcon,
    SortDescending2Icon,
    SortAscending2Icon,
    BoxIcon,
    SearchIcon,
    FilterCogIcon,
    TrashIcon,
    AddChangeProduct
  },
  name: "ProductCard",
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
      axios.get(`${apiStore().address}/api/product/admin/products-list-search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
        this.loading = false
        this.data = response.data
      })
    },removeItem(id){
      this.loadingItem = id
      axios.delete(`${apiStore().address}/api/product/admin/product-retrieve-update-destroy/${id}/`, {
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