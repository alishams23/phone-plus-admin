
<template>
    <v-card rounded="lg" elevation="10" height="480">
        <v-card-item class="pb-0">
            <v-card-title class="text-h5 rtl pt-sm-2">اعلان‌های اخیر</v-card-title>
            <div class="recent-transaction mt-10 px-3 rtl">
                <div v-for="item in data" :key="item.id">
                    <v-row class="d-flex pt-2 mb-1">
                        <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 align-start">
                            <h6 v-if="item.readingStatus" class="text-body-1 textSecondary text-no-wrap">{{ item.title }}</h6>
                            <h6 v-else class="text-body-1 textSecondary font-weight-bold text-no-wrap">{{ item.title }}</h6>
                            <p class="text-body-1 text-body-2 text-no-wrap">{{ item.user.username }}</p>
                        </v-col>
                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                            <CircleIcon v-if="item.readingStatus" size="13" class="text-gray" />
                            <CircleIcon v-else size="13" class="text-primary" />
                            <div class="line mx-auto bg-blue-grey-lighten-5"></div>
                        </v-col>
                        <v-col cols="7" sm="8" class="pt-0">
                            <h6 v-if="item.readingStatus" class="text-body-1 textSecondary ">{{ item.body }}</h6>
                            <h6 v-else class="text-body-1 font-weight-bold textSecondary ">{{ item.body }}</h6>
                            <div class="mt-n1">
                                <RouterLink :to="item.url" class="text-body-1 text-primary text-decoration-none" v-if="item.url">
                                    مشاهده
                                </RouterLink>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>
<style lang="scss">
.recent-transaction {
    .line {
        width: 2px;
        height: 35px;
    }
}
</style>
<script>
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import { CircleIcon } from 'vue-tabler-icons'
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
            axios.get(`${apiStore().address}/api/account/notification-list/`, {
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
    }, mounted() {
        this.getData()
    }
};
</script>
