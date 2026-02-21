import React from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { RxCrossCircled } from 'react-icons/rx';

const PackageCard = ({ handleChange, data, handleImage, isLoading, handleSubmit, setData, handleToggle }) => {
    // console.log(data);
    return (
        <div className='bg-white shadow rounded-lg overflow-hidden max-w-md w-full absolute'>
            <div className='text-blue-500 uppercase font-medium text-sm bg-blue-100 py-4 px-4 flex items-center justify-between'>
                Joining Package Details
                <div className='text-lg cursor-pointer hover:text-red-500' onClick={handleToggle}>
                    <RxCrossCircled />
                </div>
            </div>
            <div className='flex flex-col gap-4 px-8 my-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='title' className='text-sm text-gray-500'>Package Title*</label>
                    <input name='packageTitle' value={data?.packageTitle} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='title' type='text' placeholder='Enter the title here' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='amount' className='text-sm text-gray-500'>Package Amount*</label>
                    <input name='packageAmount' value={data?.packageAmount} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='amount' type='number' placeholder='Enter the amount' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='bv' className='text-sm text-gray-500'>Package BV/PV*</label>
                    <input name='packagePV_BV' value={data?.packagePV_BV} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='bv' type='number' placeholder='Enter the amount' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='photo' className='text-sm text-gray-500'>Package Photo(if any)</label>
                    <input name='image' onChange={handleImage} className='outline-none border text-sm p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='bv' type='file' />
                </div>
                <div className=''>
                    <button disabled={isLoading} onClick={handleSubmit} className={`flex items-center  justify-center gap-2 w-full border p-2 rounded-lg text-gray-500 ${!isLoading && 'hover:text-white hover:bg-blue-500 cursor-pointer'} bg-gray-200`}>
                        {isLoading && <ImSpinner2 className='animate-spin' />} Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PackageCard
