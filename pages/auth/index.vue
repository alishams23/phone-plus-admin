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
                 <form  @submit.prevent="Login" >
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field label="یوزرنیم" required rounded="lg" v-model="username" persistent-hint variant="outlined"
                        color="primary" class="mt-16" />
                      <v-text-field label="پسورد" required v-model="password" rounded="lg" persistent-hint variant="outlined"
                        color="primary" type="password" />
                      <v-row>
                        <v-col cols="12" class="text-right rtl">
                          <span class="caption text-primary ">فراموشی رمز عبور</span>
                        </v-col>
                      </v-row>
                      <v-btn type="submit" class="mt-16" size="large" elevation="0" rounded color="primary" :loading="loading" dark block tile>ورود</v-btn>
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
import axios from 'axios'
export default {
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
  data: () => ({
    step: 1,
    rules: {
      required: value => !!value || 'Field is required',
    },
    generalError: false,
    username: "",
    password: "",
    loading: false,
  }),
  props: {
    source: String
  },
  methods: {
    async Login() {
      this.loading = true;
      const userStore = useUserStore();
      try {
        const response = await axios.post("http://192.168.225.128:8000/api/account/login/", {
          username: this.username,
          password: this.password,
        });
        if (response.status === 200) {
          userStore.setToken(response.data.token);
          this.loading = false;
          this.$router.push("/");
        } else {
          // Handle other HTTP status codes (e.g., 401 for unauthorized)
          this.loading = false;
          this.generalError = true;
        }
      } catch (error) {
        // Handle network errors or unexpected exceptions
        this.loading = false;
        this.generalError = true;
        // Log the error to the console
        console.error("API error:", error);
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
  