<template>
  <v-container>
    <v-row align="center">
      <v-col cols="4">
        <v-locale-provider rtl  >
        <v-text-field
        label="جستجو"
        rounded="lg"
        persistent-hint
        variant="outlined"
        color="primary"
        dense
        
       class="mt-5 text-body-2"
   
      >
      <template v-slot:prepend-inner>
    
          <SearchIcon color="gray" />

        
      </template>
      <template v-slot:prepend>
        <v-btn v-bind="props" variant="tonal" color="primary"  rounded="lg" size="50"  >
          <SortDescending2Icon />
        </v-btn>       
      </template>
    </v-text-field>
    </v-locale-provider>
      </v-col>
      <v-col cols="8" class="rtl d-flex align-center">
        <v-avatar color="primary" rounded="lg" size="50">
          <BoxIcon/>
        </v-avatar>
        <div class=" px-5 font-weight-bold text-h4">
          محصولات
        </div> 
      </v-col>
    </v-row>
 <v-row>
  <v-col  v-for="product in products"
  :key="product.id" cols="6">
    <v-card
    elevation="10"
    rounded="lg"
    class="my-5 rtl mx-3"
  >
      <div class="d-flex flex-no-wrap justify-space-between">
          <div class="pa-5 d-flex align-start flex-column ">
            <v-card-title class="text-h5 font-weight-bold">
              {{ product.name }}
            </v-card-title>
            <v-card-text class="text-line-1">
              {{ product.description }}
            </v-card-text>
            <v-card-actions class="mt-auto">
              <v-btn
                class="px-10"
                variant="flat"
                rounded="xl"
                color="primary"
              >
                ویرایش
                <template v-slot:append>
                  <PencilIcon size="15" />
                </template>
              </v-btn>
            </v-card-actions>
          </div>
          <v-avatar
            size="230"
            rounded="0"
          >
            <v-img :src="product.image"></v-img>
          </v-avatar>
      </div>
  </v-card>
  </v-col>
 </v-row>
  </v-container>
  <VLayoutItem model-value position="bottom" class="text-end" size="88">
   
    <v-dialog width="500">
  <template v-slot:activator="{ props }">
    <div class="ma-4">
      <VBtn v-bind="props"  icon="" size="large" color="primary" elevation="8" >
        <v-icon>
          <PlusIcon />
        </v-icon>
      </VBtn>
    </div>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card class="px-15 rounded-lg my-20 " title="">
      <AddProduct />
    </v-card>
  </template>
</v-dialog>
  </VLayoutItem>
</template>
<script>
import { PencilIcon,PlusIcon,BoxIcon,SearchIcon,FilterCogIcon, SortDescending2Icon } from 'vue-tabler-icons';
import proimg1 from '@/assets/images/products/s4.jpg';
import proimg2 from '@/assets/images/products/s5.jpg';
import AddProduct from '@/pages/products/add_product.vue';

export default {
 components:{
   PencilIcon,
   PlusIcon,
   SortDescending2Icon,
   BoxIcon,
   SearchIcon,
   FilterCogIcon,
   AddProduct
 },
 name: "ProductCard",
 data() {
   return {
     products: [
      {
        id: 1,
        name: 'هدفون',
        description: ' با هدفون بی‌سیم EchoBeats، صدایی باکیفیت و زنده را در هر لحظه از روز تجربه کنید. طراحی ارگونومیک و وزن سبک این هدفون باعث می‌شود که در طول استفاده‌های طولانی‌مدت نیز احساس راحتی کنید. با باتری‌ای که تا ۲۴ ساعت دوام می‌آورد، EchoBeats همیشه آماده پخش موسیقی مورد علاقه شماست.',
        image: proimg1
      },
      {
        id: 2,
        name: 'Macbook Air',
        description: 'MacBook Air Elegance: بیانی از زیبایی و کارایی، بسته‌بندی شده در یک قاب باریک و سبک که تجربه‌ای بی‌نظیر از قدرت و سرعت را در اختیار شما قرار می‌دهد.',
        image: proimg2 
      },
      {
        id: 3,
        name: 'نگهدارنده مغناطیسی اتومبیل DriveGrip',
        description: 'نگهدارنده مغناطیسی DriveGrip با طراحی خلاقانه‌اش، گوشی شما را در زمان رانندگی محکم و استوار نگه می‌دارد. با قابلیت چرخش ۳۶۰ درجه، هر زاویه‌ای که نیاز دارید در دسترس است.',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhISEhISExUVFRIXFxcWExgWFhYXFRYWFxUVFxgYHiggGBolGxUVITEiJSorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslICItLi0yLSswLTUwLS8tLS0tLTAtLy0rLS0tLS8tLS0tLS8tKy0tLy0tKy0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAUCAwYHAQj/xABBEAACAQIDBQQGCAQFBQEAAAAAAQIDEQQhMQUSQVFhBnGBkQcTIjJioSNCUnKCscHRFDNDU5Ki4fDxFSRjwsMI/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAIDBAEFBv/EAC4RAQACAgAFAgQEBwAAAAAAAAABAgMRBBIhMVFBYRMiMpFx4fDxIzNCgaGx0f/aAAwDAQACEQMRAD8A9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADku2XpBwez7wnL1te2VGm05Lk5vSmu/PkmB1pUbW7S4XD/za9KD+OpGHzk18jwHtN6UNoYu8Y1P4Wk7+xRbTa+Kr7zfdurocTKV22829W82+98TkxM9pdiYfpldv8HN7sMZhE+H00L+bdmWMNozklKNS6ejVmn3NH5VLLYW3cRhJ7+HqOGd3B5059Jw0ffquDRmycPeesXn9fgsrkrHer9PUtpVFraXev1RZ4TFxmssmtUcV2X25DG4aniILd3spwvdwnHKcG+Nno+KafEuKVVxaktV8+hhx8XfHbluutjraNw6UGFKopRUlo0mu55mZ7DIAAAAAAAAAAAAAAAAAAAAAAAAGvE4iFOMp1JRhCKblKTSjFLVtvRGja206OGpTr15xp04K8pPySXFtuySWbbSR+de3/buvtOp6uG9Tw0XeFO+crPKpVtq+UdF1eYHS+kD0tzqOWH2dKUIaSxFrTnzVJPOEfi1fC2r8vp4WUm3JvNttvOTbd223xfNknD4dR6vn+xJSJxDjVRwsVwT78yZBrSyt3ZGuMTYkSFftTAxS34K1veXDvRVnR4lLcl91/kc4Rkeneg7GPextG/s/RVUuTe9Gb8bQ8j1Y8h9B1K9fHT5Qox/xOT/9D1+KPC4uv8a39v8ATbi+iFzseV6UejkvKTt8iaV+w/5KfNyf+Zlgerg/l1/CGW/1SAAtRAAAAAAAAAAAAAAAAAAAIu1No0sPSnXrTVOnTW9KT4L9W3ZJLNtpEmckk22kkrtvJJLVs/OXpP7bS2jX9TQb/haUnuf+WaydaXw6qK5Z6uyCD287ZVtqV1k6eHpt+qpN6cPWVLZOo15J2XFunoUVFWRnh8Ooq3z5m7cJxDjDdM4xCRnFHQSNiifYmxI6Ie0Z7tOXXJeOvyuc+yy2zXvLdWkfz4/sV1PDzqShSpq86sowiusnZfmQmSHsfoU2fuYGdZ61605L7kPYX+ZTO/xE92Epck/maNi7Ojh6FGhD3acIQT57qtd9W7vxI+1sTvV6GEj71S9SXSEZRjn0blY8DJab3mY9XoVjlh1eyIbtGkvhT88/1JhjCKSSWiSXkZHt0ry1iPDDM7nYACTgAAAAAAAAAAAAAAAAAUfbTtFDAYSriZWbirU4v69SWUI9183ySb4Aedemztm1fZuHlnJJ4mSekZZxoeKs5dGl9ZnmGBwu6s9X/uxGw1SdWpOtVk5zlKUpSespyd5PzZaU5k4hwcT42ZNmuSOj4kZxQSNsQEYGrE19yLfHh3m6cij2lid52Wi0/cSIc5XeZ3noa2D67Ezxk19HQvCn1qyXtP8ADF+dRcjhcHhKlerToUVepVkoxXDPVvkkrtvkj9J9m9i08Jh6WHp+7COb4yk85TfVtt/Iw8Zl5acsd5XYabnfhZuSSbeSSbb5Jas57YVTfrVMXJWc2ty/1acbqmvG7b7yR2kx1tzDxzc05VH9mnH83KVopcfa5WJuHwDVOKazte3LkvA8ncx2a+kr3C7QUtScmcVvygy32ftPqbMHGz2uovh9YX4MKVRSV0ZnpxMTG4ZgAHQAAAAAAAAAAAAAD89emztK8TjFhKbvSwz3XbSVeWU3+FWh0e+e29rttLB4PEYl2bpwbinpKb9mnHxm4rxPyvgN6dRzk3KXtSk3q5SebfVttnYFjRpbqSXD/bNqPh9RNxvhIOBhBG9ID5CBthTR8iiBtPae7eENeL5d3UDTtfGJNwi/vP8AQpKtS2bPtSZ3How7FPFTji8RH/t4SvTi/wCtOL1txpp+bVtLlWTJFK81kq1m06h1Poj7IuhD+NrxtWqxtTi9adJ53a4Slk+itzZ6Wsk2+Cb8FqYLrkjTipTnGVOHs3tvStfdXBJcX04voeHkyTe3NZt1FY1Cg2XSdXEyqT134OXFb2lKiuapxe8+cpX5nc1aRzXZbZc6depv+zBKEoU9XFNzW9Un9arOV5S5Wis7HWyRZjpuJlXkt1jSkxWFuVFam4O6OrnTKrH4e5Vlx6WUvt92Vj9DoIyurnDU5OEjqtk4jeVjVwWfrySqzU9VgAD1GYAAAAAAAAAAAAAeUf8A6D2nu4XDYZSzq1XOS5wpR49N+cH4Hjexl7/4f1O+9PtfexeHXCNOqv8ANC/5Hney66jJp5KXHqKW3GyVwz7FGe6ZxiWOEIGxK2bIuIx8IXzu+Sz/AOCnxu0ZTy0XJaePM5sTdobU+rTyXGX7fuU8pGMpcWdv2D7ASxe7XxKlDD6xhmp1lz5xh11fDmVZMtaRzWSrWbTqEX0fdiJ4+arVlKOFi+51mnnCL4R5yXcs7te9YahGMYwhFRjFJRSVkklZJJaJGGFw8YxjCnFRjFKMYxVkkskklojbiZqKa8+vwo8bNmnLO57NtKRSNR3RsViON7RWnxNfXfwrh58jLYm0YOnOrKW5SppT3pZb29d+slxXKK5Z6u0anaP0vsS91+8uEuUH8PPnppcl7E2HKtVVatveppuLpU27RqVY3+nlHiovKN75x3lbJurF899Q7kiIpuXT7Pp5ObTi6j3mnqlZKKa4OyzXNslAHoRERGoY2MkQsTAmzZDrMpy9VuPuoMdRJOwsTaUU+dvPIY1Fbh57s0Y62ml4nw02jcad2DXh6qlGMlxX/JsPoYncbh5wADoAAAAAAAAAADwb0y4FzhTxKV9yrUjJ8o1GrN9N6MV+I8qP0ntTBxmq1GolKMnOMk+KbaZ4Z2j7J18LNpRnUp3e7JLelb4klf8AElbTR+ysXCcRE7pbvErctPWFJTxM45KUkuV8vmfamKnLWTfiRpVUuKJeA2fXr/yKFarna8INxT6ytZeJumYjuq00XM8LQnUnGlShKpUlpCKu3+y6na7E9GWInaWKqKhH7FNqdV9HL3Y9/tdx6NsLYmHwkdzD0lC/vS1nL703m+7RcEY8vG0p0r1lbTDM93L9jfRvGDjWx27Ums40VZ04ff8Aty6e73np1CDeSRFwVpSavpbefCPK/V8FqyRisYo+xBPrzf3raLotTy8mS155rz+vZqrWK9KttfFRprJ3el1q39mHN9SnrzqTaWjfBaQX6yfyLTCYdJ7885aLlBco9eb8CVFRTukkyM1tb2SjUIuzdmJWlNeD/X9i9hUIKqGaql+OIpGoQvE27p6qB1CEqp8dYt51Xw0idQi1ahhOsRqtYpvdbWmmrFSKitUUbyk7KN23ySzb8iZiaxS2/iJbq/kp/SS+3b+lHmvtPldcXu5JncrYh3HZSpOWFpOatJxi2uTaTa82y3Iuy6TjSgnq1d97zt8yUfRYY1jrE+HnXndpAAWIgAAAAAAAAAA5ftDQ3am9wmr+Ksn+nmU2IpKStJKS5NXXkztNrbOjXpuDbi9YyXvQktJL9tGm1xODxs6+He5iaT6VaacoSXO2sX0zPH4vhbRfnr2lqxZImNS5/bHZSNRudGviMPU4ONWcodzg5ZL7rRyWLxG28HLOdWvBPJ7vr4SXXLfj427z0aG0KT/qJd6afla5vo4um/dVWo/gg0vOVirHmvXpaNx7/wDU5xxPbo4/ZPbrF1UoLZdepU0vTc4wb/HD2F3tnT4TDYqcfWY2dPBUsn6qlNTrPmp137MF0gt74ol9g6VeplGKprjb25+LfsrxuWmH7NQedb2763bb8/q+HmW0pOSfkpr37/k5MxX6pVFGp7KhSh6qmtG1Z55tqLzberlLO+eZCnga8ZudOqmvsNLTj3v4r+B0W18AqdnBWjpZaK3DuKunXzMmbHat5rZdjvGtw0w2nKOVWnKPVZr52fyJtHHRl7rv+fkzdTrp5O1uplKjT+yl3ZfLQ5WlvS33Sma+GHrh/EGGMwMKkd1uW7e6StGz8F+ZV1OzkXpiMVH7tSC/+ZPVoRjS4/iD48QVMdgRsk8RinZ3zqQd+j9jQtsJQUIqCu0uLefjay+RzrPqTEMZVHyt35fmVONx1RTdOnRnOWV3ZqCvzlp5tdLnQXS4LwI1aoLV1G5krPso1s2c3evUuv7cMo/ilq10Xi2XeycFvTUUrRXJWSXJcuRqaOj2VhPVwz1lm+nJFnC4py31PaEM2TVU4AHvMAAAAAAAAAAAAAAGM4JqzSafBq6MgBXy2Lh27+ph4Ky8lkbqezqMdKcV4EoEPh18QlzT5fIpLJZH0EXaeI9XSnJa2su95L8yVpisTM+jkRudK3be1F7VKCUn9ZvNLoupylLaCU3Gp7D4X0lfimb6srO/n38zTiMNCrG0kmvmuqfBnz+bNOW3Nb9noY6RWNLGLN0JHP4PZlem2qdbejwU9V0/3Yu6ba96Ml1jaS8tfkURMxK6aR6Sl7wciHWxtKLs52fxJr80Yf8AUKX9yH+It+JKE0t4T7hzIMdp0f7kPM+f9SpcJ733Yyl+SOcxGO0+iXOoR5T4vRfIqMftqrfdoYec3zkt2K77/uQFg8RVd8TUW7/bp5J9JMR17ylyTHd1eysdTc4ytvQv73Dldc0mdemcBQdlaKVlplp3cjpezuMbXqpPRXi+nFeH6m7gc0Vt8PyyZ6b+ZdgA9ZkAAAAAAAAAAAAAAAAAAAK7tAvoZdHF+TRYmnGUN+EofaTXjwfmQy15qTWPWEqzqYlxVWKkrrNNJ+ZClRlHTNfNEmanTk4yTy1jxXWPNdPFcnnSkmrrPu+a7z5y269JenWNstkzc57rLz+FKrCVd134lvQ2itGjTw84rdLd0MkXr2QcXhotWkrrk9CrqbNo8aUfmXu0akdyUo66lD/FTdv2/wBCGbHEW6O0vbTZQwNFPKnFeBY08MuGXcRsJUvKN7Zl1FxR3Dhi3WXLZJhR4+DUkuhAjh25Z+S/Vl3tGO9KMo8Lp+JHVLO5G9YrM6IlHVL/AILLYq+mguSlfus/1KzG46NN7kV6yq1lBPRP6039SPXyTeRcdk8G0pVZu8ndX0Tva9lwirJLueruyzhqTOWqGWdUl0QAPdYAAAAAAAAAAAAAAAAAAAAABB2nsyFZK/syWkl+T5o5zEbNlSleUF95aPlf/U7E+NGXPwtMvXtK2mWaOXjhYSWUpRfX2kJYGSzvB9zt+Zf1MBB6Ld7svkaZbPfCS8cjLbgfb7NEcR7ufrSUUt6Sj1lZLzZrdajL+pRf44/uXVTZ1To/EiVNlVX9RP8AFH9zPOC9Z+mU/ixPrCDTr0U1apRu8lapG+fLMsFRfH5/6nyns2t9m34l+5Kp7MqfCvH9iVMN5/plyclfMIzw64tL5/kUtd1ZNxlUUY6JUk1Lpebd79yR1cNlL60m+7IlYfB04e7FJ8+PmXRwd58R/mVc54jt1c7sfs5ZXlHci3dr68nzk3n4vM6inBJJJWSVkjIG7Fgrijp92e95tPUABcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=' 
      },
      {
        id: 4,
        name: 'محافظ صفحه نمایش CrystalClear',
        description: 'با CrystalClear، صفحه نمایش گوشی خود را از خط و خش و آسیب‌های روزمره محافظت کنید. نصب آسان و شفافیت بی‌نظیر برای تجربه‌ای ناب از تماشای ویدیوها و مرور وب.',
        image: 'data:image/jpeg;base64,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' 
      },
      {
        id: 5,
        name: 'کیس شارژر PowerCase',
        description: 'PowerCase نه تنها گوشی شما را محافظت می‌کند، بلکه با باتری داخلی‌اش، عمر شارژ دستگاه را دوبرابر می‌کند. برای زندگی پرمشغله امروزی، همراهی ایده‌آل است.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAdse-WR8ybVFW2J6Brm7MSpjafavDSloQQ&usqp=CAU' 
      },
      {
        id: 6,
        name: 'هدفون بی‌سیم FreedomBudss',
        description: 'آزادی کامل را با FreedomBuds تجربه کنید. هدفون‌های بی‌سیمی که با کیفیت صدای عالی و اتصال پایدار، شما را به موسیقی متصل می‌کنند.',
        image: 'data:image/jpeg;base64,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' 
      },
      {
        id: 7,
        name: 'پاوربانک SolarCharge',
        description: 'SolarCharge با قابلیت شارژ خورشیدی، انرژی را از نور خورشید جذب می‌کند و به برق تبدیل می‌کند. همیشه و هرجا که نیاز داشته باشید، شارژ اضافی در اختیارتان است.',
        image: 'data:image/jpeg;base64,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cL5e87/dlzMvUp06Isoux95Pqf7D0kSrObub8F3D7y+GaYqbQ2KfhTe2hI4LwHP4crrA4VnZKdNCWY7KqBck55AceO4fGVOz8G9R1p0kLuxsAup3+7iTuAPqOyd0u6qYNdtrPXYeJ9Qo/Kl9BxOp+QJVu6Xd1cJSG1Y1WA221twQHgOO858LbFESAiIgIiICIiAiIgIiICIiAiIgIiICIiBgO8dLZVawQkjwuVFyKeZ2rDM7LWPIFpoPfXD02pU6wK7VwoII8akE5cbWv8Z1uab3j7j0q93o2pvmStvAxOuQ8p5jLlvnLfw0W1Y1InExz9W9NfhpNJjMOWYuiq0MMwHib2pY7zapZfgMpQbC1P8ADmv7QgCp7PZzzyBvf36cple2OycRQRKVakUCGpsPqrh227XGVwb79LaS3qupwXsww21rXK79kp5rbxna81zaKx+fwjFbWmfTb82DpY2qiVlVsqiFH3Aqd5A1IztfS54mUsJiPZ0g5/KvvJH7y4NDwtfhPMP2Zt01S52lZbW3kAZfGa8MROWPFMxjsp4NWYbbLssxJI+n2902DsLsCvi32KKZA+N2yRPVt55C5m0d1v4du+zUxd0TdSBs7fzMPKOQ8X8s6hhcKlJFSmgVVFlVRYD3CSMJ3X7r0sEp2fHUYeNyLE8lH4V5b95NhbYoiQEREBERAREQEREBERAREQEREBERAREQEREBERApvTDAggEHUEXB9QZgsb3NwVQ3NEIeNMlB/wCkeH5TYYgajT/h7gQGDK73/M5GzzGxs/O8vuxO6WFwjFqaFmJuGc7RXkuWXrrzmwRAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED/2Q==' 
      },
       // ... اضافه کردن سایر محصولات
     ],
   };
 },
};
</script>

<style scoped>
.product-image {
 height: 200px; /* Adjust the height as needed */
}
.text-line-1 {
 display: block;/* or inline-block */
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
}
</style>
