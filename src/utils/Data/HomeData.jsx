import { BsHourglassSplit, BsPeople } from 'react-icons/bs';
import { AiOutlineShopping } from 'react-icons/ai';
import { GiPayMoney } from 'react-icons/gi'

export const cardData = [
    {
        title: 'Total Members',
        value: 496,
        icon: <BsPeople />,
        color: 'var(--primary-indigo)',
    },
    {
        title: 'Total Sales',
        value: '₹ 2440220',
        icon: <AiOutlineShopping />,
        color: 'var(--primary-yellow)',
    },
    {
        title: 'Payout Pending',
        value: '₹ 0',
        icon: <BsHourglassSplit />,
        color: 'var(--primary-orange)',
    },
    {
        title: 'Payout Disbursed',
        value: '₹ 0',
        icon: <GiPayMoney />,
        color: 'var(--primary-green)',
    }
];


export const tableStructure = [
    { title: 'Index', type: 'index' },
    { title: 'UserId', type: 'userId' },
    { title: 'Name', type: 'name' },
    { title: 'Earnings', type: 'earnings' }
]

export const getUpdatedDataForTable = (data) => {
    return data?.map((item, index) => {
        return {
            index: index + 1,
            name: item?.userInfo?.fullName,
            userId: item?.userInfo?.userId,
            earnings: item?.totalEarnings?.toFixed(2),
        }
    })
}