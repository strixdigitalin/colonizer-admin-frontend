import React, { useEffect, useState } from 'react'
import { RxCrossCircled } from 'react-icons/rx'
import { API_URI, handleChange } from '../../../utils/Global/main';
import { useDispatch, useSelector } from 'react-redux';
import { createMember } from '../../../apis/authApis';

const initialState = {
    sponserID: '',
    gender: '',
    phoneNumber: '',
    password: '',
    email: '',
    fullName: '',
}

const RegistrationCard = ({ handleToggle, setUser, setFlag, flag, setPass, isEdit, editData }) => {
    const [data, setData] = useState(initialState);

    useEffect(()=>{
        if(isEdit)
        {
            setData(editData);
        }
    }, [editData, isEdit]);

    const { isLoading } = useSelector((state) => state.member);

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const { sponserID, gender, phoneNumber, password, email, fullName } = data;
        // console.log(data);
        
        if (sponserID === '' || gender === '' || phoneNumber === '' || password === '' || email === '' || fullName === '') {
            window.alert('fill all the fields properly');
            return;
        }
        let res;
        if(!isEdit)
        {
            res = await createMember(dispatch, data);
            setUser(res.data.savedMember);
            setFlag(true);
        }
        else
        {
            let ans=await fetch(`${API_URI}/api/user/updateprofile/${editData._id}`,{
                method: "PATCH",
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            res=await ans.json();
            setUser(res.data);
            // setRefreshFlag(!refreshFlag);
            alert(res.message);
            // if(res.statusCode===200)
            // {
            //     handleToggle();
            // }
        }
        // console.log(res.data);
        
        if (res && res.statusCode===200) {
            handleToggle();
        }
    };

    return (
        <div className='bg-white shadow rounded-lg overflow-hidden max-w-xl mx-4 w-full absolute'>
            <div className='text-blue-500 uppercase font-medium text-sm bg-blue-100 py-4 px-4 flex items-center justify-between'>
                Registration Form
                <div className='text-lg cursor-pointer hover:text-red-500' onClick={handleToggle}>
                    <RxCrossCircled />
                </div>
            </div>
            <div className='flex flex-col gap-4 px-8 my-6 max-h-[80vh] overflow-y-auto'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='fullname' className='text-sm text-gray-500'>Full Name*</label>
                        <input name='fullName' value={data?.fullName} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='fullname' type='text' placeholder='Enter name' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email' className='text-sm text-gray-500'>Email*</label>
                        <input value={data?.email} name='email' onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='email' type='text' placeholder='Enter email' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='mobile' className='text-sm text-gray-500'>Mobile*</label>
                        <input name='phoneNumber' value={data?.phoneNumber} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='mobile' type='number' placeholder='Enter phone' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='sponsor' className='text-sm text-gray-500'>Sponsor Id*</label>
                        <input name='sponserID' value={data?.sponserID} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='sponsor' type='text' placeholder='Enter sponser ID' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                    {!isEdit && <div className='flex flex-col gap-1'>
                        <label htmlFor='passowrd' className='text-sm text-gray-500'>Password*</label>
                        <input name='password' value={data?.password} onChange={(e) => {handleChange(e, setData); setPass(e.target.value);}} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='passowrd' type='password' placeholder='Enter password' />
                    </div>}

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='gender' className='text-sm text-gray-500'>Gender*</label>
                        <div className='flex gap-4 items-center'>
                            <div className='flex items-center gap-2'>
                                <input name='gender' value={'MALE'} checked={data.gender==='MALE'} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='male' type='radio' placeholder='Enter issue' />
                                <label htmlFor='male' className='text-sm text-gray-500'>Male</label>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input name='gender' value={'FEMALE'} checked={data.gender==='FEMALE'} onChange={(e) => handleChange(e, setData)} className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='female' type='radio' placeholder='Enter issue' />
                                <label htmlFor='female' className='text-sm text-gray-500'>Female</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <button disabled={isLoading} className={`flex items-center  justify-center gap-2 w-full border p-2 rounded-lg text-gray-500 ${!isLoading && 'hover:text-white hover:bg-blue-500 cursor-pointer'} bg-gray-200`} onClick={handleSubmit}>
                        {isLoading && <ImSpinner2 className='animate-spin' />} Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistrationCard
