import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Icon from '../components/designs/Icons/Icon';
import { handleChange } from '../utils/Global/main';
import { ImSpinner2 } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../apis/authApis';

const initialState = {
  email: '',
  password: ''
}

const Auth = () => {
  const [user, setUser] = useState(initialState);
  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { email, password } = user;
    if (email === '' || password === '') {
      return;
    }
    // const dummyCreds = {
    //   email: 'admin@gmail.com',
    //   password: 'Admin@123'
    // }
    // if (email?.toLowerCase() === dummyCreds.email && password === dummyCreds.password) {
    //   navigate('/dashboard');
    // }
    // else {
    const res = await login(dispatch, user);
    if (res === 200)
      // console.log('success');
      // navigate('/dashboard');
      window.location.href = '/dashboard';
    else {
      window.alert('error in signin')
    }
    // }
  }
  return (
    <div className='flex justify-center items-center absolute inset-0 bg-gray-100'>
      <div className='bg-white p-8 w-[350px] flex flex-col gap-6 justify-center items-center'>
        <div className=''>
          <Icon />
        </div>
        {/* <div className='font-semibold text-2xl text-blue-600'>
          Colonizer
        </div> */}
        <div className='flex flex-col gap-3 w-full'>
          <input type='text' onChange={(e) => handleChange(e, setUser)} name='email' value={user?.email} className='border text-gray-900 outline-none p-2 rounded-lg w-full focus-within:border-indigo-300' placeholder='Email' />
          <input type='password' onChange={(e) => handleChange(e, setUser)} name='password' value={user?.password} className='border text-gray-900 outline-none p-2 rounded-lg w-full focus-within:border-indigo-300' placeholder='Password' />
        </div>
        <button disabled={isLoading} onClick={handleSubmit} className={`flex items-center justify-center gap-2 w-full border p-2 rounded-lg text-gray-500 ${!isLoading && 'hover:text-white hover:bg-blue-500 cursor-pointer'} bg-gray-200`}>
          {isLoading && <ImSpinner2 className='animate-spin' />} Submit
        </button>

        {/* <div className="w-full border-t pt-4">
          <p className="text-sm text-gray-600 mb-3 text-center">Switch to other login:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="text-xs bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => navigate("/auth/signin")}
            >
              Admin Login
            </button>
            <button
              className="text-xs bg-green-100 text-green-600 p-2 rounded hover:bg-green-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => navigate("/auth/subadmin/signin")}
              disabled={window.location.pathname === "/auth/subadmin/signin"}
            >
              Subadmin Login
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Auth
