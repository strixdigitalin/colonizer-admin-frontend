import React from 'react'
import { IoMdAdd } from 'react-icons/io';

const Header = ({ title, addTitle, add, handleClick }) => {
  return (
    <div className='text-lg md:text-4xl font-semibold text-gray-500 flex justify-between gap-4' style={{fontFamily:`'Baloo 2', cursive`}}>
      {title}
      {
        add &&
        <div 
        className='rounded-full py-2 px-4 flex justify-center items-center gap-2 text-base cursor-pointer bg-gray-200 text-gray-500 font-medium hover:text-white hover:bg-blue-600' 
        onClick={handleClick}
        >
          <IoMdAdd />
          Add {addTitle}
        </div>
      }
    </div>
  )
}

export default Header
