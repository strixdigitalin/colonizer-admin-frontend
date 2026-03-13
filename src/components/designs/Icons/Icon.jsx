import React from 'react'
import logo from '../../../utils/Images/logo.png';

const Icon = ({ extendedClasses }) => {
    return (
        <div className='px-3 text-4xl font-bold icon-title text-white text-center tracking-wider uppercase'>
            <img src={logo} alt='logo' className={`mx-auto ${extendedClasses ? extendedClasses : 'h-20'}`} />
        </div>
    )
}

export default Icon
