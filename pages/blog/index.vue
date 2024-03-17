<template>

  <v-container>
    <v-row :reverse="true" align="center" class="mb-5 rtl">
      <v-col cols="12" md="4" class="rtl d-flex align-center">
        <v-avatar color="primary" rounded="lg" size="50">
          <ArticleIcon />
        </v-avatar>
        <div class=" px-5 font-weight-bold text-h4">
          وبلاگ
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
              <v-btn @click="order = !order; searchData()" variant="tonal" color="primary" rounded="lg" size="50">
                <SortDescending2Icon v-if="order" />
                <SortAscending2Icon v-if="!order" />
              </v-btn>
            </template>
          </v-text-field>
        </v-locale-provider>
      </v-col>

    </v-row>
    <div class="d-flex justify-center">
      <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="7" color="primary"
        indeterminate></v-progress-circular>
    </div>
    <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
      border="start" class="rtl border-opacity-100 my-10">
      <div class="text-sm  font-weight-black irsa">
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
            <v-img cover height="140px" class="" :src="blog.imageBlog.photo">
            </v-img>
          </v-col>
          <v-col>
            <div class="d-flex ">
              <div>
              </div>
              <div class=" d-flex flex-column flex-fill ">
                <v-card-item>
                  <v-card-title class="text-h6 ">{{ blog.title }}</v-card-title>
                  <div v-html="blog.body" class="text-line-1  text-body-2"></div>
                </v-card-item>
                <v-card-actions class="mt-auto mr-auto px-10">
                  <v-btn class="px-10 ml-4" variant="flat" :to="'/blog/' + blog.id" rounded="xl" size="small"
                    color="primary">
                    ویرایش
                    <template v-slot:append>
                      <PencilIcon size="15" />
                    </template>
                  </v-btn>
                  <v-avatar size="30" variant="tonal" @click="removeItem(blog.id)" color="red-darken-2" icon="">
                    <TrashIcon size="15" />
                  </v-avatar>
                  <v-sheet class="px-3  text-body-2">
                    {{ blog.updated_at }}
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
    <VBtn to="/blog/addBlog" icon="" class="mx-2 mx-md-5" size="large" color="primary" elevation="8">
      <v-icon>
        <PlusIcon />
      </v-icon>
    </VBtn>
  </VLayoutItem>
</template>

<script>
import { PencilIcon, PlusIcon, BoxIcon, SearchIcon, FilterCogIcon, SortDescending2Icon, SortAscending2Icon, ArticleIcon, TrashIcon } from 'vue-tabler-icons';


import AddBlog from '@/pages/blog/addBlog.vue';
import axios from "axios";
import ShowTextEditor from '~/components/shared/ShowTextEditor.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
  components: {
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
      search_text: '',
      order: false,
      loadingItem: 0,
    };
  },
  methods: {
    searchData() {
      this.loading = true
      axios.get(`${apiStore().address}/api/blog/admin/blog-List-admin/?search=${this.search_text}&ordering=${this.order == false ? '-id' : 'id'}`, {
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
    , removeItem(id) {
      this.loadingItem = id
      axios.delete(`${apiStore().address}/api/blog/admin/blog-remove/${id}/`, {
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