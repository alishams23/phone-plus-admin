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
          محصولات فیزیکی
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-locale-provider rtl>
          <v-text-field v-model="search_text" @update:model-value="searchData" label="جستجو" rounded="lg"
            persistent-hint variant="outlined" color="primary" dense class="mt-md-5 text-body-2">

            <template v-slot:prepend>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    @click="order = !order; searchData()"
                    variant="tonal"
                    color="primary"
                    rounded="lg"
                    size="50"
                  >
                    <SortDescending2Icon v-if="order" />
                    <SortAscending2Icon v-if="!order" />
                  </v-btn>
                </template>
                <span>{{ order ? 'به ترتیب قدیمی ترین' : 'به ترتیب جدید ترین' }}</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-locale-provider>
      </v-col>

    </v-row>
    <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
      border="start" class="rtl border-opacity-100 my-10">
      <div class="text-sm  irsa">
        محصولی وجود ندارد
      </div>
    </v-alert>
    <v-row dir="rtl">
      <v-col v-for="product in data" v-if="!loading" :key="product.id" cols="12" md="6">
        <v-card elevation="10" rounded="lg" class=" rtl " :loading="loadingItem == product.id">
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
                      <div v-html="product.plain_description" class="text-line-1  text-body-2"></div>
                    </v-card-item>



                    <v-card-actions class="mt-auto d-flex flex-wrap justify-end mr-auto px-3">
                    
                      
                    
                      <v-dialog persistent width="1000"  :fullscreen="isBelowMd">
                        <template v-slot:activator="{ props: activatorProps }">
                          <div class="ma-4">
                            <v-btn class="px-5" v-bind="activatorProps" variant="flat" rounded="xl" size="small"
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
                            <AddProduct :id="product.id"  @cancel="searchData()" @close="open = false; searchData();snackbar_edit = true" />
                          </v-card>
                        </template>
                        
                      </v-dialog>      
                      <a :href="`${address}/p/product/${product.slug}`" target="_blank" rel="noopener noreferrer">
                        <v-avatar size="30" variant="tonal" class="cursor-pointer ml-4" color="primary">
                          <EyeIcon size="15" />
                        </v-avatar>
                      </a>                                                                                                         
                      <SharedConfirmationDialog @delete-item="removeItem(product.id);snackbar_delete = true">

                        <v-btn size="30" class="cursor-pointer ml-4" variant="tonal" color="red-darken-2" icon="">
                        <TrashIcon size="15" />
                      </v-btn>
                      </SharedConfirmationDialog>
                      

                    </v-card-actions>
                  </div>
                </div>
              </v-col>

            </v-row>
       
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center mt-16 mb-10" v-if="loading == false && !(page == 1 && next == null)">
      <v-btn
        variant="flat" 
        rounded="lg" 
        color="primary"
        class="mx-1"
        @click="page = page -1 ; searchData()"
        :disabled="page < 2" 
        >
        صفحه قبل
      </v-btn>
      <v-btn
      variant="flat" 
        rounded="lg" 
        class="mx-1"
        :disabled="next == null"

        color="primary"
      @click="page = page +1 ; searchData()" 
      >
        صفحه بعد
      </v-btn>
    </div>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
    <v-dialog width="1000" persistent v-model="open"  :fullscreen="isBelowMd">
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
          <AddProduct @cancel="open = false" @close="open = false; searchData();;snackbar_save = true" />
        </v-card>
      </template>
    </v-dialog>
  </VLayoutItem>
  <div class="d-flex justify-center">
    <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="5" color="primary"
      indeterminate></v-progress-circular>
  </div>
</template>
<script>
import { EyeIcon, TrashIcon, PencilIcon, PlusIcon, BoxIcon, XIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon } from 'vue-tabler-icons';

import AddProduct from '@/components/section/AddChangeProduct.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";

export default {
  components: {
    XIcon,
    EyeIcon,
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
      snackbar_delete:false,
      page:1,
      next:null,
      isBelowMd: false,
    };
  },
  computed: {
    address() {
      return apiStore().address
    }
  },
  methods: {
    checkBreakpoint() {
      // Check if the window width is less than 960px (default 'md' breakpoint in Vuetify)
      this.isBelowMd = window.innerWidth < 960;
    },
    searchData() {
      this.loading = true
      axios.get(`${apiStore().address}/api/product/seller-panel/products-list-search/?page=${this.page}&search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      }).then((response) => {
        this.loading = false
        this.data = response.data.results
        this.next = response.data.next
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
    this.checkBreakpoint();  // Run the check when the component is mounted
    window.addEventListener('resize', this.checkBreakpoint);  // Listen to resize event
    this.searchData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkBreakpoint);  // Clean up event listener
  },
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
