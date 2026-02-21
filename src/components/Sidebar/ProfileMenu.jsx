import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { VscSignOut } from 'react-icons/vsc';
import { FaUserAlt } from 'react-icons/fa';

const ProfileMenu = () => {
    const user = JSON.parse(localStorage.getItem('colonizer_admin'));

    const naivgate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('colonizer_admin');
        naivgate('/auth/signin');
        window.location.reload();
    }

    return (
        <div className='flex items-center text-gray-500'>
            <Link
            //  to={'/profile'} 
             className='flex-1 flex gap-2 items-center p-2 pl-4 bg-gray-100 group hover:text-blue-500 hover:bg-blue-50 rounded-l-lg'>
                <div className='w-8 h-8 rounded-full group-hover:bg-white bg-gray-200 flex justify-center items-center'>
                    <FaUserAlt />
                </div>
                <div className='flex flex-col'>
                    <div className='text-sm font-medium'>
                        {user?.user?.name}
                    </div>
                    {/* <div className='text-xs'>
                        {user?.user?.name}
                    </div> */}
                </div>
            </Link>
            <div className='text-xl bg-gray-100 border-l border-gray-300 hover:bg-red-500 hover:text-white cursor-pointer h-full w-10 flex justify-center items-center rounded-r-lg' onClick={handleLogout}>
                <VscSignOut />
            </div>
        </div>
    )
}

export default ProfileMenu
