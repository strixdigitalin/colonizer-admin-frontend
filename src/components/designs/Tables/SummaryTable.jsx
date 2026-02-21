import React from 'react'

const SummaryTable = ({ data, tableStructure }) => {
    
    return (
        <table className="w-full max-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {
                        tableStructure.map((heading, index) =>
                            <th
                                key={index}
                                className={`md:px-3 px-2 py-3 bg-gray-50 text-left border-r border-white text-xs leading-4 font-semibold text-gray-700 uppercase tracking-wider`}
                            >
                                {heading.title}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody className={`bg-[rgba(0,0,0,0.03)] divide-y divide-gray-200`}>
                {
                    data?.map((row, index) =>
                        <tr key={index} className='hover:bg-gray-200'>
                            {
                                tableStructure.map((element, index1) =>
                                    <td className="md:px-4 px-2 py-3 border" key={index1}>
                                        <div className="text-sm leading-5 text-gray-600 truncate max-w-[100px]">
                                            {row[element.type]}
                                        </div>
                                    </td>
                                )
                            }
                        </tr>
                    )
                }
            </tbody>
        </table>
    )
}

export default SummaryTable