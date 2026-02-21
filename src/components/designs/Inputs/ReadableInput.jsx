import React from 'react'

const ReadableInput = ({ item }) => {
    return (
        <div className='w-full border px-2.5 py-2 rounded-md border-gray-400 relative'>
            <div className='absolute -top-3 text-gray-500 px-1 left-3 bg-white'>
                {item?.name}
            </div>
            <div className=''>
                {item?.value}
            </div>
        </div>
    )
}

export default ReadableInput