<template>
  <v-app-bar :elevation="0" class=" border-b rtl d-flex justify-space-between align-center" >
  
     <div class="d-flex align-center">
      <v-btn @click=" openDrawer" color="transparent" class="hidden-lg-and-up mr-5 ms-md-3 ms-sm-5 ms-5 text-muted" 
        icon variant="flat" size="small">
        <Menu2Icon size="20" stroke-width="1.5" />
      </v-btn>
      <v-avatar  color="indigo-lighten-4" size="48" style="font-size:9px" class="me-9  ms-md-4">
        <v-icon size="20">
          <UserIcon  />
        </v-icon>
        <!-- <v-img :src="address + '/api/account/shop-profile/' + username + '/'"></v-img> -->
      </v-avatar>
      <div class=" font-weight-bold text-h6">{{$route.params.name}}</div>
     </div>
    
      <nuxt-link to="/" class="mr-auto ml-3" >
        <v-btn @click=" openDrawer" color="transparent" class="hidden-lg-and-up mr-auto ms-md-3 ms-sm-5 ms-5 text-muted" 
          icon variant="flat" size="small">
          <Home2Icon size="20" class="text-black" stroke-width="1.5" />
        </v-btn>
      </nuxt-link>
    

  </v-app-bar>
  <v-app>
    <!--  message-->
    <v-main>
      <div v-if="username == null" class="pt-5 mt-5 px-5">
        <div class="flex items-center justify-center">
          <div>گفت و گوی جدیدی را آغاز کنید</div>
        </div>
      </div>
      <v-list class="mt-12" v-else>
        <v-list-item v-for="data, index in messages" :key="data.id + 'message-chat-'"
          :class="(data.username == userSelf ? 'text-right' : '')">
          <v-card elevation="0" v-if="data.username == userSelf">
            <div class="d-flex justify-end align-center">
              <div v-if="data.content" class="bg-primary mx-0  rounded-be-0 rounded-xl px-5 py-3">
                {{ data.content }}

                
              </div>
            </div>
            <v-card class="pe-3" elevation="0" v-if="data.created_at">
              <div class="d-flex justify-end align-center">
                <div v-if="data.read == 'True'" >
                  <svg v-if="data.username == userSelf" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-check2-all me-1 mt-1 text-blue-300" viewBox="0 0 16 16">
                    <path
                      d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                    <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                  </svg>
                </div>
                <div v-else>
                  <svg v-if="data.username == userSelf" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-check2 me-1 mt-1 text-gray-400" viewBox="0 0 16 16">
                    <path
                      d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
                <div class="text-grey text-caption">
                  {{ convertToJalaali(data.created_at) }}
                </div>
              </div>
            </v-card>
          </v-card>
          <v-card elevation="1" v-else>
            <div class="d-flex justify-start align-center">
              <div v-if="data.content" class="bg-grey-lighten-3 mx-0  rounded-bs-0 rounded-xl px-5 py-3">
                {{ data.content }}
              </div>
            </div>
            <v-card class="ps-3" elevation="0" v-if="data.created_at">
              <div class="d-flex justify-start align-center">
                <div class="text-grey text-caption">
                  {{ convertToJalaali(data.created_at) }}
                </div>
              </div>
            </v-card>
          </v-card>
        </v-list-item>
      </v-list>
    </v-main>
  </v-app>
  <v-bottom-navigation v-if="username != null && loadingGetMessage == false" height="70" elevation="0"
    color="transparent">
    <v-row class="px-3 py-2 ">
      <v-col cols="9" sm="10" md="11">
        <v-locale-provider rtl>
        <v-text-field @keyup.enter="sendMessage()" variant="solo" v-model="inputData" class="shadow-none rtl"
          bg-color="grey-lighten-3" elevation="10" placeholder="پیام شما..."  rounded="pill" required></v-text-field>
        </v-locale-provider>
        </v-col>
      <v-col>
        <v-avatar @click="sendMessage()" color="primary"  class="mt-1" size="48">
          <SendIcon size="25" />
        </v-avatar>
      </v-col>
    </v-row>
  </v-bottom-navigation>
</template>

<script>
import { apiStore } from '~/store/api';

import {
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'
import { useUserStore } from '~/store/user';
import { Circle0FilledIcon, SendIcon, SearchIcon, Home2Icon, Logout2Icon, Menu2Icon,UserIcon } from 'vue-tabler-icons';
import moment from 'moment-jalaali';

export default {
  components: { UserIcon,PaperAirplaneIcon, Circle0FilledIcon, SendIcon, SearchIcon, Home2Icon, Logout2Icon, Menu2Icon },

  data() {
    return {
      test: [],
      message: [],
      messages: [],
      inputData: '',
      username: this.$route.params.username,
      userSelf: useUserStore().username,
      scrollStatus: true,
 
      counter: 0,
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${useUserStore().userToken}`
      },
      setInterval2: null,
      setInterval3: null,
      loadingGetMessage: false,
      chatSocket: null
    }
  },
  mounted() {
    if (
      this.$route.params.roomName == null
    ) {
      if (this.$route.params.username != null) {
        fetch(
          `${apiStore().address}/api/chat/ChatRetrieve/${this.$route.params.username}/`,
          {
            headers: this.headers
          }
        )
          .then(response => response.json())
          .then((data) => {
            this.username = data.contact.username
            this.$route.params.username = this.username
            this.user = data.contact
            this.$route.params.user = this.user
            this.roomName = data.room_name
            this.$route.params.roomName = this.roomName
            this.$forceUpdate();
          })
      } else {
        this.slideBarActivator()
      }
    } else {
      this.connectToWebsocket(this.$route.params.roomName)
    }
  },
  beforeDestroy() {
    if (this.chatSocket != null) {
      this.chatSocket.close()
    }
  },
  methods: {
    convertToJalaali(dateString) {
      const jalaaliDate = moment(dateString).format('jMM/jDD HH:mm');
      return jalaaliDate;
    },
    openDrawer(){
      document.getElementsByClassName("openchat")[0].click()
    },
    sendMessage() {
      if (this.inputData != null && this.inputData != '') {
        this.chatSocket.send(
          JSON.stringify({
            command: 'new_message',
            room_name: this.$route.params.roomName,
            message: this.inputData
          })
        )
        this.inputData = ''
      }
    },
    scrollMessage() {
      if (this.loadingGetMessage == false) {
       
        window.scrollTo(0, document.body.scrollHeight);
      }
    },
    addMessage(data) {
      this.messages.push(data)
    },
    async connectToWebsocket(roomName) {
      this.loadingGetMessage = true
      this.chatSocket = new WebSocket(
        `${apiStore().ws}` + '/ws/chat/' + roomName + '/' + useUserStore().userToken + '/'
      )
      this.chatSocket.onopen = (e) => {
        this.chatSocket.send(
          JSON.stringify({ command: 'fetch_message', room_name: roomName })
        )
      }
      this.chatSocket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.command === 'fetch_message') {
          this.messages = data.message
          this.loadingGetMessage = false
          this.$nextTick(() => {
            this.scrollMessage()
          })
        } else if (data.command === 'new_message') {
          this.addMessage(data)
          this.$nextTick(() => {
            this.scrollMessage()
          })
          this.chatSocket.send(
            JSON.stringify({ command: 'read_message', room_name: roomName, message: data.id })
          )
        } else if (data.command === 'img') {
          this.addMessage(data)
          this.$nextTick(() => {
            this.scrollMessage()
          })
        } else if (data.command === 'read_message') {
          for (var i in this.messages) {
            if (this.messages[i].id == data.id) {
              this.messages[i].read = 'True';
              this.$forceUpdate();
            }
          }
        }
      }
      this.chatSocket.onclose = (e) => {
        console.error('Chat socket closed unexpectedly')
      }
    },

  },

  watch: {
  $route(to, from) {
    if (this.chatSocket) {
      this.chatSocket.close();
    }
  }
},
  computed:{
    address(){
        return apiStore().address
    },
  },
}
</script>