<template>
  <v-snackbar
    v-model="snackbar"
    class="rtl"
    color="success"
    elevation="24"
    rounded="lg"
  >
    دسته بندی با موفقیت ایجاد شد
  </v-snackbar>

  <v-autocomplete
    :loading="loading"
    label="دسته بندی‌ها"
    rounded="lg"
    persistent-hint
    variant="outlined"
    color="primary"
    clearable
    chips
    v-model="selectedData"
    :items="data"
    item-text="name"
    item-value="id"
    multiple
  >
    <template v-slot:no-data>
      <div class="d-flex justify-center align-center category-container">
        <div class="px-5 text-body-2 font-weight-bold">
          افزودن دسته بندی
        </div>
        <v-menu
          v-model="dialog"
          offset-y
          location-strategy="connected"
          location="bottom-start"
          transition="scale-transition"
        >
          <!-- Activator slot: binds the button’s props & events -->
          <template #activator="{ props, on }">
            <v-btn
              v-bind="props"
              v-on="on"
              icon
              size="x-small"
              variant="tonal"
              color="primary"
            >
              <PlusIcon />
            </v-btn>
          </template>

          <!-- The “popover” form -->
          <v-card min-width="300" class="px-5 pt-7 rounded-lg">
            <v-text-field
              label="نام دسته بندی"
              rounded="lg"
              v-model="text"
              variant="outlined"
              color="primary"
              class="pt-0 mt-0"
            />
            <v-card-actions>
              <v-btn text variant="flat" @click="dialog = false">بستن</v-btn>
              <v-btn
                :loading="loadingCreate"
                :disabled="!text"
                @click="createCategory"
                class="rounded-lg px-10"
                variant="flat"
                color="primary"
              >
                افزودن
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-autocomplete>
</template>
<script>
import { PlusIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    emits: ["change","getData"],
    props: ["selected","url",],
    components: {
        PlusIcon
    },
    data() {
        return {
            snackbar: false,
            dialog: false,
            data : [],
            text:null,
            selectedData:[],
            loading:true,
            loadingCreate:false,
        }
    },
    methods:{
        async getCategories() {
            try {
                const userToken = useUserStore().userToken; // Get the token from your user store
                const response = await axios.get(`${apiStore().address}${this.url}`, {
                    headers: {
                        Authorization: `Token ${userToken}`
                    }
                });
                this.data = response.data; // Assuming the API returns an array
                this.loading = false
                this.$emit("getData", this.data)
                
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async createCategory() {
            this.loadingCreate = true
            axios.post(`${apiStore().address}${this.url}`,
                {
                    title: this.text,
                }, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.dialog = false
                    this.selectedData.push(response.data.id)
                    this.getCategories()
                    this.text=null
                    this.loadingCreate = false
                    this.snackbar = true
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
    },
    mounted(){
        this.getCategories()
        if(this.selected != null) this.selectedData = this.selected
    },
    watch: {
        selectedData: {
            handler: function (val, oldVal) {
                this.$emit("change", val)
            },

        },
        selected: {
            handler: function (val, oldVal) {
                this.selectedData = val
            },

        },
    },
}
</script>

<style scoped>
.category-container {
  position: relative;
}
</style>
