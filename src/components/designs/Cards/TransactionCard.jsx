import React from 'react'

const TransactionCard = () => {
    return (
        <div className='bg-white shadow rounded-lg overflow-hidden max-w-sm w-full'>
            <div className='text-blue-500 uppercase font-medium text-sm text-center bg-blue-100 py-3 px-4'>
                Transaction Details
            </div>
            <div className='flex flex-col gap-4 px-4 my-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='id' className='text-sm text-gray-500'>Transfer ID*</label>
                    <input className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='id' type='text' placeholder='Enter your ID here' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='wallet' className='text-sm text-gray-500'>Select Wallet*</label>
                    <select id='wallet' className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500'>
                        <option value="" className='text-sm rounded-none p-2 bg-white'>Wallet 1</option>
                        <option value="" className='text-sm rounded-none p-2 bg-white'>Wallet 2</option>
                        <option value="" className='text-sm rounded-none p-2 bg-white'>Wallet 3</option>
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='amount' className='text-sm text-gray-500'>Amount*</label>
                    <input className='outline-none border p-2 rounded-md focus-within:border-blue-400 placeholder:text-sm text-gray-500' id='amount' type='text' placeholder='Enter the amount' />
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

export default TransactionCard
