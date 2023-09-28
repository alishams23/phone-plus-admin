import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, Settings2Icon, UserCircleIcon, CoinsIcon, MessageCircleIcon,CubeIcon, CubeSendIcon
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
        to: '/sample'
    },
    {
        title: 'تنظیمات',
        icon: Settings2Icon,
        to: '/sample'
    },
    { header: 'مالی' },
    {
        title: 'پرداخت‌ها',
        icon: CoinsIcon,
        to: '/sample'
    },
    { header: 'محصولات' },
    {
        title: 'کالاها',
        icon: CubeIcon,
        to: '/sample'
    },
    {
        title: 'ارسال کالا',
        icon: CubeSendIcon,
        to: '/sample'
    },
    { header: 'ارتباط' },
    {
        title: 'گفت و گو',
        icon: MessageCircleIcon,
        to: '/sample'
    },
];

export default sidebarItem;
