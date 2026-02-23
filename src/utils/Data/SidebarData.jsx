import { HiOutlineBuildingLibrary, HiOutlineHome, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BsKey, BsPeople } from 'react-icons/bs';
import { RiFundsLine, RiOrderPlayFill } from 'react-icons/ri'
import { PiGift, PiTreeStructure } from 'react-icons/pi'
import { LiaWalletSolid } from 'react-icons/lia';
import { VscSignIn } from 'react-icons/vsc';
import { ProductionQuantityLimits } from '@mui/icons-material';

export const menuItems = [
    {
        icon: <HiOutlineHome />,
        title: "Dashboard",
        link: '/dashboard',
        type: 'item'
    },
    // broker
    {
        icon: <BsPeople />,
        title: "Brokers",
        link: '/brokers',
        type: 'item'
    },
    // customers
    {
        icon: <BsPeople />,
        title: "Customers",
        link: '/customers',
        type: 'item'
    },
    // colony
    {
        icon: <PiTreeStructure />,
        title: "Colony",
        link: '/colony',
        type: 'item'
    },
    // {
    //     icon: <PiTreeStructure />,
    //     title: "Marker",
    //     link: '/marker',
    //     type: 'item'
    // },
    
];

export const checkActiveMenu = (link, activePath) => {
    if (activePath?.includes(link))
        return 'text-blue-600 bg-blue-200';
    return 'text-gray-400'
}

export const modeItems = [
    { icon: <HiOutlineSun />, title: 'Light' },
    { icon: <HiOutlineMoon />, title: 'Dark' }
]