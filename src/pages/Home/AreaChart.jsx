import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
// import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const AreaChart = () => {
    const { lineChartData } = useSelector((state) => state.home);

    const [lineData, setLineData] = useState({ labels: [], data: [] });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Sales Report',
            },
        },
    };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels: lineData.labels,
        datasets: [
            {
                fill: true,
                label: 'total Sales',
                data: lineData.data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    useEffect(() => {
        setLineData(() => {
            return {
                labels: lineChartData?.slice(-10)?.map((item) => item?._id),
                data: lineChartData?.slice(-10)?.map((item) => item?.totalAmount?.toFixed(2))
            }
        })
    }, [lineChartData])

    return (
        <Line options={options} data={data} />
    )
}

export default AreaChart
