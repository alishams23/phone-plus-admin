<template>
  <v-app height="100%">
    <v-card height="100%" elevation="0">

      <v-window v-model="step" class=" h-100">
        <v-window-item :value="1" class=" h-100">
          <v-row class="h-100">
            <v-col cols="12" md="6" class="h-100">
              <v-card-text class="mt-12" height="100%">
                <h4 class="text-center text-h4 my-10 font-weight-black">ورود به اکانت</h4>
                <v-locale-provider rtl>
                 <form v-if="state == 'login' " @submit.prevent="sendLoginSms" >
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <div v-if="error" class="  text-red-accent-4 d-flex justify-start pl-3 pt-1 ">
                      {{ error }}
                      </div>
                      <v-text-field
                        v-model="phoneNumber"
                        :rules="[rules.required, rules.phoneNumber]"
                       label="شماره موبایل" required rounded="lg"
                       persistent-hint variant="outlined"
                        color="primary" class="mt-16" />

                      <v-btn type="submit" class="mt-16" size="large" elevation="0" rounded color="primary" :loading="loading" dark block tile> دریافت کد</v-btn>
                    </v-col>
                  </v-row>
                 </form>
                 <form v-if="state == 'get_login_code' " @submit.prevent="check_code" >
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <div v-if="error" class="  text-red-accent-4 d-flex justify-start pl-3 pt-1 ">
                      {{ error }}
                      </div>
                      <v-text-field
                        v-model="code"
                        :rules="[rules.required, rules.number]"
                       label="کد را وارد کنید" required rounded="lg"
                       persistent-hint variant="outlined"
                        color="primary" class="mt-16" />
                    <div @click="state='login'"  class="  text-indigo-accent-4 d-flex justify-end pl-3 pt-1 cursor-pointer">
                      تغییر شماره  {{ phoneNumber }} 
                    </div>
                      

                      <v-btn
                        type="submit"
                        class="mt-16"
                        size="large"
                        elevation="0"
                        rounded
                        color="primary"
                        :loading="loading"
                        dark
                        block
                        tile>
                        
                      <div >
                        ورود
                      </div>
                      </v-btn>
                      <div v-if="isCooldownActive" class="text-indigo-accent-2 d-flex  justify-center pt-5">
                        {{ Math.floor(cooldownTime / 60) }}:{{ ('0' + cooldownTime % 60).slice(-2) }}  تا تلاش مجدد
                      </div>
                      <div v-else @click="state='login'" class="text-indigo-accent-4 d-flex justify-center cursor-pointer pt-5">
                        دریافت مجدد کد
                      </div>
                    </v-col>
                  </v-row>
                 </form>
                </v-locale-provider>
              </v-card-text>
            </v-col>
            <v-col cols="12" md="6" class="bg-primary rounded-bl-xl h-100">
              <div style="  text-align: center; padding: 180px 0;">
                <v-card-text class="white--text">
                  <h3 class="text-center font-weight-black text-h3 rtl">اکانتی نداری؟</h3>
                  <div class="text-center mt-3">
                    از قبل اکانتی برای پنل ادمین به ثبت نرسانده اید؟
                  </div>
                </v-card-text>
                <div class="text-center">
                  <v-btn tile rounded variant="outlined" dark @click="step++" class="mt-10 font-weight-bold px-15">ثبت
                    نام</v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item :value="2" class=" h-100">
          <v-row class=" h-100">
            <v-col cols="12" md="6" class="bg-primary rounded-br-xl h-100">
              <div style="  text-align: center; padding: 180px 0;">
                <v-card-text class="white--text">
                  <h3 class="text-center font-weight-black text-h3 rtl">اکانتی داری؟</h3>
                  <div class="text-center mt-3">
                    از قبل اکانتی برای پنل ادمین به ثبت رسانده اید؟
                  </div>
                </v-card-text>
                <div class="text-center">
                  <v-btn tile rounded variant="outlined" dark @click="step--" class="mt-10 font-weight-bold px-15">ورود
                  </v-btn>

                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="h-100">
              <v-card-text class="mt-12">
                <h4 class="text-center text-h4 my-10 font-weight-black">ثبت نام </h4>
                <v-locale-provider rtl>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field label="نام" rounded="lg" persistent-hint variant="outlined" color="primary"
                            class="mt-4" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="نام خانوادگی" rounded="lg" persistent-hint variant="outlined"
                            color="primary" class="mt-4" />
                        </v-col>
                      </v-row>
                      <v-text-field label="ایمیل" rounded="lg" persistent-hint variant="outlined" color="primary" />
                      <v-text-field label="شماره تلفن" rounded="lg" persistent-hint variant="outlined" color="primary" />
                      <v-text-field label="پسورد" rounded="lg" persistent-hint variant="outlined" color="primary"
                        type="password" />

                      <v-btn class="mt-16" size="large" elevation="0" rounded color="primary" dark block tile>ثبت
                        نام</v-btn>



                    </v-col>
                  </v-row>
                </v-locale-provider>
              </v-card-text>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card>
  </v-app>
</template>
  
<script>

import { useUserStore } from '~/store/user'; 
import { apiStore } from '~/store/api'; 
import axios from 'axios'
export default {
  props: {
    source: String
  },
  data: () => ({
    error: null,
    isCooldownActive: false,
    cooldownTime: 120, // 2 minutes in seconds
    state: 'login',
    step: 1,
    rules: {
      required: value => !!value || 'این فیلد اجباری است',
      phoneNumber: value => {
        const pattern = /^\d{11}$/; // Updated to check for exactly 11 digits
        return pattern.test(value) || 'شماره باید ۱۱ رقم باشد';
      },
      number: value=>{
        const pattern = /^[0-9]*$/;
        return pattern.test(value) || 'باید از اعداد استفاده شود';
      }
    },
    generalError: false,
    phoneNumber: '',
    code: null, 
    loading: false,
  }),
  computed: {
    userToken() {
      return useUserStore().userToken;
    },
  },

  setup() {
    definePageMeta({
      layout: "chat",
    })
  },
  methods: {
    startCooldown() {
      const intervalId = setInterval(() => {
        if (this.cooldownTime > 0) {
          // Decrease the cooldown time
          this.cooldownTime -= 1;
        } else {
          // Reset cooldown state and time, then clear interval
          this.isCooldownActive = false;
          this.cooldownTime = 120; // Reset to 2 minutes
          clearInterval(intervalId);
        }
      }, 1000); // Update every second
    },
    sendLoginSms() {
        // Ensure the phone number is not empty
        if (this.phoneNumber) {
            const apiUrl = `${apiStore().address}/api/account/login-sms/`;
            const data = {
                number: this.phoneNumber // Assuming the API expects the full number with country code
            };
            this.loading = true
            axios.post(apiUrl, data,{
                        headers: {
                            'Content-Type': 'multipart/form-data',
                          
                        },
                    })
                .then(response => {
                    // Handle success response

                
                    this.state = 'get_login_code' 
                    this.error = null
                    this.loading = false
                    this.isCooldownActive = true;
                    this.startCooldown();

                    // You can change the dialog page or show a success message here
                })
                .catch(error => {
                    // Handle error response
                    this.error = 'کاربری با این شماره وجود ندارد'
                    this.loading = false
                    console.log(error.response.status);
                    // You can show an error message to the user here
                });
        } else {
            // Phone number is empty, handle accordingly
            console.error('Phone number is empty');
            // You can show an error message to the user here
        }
    },
    check_code() {
        // Ensure the phone number is not empty
        this.loading = true
        if (this.code ) {
            const apiUrl = `${apiStore().address}/api/account/admin/code-check/`;
            const data = {
                number: this.phoneNumber, // Assuming the API expects the full number with country code
                code  : this.code
            };
            axios.post(apiUrl, data,{
                        headers: {
                            'Content-Type': 'multipart/form-data',
                          
                        },
                    })
                .then(response => {
                    // Handle success response
                    console.log(response);
                    const userStore = useUserStore();
                    userStore.setToken(response.data.token,response.data.username,response.data.status);
                    this.$router.push(`/`);
                    // You can change the dialog page or show a success message here
                })
                .catch(error => {
                  this.error = 'کد معتبر نیست'
                  this.loading = false
                  // Handle error response
                  console.error('Error sending SMS:', error);
                  // You can show an error message to the user here
                });
        } else {
            // Phone number is empty, handle accordingly
            console.error('Phone number is empty');
            // You can show an error message to the user here
        }
    }
  }
}
</script>
<style scoped>
.full-card {
  width: 100%;
  height: 100%;
}

.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}

.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>
  