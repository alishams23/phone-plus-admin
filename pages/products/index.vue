<template>
  <v-container>

    <v-snackbar
      :timeout="2000"
      color="success"
      elevation="24"
       v-model="snackbar_edit">
      <div class="w-100 rtl">
        <p>محصول با موفقیت ویرایش شد</p>
      </div>
      <template v-slot:actions>
        <!-- <v-btn
          color="red"
          variant="text"
          @click="snackbar_edit = false">
          <XIcon/>
        </v-btn> -->
      </template>
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="success"
      elevation="24"
       v-model="snackbar_save">
      <div class="w-100 rtl">
        <p>محصول با موفقیت ثبت شد</p>
      </div>
      <template v-slot:actions>
        <!-- <v-btn
          color="red"
          variant="text"
          @click="snackbar_save = false">
          <XIcon/>
        </v-btn> -->
      </template>
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="red"
      elevation="24"
       v-model="snackbar_delete">
      <div class="w-100 rtl">
        <p>محصول با موفقیت حذف شد</p>
      </div>
      <template v-slot:actions>
        <!-- <v-btn
          color="red"
          variant="text"
          @click="snackbar_delete = false">
          <XIcon/>
        </v-btn> -->
      </template>
    </v-snackbar>

    <v-row align="center" class="rtl">
      <v-col cols="12" md="8" class="rtl d-flex align-center">
        <v-avatar color="primary" rounded="lg" size="50">
          <BoxIcon />
        </v-avatar>
        <div class=" px-5 font-weight-bold text-h4">
          محصولات
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-locale-provider rtl>
          <v-text-field v-model="search_text" @update:model-value="searchData" label="جستجو" rounded="lg"
            persistent-hint variant="outlined" color="primary" dense class="mt-md-5 text-body-2">

            <template v-slot:prepend>
              <v-btn @click="order = !order; searchData()" variant="tonal" color="primary" rounded="lg" size="50">
                <SortDescending2Icon v-if="order" />
                <SortAscending2Icon v-if="!order" />
              </v-btn>
            </template>
          </v-text-field>
        </v-locale-provider>
      </v-col>

    </v-row>
    <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
      border="start" class="rtl border-opacity-100 my-10">
      <div class="text-sm  font-weight-black irsa">
        محصولی وجود ندارد
      </div>
    </v-alert>
    <v-row>
      <v-col v-for="product in data" v-if="!loading" :key="product.id" cols="12" md="6">
        <v-card elevation="10" rounded="lg" class="my-5 rtl " :loading="loadingItem == product.id">
          <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
          </template>
          
            <v-row >
              <v-col cols="12" md="4" rounded="0">
                <v-img height="175px" :src="product.image[0].photo" cover></v-img>
              </v-col>  
              <v-col cols="12" md="8">
                <div class="d-flex ">
                  <div class=" d-flex flex-column flex-fill ">
                    <v-card-item>
                      <v-card-title class="text-h6 ">{{ product.title }}</v-card-title>
                      <div v-html="product.description" class="text-line-1  text-body-2"></div>
                    </v-card-item>

                    <v-card-actions class="mt-auto mr-auto px-10">
                      <v-dialog width="900" >
                        <template v-slot:activator="{ props: activatorProps }">
                          <div class="ma-4">
                            <v-btn class="px-10 ml-4" v-bind="activatorProps" variant="flat" rounded="xl" size="small"
                            color="primary">
                            ویرایش
                            <template v-slot:append>
                              <PencilIcon size="15" />
                            </template>
                          </v-btn>
                          </div>
                        </template>
                        <template v-slot:default="{ isActive }">
                          <v-card class="px-3 px-md-15 rounded-lg my-20 " title="">
                            <AddProduct :id="product.id" @close="open = false; searchData();snackbar_edit = true" />
                          </v-card>
                        </template>
                        
                      </v-dialog>                                                                                                               
                    
                      <v-avatar size="30" variant="tonal" @click="removeItem(product.id);snackbar_delete = true" color="red-darken-2" icon="">
                        <TrashIcon size="15" />
                      </v-avatar>
                    </v-card-actions>
                  </div>
                </div>
              </v-col>

            </v-row>
       
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
    <v-dialog width="900" v-model="open">
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
        <v-card class="px-3 px-md-15 rounded-lg my-20 " title="">
          <AddProduct @close="open = false; searchData();;snackbar_save = true" />
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
import { TrashIcon, PencilIcon, PlusIcon, BoxIcon, XIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon } from 'vue-tabler-icons';

import AddProduct from '@/components/section/AddChangeProduct.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";

export default {
  components: {
    XIcon,
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
      search_text: '',
      order: false,
      loadingItem: 0,
      open: false,
      snackbar_edit:false,
      snackbar_save:false,
      snackbar_delete:false

    };
  },

  methods: {

    searchData() {
      this.loading = true
      axios.get(`${apiStore().address}/api/product/seller-panel/products-list-search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
        this.loading = false
        this.data = response.data
      })
    },
    removeItem(id) {
      this.loadingItem = id
      axios.delete(`${apiStore().address}/api/product/seller-panel/product-retrieve-update-destroy/${id}/`, {
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
  }, 
  async mounted() {
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
