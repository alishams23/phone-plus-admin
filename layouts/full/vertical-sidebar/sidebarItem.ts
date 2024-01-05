import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, Settings2Icon, UserCircleIcon, CoinsIcon, MessageCircleIcon,CubeIcon, CubeSendIcon, ToolIcon, ArticleIcon
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
        icon: LayoutDashboardIcon,
        to: '/'
    },
    { header: 'عمومی' },
    {
        title: 'پروفایل',
        icon: UserCircleIcon,
        to: '/profile'
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
        title: 'پرداخت‌ها',
        icon: CoinsIcon,
        to: '/payment'
    },
    { header: 'محصولات' },
    {
        title: 'محصولات',
        icon: CubeIcon,
        to: '/products'
    },
    {
        title: 'محصولات دیجیتال',
        icon: ToolIcon,
        to: '/services'
    },
    {
        title: 'ارسال کالا',
        icon: CubeSendIcon,
        to: '/transport'
    },
    { header: 'ارتباط' },
    {
        title: 'گفت و گو',
        icon: MessageCircleIcon,
        to: '/chat'
    },
];

export default sidebarItem;
