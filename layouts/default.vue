<!-- <script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems from '@/layouts/full/vertical-sidebar/sidebarItem';
import NavGroup from '@/layouts/full/vertical-sidebar/NavGroup/index.vue';
import NavItem from '@/layouts/full/vertical-sidebar/NavItem/index.vue';
import ExtraBox from '@/layouts/full/vertical-sidebar/extrabox/ExtraBox.vue';
import Icon from '@/layouts/full/vertical-sidebar/Icon.vue';

import { Menu2Icon, } from 'vue-tabler-icons';

import NotificationDD from '@/layouts/full/vertical-header/NotificationDD.vue';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const drawer =  ref(false);
const items= [
            { active: true, title: 'آرتا', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
            { active: true, title: 'کامران', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
            { title: 'شایان', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
            { title: 'کیوان', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        ]
</script> -->

<script>
import sidebarItems from '@/layouts/full/vertical-sidebar/sidebarItem';
import settingItems from '@/layouts/full/vertical-sidebar/settingItem';
import NavGroup from '@/layouts/full/vertical-sidebar/NavGroup/index.vue';
import NavItem from '@/layouts/full/vertical-sidebar/NavItem/index.vue';
import ExtraBox from '@/layouts/full/vertical-sidebar/extrabox/ExtraBox.vue';
import Icon from '@/layouts/full/vertical-sidebar/Icon.vue';
// import Logo from '@/assets//logo/Logo.vue';
// Icon Imports
import { Menu2Icon,SearchIcon,Settings2Icon } from 'vue-tabler-icons';
// dropdown imports
import NotificationDD from '@/layouts/full/vertical-header/NotificationDD.vue';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';

export default {
    components: { Menu2Icon, NavGroup, NavItem, ExtraBox, Icon,Settings2Icon,SearchIcon,NotificationDD ,ProfileDD},
  data (){
    return{
        sidebarMenu : shallowRef(sidebarItems),
        settingMenu : shallowRef(settingItems),
        sDrawer : true,
        chat_drawer:false,
        setting_drawer:false,
        items: [
            { active: true, title: 'آرتا', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
            { active: true, title: 'کامران', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
            { title: 'شایان', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
            { title: 'کیوان', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        ]
    }
  },methods:{
    currentRouteCheck(url) {
      return this.$route.name.split("-").includes(url.split('/')[1]);
    },
  }
    }
</script>

<template>
 <v-app>
       <!------Sidebar-------->
       <v-navigation-drawer location="right" elevation="0"  app class="leftSidebar  border-0 curved" color="transparent"  v-model="sDrawer">
        <!---Logo part -->
        <div class=" pa-5  ">
            <!-- <Logo /> -->
           <v-sheet class="d-flex justify-center align-center" color="transparent">
            <v-avatar size="100" justify="center">
                    <img src="@/assets/images/users/avatar-1.jpg" height="100" alt="user" />
                </v-avatar>
            </v-sheet>
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
            <v-list class="pa-6">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu">
                    <!---Item Sub Header -->
                    <NavGroup :item="item" v-if="item.header" :key="item.title" />
                    <!---Single Item-->
                        <v-list-item
                        v-else 
                        :to="item.to == '/chat' || item.to == '/settings'? ''  : item.to"
                        rounded
                        @click="item.to == '/chat' ? (chat_drawer = true,setting_drawer = false)   : item.to == '/settings'? (setting_drawer = true,chat_drawer = false) : null"
                        class="mb-1 text-white"
                        active-class="bg-white text-primary"
                        :disabled="item.disabled"
                        :target="item.type === 'external' ? '_blank' : ''">
                        <!---If icon-->
                        <template v-slot:prepend>
                            <Icon :item="item.icon"  />
                        </template>
                        <v-list-item-title class="rtl text-right">{{item.title }}</v-list-item-title>
                        <!---If Caption-->
                        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
                            {{ item.subCaption }}
                        </v-list-item-subtitle>
                        <!---If any chip or label-->
                        <template v-slot:append v-if="item.chip">
                            <v-chip
                                :color="item.chipColor"
                                class="sidebarchip hide-menu"
                                :size="'small'"
                                :variant="item.chipVariant"
                                :prepend-icon="item.chipIcon">
                                {{ item.chip }}
                            </v-chip>
                        </template>
                    </v-list-item>
                    <!---End Single Item-->
                </template>
            </v-list>
        </div>
    </v-navigation-drawer>

    <v-navigation-drawer  location="left" color="transparent" elevation="0" :class="currentRouteCheck('/chat') ? ' bg-white-important ' : 'curved-white  border-0'"  :temporary="currentRouteCheck('/chat') ? false : true" v-model="chat_drawer" :width="300">
        <v-text-field class="shadow-none px-3 pt-0 mt-10 border-0" bg-color="grey-lighten-3" base-color="primary" label=" search..."
            rounded="pill" variant="solo" elevation="0">
            <template v-slot:append-inner>
                <v-avatar size="48" color="transparent">
                    <SearchIcon class="text-primary" />
                </v-avatar>
            </template>
        </v-text-field>
        <v-list subheader>
            <v-list-item v-for="item,index in items" :to="'/chat/' + index" :key="item.title" class="py-3 rtl mx-3 rounded-lg my-1">
                <template v-slot:prepend>
                    <v-avatar size="50" color="grey-lighten-1">
                        <v-img :src="item.avatar"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:append>
                    <v-avatar size="20" class=" text-body-2" color="primary" v-if="item.active"> 1</v-avatar>
                </template>
                <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    
    <v-navigation-drawer  color="transparent" elevation="0" :class="currentRouteCheck('/settings') ? 'bg-white-important ' : 'curved-white  border-0'" location="left" :temporary="currentRouteCheck('/settings') ? false : true" v-model="setting_drawer" :width="300">

        <div class="rtl d-flex align-center mt-4 mr-10 mb-10">
            <v-avatar color="primary" rounded="lg" size="50">
              <Settings2Icon/>
            </v-avatar>
            <div class=" px-5 font-weight-bold text-h4">
              تنظیمات
            </div> 
          </div>

        <template v-for="(item, i) in settingMenu" >
                        <!---Item Sub Header -->
                        <NavGroup :item="item" v-if="item.header" :key="item.title" />
                        <!---Single Item-->
                            <v-list-item
                            v-else 
                            :to="item.to == '/chat' || item.to == '/settings'? ''  : item.to"
                            
                            @click="item.to == '/chat' ? chat_drawer = true : item.to == '/settings'? setting_drawer = true : null"
                            class="mb-1 mx-8 px-3 py-3 my-4 rounded-lg"
                            variant="flat"
                            color="primary"
                          
                            :disabled="item.disabled"
                            :target="item.type === 'external' ? '_blank' : ''">
                            <!---If icon-->
                            <template v-slot:prepend>
                                <Icon :item="item.icon"  />
                            </template>
                            <v-list-item-title  class="rtl">{{item.title }}</v-list-item-title>
                            <!---If Caption-->
                            <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
                                {{ item.subCaption }}
                            </v-list-item-subtitle>
                            <!---If any chip or label-->
                            <template v-slot:append v-if="item.chip">
                                <v-chip
                                    :color="item.chipColor"
                                    class="sidebarchip hide-menu"
                                    :size="'small'"
                                    :variant="item.chipVariant"
                                    :prepend-icon="item.chipIcon">
                                    {{ item.chip }}
                                </v-chip>
                            </template>
                        </v-list-item>
                        <!---End Single Item-->
                    </template>
    </v-navigation-drawer>

    <!------Header-------->
    <v-app-bar elevation="0" class="rtl bg-glass" height="70" color="transparent" v-if="sDrawer == false" >
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn color="transparent" class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat"
                    size="small">
                    <Menu2Icon size="20" stroke-width="1.5" />
                </v-btn>
                <!-- Notification -->
                <NotificationDD />
            </div>
            <div>
                <!-- User Profile -->
                <!-- <ProfileDD /> -->
            </div>
        </div>
    </v-app-bar>
    <v-main>
        <slot />  
    </v-main>
 </v-app>
</template>

<style scoped>

.text-primary{
    color: rgb(64, 0, 124) !important;
}

.curved {
    padding: 0px 0px 0px 20px;
    background-image:radial-gradient(ellipse 75% 100% at 70% 50%, rgb(98, 0, 238) 89.9%, #ffffff00 90%);
    text-align: center;
    font-family: sans-serif;
    text-transform: uppercase;
  
  }

  .curved-white {
    padding: 0px 20px 0px 0px;
    background-image:radial-gradient(ellipse 60% 100% at 45% 50%, rgb(255, 255, 255) 89.9%, #ffffff00 90%);
    text-align: center;
    font-family: sans-serif;
    text-transform: uppercase;
  
  }

  .bg-white-important{
    background-color: white !important;
  }

</style>