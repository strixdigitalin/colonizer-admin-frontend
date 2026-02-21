import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser } from 'react-icons/hi2';
import { FaSignOutAlt } from 'react-icons/fa';
import { VscSignOut } from 'react-icons/vsc';
import { API_URI } from "../../utils/Global/main";
import axios from 'axios';

const SubadminProfileMenu = ({ userData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adc_aspirants_subadmin');
        localStorage.removeItem('adc_aspirants_subadmin_token');
        navigate('/auth/subadmin/signin');
    };

    useEffect(() => {
        const fetchSubadminSelf = async () => {
            try {
                const token = localStorage.getItem('adc_aspirants_subadmin_token');
                if (!token) return;
                const res = await axios.get(`${API_URI}/api/subadmin/self`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.data && res.data.data) {
                    const admin = localStorage.getItem('baggi_subadmin');
                    if(admin.permissions.length !== res.data.data.permissions.length){
                        window.location.reload();
                    }
                    localStorage.setItem('baggi_subadmin', JSON.stringify(res.data.data)); 
                }
            } catch (error) {
                console.error("Failed to fetch subadmin self:", error);
            }
        };
        fetchSubadminSelf();
    }, []);
    

    return (
        <div className='flex items-center text-gray-500'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {userData?.name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {userData?.name || 'Subadmin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {userData?.assignedArea || 'Subadmin'}
                    </p>
                </div>
            </button>

            <div className='text-xl bg-gray-100 border-l border-gray-300 hover:bg-red-500 hover:text-white cursor-pointer h-full w-10 flex justify-center items-center rounded-r-lg' onClick={handleLogout}>
                <VscSignOut className='text-2xl' />
            </div>

            {/* {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // Add profile view functionality here
                            }}
                            className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 transition-colors text-sm"
                        >
                            <HiOutlineUser className="w-4 h-4" />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 transition-colors text-sm text-red-600"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default SubadminProfileMenu; 