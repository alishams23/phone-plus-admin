<template>

    <v-snackbar
      :timeout="2000"
      color="primary"
      
      elevation="24"
       v-model="snackbar_edit">
      <div class="w-100 rtl">
        <p>مقاله با موفقیت ویرایش شد</p>
      </div>
      <!-- <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar_edit = false">
          <XIcon/>
        </v-btn>
      </template> -->
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="primary"
      
      elevation="24"
       v-model="snackbar_save">
      <div class="w-100 rtl">
        <p>مقاله با موفقیت ثبت شد</p>
      </div>
      <!-- <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar_save = false">
          <XIcon/>
        </v-btn>
      </template> -->
    </v-snackbar>

    <v-snackbar
      :timeout="2000"
      color="red"
      
      elevation="24"
       v-model="snackbar_delete">
      <div class="w-100 rtl">
        <p>مقاله با موفقیت حذف شد</p>
      </div>
      <!-- <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackbar_delete = false">
          <XIcon/>
        </v-btn>
      </template> -->
    </v-snackbar>

  <v-container>
    <v-row :reverse="true" align="center" class="mb-5 rtl">
      <v-col cols="12" md="4" class="rtl d-flex align-center">
        <v-avatar color="primary" rounded="lg" size="50">
          <ArticleIcon />
        </v-avatar>
        <div class=" px-5 font-weight-bold text-h4">
          مقاله ها
        </div>
      </v-col>
      <v-col cols="12" class="mr-auto" md="4">
        <v-locale-provider rtl>
          <v-text-field v-model="search_text" @update:model-value="searchData" label="جستجو" rounded="lg"
            persistent-hint variant="outlined" color="primary" dense class="    mt-0 mt-md-5 text-body-2">
            <template v-slot:prepend-inner>
              <SearchIcon color="gray" />
            </template>
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
    <div class="d-flex justify-center">
      <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="5" color="primary"
        indeterminate></v-progress-circular>
    </div>
    <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
      border="start" class="rtl border-opacity-100 my-10">
      <div class="text-sm  irsa">
        مقاله ای وجود ندارد
      </div>
    </v-alert>
    <v-locale-provider rtl>

      <v-card v-for="blog in data" :key="blog.id" :loading="loadingItem == blog.id" elevation="10" rounded="xl"
        class=" mb-5 ">

        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
        </template>
        <v-row>
          <v-col cols="12" md="3">
            <v-img cover height="171px" class="" :src="blog.imageBlog.photo">
            </v-img>
          </v-col>
          <v-col>
            <div class="d-flex ">
              <div>
              </div>
              <div class=" d-flex flex-column flex-fill ">
                <v-card-item>
                  <v-card-title class="text-h6 ">{{ blog.title }}</v-card-title>
                  <div v-html="blog.plain_description" class="text-line-1  text-body-2"></div>
                </v-card-item>
                <v-card-actions class="mt-auto mr-auto px-2 flex-wrap">
                  
                  <v-dialog persistent width="1000"  :fullscreen="isBelowMd">
                    <template v-slot:activator="{ props: activatorProps }">
                      <div class="ma-4">
                        <v-btn class="px-10 " v-bind="activatorProps" variant="flat" rounded="xl" size="small"
                        color="primary">
                        ویرایش
                        <template v-slot:append>
                          <PencilIcon size="15" />
                        </template>
                      </v-btn>
                      </div>
                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card class="px-3 px-md-15 rounded-lg my-20 ltr" title="">
                        <AddChangeBlog @cancel="searchData()" :id="blog.id" @close=" searchData();snackbar_edit=true" />
                      </v-card>
                    </template>
                  </v-dialog>  
                  <a :href="`${address}/p/blog/${blog.slug}`" target="_blank" rel="noopener noreferrer">
                    <v-avatar size="30" variant="tonal" class="cursor-pointer ml-4" color="primary">
                      <EyeIcon size="15" />
                    </v-avatar>
                  </a>
                  <SharedConfirmationDialog @delete-item="removeItem(blog.id);snackbar_delete=true">
                    <v-btn size="30" class="cursor-pointer" variant="tonal" color="red-darken-2" icon="">
                    <TrashIcon size="15" />
                  </v-btn>
                    </SharedConfirmationDialog>

                 
                  <v-sheet class="px-3  text-body-2">
            
                    {{ blog.created_at_jalali }}
                  </v-sheet>

                </v-card-actions>

              </div>

            </div>
          </v-col>

        </v-row>
      </v-card>

    </v-locale-provider>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
    <v-dialog persistent width="1000" v-model="open"  :fullscreen="isBelowMd">
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
        <v-card class="rounded-lg  " title="">
          <v-container>
            <AddChangeBlog  @cancel="open = false" @close="open=false; searchData();snackbar_save=true" />
          </v-container>
        </v-card>
      </template>
    </v-dialog>
  </VLayoutItem>
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
</template>

<script>
import {EyeIcon, PencilIcon, PlusIcon, XIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon, ArticleIcon, TrashIcon } from 'vue-tabler-icons';

import AddChangeBlog from '@/components/section/AddChangeBlog.vue';
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

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
    ArticleIcon,
    AddChangeBlog,
    TrashIcon
  },
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
      this.data = []
      this.loading = true
      axios.get(`${apiStore().address}/api/blog/seller-panel/blog-List-admin/?page=${this.page}&search=${this.search_text}&ordering=${this.order == false ? '-id' : 'id'}`, {
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
    }
    , removeItem(id) {
      this.loadingItem = id
      axios.delete(`${apiStore().address}/api/blog/seller-panel/blog-remove/${id}/`, {
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
