<script>

import settingItems from '@/layouts/full/vertical-sidebar/settingItem';
import sidebarItems from '@/layouts/full/vertical-sidebar/sidebarItem';
import sidebarItemUnregister from '@/layouts/full/vertical-sidebar/sidebarItemUnregister';
import NavGroup from '@/layouts/full/vertical-sidebar/NavGroup/index.vue';
import NavItem from '@/layouts/full/vertical-sidebar/NavItem/index.vue';
import ExtraBox from '@/layouts/full/vertical-sidebar/extrabox/ExtraBox.vue';
import Icon from '@/layouts/full/vertical-sidebar/Icon.vue';
import Side from '@/components/section/chat/side.vue';
// import Logo from '@/assets//logo/Logo.vue';
// Icon Imports
import { Menu2Icon, SearchIcon, Settings2Icon ,ExternalLinkIcon } from 'vue-tabler-icons';
// dropdown imports
import ProfileDD from '@/layouts/full/vertical-header/ProfileDD.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from 'axios';

export default {
    components: { Menu2Icon, NavGroup, NavItem, ExtraBox, Icon, Settings2Icon, SearchIcon, ProfileDD, Side,ExternalLinkIcon },
    data() {
        return {
            sidebarMenu: shallowRef([]),
            sidebarItemsData: sidebarItems,
            sidebarItemUnregisterData: sidebarItemUnregister,
            settingMenu: shallowRef(settingItems),
            sDrawer: true,
            countMessage: 0,
            chat_drawer: false,
            setting_drawer: false,

        }
    },
    mounted() {

        this.sidebarMenu = useUserStore().status == 's' ? this.sidebarItemsData : this.sidebarItemUnregisterData
        this.getMessage()
        setInterval(() => {
            this.getMessage()
        }, 10000);

    },
    computed: {
        address() {
            return apiStore().address
        },
        shop_username() {
            return useUserStore().usernameShop
        },
        user_status(){
            return useUserStore().status 
        }
    },

    methods: {
        currentRouteCheck(url) {
            return this.$route.name.split("-").includes(url.split('/')[1]);
        },
        getMessage() {
            axios.get(`${apiStore().address}/api/chat/unread-messages/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.countMessage = response.data.count
            })
        },
    },

    beforeMount() {
        const userStore = useUserStore();
        if (!userStore.userToken) {
            // If the userToken does not exist, redirect to the login page
            this.$router.push('/auth');
        } else if (userStore.status != 's')
            this.$router.push('/authentication');
    },
}
</script>

<template>
    <v-app>
        <!------Sidebar-------->
        <div :class="setting_drawer == true || chat_drawer == true ? 'd-none d-md-block  ' : ''">
            <v-navigation-drawer :touchless="true"  location="right" elevation="0" app class="leftSidebar  border-0 curved"
                :color="chat_drawer == true | setting_drawer == true ? 'white' : 'transparent'" v-model="sDrawer">
                <!---Logo part -->
                <div class=" px-5 pt-2  " v-if="user_status == 's'">
                    <!-- <Logo /> -->
                   <a :href="`https://phoneplus.ir/` + shop_username" target="blank"> 
                     <v-sheet class="d-flex justify-center align-center ml-5" color="transparent">
                    
                         <v-tooltip text="مشاهده ی فروشگاه">
                             <template v-slot:activator="{ props }">
                                 <v-avatar v-bind="props" size="100" justify="center" color="indigo-lighten-4">
                                     <v-img cover :src="address + '/api/account/shop-profile/' + shop_username + '/'"
                                         height="100" alt="user" />
                    
                                 </v-avatar>
                    
                             </template>
                    
                         </v-tooltip>
                    
                    
                     </v-sheet>
                    <v-avatar color="primary" class="me-14 shadow-xl" size="25" style="margin-top: -60px;">
                        <ExternalLinkIcon size="15" class="text-white"  />
                    </v-avatar>
                   </a>
                </div>
                <!-- ---------------------------------------------- -->
                <!---Navigation -->
                <!-- ---------------------------------------------- -->
                <div>
                    <v-list class="pt-0 mt-0">
                        <!---Menu Loop -->
                        <template  v-for="(item) in sidebarMenu">

                            <!---Item Sub Header -->
                            <NavGroup :item="item" v-if="item.header" :key="item.title" />
                            <!---Single Item-->

                            <v-list-item v-else :to="item.to == '/chat' || item.to == '/settings' ? '' : item.to"
                                variant="elevated" elevation="0"
                                @click="item.to == '/chat' ? (chat_drawer = true, setting_drawer = false) : item.to == '/settings' ? (setting_drawer = true, chat_drawer = false) : null"
                                class=" text-white  rounded-e-lg bg-transparent ml-n5 mr-n3"
                                :class="currentRouteCheck(item.to) ? 'bg-white-important  text-primary' : ''"
                                active-class="bg-white-important  text-primary" :disabled="item.disabled"
                                :ripple="false" :target="item.type === 'external' ? '_blank' : ''">
                                <!---If icon-->
                                <template v-slot:append>
                                    <Icon :item="item.icon" class="ml-3" />
                                </template>
                                <v-list-item-title class="rtl text-right ">{{ item.title }}</v-list-item-title>
                                <!---If Caption-->
                                <v-list-item-subtitle v-if="item.subCaption" class="text-caption  hide-menu">
                                    {{ item.subCaption }}
                                </v-list-item-subtitle>
                                <!---If any chip or label-->
                                <template v-slot:append v-if="item.chip">
                                    <v-chip :color="item.chipColor" class="sidebarchip hide-menu" :size="'small'"
                                        :variant="item.chipVariant" :prepend-icon="item.chipIcon">
                                        {{ item.chip }}
                                    </v-chip>
                                </template>
                                <template v-slot:prepend v-if="item.to == '/chat' && countMessage != 0">
                                    <v-badge class="ml-10" color="red" :content="countMessage" inline></v-badge>
                                </template>

                            </v-list-item>
                            <!---End Single Item-->
                        </template>
                    </v-list>
                </div>
            </v-navigation-drawer>
        </div>

        <v-navigation-drawer location="right" :touchless="true" color="transparent" elevation="0"
            :class="currentRouteCheck('/chat') ? 'curved-white  border-0 ' : 'curved-white  border-0'"
            :temporary="currentRouteCheck('/chat') ? false : true" v-model="chat_drawer" :width="300">
            <Side />
        </v-navigation-drawer>

        <v-navigation-drawer color="transparent" :touchless="true" elevation="0"
            :class="currentRouteCheck('/settings') ? 'curved-white  border-0 ' : 'curved-white  border-0'"
            location="right" :temporary="currentRouteCheck('/settings') ? false : true" v-model="setting_drawer"
            :width="300">

            <div class="rtl d-flex align-center mt-4 mr-10 mb-10">
                <v-avatar color="primary" rounded="lg" size="50">
                    <Settings2Icon />
                </v-avatar>
                <div class=" px-5 font-weight-bold text-h4">
                    تنظیمات
                </div>
            </div>

            <template v-for="(item, i) in settingMenu">
                <!---Item Sub Header -->
                <NavGroup :item="item" v-if="item.header" :key="item.title" />
                <!---Single Item-->
                <v-list-item v-else :to="item.to == '/chat' || item.to == '/settings' ? '' : item.to"
                    @click="item.to == '/chat' ? chat_drawer = true : item.to == '/settings' ? setting_drawer = true : null"
                    class="mb-1 mx-8 px-3 py-3 my-4 rounded-lg" variant="flat" color="primary" :disabled="item.disabled"
                    :target="item.type === 'external' ? '_blank' : ''">
                    <!---If icon-->
                    <template v-slot:prepend>
                        <Icon :item="item.icon" />
                    </template>
                    <v-list-item-title class="rtl">{{ item.title }}</v-list-item-title>
                    <!---If Caption-->
                    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
                        {{ item.subCaption }}
                    </v-list-item-subtitle>
                    <!---If any chip or label-->
                    <template v-slot:append v-if="item.chip">
                        <v-chip :color="item.chipColor" class="sidebarchip hide-menu" :size="'small'"
                            :variant="item.chipVariant" :prepend-icon="item.chipIcon">
                            {{ item.chip }}
                        </v-chip>
                    </template>
                </v-list-item>
                <!---End Single Item-->
            </template>
        </v-navigation-drawer>

        <!------Header-------->
        <div class="openchat" @click="chat_drawer = !chat_drawer">
        </div>
        <v-app-bar elevation="0" class="rtl bg-glass" height="70" color="transparent"
            v-if="sDrawer == false && currentRouteCheck('/chat') != true">
            <div class="d-flex align-center justify-space-between w-100">
                <div>
                    <v-btn color="transparent" class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted"
                        @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                        <Menu2Icon size="20" stroke-width="1.5" />
                    </v-btn>
                    <!-- Notification -->

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
.text-primary .v-list-item__content .v-list-item-title {
    color: rgb(64, 0, 124) !important;
}

.text-primary .v-list-item__append .icon-tabler {
    color: rgb(64, 0, 124) !important;
}


@media (min-width: 1280px) {
    .curved {
        padding: 0px 0px 0px 0px;
        background-image: radial-gradient(ellipse 75% 100% at 70% 50%, rgb(98, 0, 238) 89.9%, #ffffff00 90%);
        text-align: center;
        font-family: sans-serif;
        text-transform: uppercase;

    }
}

@media (max-width: 1280px) {
    .curved {
        padding: 0px 0px 0px 0px;
        background-color: rgb(98, 0, 238) !important;
        text-align: center;
        font-family: sans-serif;
        text-transform: uppercase;

    }
}

@media (min-width: 1280px) {
    .curved-white {
        padding: 0px 0px 0px 25px;
        background-image: radial-gradient(ellipse 75% 100% at 70% 50%, rgb(255, 255, 255) 89.9%, #ffffff00 90%), radial-gradient(ellipse 75% 100% at 69.8% 50%, rgb(198, 198, 198) 89.9%, #ffffff00 90%);
        text-align: center;
        font-family: sans-serif;
        text-transform: uppercase;
    }
}

@media (max-width: 1280px) {
    .curved-white {
        padding: 0px 0px 0px 25px;
        background-color: rgb(255, 255, 255) !important;
        text-align: center;
        font-family: sans-serif;
        text-transform: uppercase;
    }
}


.bg-white-important {
    background-color: white !important;
}
</style>