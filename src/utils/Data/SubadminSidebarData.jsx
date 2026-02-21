import { HiOutlineBuildingLibrary, HiOutlineHome, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { BsKey, BsPeople } from 'react-icons/bs';
import { MdAdminPanelSettings, MdDashboard } from 'react-icons/md';
import { FaChartBar, FaFileInvoice, FaMoneyBillWave } from 'react-icons/fa';
import { ProductionQuantityLimits } from '@mui/icons-material';
import { RiFundsLine, RiOrderPlayFill } from 'react-icons/ri'
import { PiGift, PiTreeStructure } from 'react-icons/pi'

// All possible menu items with their required permissions
const allMenuItems = [
    {
        icon: <MdDashboard />,
        title: "Dashboard",
        link: '/office/dashboard',
        type: 'item',
        permission: null
    },
    {
        title: "Users",
        link: "/office/users",
        type: "item",
        icon: <BsPeople />,
        permission: 'user_management_list'
    },
    {
        icon: <PiGift />,
        title: 'Coupons',
        link: '/office/coupons',
        type: 'item',
        permission: 'coupon_management_list'
    },
    {
        icon: <RiOrderPlayFill />,
        title: "Faqs",
        link: "/office/faq",
        type: "item",
        permission: 'faq_management_list'
    },
    // Instructor
    {
        title: 'Instructor',
        link: '/office/instructor',
        type: 'item',
        icon: <PiGift />,
        permission: 'instructor_management_list'
    },
    {
        title: 'Blog',
        link: '/office/blog',
        type: 'item',
        icon: <PiGift />,
        permission: 'blog_management_list'
    },
    {
        title: 'Course',
        link: '/office/course',
        type: 'item',
        icon: <PiGift />,
        permission: 'course_management_list'
    },
    {
        title: "Course-Orders",
        link: "/office/orders",
        type: "item",
        icon: <RiOrderPlayFill />,
        permission: 'order_management_list'
    },
    {
        title: "Register Students",
        link: "/office/register-student",
        type: "item",
        icon: <RiOrderPlayFill />,
        permission: 'Register_Student_list'
    },
    {
        title: "Leads",
        link: "/office/lead",
        type: "item",
        icon: <BsPeople />,
        permission: 'lead_management_list'
    },
    {
        title: "Sub Admin",
        link: "/office/subadmin",
        type: "item",
        icon: <BsPeople />,
        permission: 'subadmin_management_list'
    }
];

// Function to filter menu items based on permissions
const filterMenuItemsByPermissions = (menuItems, permissions) => {
    return menuItems
        .map(item => {
            if (item.children && item.children.length > 0) {
                const filteredChildren = filterMenuItemsByPermissions(item.children, permissions);

                if (filteredChildren.length > 0) {
                    return { ...item, children: filteredChildren };
                }
                return null;
            }

            if (!item.permission || permissions.includes(item.permission)) {
                return item;
            }
            return null;
        })
        .filter(Boolean);
};



// Function to get menu items based on permissions from localStorage
export const getSubadminMenuItems = () => {
    try {
        const subadminData = localStorage.getItem('adc_aspirants_subadmin');
        console.log(subadminData);
        if (subadminData) {
            const parsed = JSON.parse(subadminData);
            const permissions = parsed.permissions || [];
            return filterMenuItemsByPermissions(allMenuItems, permissions);
        }
        return [allMenuItems[0]]; // Return only dashboard if no data
    } catch (error) {
        console.error('Error parsing subadmin data:', error);
        return [allMenuItems[0]]; // Return only dashboard on error
    }
};

// Default sidebar data
export const SubadminSidebarData = {
    menuItems: [allMenuItems[0]], // Default to dashboard only
    checkActiveMenu: (link, activePath) => {
        if (activePath?.includes(link))
            return 'text-blue-600 bg-blue-200';
        return 'text-gray-400'
    },
    modeItems: [
        { icon: <HiOutlineSun />, title: 'Light' },
        { icon: <HiOutlineMoon />, title: 'Dark' }
    ]
};

export const checkActiveMenu = (link, activePath) => {
    if (activePath?.includes(link))
        return 'text-blue-600 bg-blue-200';
    return 'text-gray-400'
}

export const modeItems = [
    { icon: <HiOutlineSun />, title: 'Light' },
    { icon: <HiOutlineMoon />, title: 'Dark' }
] 