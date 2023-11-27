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
import NavGroup from '@/layouts/full/vertical-sidebar/NavGroup/index.vue';
import NavItem from '@/layouts/full/vertical-sidebar/NavItem/index.vue';
import ExtraBox from '@/layouts/full/vertical-sidebar/extrabox/ExtraBox.vue';
import Icon from '@/layouts/full/vertical-sidebar/Icon.vue';
// import Logo from '@/assets//logo/Logo.vue';
// Icon Imports
import { Menu2Icon,SearchIcon } from 'vue-tabler-icons';
// dropdown imports
import NotificationDD from '@/layouts/full/vertical-header/NotificationDD.vue';
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';

export default {
    components: {  NavGroup, NavItem, ExtraBox, Icon,Menu2Icon,SearchIcon,NotificationDD ,ProfileDD},
  data (){
    return{
        sidebarMenu : sidebarItems,
        sDrawer : true,
        drawer:false,
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
       <v-navigation-drawer location="right" elevation="0"  app class="leftSidebar rounded-s-circle overflow-hidden bg-primary"  v-model="sDrawer">
        <!---Logo part -->
        <div class=" pa-5  ">
            <!-- <Logo /> -->
           <v-sheet class="d-flex justify-center align-center" color="primary">
            <v-avatar size="100" justify="center">
                    <img src="@/assets/images/users/avatar-1.jpg" height="100" alt="user" />
                </v-avatar>
            </v-sheet>
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
            <perfect-scrollbar class="scrollnavbar">
                <v-list class="pa-6">
                    <!---Menu Loop -->
                    <template v-for="(item, i) in sidebarMenu">
                        <!---Item Sub Header -->
                        <NavGroup :item="item" v-if="item.header" :key="item.title" />

                        <!---Single Item-->
                
                            <v-list-item
                            v-else 
                            :to="item.to != '/chat' ?  item.to : ''"
                            rounded
                            @click="item.to == '/chat'? drawer = true : null"
                            class="mb-1"
                            color="primary"
                            :disabled="item.disabled"
                            :target="item.type === 'external' ? '_blank' : ''"
                        >
                            <!---If icon-->
                            <template v-slot:prepend>
                                <Icon :item="item.icon"  />
                            </template>
                            <v-list-item-title class="rtl">{{item.title }}</v-list-item-title>
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
                                    :prepend-icon="item.chipIcon"
                                >
                                    {{ item.chip }}
                                </v-chip>
                            </template>
                        </v-list-item>
                    
                

                        
                        <!---End Single Item-->
                    </template>
                </v-list>
            
            </perfect-scrollbar> 
        </div>
    </v-navigation-drawer>


    <!-- <v-navigation-drawer location="right" :temporary="currentRouteCheck('/chat') ? false : true" v-model="drawer" :width="300">

         
        <v-text-field class="shadow-none px-3 pt-0 mt-10" bg-color="grey-lighten-3" base-color="primary" label=" search..."
            rounded="pill" variant="solo-flat">

            <template v-slot:append>

                <v-avatar size="48" color="primary">
                    <SearchIcon  />

                </v-avatar>
            </template>
        </v-text-field>




        <v-list subheader>

            <v-list-item v-for="item,index in items" :to="'/chat/' + index" :key="item.title" class="py-3 rtl">
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
    </v-navigation-drawer> -->


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
