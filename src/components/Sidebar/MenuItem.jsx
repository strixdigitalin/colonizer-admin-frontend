import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { checkActiveMenu } from '../../utils/Data/SidebarData';

const MenuItem = ({ item }) => {
    const { pathname } = useLocation();

    return (
        <Link to={item.link} className={`${checkActiveMenu(item.link, pathname)} hover:text-blue-600 hover:bg-blue-200 group flex items-center gap-1 rounded-xl text-base p-1 leading-6 font-medium`}>
            {

                <span className={`group-hover:text-blue-600 flex h-10 ${item?.icon ? 'w-10' : 'w-5'} shrink-0 items-center justify-center text-xl`}>
                    {item?.icon}
                </span>
            }
            <span className='truncate'>
                {item.title}
            </span>
        </Link>
    )
}

export default MenuItem