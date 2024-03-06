<template>
  <v-container>
    <v-alert rounded="lg" border="start" class="mb-10 rtl ">
      <div class="pa-3">
        لطفا با درگ و دراپ ترتیب نمایش ایتم ها در صفحه ی پروفایل خود را مشخص کنید.
      </div>

    </v-alert>
    <div>
      <div class="pa-5 rtl font-weight-bold ma-5">لیست ایتم های پروفایل فروشگاه</div>
      <Container orientation="vertical" @drop="onDrop">
        <Draggable v-for="(item, i) in items" :key="item.id" class="pb-8 px-5">
          <v-sheet elevation="10"
            class="bg-white rounded-xl  border-t   px-10 py-5  mx-3 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <Menu2Icon size="20" />
              <v-btn v-if="item.type != 'product' && item.type != 'digital' && item.type != 'blog'" @click="items.splice(i,1)" color="red" class="mx-3" icon="" variant="tonal" size="x-small">
                <TrashIcon size="18" />
              </v-btn>
            </div>
            <div>
              <!-- {{ i + 1 }} -> -->
              
              {{ item.data }}
            </div>
          </v-sheet>
        </Draggable>


        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" elevation="0" rounded="lg" class="px-8 mx-10">
              افزودن دسته بندی محصول
              <template v-slot:prepend>
                <PlusIcon size="15" />
              </template>
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }"><v-locale-provider rtl>
            <v-card title="Dialog">
            
              <v-card-text>
                <v-autocomplete label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined" color="primary"
                clearable chips v-model="selectedCategories" :items="categories" item-text="name"
                item-value="id" multiple>
            </v-autocomplete>

              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="بستن" @click="isActive.value = false"></v-btn>
                <v-btn text="افزودن" 
                @click="addProductCategory()"
                color="primary" rounded="lg" variant="flat" elevation="0" class="px-5 mx-4 my-2"></v-btn>
              </v-card-actions>
            </v-card>
          </v-locale-provider>
          </template>
        </v-dialog>
        <v-btn  color="primary" elevation="0" rounded="lg" class="px-8 ">
          افزودن دسته بندی محصول دیجیتال
          <template v-slot:prepend>
            <PlusIcon size="15" />
          </template>
        </v-btn>

      </Container>
    </div>
  </v-container>
</template>
<script>
import { Container, Draggable } from "vue3-smooth-dnd";
import { Menu2Icon, PlusIcon ,TrashIcon} from 'vue-tabler-icons'
import axios from 'axios'
import { useUserStore } from '~/store/user';

export default {
  name: "app",
  components: { Container, Draggable, Menu2Icon, PlusIcon ,TrashIcon},
  mounted() {
    this.getCategories()
  },
  data() {
    return {
      items: [
        { id: 1, data: "محصولات فیزیکی" , type:'product' },
        { id: 2, data: "محصولات دیجیتال" , type:'digital' },
        { id: 3, data: "بلاگ" , type:'blog' },
      ],
      categories:[],
      selectedCategories:[]
    };
  },
  methods: {
    async getCategories() {
      try {
        const userToken = useUserStore().userToken; // Get the token from your user store
        const response = await axios.get('http://127.0.0.1:8000/api/product/ListCategories/', {
          headers: {
            Authorization: `Token ${userToken}`
          }
        });
        this.categories = response.data; // Assuming the API returns an array
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    addProductCategory(){
      this.selectedCategories.forEach((item)=>{this.items.push({id:item ,data:  ' دسته بندی ' + this.categories.find(m => m.id == item).title ,type:'productCategory'})})

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
  }
}
</script>