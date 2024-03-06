<template>
    <v-container>
        <form class="mt-10">
            <v-locale-provider rtl>
                <v-alert rounded="lg" border="start" class="mb-10 ">
                    <div class="pa-3">
                       پس از ثبت نام در سایت زرین پال و درخواست درگاه پرداخت merchantID دریافت شده از زرین پال را در قسمت زیر وارد کنید .
                    </div>
                </v-alert>
               
            </v-locale-provider>
            <v-text-field
            v-model="username"
            label="merchantID"
            :rules="usernameRules"
            rounded="lg"
            required
            persistent-hint
            variant="outlined"
            color="primary"
          ></v-text-field>
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
<script>

</script>