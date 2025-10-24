import {
    ApertureIcon,
    WalletIcon,
    Settings2Icon,
    CheckIcon,
    UserCircleIcon, LogoutIcon,MenuOrderIcon
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
    {
        title: 'اطلاعات  فروشگاه',
        icon: Settings2Icon,
        to: '/settings/'
    },
    {
        title: ' نام کاربری فروشگاه',
        icon: UserCircleIcon,
        to: '/settings/changeUsername'
    },
    {
        title: '  چینش محصولات   ',
        icon: MenuOrderIcon,
        to: '/settings/showProfile'
    },
    {
        title: ' درگاه پرداخت  ',
        icon: WalletIcon,
        to: '/settings/wallet'
    },
    {
        title: ' اینماد  ',
        icon: WalletIcon,
        to: '/settings/enamad'
    },
    
    
];

export default sidebarItem;
