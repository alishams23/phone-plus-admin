<template>
  <div id="sidebar" class="sidebar sidebar-chat border bg-white scrollBarHidden" style="overflow-y: scroll">
    <div class="flex justify-between items-center pt-2 pl-5 relative d-lg-none">
      <div class="d-flex align-items-center">
        <div>
          <!-- <img src="@/static/icon.png" style="width: 40px"> -->
        </div>
        <div>
          <!-- <img src="@/assets/inside/images/treaget2.png" class="mx-3" style="width: 50px"> -->
        </div>
      </div>
      <nuxt-link to="/"
        class=" h-10 w-10 rounded-full bg-treaget treaget-shadow d-flex align-items-center justify-content-center ">
        <i class="fa fa-home text-white p-2"></i>
      </nuxt-link>
    </div>
    <div class="sidebar_inner">
      <div class="border-b px-2 py-2 row">
        <div class="col bg-gray-100  rounded-md">
          <input id="" type="search" placeholder="Search" class="bg-transparent max-h-10 shadow-none"
            v-model="searchInput" @input="searchUser">
          <i class="icon-material-outline-search" />
        </div>
        <button @click="searchInput = ''" class="col-1 mx-2 d-flex align-items-center justify-content-center" v-if="searchInput != ''">
          <i class=" fa fa-times"></i>
        </button>
      </div>
      <!-- user list-->

      <div>
        <div v-if="loadingListUserMessage == false" class="px-1" @click="slideBarDeactivator">

          <div v-if="searchInput != ''">
            
            <nuxt-link v-for="person in searchContact" class=" col-12 p-3 mt-2 hover:bg-gray-100 rounded-10 btn-material"
              :class="
                $route.params.username == person['contact']['username']
                  ? 'bg-gray-100    '
                  : ''
              " type="button" :key="person['contact']['username'] + 'contacts-chat'" :to="{
                  name: 't-chat-username-roomName',
                  params: {
                    username: person.contact.username,
                    user: person.contact,
                    roomName: person.room_name
                  }
                }">
              <Contact :user="person['contact']" :unread="person['unread']" />
            </nuxt-link>
          </div>
          <div v-else>
            
            <nuxt-link v-for="person in contacts" class=" col-12 p-3 mt-2 hover:bg-gray-100 rounded-10 btn-material"
              :class="
                $route.params.username == person['contact']['username']
                  ? 'bg-gray-100    '
                  : ''
              " type="button" :key="person['contact']['username'] + 'contacts-chat'" :to="{
                  name: 't-chat-username-roomName',
                  params: {
                    username: person.contact.username,
                    user: person.contact,
                    roomName: person.room_name
                  }
                }">
              <Contact :user="person['contact']" :unread="person['unread']" />
            </nuxt-link>
          </div>
        </div>
        <div v-if="loadingListUserMessage == true" class="d-flex flex-column align-items-center mt-5">
          <span class="loader" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Contact from '~/components/section/chat/Contact.vue'

import { useUserStore } from '~/store/user'; 
export default {
  components:{Contact},
  data() {
    return {
      setIntervalVar: null,
      loadingListUserMessage: false,
      contacts: [],
      searchContact: [],
      searchInput: '',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${useUserStore().userToken}`
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.setIntervalVar)
  },
  mounted() {
    this.loadingListUserMessage = true
    this.ListUserMessageApi()
    this.setIntervalVar = setInterval(() => {
      this.ListUserMessageApi()
    }, 4000)
  },
  methods: {
    async ListUserMessageApi() {
      await fetch(`${apiStore().address}/api/chat/ChatList/`, {
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
    slideBarDeactivator() {
      document.getElementById('wrapper').classList.remove('sidebar-active')
    }
  }
}
</script>
