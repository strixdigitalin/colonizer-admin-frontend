import React from 'react'

const IconCard = ({ item }) => {
    return (
        <div className='bg-white rounded-lg p-3 flex items-center gap-4 border border-gray-300'>
            <div className={`p-3 font-medium rounded-lg bg-[rgba(0,0,0,0.04)] text-3xl`} style={{ color: item?.color }}>{item?.icon}</div>
            <div className='flex flex-col'>
                <div className='font-medium text-2xl' style={{ color:item?.color }}>{item?.value}</div>
                <div className='text-sm text-gray-500'>{item?.title}</div>
            </div>
        </div>
    )
}

export default IconCard
