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
      <div class=" font-weight-bold text-h5">{{username}}</div>
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
              <div v-if="data.content" class="bg-primary mx-3  rounded-be-0 rounded-pill px-5 py-3">
                {{ data.content }}
              </div>
            </div>
          </v-card>
          <v-card elevation="0" v-else>
            <div class="d-flex justify-start align-center">
              <div v-if="data.content" class="bg-grey-lighten-3 mx-3  rounded-bs-0 rounded-pill px-5 py-3">
                {{ data.content }}
              </div>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
     
    </v-main>
  </v-app>
  <v-bottom-navigation v-if="username != null && loadingGetMessage == false" height="70" elevation="0"
    color="transparent">
    <v-row class="px-3 py-2 ">
      <v-col cols="9" sm="10" md="11">
        <v-text-field @keyup.enter="sendMessage()" variant="solo" v-model="inputData" class="shadow-none"
          bg-color="grey-lighten-3" elevation="10" label=" پیام شما ..." rounded="lg" required></v-text-field>
      </v-col>
      <v-col>
        <v-avatar @click="sendMessage()" color="primary" class="mt-1" size="48">
          <SendIcon size="20" />
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

  computed:{
    address(){
        return apiStore().address
    },
  },
}
</script>