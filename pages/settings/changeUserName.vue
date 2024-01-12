<!-- UsernameCheck.vue -->
<template>
    <v-container>
    {{ usernameExists }}
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="username"
            label="یوزرنیم"
            rounded="lg"
            required
            persistent-hint
            variant="outlined"
            color="primary"
           
       
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-alert v-if="usernameExists !== null" variant="tonal" class="rtl my-3"  :type="alertType">
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
  </template>
  
  <script>
import axios from "axios";
import { useUserStore } from '~/store/user';

  export default {
    data() {
      return {
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
    methods: {
      checkUsername() {
        this.loading = true
        axios.post('http://192.168.1.106:8000/api/account/check-username-shop/', { username: this.username },{
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${useUserStore().userToken}`
        },
      })
          .then(response => {
            this.usernameExists = response.data.exists;
            this.setAlertMessage();
          })
          .catch(error => {
            console.error('Error checking username:', error);
          });
        this.loading = false
      },
      setAlertMessage() {
        if (this.usernameExists == false) {
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
  