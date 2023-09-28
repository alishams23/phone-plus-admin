import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon
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
        title: 'پزوفایل',
        icon: TypographyIcon,
        to: '/ui/typography'
    },
    {
        title: 'تنظیمات',
        icon: MoodHappyIcon,
        to: '/icons'
    },
    { header: 'کاری' },
    {
        title: 'امور مالی',
        icon: LoginIcon,
        to: '/auth/login'
    },
    {
        title: 'کسب و کار',
        icon: CopyIcon,
        to: '/ui/shadow'
    },
    
    { header: 'ارتباط' },
    {
        title: 'دورهی',
        icon: UserPlusIcon,
        to: '/auth/register'
    },
    {
        title: 'گفت و گو',
        icon: UserPlusIcon,
        to: '/auth/register'
    },
];

export default sidebarItem;
