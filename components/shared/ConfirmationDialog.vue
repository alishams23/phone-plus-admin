<template>
     <v-locale-provider rtl>
    <div @click="this.dialog = true">
        <slot/>
    </div>
    <v-dialog v-model="dialog"  max-width="290" >
      <v-card class="pa-4" rounded="lg">
        <v-card-title class="headline">حذف آیتم</v-card-title>
        <div class="mb-4 px-4 text-body-1">آیا از انجام این عملیات مطمئن هستید؟</div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="flat" rounded="xl" @click="confirmDelete">تایید</v-btn>
          <v-btn color="black" rounded="xl" text @click="dialog = false">برگشت</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-locale-provider>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        
      };
    },
    methods: {

      confirmDelete() {
      
          this.$emit('delete-item');
          this.dialog = false;
       
      }
    }
  }
  </script>
  