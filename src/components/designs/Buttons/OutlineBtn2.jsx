import React from 'react'

const OutlineBtn2 = ({ extendedClass, icon, btnText, handleClick }) => {
    return (
        <div className={`flex gap-2 justify-center items-center cursor-pointer py-1.5 px-3 rounded-md ${extendedClass}`} onClick={handleClick}>
            {
                icon &&
                <div className=''>
                    {icon}
                </div>
            }
            <div className=''>
                {btnText}
            </div>
        </div>
    )
}

export default OutlineBtn2
