import React from 'react'

const AchieverCard = () => {
    return (
        <div className='bg-white shadow rounded-lg overflow-hidden max-w-sm w-full mx-auto'>
            <div className='text-blue-500 uppercase font-medium text-sm text-center bg-blue-100 py-3 px-4'>
                Achiever Details
            </div>
            <div className='flex flex-col gap-4 px-4 my-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='achiever' className='text-sm text-gray-500'>Achiever Contents*</label>
                    <textarea className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='achiever' type='text' placeholder='Enter your content' />
                </div>
                <div className=''>
                    <button className='w-full border p-2 rounded-lg text-gray-500 hover:text-white hover:bg-blue-500 bg-gray-200'>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AchieverCard
