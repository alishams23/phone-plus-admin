<template>
    <v-card elevation="10" rounded="lg" class="bg-primary rtl">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">

                <v-card-title class="d-flex items-center flex-col text-h5 font-weight-black rtl">
                    کیف پول
                    
                    <v-tooltip activator="parent" class="text-center " location="top" :open-delay="300" :close-delay="200">
                        <template v-slot:activator="{ on, attrs }">
                            <QuestionMarkIcon size="12" class="bg-white rounded-pill ml-2" v-bind="attrs" v-on="on" />
                        </template>

                        <span class="text-center rtl">برای فروش هر محصول، مبلغ ۱۸۰۰ تومان از کیف پول شما کسر می‌شود 
                            <br/>
                            اگر موجودی کیف پول
                            شما کمتر از این مقدار
                            باشد، محصول شما در وبسایت نمایش داده نخواهد شد 
                            <br/>
                            <br/>
                            
                            لطفاً اطمینان حاصل کنید که موجودی کیف پولتان
                            کافی است</span>

                            
                    </v-tooltip>
                </v-card-title>
                <div>
                    <WalletIcon size="40" />
                </div>
            </div>


            <div class="mt-6">
                <h3 class="text-h3">{{ price(cash) }}</h3>
                <div class="mt-1">
                    <span class="text-subtitle-1 opacity-50 text-muted ml-2">تومان</span>
                </div>
                <div class="d-flex justify-end align-center mt-4">

                    <v-dialog width="500">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" variant="tonal" size="small" class="rounded-xl">
                                <template v-slot:prepend>
                                    <ArrowDownIcon size="17" />
                                </template>
                                افزایش اعتبار
                            </v-btn>
                        </template>
                            
                        <template v-slot:default="{ isActive }"><v-locale-provider rtl>
                                <form @submit.prevent="goPaymentPage">
                                    <v-card rounded="lg">
                                        <div class="ma-5">افزایش اعتبار</div>
                                    
                                        <v-card-text>
                                            <v-text-field  type="number" min="10000" v-model="amount" label=" به مبلغ مورد نظر (ریال)" rounded="lg"
                                                required class="mt-1" persistent-hint variant="outlined" color="primary" />
                                        </v-card-text>
                                        <v-slide-group class="mx-5" v-model="selected_gateway" mandatory show-arrows>
                                            <v-slide-group-item
                                                v-for="(key, index) in available_gateways"
                                                :key="key"
                                                :value="key"
                                                v-slot="{ isSelected, toggle }"
                                            >
                                                <v-card
                                                    @click="toggle"
                                                    class="ma-2 d-flex flex-column align-center justify-center text-center"
                                                    rounded="lg"
                                                    :elevation="0"
                                                    :variant="isSelected ? 'outlined' : 'text'"
                                                    :color="isSelected ? 'primary' : undefined"
                                                    width="84"
                                                    height="80"
                                                >
                                                    <v-img
                                                        :src="gateways[key].img"
                                                        :alt="gateways[key].name"
                                                        width="32"
                                                        height="24"
                                                        cover
                                                        class="mt-2"
                                                    />
                                                    <v-card-text class="text-subtitle-2 text-center text-grey-darken-2 py-1">
                                                        {{ gateways[key].name }}
                                                    </v-card-text>
                                                </v-card>
                                            </v-slide-group-item>
                                        </v-slide-group>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                    
                                            <v-btn text="بستن" rounded="lg" @click="isActive.value = false"></v-btn>

                                            <v-btn
                                            type="submit" 
                                            @click=""
                                                
                                                text="پرداخت" color="primary" rounded="lg" variant="flat" elevation="0"
                                                class="px-5 mx-4 my-2"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </form>
                            </v-locale-provider>
                        </template>
                    </v-dialog>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>

<script>
import { ref } from 'vue';
import { ArrowDownIcon, WalletIcon, QuestionMarkIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from 'axios';


export default {
    components: {
        ArrowDownIcon,
        QuestionMarkIcon,
        WalletIcon
    },
    computed: {
        address() {
            return apiStore().address
        }, shop_username() {
            return useUserStore().usernameShop
        },
    },
    data() {
        return {
            amount: null,
            available_gateways: [],
            selected_gateway: null,
            gateways: {
                sep:        { name: 'سپ',        img: '/images/gateways/sep.png' },
                custom:     { name: 'زرینپال',   img: '/images/gateways/zarinpal.png' },
                zarinpal:   { name: 'زرین پال',  img: '/images/gateways/zarinpal.png' },
                behpardakht:{ name: 'به پرداخت', img: '/images/gateways/behpardakht.png' },
                sadad:      { name: 'سداد',      img: '/images/gateways/sadad.png' },
            }
        }
    },
    methods: {
        price(value){
            let text
            let chars = Array.from(`${value/10}`)
            for (let index = 1; index <= chars.length; index++) {
                
                if(index % 3==0){
                    if (chars.length != index) {
                    chars[chars.length-index] = `,${chars[chars.length-index]}`;
                        
                    }
                }

            }
            return chars.join("");;
        },
    goPaymentPage(){
        window.location.href = this.address + '/api/wallet/charge-wallet/' + this.shop_username + '/' + this.amount + '/' + this.selected_gateway
    }
    },
    setup() {
        const cash = ref(0);

        return {
            cash,
        };
    },
    async mounted() {
        try {
            const response = await axios.get(`${apiStore().address}/api/wallet/wallet-info/`, {
                headers: {
                    'Content-type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Token ${useUserStore().userToken}`,
                },
            });
            this.cash = response.data.cash;
            this.available_gateways = response.data.available_gateways || [];
            this.selected_gateway = this.available_gateways[0] || null;
        } catch (error) {
            console.error('Error fetching data from API', error);
        }
    }
};
</script>
