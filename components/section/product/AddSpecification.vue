<template>
    <v-row>
        <v-col cols="12" md="6">
            <v-text-field label="عنوان ویژگی" rounded="lg" v-model="title_specification" variant="outlined"
                color="primary" class="mt-10" />
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center justify-center">
            <v-text-field label="مقدار ویژگی" rounded="lg" v-model="body_specification" variant="outlined"
                color="primary" class="mt-10" />
            <v-btn @click="createSpecification" :loading="loadingSpecification" icon="" class="mt-4 mx-3"
                color="primary" variant="flat" size="small">
                <CheckIcon size="17" />
            </v-btn>
        </v-col>
    </v-row>

    <v-row v-for="item in data" align="center">
        <v-col>عنوان : {{ item.title }}</v-col>
        <v-col class="d-flex justify-space-between align-center">
            <div>
                مقدار : {{ item.body }}
            </div>
            <v-btn @click="data.splice(data.indexOf(item),1)" icon="" variant="tonal" class="mx-3" elevation="0"
                color="red" size="small">
                <TrashIcon size="17" />
            </v-btn>
        </v-col>
    </v-row>
</template>
<script>
import { PlusIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    props: ["data",],
    components: {
        PlusIcon, TrashIcon,
        CheckIcon
    },
    data() {
        return {
            loadingSpecification: false,
            title_specification: null,
            body_specification: null,
        }
    },
    methods: {

        async createSpecification() {
            this.loadingSpecification = true
            axios.post(`${apiStore().address}/api/product/admin/specification-list-create/`,
                {
                    title: this.title_specification,
                    body: this.body_specification
                }, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.loadingSpecification = false
                    this.data.push({
                        title: this.title_specification,
                        body: this.body_specification,
                        id: response.data.id
                    })

                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
    },
    mounted() {

    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.$emit("change", val)
            },

        },

    },
}
</script>