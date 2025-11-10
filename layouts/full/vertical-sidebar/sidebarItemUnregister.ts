import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, Settings2Icon, ScanEyeIcon, UserCircleIcon, CoinsIcon, MessageCircleIcon,CubeIcon, LogoutIcon, CubeSendIcon, ToolIcon, ArticleIcon
} from 'vue-tabler-icons';
import { useUserStore } from '~/store/user'; 

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

const sidebarItemUnregister: menu[] = [
    { header: 'خانه' },

    {
        title: 'تکمیل ثبت‌نام',
        icon: ScanEyeIcon,
        to: '/authentication'
    },
    {
        title: 'قوانین',
        icon: ArticleIcon,
        to: '/terms'
    },
    {
        title: 'خروج',
        icon: LogoutIcon,
        to: '/auth/logOut'
    },
   
   
   

];


export default sidebarItemUnregister;
