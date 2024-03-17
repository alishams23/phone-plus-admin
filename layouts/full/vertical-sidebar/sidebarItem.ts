import {
    ApertureIcon,
    CopyIcon,
    Settings2Icon, CoinsIcon, MessageCircleIcon,CubeIcon, ToolIcon, ArticleIcon, MenuIcon, ThreedCubeSphereIcon
} from 'vue-tabler-icons';


export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'خانه' },
    {
        title: 'داشبورد',
        icon: MenuIcon,
        to: '/'
    },
    {
        title: 'تنظیمات',
        icon: Settings2Icon,
        to: '/settings'
    },
    {
        title: 'وبلاگ',
        icon: ArticleIcon,
        to: '/blog'
    },
    { header: 'مالی' },
    {
        title: 'پرداخت‌ محصولات',
        icon: CoinsIcon,
        to: '/paymentProduct'
    },
    {
        title: 'پرداخت‌ فایل ها ',
        icon: CoinsIcon,
        to: '/paymentDigitalProduct'
    },
    { header: 'محصولات' },
    {
        title: 'محصولات',
        icon: CubeIcon,
        to: '/products'
    },
    {
        title: 'محصولات دیجیتال',
        icon: ThreedCubeSphereIcon,
        to: '/digitalProducts'
    },

    { header: 'ارتباط' },
    {
        title: 'گفت و گو',
        icon: MessageCircleIcon,
        to: '/chat'
    },
   

];


export default sidebarItem;
