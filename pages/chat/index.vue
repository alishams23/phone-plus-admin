<template>
    <v-app>
        <v-navigation-drawer class=" hidden-sm-and-down" location="left" rail-width="90" rail
            style="position:fixed; top:0; right:0; ">
            <div class="d-flex bg-primary flex-column justify-center align-center" style="height: 100%;">
                <v-btn rounded="xl" elevation="0" size="small" width="50" color="transparent" height="50"
                    class="text-sm text-blue-darken-4 text-white font-weight-black mt-5 mb-auto">چت</v-btn>

                <v-btn v-for="(item, index) in menu" variant="flat" :key="item + '+sidebar'" elevation="0" size="x-small"
                    width="50" height="50" class="my-3 custom-rounded-1" color="transparent">
                    <v-icon size="40">
                        <component :is="item.icon" stroke-width="1.5" class="text-white"></component>
                    </v-icon>

                </v-btn>

                <v-btn rounded="xl" elevation="0" size="small" width="45" height="45" class="mt-auto mb-5 custom-rounded-1"
                    color="indigo-darken-3">
                    <v-icon>
                        <Logout2Icon />
                    </v-icon>

                </v-btn>
            </div>
        </v-navigation-drawer>
        <v-navigation-drawer location="left" v-model="drawer" :width="300">

            <v-toolbar color="transparent" class="py-5">
                <v-btn icon>
                    <v-avatar size="50">
                        <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>


                    </v-avatar>
                </v-btn>

                <v-toolbar-title>New Chat</v-toolbar-title>

            </v-toolbar>
            <v-text-field class="shadow-none px-3 pt-0" bg-color="grey-lighten-3" base-color="primary" label=" search..."
                rounded="pill" variant="solo-flat">

                <template v-slot:prepend>

                    <v-avatar size="48" color="primary">
                        <SearchIcon  />

                    </v-avatar>
                </template>
            </v-text-field>




            <v-list subheader>

                <v-list-item v-for="item in items" :key="item.title" class="py-3">
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

        <v-main>
            <v-app-bar :elevation="0" class=" border-b">
                <v-avatar color="indigo-darken-4" size="48" style="font-size:9px" class="me-9  ms-md-4">
                    J O
                </v-avatar>
                <div class=" font-weight-bold text-h5">Jason Oner</div>
            </v-app-bar>
            <v-list>


                <v-list-item v-for="(item, i) in messages" :key="i" :class="(item.sent ? 'text-right' : '')">
                    <v-card pill v-if="item.sent">
                        <div class="d-flex justify-end align-center">
                            <div class="bg-grey-lighten-3 mx-3  rounded-be-0 rounded-pill px-5 py-3">
                                {{ item.msg }}
                            </div>
                            <v-avatar right>
                                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                            </v-avatar>

                        </div>
                    </v-card>
                    <v-card pill v-else>
                        <div class="d-flex justify-start align-center">
                            <v-avatar right>
                                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                            </v-avatar>
                            <div class="bg-grey-lighten-3 mx-3  rounded-bs-0 rounded-pill px-5 py-3">
                                {{ item.msg }}
                            </div>

                        </div>
                    </v-card>
                </v-list-item>


            </v-list>

            <v-bottom-navigation height="70" elevation="0" color="transparent">
                <v-row class="px-3 py-2">
                    <v-col cols="11">
                        <v-text-field class="shadow-none" bg-color="grey-lighten-3" elevation="10" label=" پیام شما ..." rounded="pill"
                            variant="solo-flat"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-avatar color="primary" size="48">
                            <SendIcon />
                        </v-avatar>
                    </v-col>
                </v-row>

            </v-bottom-navigation>
        </v-main>

    </v-app>
</template>

<script>
import { Circle0FilledIcon, SendIcon, SearchIcon, Home2Icon, Logout2Icon } from 'vue-tabler-icons';

export default {
    components: { Circle0FilledIcon, SendIcon, SearchIcon, Home2Icon, Logout2Icon },
    setup() {
        definePageMeta({
            layout: "chat",
        })
    },
    data: () => ({
        menu: [
            {
                icon: Home2Icon,
                to: '/home',
                login: false
            },
            {
                icon: SendIcon,
                to: '/explore',
                login: false

            },
            {
                icon: SearchIcon,
                to: '/profile',
                login: true

            },
            {
                icon: SearchIcon,
                to: '/blog',
                login: false

            },
        ],
        drawer: true,
        items: [
            { active: true, title: 'Jason Oner', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
            { active: true, title: 'Ranee Carlson', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
            { title: 'Cindy Baker', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
            { title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        ],
        items2: [
            { title: 'Travis Howard', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
        ],
        messageNew: {
            text: null
        },
        messages: [
            { msg: 'Real-Time', avatar: 'https://cdn.vuetifyjs.com/images/john.png', sent: false },
            { msg: 'Audience', avatar: 'https://cdn.vuetifyjs.com/images/john.png', sent: true },
            { msg: 'Conversions', avatar: 'https://cdn.vuetifyjs.com/images/john.png', sent: false },
            { msg: 'reaas', avatar: 'https://cdn.vuetifyjs.com/images/john.png', sent: false },
        ],

        user_item: 0,
        user_items: [
            { text: 'My Files', icon: 'mdi-folder' },
            { text: 'Shared with me', icon: 'mdi-account-multiple' },
            { text: 'Starred', icon: 'mdi-star' },
            { text: 'Recent', icon: 'mdi-history' },
            { text: 'Offline', icon: 'mdi-check-circle' },
            { text: 'Uploads', icon: 'mdi-upload' },
            { text: 'Backups', icon: 'mdi-cloud-upload' },
        ],
    }),
    methods: {
        sendMessage() {
            this.messages.push({
                msg: this.messageNew.text,
                avatar: 'https://cdn.vuetifyjs.com/images/john.png',
                sent: true
            })
            this.messageNew.text = null;
        }
    }
}
</script>