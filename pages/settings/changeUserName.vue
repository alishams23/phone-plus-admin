<!-- UsernameCheck.vue -->
<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="primary" elevation="24" rounded="lg">
      
       یوزرنیم شما تغییر کرد
      </v-snackbar>
   <form @submit.prevent="sendData" >
    <v-container class="mt-10">
        <v-row>
          <v-col cols="12">
            <v-locale-provider rtl>
            <v-text-field
              v-model="username"
              label="یوزرنیم"
              :rules="usernameRules"
              rounded="lg"
              required
              persistent-hint
              variant="outlined"
              color="primary"
            ></v-text-field>
        </v-locale-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-alert v-if="usernameExists !== null && isValidUsername(username)" variant="tonal" class="rtl my-3"  :type="alertType">
              {{ alertMessage }}
            </v-alert>
          </v-col>
        </v-row>
       
        <v-btn
        rounded="lg"
        persistent-hint
        variant="flat"
        color="primary"
        :loading="loading"
        class="mx-2 px-10 text-body2 font-weight-bold mb-5"
        type="submit">
        ثبت
    </v-btn>
      </v-container>
   </form>
  </template>
  
  <script>
import axios from "axios";
import { useUserStore } from '~/store/user';

  export default {
    data() {
      return {
        snackbar:false,
        username: '',
        usernameExists: null,
        alertType: '',
        alertMessage: '',
        loading:false,
      };
    },
    watch: {
    username: {
      handler: function (val, oldVal) {
        this.checkUsername()
      },
     
    },},
    computed: {
  
 
      usernameRules() {
        return [
          v => !!v || 'یوزرنیم اجباری است',
          v => this.isValidUsername(v) || 'یوزرنیم حداقل باید شامل ۶ کاراکتر باشد و شامل کارکتر های !@#$%^&*()-+?=,<>/ نباشد ',
        ];
      },
    },
    methods: {
        isValidUsername(username) {
        const disallowedCharsRegex = /[!@#$%^&*()\-\+?=,<>'/]/;
        const isLengthValid = username.length >= 6;
        return isLengthValid && !disallowedCharsRegex.test(username);
      },
      async checkUsername() {
        this.username = this.username.toLowerCase();

        this.loading = true
        await axios.post('http://192.168.225.128:8000/api/account/check-username-shop/', { username: this.username },{
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
      },
      async sendData() {
        this.username = this.username.toLowerCase();

        this.loading = true
        await axios.put('http://192.168.225.128:8000/api/account/change-username/', { username: this.username },{
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
        
      })
          .then(response => {
            this.snackbar = true
        this.loading = false

          })
          .catch(error => {
            console.error('Error checking username:', error);
          });
      },
      setAlertMessage() {
        if (this.usernameExists == true) {
          this.alertType = 'error';
          this.alertMessage = 'یوزرنیم وجود دارد';
        } else {
          this.alertType = 'success';
          this.alertMessage = 'یوزرنیم وجود ندارد';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here if needed */
  </style>
  