import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = () => {
    const { pieChartData } = useSelector((state) => state.home);

    const [pieData, setPieData] = useState([0, 0]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Users Withdrawl Report',
            },
        },
    };

    const data = {
        labels: ['Pending', 'Approved'],
        datasets: [
            {
                label: `Withdrawl Amount`,
                data: pieData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        if (pieChartData) {
            setPieData(() => [pieChartData?.pending, pieChartData?.approved]);
        }

    }, [pieChartData]);

    return (
        <Pie data={data} options={options} />
    )
}

export default PieChart
