<template>
    <div class="d-flex   justify-content-between align-items-center">
        <div class="col-3">
            <div class=" w-10 h-10 rounded-2xl">
                <img :src="
                    user.image != null
                        ? '' + user.image
                        : getImgUrl('inside/avatar.jpg')
                " class="cover w-full h-full rounded-2xl shadow-lg">
            </div>
        </div>
        <div class="col-9 text-gray-500 px-3">
            <div class="d-flex align-items-center justify-content-end ">
                <h4 class="text-black irsa truncate text-right">
                    {{ user.get_full_name }}
                </h4>
                <div>
                    <div v-if="unread != 0"
                        class="rounded-pill mx-1 text-xs h-6 w-6 align-items-center d-flex justify-content-center bg-treaget text-white">
                        {{ unread }}
                    </div>
                </div>

            </div>

            <p class="irsa text-xs truncate">
                {{ user.bio }}
            </p>

        </div>

    </div>
</template>

<script>
export default {
    props: ["user", "unread"],
    methods: {
        getImgUrl(pic) {
            return require("@/assets/" + pic);
        }
    }
}
</script>

<style></style>