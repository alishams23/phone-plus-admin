<template>
  <v-container>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        تغییرات اعمال شد
    </v-snackbar>
    <v-alert rounded="lg" border="start" class="mb-10 rtl ">
      <div class="pa-3">
        لطفا با جابجایی ترتیب نمایش ایتم ها در صفحه ی پروفایل خود را مشخص کنید.
      </div>
    </v-alert>
    <v-btn 
          text="ثبت" 
          :loading="loading" 
          @click="updateData" 
          color="primary" 
          rounded="lg" 
          variant="flat" 
          elevation="0"
          class="px-10 mx-4 my-2"/>

        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" elevation="0" variant="tonal" rounded="lg" class="px-8 my-3 mx-3">
              افزودن دسته بندی محصول
              <template v-slot:prepend>
                <PlusIcon size="15" />
              </template>
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }"><v-locale-provider rtl>
              <v-card rounded="lg">

                <v-card-text>


                  <AddCategories @getData="(data) => { categories = data }"
                    @change="(data) => { selectedCategories = data }" :selected="selectedCategories"
                    url="/api/product/seller-panel/category-product-list-create/" />



                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text="بستن" @click="isActive.value = false"></v-btn>
                  <v-btn text="افزودن" @click="addProductCategory()" color="primary" rounded="lg" variant="flat"
                    elevation="0" class="px-5 mx-4 my-2"></v-btn>
                </v-card-actions>
              </v-card>
            </v-locale-provider>
          </template>
        </v-dialog>
        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" elevation="0" variant="tonal" rounded="lg" class="px-8  my-3 mx-3">
              افزودن دسته بندی محصول دیجیتال
              <template v-slot:prepend>
                <PlusIcon size="15" />
              </template>
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }"><v-locale-provider rtl>
              <v-card rounded="lg">

                <v-card-text>
                  <AddCategories @getData="(data) => { categoriesDigital = data }"
                    @change="(data) => { selectedCategoriesDigitalProduct = data }"
                    :selected="selectedCategoriesDigitalProduct"
                    url="/api/product/seller-panel/category-digital-product-list-create/" />
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text="بستن" @click="isActive.value = false"></v-btn>
                  <v-btn text="افزودن" @click="addDigitalProductCategory()" color="primary" rounded="lg" variant="flat"
                    elevation="0" class="px-5 mx-4 my-2"></v-btn>
                </v-card-actions>
              </v-card>
            </v-locale-provider>
          </template>
        </v-dialog>
    <div>
      <div class="pa-5 rtl font-weight-bold ma-5">لیست ایتم های پروفایل فروشگاه</div>
      <Container orientation="vertical" @drop="onDrop">
        <Draggable v-for="(item, i) in items" :key="item.id" class="pb-8 px-5">
          <v-sheet elevation="10"
            class="bg-white rounded-xl  border-t   px-10 py-5  mx-3 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <Menu2Icon size="20" />
              <v-btn v-if="item.type != 'product' && item.type != 'digital' && item.type != 'blog'"
                @click="items.splice(i, 1)" color="red" class="mx-3" icon="" variant="tonal" size="x-small">
                <TrashIcon size="18" />
              </v-btn>
            </div>
            <div>
              <!-- {{ i + 1 }} -> -->

              {{ item.title }}
            </div>
          </v-sheet>
        </Draggable>


      </Container>
    </div>
  </v-container>
</template>
<script>
import { Container, Draggable } from "vue3-smooth-dnd";
import { Menu2Icon, PlusIcon, TrashIcon } from 'vue-tabler-icons'
import axios from 'axios'
import AddCategories from '@/components/section/product/AddCategories.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
  name: "app",
  components: { Container, Draggable, Menu2Icon, PlusIcon, TrashIcon, AddCategories },
  mounted(){
    this.getData()
  },
  data() {
    return {
      snackbar: false,
      id: null,
      loading: true,
      items: [
        { id_object: 1, title: "محصولات فیزیکی", type: 'product' },
        { id_object: 2, title: "محصولات دیجیتال", type: 'digital' },
        { id_object: 3, title: "بلاگ", type: 'blog' },
      ],
      categories: [],
      categoriesDigital: [],
      selectedCategories: [],
      selectedCategoriesDigitalProduct: []
    };
  },
  methods: {
    getData() {
    axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Token ${useUserStore().userToken}`
      },
    }).then((response) => {
      this.loading = false
      response.data[0].order.length > 0 ? this.items = response.data[0].order : ''
      this.id = response.data[0].id
    }
    )
  },
  async updateData() {
    this.loading = true
    let formDict = {}
    let itemUpdate = []
    this.items.forEach((element , index) => {
      element["position"] = index
      itemUpdate.push(element)
    });
    formDict['order'] = itemUpdate

    await axios
      .put(
        `${apiStore().address}/api/account/seller-panel/shop-order-update/${this.id}/`,
        formDict,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Token ${useUserStore().userToken}`
          },
        }
      )
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }).then((response) => {
        this.snackbar = true
        this.loading = false
      })

  },
    addProductCategory() {
      this.selectedCategories.forEach((item) => { this.items.push({ id_object: item, title: ' دسته بندی ' + this.categories.find(m => m.id == item).title, type: 'productCategory' }) })

    },
    addDigitalProductCategory() {
      this.selectedCategoriesDigitalProduct.forEach((item) => { this.items.push({ id_object: item, title: ' دسته بندی ' + this.categoriesDigital.find(m => m.id == item).title, type: 'productDigitalCategory' }) })

    },
    onDrop(dropResult) {
      this.items = this.applyDrag(this.items, dropResult);
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    }
  },
 
}
</script>