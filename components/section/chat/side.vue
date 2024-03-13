<template>



  <v-text-field v-model="searchInput" @input="ListUserMessageApi" class="shadow-none px-3 pt-0 mt-10 border-0" bg-color="grey-lighten-3" base-color="primary" label=" search..."
  rounded="pill" variant="solo" elevation="0">
  <template v-slot:append-inner>
      <v-avatar size="48" color="transparent">
          <SearchIcon class="text-primary" />
      </v-avatar>
  </template>
</v-text-field>


<v-list subheader>
  <v-list-item  v-for="person,index in contacts" :key="person" :to="'/chat/' + person.contact.username + '/' + person.room_name" @click="$emit('get-selected-user', person); selected_user = person.contact.username"  class="py-3 rtl mx-3 rounded-lg my-1">
    {{ selected_user == person.contact.username ? $emit('get-selected-user', person) : '' }}
      <template v-slot:prepend>
          <v-avatar size="50" color="grey-lighten-1" >
              <img :src="address + person.contact.shop.image" class="cover h-full w-full"/>
          </v-avatar>
      </template>
      <template v-slot:append>
          <v-avatar size="20" class=" text-body-2" color="primary" > 1</v-avatar>
      </template>
      <v-list-item-title v-if="person.contact.shop">{{person.contact.shop.name}}</v-list-item-title>
      <v-list-item-title v-else>{{ person.contact.full_name }}</v-list-item-title>
  </v-list-item>
</v-list>

 
</template>
<script>
import { useUserStore } from '~/store/user';


import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
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