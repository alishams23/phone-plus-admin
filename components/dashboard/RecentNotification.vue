
<template>
    {{ data }}
    <v-card rounded="lg" elevation="10" >
        <v-card-item class="pb-0">
            <v-card-title class="text-h5 rtl pt-sm-2">اعلان‌های اخیر</v-card-title>
            <div class="recent-transaction mt-10 px-3 rtl">
                <div v-for="item in data" :key="item.id" >
                    <v-row class="d-flex mb-4">
                        <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
                            <h6 class="text-body-1 textSecondary text-no-wrap">{{ item.title }}</h6>
                        </v-col>
                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                            <CircleIcon size="13" class="text-primary"  />
                            <div class="line mx-auto bg-grey100"></div>
                        </v-col>
                        <v-col cols="7" sm="8" class="pt-0">
                            <h6 class="text-body-1 textSecondary font-weight-bold">{{ item.body }}</h6>
                            <div class="mt-n1">
                                <RouterLink :to="'/'" class="text-body-1 text-primary text-decoration-none"
                                    v-if="item.url">{{
                                        item.url
                                    }}</RouterLink>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>

<script>
import axios from "axios";
import { useUserStore } from '~/store/user';
import {CircleIcon} from 'vue-tabler-icons'
export default {
    components: {
        CircleIcon
    },
 
    data() {
        return {
            data: [],
            loading: true,
        };

    },

    methods: {

        getData() {
            this.loading = true
            axios.get(`http://192.168.1.106:8000/api/account/notification-list/`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading = false
                this.data = response.data
            })
        }
    },  mounted() {
        this.getData()
    }
};
</script>
