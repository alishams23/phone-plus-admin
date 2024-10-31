import {
    ApertureIcon,
    CopyIcon,
    Settings2Icon, CoinsIcon, MessageCircleIcon,CubeIcon, ToolIcon, ArticleIcon, MenuIcon, ThreedCubeSphereIcon,BuildingStoreIcon,LogoutIcon
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
        title: 'مقاله ها',
        icon: ArticleIcon,
        to: '/blog'
    },
    { header: 'مالی' },
    {
        title: 'پرداخت‌ ها',
        icon: CoinsIcon,
        to: '/paymentProduct'
    },
    
    { header: 'محصولات' },
    {
        title: 'محصولات فیزیکی',
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
    {
        title: 'خروج',
        icon: LogoutIcon,
        to: '/auth/logOut/'
    },
   

];


export default sidebarItem;
