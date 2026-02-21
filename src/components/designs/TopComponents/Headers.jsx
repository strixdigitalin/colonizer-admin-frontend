
import { IoMdAdd } from 'react-icons/io'

const Headers = ({ title, action, showAction }) => {
    return (
        <div className='mb-8 flex justify-between items-center'>
            <div className='text-3xl font-medium text-blue-600'>{title}</div>
            <div
                onClick={action}
                className={`rounded-full font-medium ${showAction ? 'flex' : 'hidden'} items-center gap-1 transition-all duration-200 cursor-pointer bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2`}
            >
                <IoMdAdd />Add
            </div>
        </div>
    )
}

export default Headers