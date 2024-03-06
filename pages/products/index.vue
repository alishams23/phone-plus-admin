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
          <BoxIcon />
        </v-avatar>
        <div class=" px-5 font-weight-bold text-h4">
          محصولات
        </div>
      </v-col>
    </v-row>
    <v-alert v-if="data.length == 0 && loading == false"  color="primary" icon="fa fa-info" variant="tonal" border="start"  class="rtl border-opacity-100 my-10">
      <div class="text-sm  font-weight-black irsa">
      محصولی وجود ندارد
    </div>
    </v-alert>
    <v-row>
      <v-col v-for="product in data" v-if="!loading" :key="product.id" cols="6">
        <v-card elevation="10" rounded="lg" class="my-5 rtl mx-3"
        :loading="loadingItem == product.id"
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div class="pa-5 d-flex align-start flex-column ">
              <v-card-title class="text-h5 font-weight-bold">
                {{ product.title }}
              </v-card-title>
              <v-card-text class="text-line-1">
                <div v-html=" product.description">
                </div>
              </v-card-text>
              <v-card-actions class="mt-auto">
                <v-btn :to="'/products/' +product.id " class="px-10" variant="flat" rounded="xl" color="primary">
                  ویرایش
                  <template v-slot:append>
                    <PencilIcon size="15" />
                  </template>
                </v-btn>
                <v-avatar
                size="30"
                variant="tonal"
                class="mx-3"
                @click="removeItem(product.id)"
              
                color="red-darken-2"
                icon=""
                
            >
                
               
                <TrashIcon size="15"  />
         
            </v-avatar>
              </v-card-actions>
            </div>
            <v-avatar size="230" rounded="0">
              <v-img :src="product.image[0].photo" cover></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
    <v-dialog width="900">
      <template v-slot:activator="{ props }">
        <div class="ma-4">
          <VBtn v-bind="props" icon="" size="large" color="primary" elevation="8">
            <v-icon>
              <PlusIcon />
            </v-icon>
          </VBtn>
        </div>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card class="px-15 rounded-lg my-20 " title="">
          <AddProduct />
        </v-card>
      </template>
    </v-dialog>
  </VLayoutItem>
  <div class="d-flex justify-center">
      <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="7" color="primary"
        indeterminate></v-progress-circular>
    </div>
</template>
<script>
import {TrashIcon, PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon} from 'vue-tabler-icons';
import proimg1 from '@/assets/images/products/s4.jpg';
import proimg2 from '@/assets/images/products/s5.jpg';
import AddProduct from '@/pages/products/add_product.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
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
    AddProduct
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
      axios.get(`${apiStore().address}/api/product/Products_list_admin_search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
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
      axios.delete(`${apiStore().address}/api/product/ProductRemove/${id}/`, {
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
  height: 200px;
  /* Adjust the height as needed */
}

.text-line-1 {
  display: block;
  /* or inline-block */
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
}
</style>
