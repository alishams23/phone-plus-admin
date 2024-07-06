<template>


<v-locale-provider rtl>
  <v-text-field v-model="searchInput" @input="ListUserMessageApi" class="shadow-none px-3 pl-7 pt-0 mt-10 border-0 text-right" bg-color="grey-lighten-3" base-color="primary" label=" جستجو"
  rounded="pill" variant="solo" elevation="0">
  <template v-slot:append-inner>
      <v-avatar size="48" color="transparent">
          <SearchIcon class="text-primary" />
      </v-avatar>
  </template>
</v-text-field>
</v-locale-provider>
<v-alert v-if="contacts.length == 0 " class="mx-7 font-weight-bold"  border="start"  variant="tonal" color="primary" >
  گفتگویی وجود ندارد
</v-alert>
<v-list subheader class="pl-4">
 
  <div v-for="person,index in contacts">
    <v-list-item  v-if="person.contact"  :to="'/chat/' + person.contact.username + '/' + person.room_name + '/' + person.contact.full_name" @click="$emit('get-selected-user', person); selected_user = person.contact.username"  class="py-3 rtl mx-3 rounded-lg my-1">
      {{ selected_user == person.contact.username ? $emit('get-selected-user', person) : '' }}
        <template v-slot:prepend>
            <v-avatar size="50" color="grey-lighten-1" >
                <!-- <v-img v-if="person.contact.shop" :src="address + person.contact.shop.image" class="cover h-full w-full"/> -->
                <v-icon size="20" >
            <UserIcon  />
          </v-icon>
            </v-avatar>
        </template>
        <template v-slot:append>
         
            <v-avatar size="20" class=" text-body-2" color="primary" v-if="person.unread > 0" >{{person.unread}}</v-avatar>
        </template>
         
        <!-- <v-list-item-title v-if="person.contact.shop">{{person.contact.shop.name}}</v-list-item-title> -->
        <v-list-item-title >{{ person.contact.full_name }}</v-list-item-title>
    </v-list-item>
  </div>
</v-list>

 
</template>
<script>
import { useUserStore } from '~/store/user';
import {  SearchIcon, } from 'vue-tabler-icons';


import { UserIcon } from '@heroicons/vue/24/outline'
import { EllipsisVerticalIcon, } from '@heroicons/vue/20/solid'
import { XMarkIcon, } from '@heroicons/vue/24/outline'
import { apiStore } from '~/store/api';

export default {
  props: ["class",],

  computed: {
    address() {
      return apiStore().address
    },
  },
  components: {
  
    EllipsisVerticalIcon,
    XMarkIcon,
    SearchIcon,
    UserIcon
 
  },


  data() {
    return {

      setIntervalVar: null,
      loadingListUserMessage: false,
      contacts: [],
      selected_user: this.$route.params.username,
      searchContact: [],
      searchInput: '',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${useUserStore().userToken}`
      }
    }
  },
  methods: {
    async ListUserMessageApi() {
      await fetch(`${apiStore().address}/api/chat/ChatList/?search=${this.searchInput == null ? '' : this.searchInput}`, {
        headers: this.headers
      })
        .then(response => response.json())
        .then((data) => {
          this.contacts = data
          this.loadingListUserMessage = false


        })
    }, async searchUser() {
      this.loadingListUserMessage = true

      await fetch(`${apiStore().address}/api/chat/Search/?search=${this.searchInput}`, {
        headers: this.headers
      })
        .then(response => response.json())
        .then((data) => {
          this.searchContact = data
          this.loadingListUserMessage = false
        })
    },
  },
  mounted() {
    this.loadingListUserMessage = true
    this.ListUserMessageApi()
    this.setIntervalVar = setInterval(() => {
      this.ListUserMessageApi()
    }, 4000)
  },
  beforeDestroy(){
    clearInterval(this.setIntervalVar)
  }
}
</script>