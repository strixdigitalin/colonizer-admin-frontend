import React from 'react'

const OutlineButton = ({ text, icon, colors, action }) => {
    return (
        <div className={`flex items-center transition-all duration-300 shadow hover:shadow-none justify-center gap-2 pr-2 py-1 cursor-pointer ${colors}`} onClick={action}>
            <div className=''>
                {icon}
            </div>
            <div className=''>
                {text}
            </div>
        </div>
    )
}

export default OutlineButton
