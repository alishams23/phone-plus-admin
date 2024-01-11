import {
    ApertureIcon,
    CopyIcon,
    Settings2Icon,
    UserCircleIcon, LogoutIcon
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
        title: 'اطلاعات کاربری',
        icon: Settings2Icon,
        to: '/settings/'
    },
    {
        title: 'تغییر نام کاربری',
        icon: UserCircleIcon,
        to: '/settings/changeUsername'
    },
    
    {
        title: 'خروج',
        icon: LogoutIcon,
        to: '/settings/exit'
    },
];

export default sidebarItem;
