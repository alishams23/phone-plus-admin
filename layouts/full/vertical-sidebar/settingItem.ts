import {
    ApertureIcon,
    CopyIcon,
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
    { header: '' },
    {
        title: 'تغییر نام کاربری',
        icon: UserCircleIcon,
        to: '/settings/changeUserName'
    },
    {
        title: 'خروج',
        icon: LogoutIcon,
        to: '/settings/exit'
    },
];

export default sidebarItem;
