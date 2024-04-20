<!-- UsernameCheck.vue -->
<template>
  <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">

    یوزرنیم شما تغییر کرد
  </v-snackbar>
  <form @submit.prevent="sendData">
    <v-overlay
      :model-value="overlay"
      class="align-center justify-center "
    >
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-progress-circular color="primary" size="32" indeterminate></v-progress-circular>
          </v-col>
            <p class="text-center text-white">!لطفا دوباره وارد شوید</p>
        </v-row>
      </v-container>
    </v-overlay>
    <v-container class="mt-10">
      <v-row>
        <v-col cols="12">
          <v-locale-provider rtl>
            <v-text-field v-model="username" label="آیدی فروشگاه" :rules="usernameRules" rounded="lg" required
              persistent-hint variant="outlined" color="primary"></v-text-field>
          </v-locale-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-alert v-if="usernameExists !== null && isValidUsername(username)" variant="tonal" class="rtl my-3"
            :type="alertType">
            {{ alertMessage }}
          </v-alert>
        </v-col>
      </v-row>

      <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :loading="loading"
        class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
        ثبت
      </v-btn>
    </v-container>
  </form>
  
</template>

<script>
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
  data() {
    return {
      snackbar: false,
      username: useUserStore().usernameShop,
      usernameExists: null,
      alertType: '',
      alertMessage: '',
      loading: false,
      overlay: false
    };
  },
  watch: {
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 3000)
    },
    username: {
      handler: function (val, oldVal) {
        this.checkUsername()
      },

    },
  },
  computed: {


    usernameRules() {
      return [
        v => !!v || 'یوزرنیم اجباری است',
        v => this.isValidUsername(v) || 'یوزرنیم حداقل باید شامل ۶ کاراکتر باشد و شامل کارکتر های !@#$%^&*()-+?=,<>/ و حروف فارسی نباشد ',
      ];
    },
  },
  methods: {
   
    isValidUsername(username) {
      // Regex for disallowed characters.
      const disallowedCharsRegex = /[!@#$%^&*()\-\+?=,<>'/]/;
      // Regex for allowing lowercase English letters and numbers.
      const allowedCharsRegex = /^[a-z0-9]+$/;
      // Check that the username is at least 6 characters long.
      const isLengthValid = username.length >= 6;

      // The username must pass the length check, not contain disallowed characters,
      // and match the allowed characters regex.
      return isLengthValid && !disallowedCharsRegex.test(username) && allowedCharsRegex.test(username);
    },

    async checkUsername() {
      this.username = this.username.toLowerCase();

      this.loading = true
      if (this.username.length >= 6) {
        await axios.post(`${apiStore().address}/api/account/seller-panel/check-username-shop/`, { username: this.username }, {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${useUserStore().userToken}`
          },

        })
          .then(response => {
            this.usernameExists = response.data.exists;
            this.setAlertMessage();
            this.loading = false

          })
          .catch(error => {
            console.error('Error checking username:', error);
          });
      }
    },
    async sendData() {
      
      this.username = this.username.toLowerCase();

      this.loading = true
      await axios.put(`${apiStore().address}/api/account/seller-panel/change-username-shop/`, { username: this.username }, {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },

      })
        .then(response => {
          // this.snackbar = true
          this.overlay=true
          this.loading = false
          setTimeout(() => {
            this.$router.push('/auth/logOut')
          }, 3000);
          
        

        })
        .catch(error => {
          console.error('Error checking username:', error);
          this.loading = false

        });
    },
    setAlertMessage() {
      if (this.usernameExists == true) {
        if (this.usernameExists == this.username.toLowerCase()) {
          this.alertType = 'error';
          this.alertMessage = 'این آیدی قبلا گرفته شده است';
        }else {
          this.alertType = 'info';
          this.alertMessage = 'این آیدی از قبل برای شما ثبت شده';
        }
      } else {
        this.alertType = 'success';
        this.alertMessage = 'این آیدی قابل استفاده است';
      }
    },
  },
};
</script>

<style scoped>
.overlay
{
    background-color: rgba(145, 150, 158, 0.6);
    backdrop-filter: blur(1px);
}
</style>