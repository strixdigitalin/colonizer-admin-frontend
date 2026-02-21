import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import { BiSolidChevronDown } from 'react-icons/bi';

const MenuGroup = ({ item, open, handleClick, index }) => {
    // const [open===index, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { pathname } = useLocation();

    // const handleToggle = () => {
    // setIsOpen(!open===index);
    // };

    useEffect(() => {
        setIsActive(() => item?.children?.some((child) => pathname?.includes(child?.link)));

        return () => { }
    }, [pathname]);

    return (
        <div className={`flex flex-col justify-center rounded-xl transition-all ease-linear duration-300`}>
            {/* dropdown header start */}
            <div
                className={`${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-400'} cursor-pointer group flex items-center justify-between gap-1 rounded-xl text-base p-1 leading-6 font-medium`}
                onClick={() => handleClick(index)}
            >
                <div className='flex items-center gap-1'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center text-xl'>
                        {item.icon}
                    </span>
                    <span className='truncate'>
                        {item.title}
                    </span>
                </div>
                <span className={`transition-all duration-200 ease-linear ${open === index ? 'rotate-90' : 'rotate-0'}`}>
                    <BiSolidChevronDown />
                </span>
            </div>
            {/* dropdown header end  */}

            {/* options start  */}
            <div className={`overflow-hidden transition-all duration-300 ease-linear shadow-black px-2 pl-6 ${open === index ? 'max-h-screen h-fit pb-2' : 'max-h-0 h-0 p-0'}`}>
                <ul className={`border-l ${isActive ? 'border-blue-400' : 'border-gray-400'}`}>
                    {item.children.map((child, index) => (
                        <li key={index} className="mt-2 flex items-center">
                            <hr className={`w-4 ${isActive ? 'border-blue-400' : 'border-gray-400'}`} />
                            <div className='flex-1'>
                                <MenuItem item={child} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {/* options end */}
        </div>
    )
}

export default MenuGroup
