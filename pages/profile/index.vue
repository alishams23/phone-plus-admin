
<template>
  <v-container>
    <v-card elevation="10" rounded="lg">
      <v-row>
        <v-col cols="12" md="4" class="pa-10 ">
          <!-- Seller's Profile Picture -->
          <v-avatar size="150">
            <img src="@/assets/images/users/avatar-1.jpg" height="150" alt="Seller's Profile">
          </v-avatar>
        </v-col>
        <v-col cols="12" md="8" class="py-10">
          <!-- Seller's Name -->
          <h2 class="text-h5">{{ seller.name }}</h2>
          <!-- Seller's Bio/Description -->
          <p>{{ seller.bio }}</p>
          <!-- Contact Information -->
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-phone</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ seller.phone }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ seller.email }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Social Media Links -->
          <v-btn v-for="(link, index) in seller.socialLinks" :key="index" rounded="pill" :href="link.url" color="primary"
            target="_blank" class="mx-2 " outlined>
            <template v-slot:prepend>
              <component :is="link.icon" size="20" stroke-width="1.5" class="iconClass"></component>

            </template>
            {{ link.label }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card rounded="lg"  class="mt-10" elevation="10">
      <v-tabs
      fixed-tabs
        v-model="tab"
       color="primary"
      >
        <v-tab value="one">محصولات</v-tab>
        <v-tab value="two">محصولات فیزیکی</v-tab>
        <v-tab value="three">آموزش‌ها</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <ProductCards />
          </v-window-item>
  
          <v-window-item value="two">
            <physicalProductsCard />
          </v-window-item>
          
          <v-window-item value="three">
            <learningsCard />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

  </v-container>
</template>
  
<script>

/*Call Components*/
import ProductCards from '~/components/dashboard/ProductCards.vue';
import learningsCard from '~/components/dashboard/LearningsCards.vue';
import physicalProductsCard from '~/components/dashboard/PhysicalProductsCards.vue';
import { BrandInstagramIcon, BrandTelegramIcon } from 'vue-tabler-icons';

export default {
  components: { BrandInstagramIcon, BrandTelegramIcon, ProductCards},
  data() {
    return {
      tab:null,
      hover: false,
      top: false,
      right: false,
      bottom: false,
      left: false,
      direction: 'top',
      transition: 'slide-y',
      fab: false,
      seller: {
        
        name: 'John Doe',
        bio: 'Passionate seller of unique handmade items.',
        phone: '+123 456 789',
        email: 'john@example.com',
        socialLinks: [

          { label: 'تلگرام', url: 'https://twitter.com/johndoe', icon: BrandTelegramIcon },
          { label: 'اینستاگرام', url: 'https://www.instagram.com/johndoe', icon: BrandInstagramIcon },
        ],
      },
    };
  },
};
</script>
  
<style scoped>
/* Add your custom styles here to make it beautiful */
</style>

