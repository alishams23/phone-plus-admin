<template>
 
        <td>
            <p class="text-15 font-weight-medium">{{ data.id }}</p>
        </td>
        <td>
            <div class="">
                <v-dialog width="900">
                    <template v-slot:activator="{ props }">
                        <v-sheet v-bind="props">
                            <h6 class=" text-body-1 font-weight-bold text-muted">{{ data.author.full_name }}
                            </h6>
                            <div class="text-13 text-body-2 mt-1 text-muted">{{ data.author.username }}
                            </div>
                        </v-sheet>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <v-locale-provider rtl>

                            <v-card class=" rounded-xl  pa-5  ">
                                <v-list-item class="  pa-2 pe-4">
                                    <template v-slot:prepend>
                                        <v-avatar size="x-large" class="">
                                            <UserIcon />
                                        </v-avatar>
                                    </template>
                                    <v-list-item-title class=" font-weight-bold  text-nauto">{{ data.author.username
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="text-body-2 text-nauto">{{ data.author.full_name
                                    }}</v-list-item-subtitle>
                                </v-list-item>


                                <v-row class="pt-5">
                                    <v-col cols="4">

                                        <v-list-item class="  py-3 px-5">

                                            <v-list-item-title
                                                class=" font-weight-bold  text-nauto">استان</v-list-item-title>
                                            <div class="text-xs text-body-2 text-nauto pt-2">{{ data.author.state }}
                                            </div>
                                        </v-list-item>
                                    </v-col>
                                    <v-col cols="4">

                                        <v-list-item class="  py-3 px-5">

                                            <v-list-item-title
                                                class=" font-weight-bold  text-nauto">شهر</v-list-item-title>
                                            <div class="text-xs text-body-2 text-nauto pt-2">{{ data.author.city }}
                                            </div>
                                        </v-list-item>
                                    </v-col>
                                    <v-col cols="4">

                                        <v-list-item class="  py-3 px-5">

                                            <v-list-item-title
                                                class=" font-weight-bold  text-nauto">خیابان</v-list-item-title>
                                            <div class="text-xs text-body-2 text-nauto pt-2">{{ data.author.street }}
                                            </div>
                                        </v-list-item>
                                    </v-col>
                                    <v-col cols="4">

                                        <v-list-item class="  py-3 px-5">

                                            <v-list-item-title
                                                class=" font-weight-bold  text-nauto">کوچه</v-list-item-title>
                                            <div class="text-xs text-body-2 text-nauto pt-2">{{ data.author.alley }}
                                            </div>
                                        </v-list-item>
                                    </v-col>
                                    <v-col cols="4">

                                        <v-list-item class="  py-3 px-5">

                                            <v-list-item-title
                                                class=" font-weight-bold  text-nauto">کدپستی</v-list-item-title>
                                            <div class="text-xs text-body-2 text-nauto pt-2">{{ data.author.zipCode }}
                                            </div>
                                        </v-list-item>
                                    </v-col>
                                </v-row>
                                <!-- <v-card-text  class="rtl text-nauto" v-if="data.teacher.bio">{{data.teacher.bio}}</v-card-text> -->
                            </v-card>
                        </v-locale-provider>

                    </template>
                </v-dialog>
            </div>
        </td>
        <td>
            <h6 v-bind="props" class="text-body-1 text-muted">{{ data.product.title }}</h6>
        </td>
        <td>
            <h6 class="text-body-1 text-muted">{{ data.count }}</h6>
        </td>
        <td>

            <v-menu>
                <template v-slot:activator="{ props }">

                    <v-btn :loading="data.id == loadingStatus" density="compact" :ripple="false" v-bind="props"
                        variant="flat" rounded="pill"
                        :class="data.status == 'received' ? 'bg-green' : data.status == 'sended' ? 'bg-primary' : 'bg-red'"
                        class="pa-0">
                        <v-chip class="text-body-2 px-3 py-1  text-white " size="x-small">
                            {{ data.status == 'received' ? ' تحویل داده شده' : data.status == 'sended' ?
                                ' ارسال شده ' : ' ارسال نشده' }}
                        </v-chip></v-btn>

                </template>
                <v-list 
                rounded="lg"
                elevation="10">
                    <v-list-item v-for="(itemStatus, index) in items" :key="index" :value="itemStatus.value"
                        :class="data.status == itemStatus.value ? 'bg-grey-lighten-3 text-black text-weight-bold ' : ''"
                        @click="data.status = itemStatus.value; changeStatus(data.id, data.status)">
                        <v-list-item-title class="text-body-1 rtl"
                            :class="data.status == itemStatus.value ? 'font-weight-bold ' : ''">{{
                                itemStatus.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </td>
        <td>
            <h6 class="text-h6 text-right">{{ data.price }} تومان</h6>
        </td>
 
   
</template>
<script>
  
    import { UserIcon } from 'vue-tabler-icons';
    import { useUserStore } from '~/store/user';
    import axios from "axios";

export default {
  
    components: {
        UserIcon,
    },
    props:["data"],
    data() {
        return {
            loading: true,
            loadingStatus: 0,
            items: [
                { title: 'تحویل داده شده', value: 'received' },
                { title: 'ارسال شده ', value: 'sended' },
                { title: 'ارسال نشده', value: 'none' },
            ],
        }
    },
    methods: {
        changeStatus(id, status) {
            this.loadingStatus = id
            axios.put(`http://127.0.0.1:8000/api/order/OrderUpdateStatus/${id}/`, { status: status }, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
            this.loadingStatus = 0
        },
    }
}
</script>