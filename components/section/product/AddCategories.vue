<template>
    <v-autocomplete :loading="loading" label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined" color="primary" clearable chips
        v-model="selectedData"  :items="data" item-text="name" item-value="id" multiple>
        <template v-slot:no-data>
           <div class="d-flex justify-center align-center">
                <div class="px-5 text-body-2 font-weight-bold">
                    افزودن دسته بندی
                </div>
                {{ text }}
                <v-btn @click="dialog = true" icon="" size="x-small" variant="tonal" color="primary">
                    <PlusIcon />
                </v-btn>
           </div>
        </template>
    </v-autocomplete>
    <v-dialog v-model="dialog" width="auto">
        <v-card min-width="300"  class="px-5 pt-7 rounded-lg">
            <v-text-field label="نام دسته بندی" rounded="lg" v-model="text"
            variant="outlined" color="primary" class="pt-0 mt-0" />
            <template v-slot:actions>
                <v-btn class="" text="بستن"  variant="flat" @click="dialog = false"></v-btn>
                <v-btn :loading="loadingCreate" :disabled="text == null || text == ''" @click="createCategory" class="rounded-lg px-10" color="primary" variant="flat" text="افزودن" ></v-btn>
            </template>
        </v-card>
    </v-dialog>


</template>
<script>
import { PlusIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    props: ["selected","url","urlCreate"],
    components: {
        PlusIcon
    },
    data() {
        return {
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
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async createCategory() {
            this.loadingCreate = true
            axios.post(`${apiStore().address}${this.urlCreate}`,
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