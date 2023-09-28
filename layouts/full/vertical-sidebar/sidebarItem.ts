import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon, Settings2Icon, UserCircleIcon, CoinsIcon, MessageCircleIcon
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
        to: '/ui/typography'
    },
    {
        title: 'تنظیمات',
        icon: Settings2Icon,
        to: '/icons'
    },
    { header: 'کاری' },
    {
        title: 'امور مالی',
        icon: CoinsIcon,
        to: '/auth/login'
    },
    
    { header: 'ارتباط' },
    {
        title: 'گفت و گو',
        icon: MessageCircleIcon,
        to: '/auth/register'
    },
];

export default sidebarItem;
