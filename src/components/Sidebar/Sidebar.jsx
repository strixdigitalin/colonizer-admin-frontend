import React, { useEffect, useState } from 'react';
import { menuItems } from '../../utils/Data/SidebarData';
import { getSubadminMenuItems } from '../../utils/Data/SubadminSidebarData';
import './Sidebar.css';
import Icon from '../designs/Icons/Icon';
import MenuItem from './MenuItem';
import MenuGroup from './MenuGroup';
import ProfileMenu from './ProfileMenu';
import SubadminProfileMenu from './SubadminProfileMenu';

const Sidebar = ({ userType = "admin" }) => {
    const [open, setOpen] = useState(-1);
    const [currentMenuItems, setCurrentMenuItems] = useState(menuItems);
    const [userData, setUserData] = useState(null);

    const handleClick = (id) => {
        setOpen((prev) => prev === id ? -1 : id);
    }

    useEffect(() => {
        if (userType === "subadmin") {
            const subadminData = localStorage.getItem('adc_aspirants_subadmin');
            if (subadminData) {
                const parsed = JSON.parse(subadminData);
                console.log(parsed);
                setUserData(parsed);
                const subadminMenuItems = getSubadminMenuItems();
                setCurrentMenuItems(subadminMenuItems);
            }
        }
    }, [userType]);

    return (
        <>
            {/* Icon Section Start */}
            <Icon />
            {/* Icon Section End */}
            <hr />

            {/* Menu Section Start */}
            <nav className='flex flex-1 flex-col justify-between'>
                <ul role='list' className='flex flex-1 flex-col gap-y-2 overflow-y-auto'>
                    {
                        currentMenuItems.map((item, index) =>
                            <li key={index}>
                                {
                                    item.type === 'item' ?
                                        <MenuItem item={item} />
                                        :
                                        <MenuGroup item={item} index={index} handleClick={handleClick} open={open} />
                                }
                            </li>
                        )
                    }
                </ul>
                {userType === "subadmin" ? <SubadminProfileMenu userData={userData} /> : <ProfileMenu />}
            </nav>
        </>
        // </div>
        // </div>
    )
}

export default Sidebar
