<template>
    <v-dialog scrollable width="900" v-model="dialog">
     
      
       

                <v-card class=" rounded-xl  pa-5  "  >
                 <v-card-text >
                    <v-locale-provider rtl>
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
                    <div class=" text-body-1 font-weight-bold px-3 py-5 border-t">
                        شماره سفارش:     {{ data.order_id }}
                       
                       </div>
                    <div class=" text-body-1 font-weight-bold px-3 py-5 border-t">
                        شماره تماس:     {{ data.author.phone_number }}
                       
                       </div>
                      
                    <div class=" text-body-1 font-weight-bold px-3 pt-5 border-t">
                        آدرس:
                       </div>

                    <v-row class="pt-5 mb-3">
                        <v-col cols="6" md="4">

                            <v-list-item class="  py-3 px-5">

                                <v-list-item-title
                                    class="   text-body-1 text-nauto">استان</v-list-item-title>
                                <div class="font-weight-bold text-xs text-body-1 text-nauto pt-2">{{ data.state }}
                                </div>
                            </v-list-item>
                        </v-col>
                        <v-col cols="6" md="4">

                            <v-list-item class="  py-3 px-5">

                                <v-list-item-title
                                    class="   text-body-1 text-nauto">شهر</v-list-item-title>
                                <div class="font-weight-bold text-xs text-body-1 text-nauto pt-2">{{ data.city }}
                                </div>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">

                            <v-list-item class="  py-3 px-5">

                                <v-list-item-title
                                    class="   text-body-1 text-nauto">خیابان</v-list-item-title>
                                <div class="font-weight-bold text-xs text-body-1 text-nauto pt-2">{{ data.street }}
                                </div>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">

                            <v-list-item class="  py-3 px-5">

                                <v-list-item-title
                                    class="   text-body-1 text-nauto">کوچه</v-list-item-title>
                                <div class="font-weight-bold text-xs text-body-1 text-nauto pt-2">{{ data.alley }}
                                </div>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">

                            <v-list-item class="  py-3 px-5">

                                <v-list-item-title
                                    class="   text-body-1 text-nauto">کدپستی</v-list-item-title>
                                <div class="font-weight-bold text-xs text-body-1 text-nauto pt-2">{{ data.zipCode }}
                                </div>
                            </v-list-item>
                        </v-col>
                    </v-row>
           <div class=" py-5 border-t">
            <span class="text-body-1 px-3 font-weight-bold">وضعیت:</span>
            <v-menu>
                <template v-slot:activator="{ props }">
                    
                    <v-btn :loading="data.id == loadingStatus"  :ripple="false" v-bind="props"
                        variant="flat" rounded="pill"
                        :class="data.status == 'received' ? 'bg-green' : data.status == 'sended' ? 'bg-primary' : 'bg-red'"
                        class="text-body-2">
                        
                        {{ data.status == 'received' ? ' تحویل داده شده' : data.status == 'sended' ?
                        ' ارسال شده ' : ' ارسال نشده' }}
                    </v-btn>

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
           </div>
           <div class="py-5 border-t">
           <div class="text-body-1 font-weight-bold px-3">
            محصول
           </div>
            <v-card elevation="0"  class="my-5 rtl mx-3"
     
            >
              <v-row class="d-flex flex-no-wrap justify-space-between">
                <v-col cols="12" md="4">
                    <v-avatar size="230" rounded="xl">
                      <v-img :src="data.product.image[0].photo" cover></v-img>
                    </v-avatar>
                </v-col >
                <v-col cols="12" md="8">
                    
                  <v-card-title class="text-h5 font-weight-bold">
                    {{ data.product.title }}
                  </v-card-title>
                  <v-card-text class="text-line-1">
                    <div v-html=" data.product.description">
                    </div>
                  </v-card-text>
                
                </v-col>
                
                   <v-col cols="1s2">
                     <div class="d-flex">
                        <div class="text-body-1 font-weight-bold px-3">
                            تعداد:
                        </div>
                        <div class="px-5 font-weight-bold">
                            {{ data.count }}
                        </div>
                     </div>
                   </v-col>
              </v-row>
            </v-card>
           </div>
           <div class="py-5 border-t">
           
           </div>
        </v-locale-provider>
                 </v-card-text>
                </v-card>
         

      
    </v-dialog>
        <td>
            <p class="text-15 font-weight-medium">{{ data.order_id }}</p>
        </td>
        <td>
            <div class="">
                <v-sheet v-bind="props">
                    <h6 class=" text-body-1 font-weight-bold text-muted">{{ data.author.full_name }}
                    </h6>

                </v-sheet>
               
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
        <td>
            <v-btn @click="dialog=true" class=" text-right text-xs" icon="" color="primary" size="x-small"  variant="tonal"
            >
            <PencilIcon size="15"/>
        </v-btn>
        </td>
 
   
</template>
<script>
  
    import { UserIcon } from 'vue-tabler-icons';
    import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
    import axios from "axios";
    import { PencilIcon } from 'vue-tabler-icons';

export default {
  
    components: {
        UserIcon,
        PencilIcon
    },
    props:["data"],
    data() {
        return {
            loading: true,
            loadingStatus: 0,
            dialog:false,
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
            axios.put(`${apiStore().address}/api/order/admin/order-update-status/${id}/`, { status: status }, {
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