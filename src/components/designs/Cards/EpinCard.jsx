import React, { useEffect, useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { getPackages } from '../../../apis/packageApis';
import { ImSpinner2 } from 'react-icons/im';
import { handleChange } from '../../../utils/Global/main';
import { createEpin } from '../../../apis/epinApis';

const initialValue = {
    packageId: '',
    quantity: '',
    userId: '',
}

const EpinCard = ({ handleToggle }) => {
    const { packages, isLoading } = useSelector((state) => state.package);
    const isLoadingEpin = useSelector((state) => state.epin.isLoading);
    const dispatch = useDispatch();

    const [data, setData] = useState(initialValue);

    const handleSubmit = async () => {
        console.log(data);
        const { packageId, quantity, userId } = data;
        if (packageId === '' || quantity === '' || userId?.trim() === '') {
            window.alert('fill all the fields properly');
            return;
        }
        const res = await createEpin(dispatch, data);
        if (res)
            handleToggle();
    }

    useEffect(() => {
        const getData = async () => {
            await getPackages(dispatch);
        }
        getData();
    }, [dispatch]);

    return (
        <div className='bg-white shadow rounded-lg overflow-hidden max-w-md w-full absolute'>
            <div className='text-blue-500 uppercase font-medium text-sm bg-blue-100 py-4 px-4 flex items-center justify-between'>
                Issue Epin
                <div className='text-lg cursor-pointer hover:text-red-500' onClick={handleToggle}>
                    <RxCrossCircled />
                </div>
            </div>
            {
                isLoading ?
                    <div className='w-full h-20 flex justify-center items-center'>
                        <ImSpinner2 className='animate-spin' />
                    </div>
                    :
                    <div className='flex flex-col gap-4 px-8 my-6'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='packageId' className='text-sm text-gray-500'>Select Joining Package*</label>
                            <select value={data?.packageId} name='packageId' onChange={(e) => handleChange(e, setData)} id='packageId' className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500'>
                                <option value="" className='text-sm rounded-none p-2 bg-white'>Choose One</option>
                                {
                                    packages?.map((item) =>
                                        <option
                                            key={item?._id}
                                            value={item?._id}
                                            className='text-sm rounded-none p-2 bg-white'>
                                            {item?.packageTitle}
                                        </option>
                                    )
                                }
                                {/* <option value="" className='text-sm rounded-none p-2 bg-white'>package 1</option>
                        <option value="" className='text-sm rounded-none p-2 bg-white'>package 2</option>
                        <option value="" className='text-sm rounded-none p-2 bg-white'>package 3</option> */}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='quantity' className='text-sm text-gray-500'>Epin Quantity*</label>
                            <input value={data?.quantity} name='quantity' onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='quantity' type='number' placeholder='Enter the quantity' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='userId' className='text-sm text-gray-500'>Issue to*</label>
                            <input value={data?.userId} name='userId' onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='userId' type='text' placeholder='Enter issue' />
                        </div>
                        <div className=''>
                            <button disabled={isLoadingEpin} className={`flex items-center  justify-center gap-2 w-full border p-2 rounded-lg text-gray-500 ${!isLoadingEpin && 'hover:text-white hover:bg-blue-500 cursor-pointer'} bg-gray-200`} onClick={handleSubmit}>
                                {isLoadingEpin && <ImSpinner2 className='animate-spin' />} Submit
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default EpinCard
