import type { recentTrans, productPerformanceType, productsCards } from '@/types/dashboard/index';

/*--Recent Transaction--*/
const recentTransaction: recentTrans[] = [
    {
        title: '09:30',
        subtitle: 'پرداخت جدید ثبت شد',
        textcolor: 'primary',
        boldtext: false,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '10:00',
        subtitle: 'فروش جدید ثبت شد',
        textcolor: 'secondary',
        boldtext: true,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '17:00',
        subtitle: 'درخواست خدمات جدید ثبت شد',
        textcolor: 'success',
        boldtext: false,
        line: true,
        link: 'برو به صفحه',
        url: ''
    },
    {
        title: '19:30',
        subtitle: 'فروش جدید ثبت شد',
        textcolor: 'warning',
        boldtext: true,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '20:30',
        subtitle: 'ورود جدید ثبت شد',
        textcolor: 'error',
        boldtext: true,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '22:00',
        subtitle: 'پرداخت جدید ثبت شد',
        textcolor: 'success',
        boldtext: false,
        line: false,
        link: '',
        url: ''
    },
]

/*Basic Table 1*/
const productPerformance: productPerformanceType[] = [
    {
        id: 1,
        name: 'محمد کریمی',
        post: 'mhm_karimi',
        pname: 'هدفون',
        status: 'در انتظار ارسال',
        statuscolor: 'primary',
        budget: '285'
    },
    {
        id: 2,
        name: 'علی صالحی',
        post: 'ali_salehi',
        pname: 'Macbook Air',
        status: 'ارسال شده',
        statuscolor: 'secondary',
        budget: '900'
    },
    {
        id: 3,
        name: 'سامان روشنی',
        post: 'saman021',
        pname: 'اپل آیدی',
        status: 'انجام شده',
        statuscolor: 'success',
        budget: '150'
    },
    {
        id: 4,
        name: 'امیر باقری',
        post: 'amirbagheri',
        pname: 'Macbook Air',
        status: 'ارسال شده',
        statuscolor: 'secondary',
        budget: '900'
    }

];

/*--Products Cards--*/
import proimg1 from '@/assets/images/products/s4.jpg';
import proimg2 from '@/assets/images/products/s5.jpg';
import proimg3 from '@/assets/images/products/s7.jpg';
import proimg4 from '@/assets/images/products/s11.jpg';
const productsCard: productsCards[] = [
    {
        title: 'هدفون',
        link: '/',
        photo: proimg1,
        salesPrice: 375,
        price: 285,
        rating: 4
    },
    {
        title: 'MacBook Air ',
        link: '/',
        photo: proimg2,
        salesPrice: 650,
        price: 900,
        rating: 5
    },
    {
        title: 'هدفون',
        link: '/',
        photo: proimg1,
        salesPrice: 375,
        price: 285,
        rating: 4
    },
    {
        title: 'MacBook pro ',
        link: '/',
        photo: proimg2,
        salesPrice: 9000,
        price: 10000,
        rating: 5
    },
 
];


export { recentTransaction, productPerformance, productsCard }