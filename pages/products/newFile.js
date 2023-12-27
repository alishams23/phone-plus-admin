import axios from 'axios';
import { useUserStore } from '~/store/user';

export default (await import('vue')).defineComponent({
components: { PhotoIcon, VideoIcon, CheckboxIcon, TextEditor },

data: () => ({
price: 0,
title: null,
description: null,
discount: false,
images: [],
video: null,
value: 0,
imageIds: [],
loadingImage: false,
imagePreviews: [],
categories: [],
}),
mounted() {
this.fetchCategories();
},
methods: {
handleTextChange(newText) {
this.description = newText;
console.log(newText);
},
async fetchCategories() {
try {
const response = await axios.get('http://192.168.1.107:8000/api/product/ListCategories/');
this.categories = response.data; // Assuming the API returns an array
} catch (error) {
console.error('Error fetching categories:', error);
}
},
async sendDataFunc() {
if (this.images && this.images.length) {
this.images.forEach((file, index) => {
let imageFormData = new FormData();

imageFormData.append(`photo`, file);

try {
axios.post('http://192.168.1.107:8000/api/product/AddImageApi/', imageFormData, {
headers: {
'Content-Type': 'multipart/form-data',
Authorization: `Token ${useUserStore().userToken}`
},
}).then((data) => {
this.imageIds.push(data.data.id);

});


} catch (error) {
console.error('Error uploading images:', error);
return;
}
return;
});


}
},
async sendImage() {
this.loadingImage = true;
this.imagePreviews = [];
this.images.forEach(file => {
const reader = new FileReader();
reader.onload = (e) => {
this.imagePreviews.push(e.target.result);
};
reader.readAsDataURL(file);
});
this.sendDataFunc();
this.loadingImage = false;
},
async sendData() {

let formDic = {};
formDic['image'] = this.imageIds;
formDic['title'] = this.title;
formDic['description'] = this.description;
formDic['price'] = this.price;
formDic['discount'] = this.value;

axios.post('http://192.168.1.107:8000/api/product/AddProductApi/', formDic, {
headers: {
Authorization: `Token ${useUserStore().userToken}`
},
})
.then(response => {
// handle success
console.log(response.data);
})
.catch(error => {
// handle error
console.error('Error:', error);
});
},
}
});
