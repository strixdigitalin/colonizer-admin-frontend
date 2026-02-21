import React, { useEffect, useState } from 'react'
import SummaryTable from '../../components/designs/Tables/SummaryTable'
import { getUpdatedDataForTable, tableStructure } from '../../utils/Data/HomeData'
import { useSelector } from 'react-redux';

const Table = () => {
    const { dayBoard, halfMonthBoard, fullMonthBoard } = useSelector((state) => state.home);


    const initialtable = {
        name: 'Today',
        activeValue: dayBoard,
    }

    const [activeTab, setActiveTab] = useState(initialtable);

    const tabSection = [
        {
            name: 'Today',
            activeValue: dayBoard,
        },
        {
            name: 'Last 15 Day',
            activeValue: halfMonthBoard,
        },
        {
            name: 'Last 30 Day',
            activeValue: fullMonthBoard,
        }
    ];

    const handleToggleTab = (tab) => {
        setActiveTab(() => tab);
    }

    useEffect(() => {
        if (dayBoard?.length > 0)
            setActiveTab(() => initialtable);
    }, [dayBoard]);

    return (
        <div className='p-4 flex flex-col gap-4 border border-gray-300 rounded-lg'>
            {/* tab select section */}
            <div className='font-medium'>
                <div className="">
                    Leaderboard
                </div>
                <div className='flex gap-2 items-center text-xs mt-3'>
                    {
                        tabSection.map((item, index) =>
                            <div
                                className={`px-3 py-1 rounded-full w-fit cursor-pointer ${item?.name === activeTab?.name ? 'text-white bg-blue-500' : 'text-blue-500 border-blue-500 border'}`}
                                key={index}
                                onClick={() => handleToggleTab(item)}
                            >
                                {item?.name}
                            </div>
                        )
                    }
                </div>
            </div>
            {/* main table section start  */}
            <div className='w-full px-1 pb-2 overflow-x-auto table-scroll'>
                <div className="max-h-[300px] overflow-y-auto min-w-[380px]">
                    <SummaryTable
                        data={getUpdatedDataForTable(activeTab?.activeValue?.slice(0, 10))}
                        color={'text-cyan-600'}
                        background={'bg-cyan-50'}
                        tableStructure={tableStructure}
                    />
                </div>
            </div>
        </div>
    )
}

export default Table
