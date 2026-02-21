import React from 'react'

const ProfileCard = ({data}) => {
    console.log(data);
    let t=0;
    for(let i=1;i<Object.values(data).length;i++)
    {
        t+=Object.values(data)[i].length;
    }
    return (
        <div className='bg-white w-fit h-fit mx-auto p-4 flex gap-6 items-center rounded-lg border'>
            <div className=' w-36 h-36 rounded-full flex justify-center items-center bg-gray-100'>
                Profile Image
            </div>
            <div className='flex gap-3 flex-col text-gray-500 font-medium'>
                <div className=''>
                    ID: {data[0][0]?.userId}
                </div>
                <div className=''>
                    Name: {data[0][0]?.fullName}
                </div>
                <div className=''>
                    Direct Sponsor: {data[1].length}
                </div>
                <div className=''>
                    Total Downline: {t}
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
