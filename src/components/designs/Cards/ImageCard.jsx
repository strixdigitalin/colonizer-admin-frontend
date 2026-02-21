import React from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';

const ImageCard = ({ item, handleEdit }) => {
    return (
        <div className='bg-blue-50 shadow flex flex-col'>
            <div className='relative flex-1'>
                {
                    item?.packageImage ?
                        <img src={item?.packageImage} className='w-full relative object-cover h-full' alt='image' />
                        :
                        <div className='w-full h-32 bg-gray-200'></div>
                }
                <div className='absolute top-0 left-0 w-full p-2 text-xs uppercase font-medium pb-4 text-white' style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))' }}>
                    {item?.packageTitle}
                </div>
            </div>
            <div className='p-4'>
                <div className='text-gray-500 text-sm font-medium flex justify-between gap-4'>
                    <div className=''>
                        Price: <span className='font-medium text-gray-600'>{item?.packageAmount.toFixed(2)}</span>
                    </div>
                    <div className=''>
                        B.V.: <span className='font-medium text-gray-600'>{item?.packagePV_BV.toFixed(2)}</span>
                    </div>
                </div>
                <div className='text-sm mt-4 flex justify-between gap-4'>
                    <div onClick={()=>{
                        handleEdit(item);
                    }} className='flex gap-2 items-center text-gray-500 hover:text-green-600 cursor-pointer'>
                        <CiEdit /> Edit
                    </div>
                    <div className='flex gap-2 items-center text-gray-500 cursor-pointer hover:text-red-600'>
                        <MdDelete /> Delete
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageCard
