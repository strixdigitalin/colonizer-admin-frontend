import Header from "../../components/designs/TopComponents/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

import {
    FaUsers,
    FaBuilding,
    FaMapMarkedAlt,
    FaCheckCircle,
    FaClock,
    FaRupeeSign,
    FaExclamationCircle,
    FaHandshake,
} from "react-icons/fa";

const Dashboard = ({ token, routepath }) => {

    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`${API_URI}/api/v1/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStatsData(res.data?.data);
            } catch (error) {
                console.error("Dashboard API Error:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [token]);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
    }

    if (!statsData) {
        return <div className="p-10 text-center text-red-500">Failed to load dashboard data.</div>;
    }

    const stats = [
        {
            title: "Total Customers",
            value: statsData.totalCustomers,
            icon: <FaUsers size={26} />,
            color: "bg-green-500",
        },
        {
            title: "Total Brokers",
            value: statsData.totalBrokers,
            icon: <FaHandshake size={26} />,
            color: "bg-blue-500",
        },
        {
            title: "Total Colonies",
            value: statsData.totalColonies,
            icon: <FaBuilding size={26} />,
            color: "bg-purple-500",
        },
        {
            title: "Total Plots",
            value: statsData.totalPlots,
            icon: <FaMapMarkedAlt size={26} />,
            color: "bg-indigo-500",
        },
        {
            title: "Available Plots",
            value: statsData.availablePlots,
            icon: <FaCheckCircle size={26} />,
            color: "bg-teal-500",
        },
        {
            title: "Hold Plots",
            value: statsData.holdPlots,
            icon: <FaClock size={26} />,
            color: "bg-yellow-500",
        },
        {
            title: "Sold Plots",
            value: statsData.soldPlots,
            icon: <FaCheckCircle size={26} />,
            color: "bg-orange-500",
        },
        {
            title: "Pending Hold Requests",
            value: statsData.pendingHoldRequests,
            icon: <FaExclamationCircle size={26} />,
            color: "bg-red-500",
        },
        {
            title: "Total Revenue Collected",
            value: `₹ ${statsData.totalRevenue.toLocaleString("en-IN")}`,
            icon: <FaRupeeSign size={26} />,
            color: "bg-green-700",
        },
        {
            title: "Total Due Amount",
            value: `₹ ${statsData.totalDue.toLocaleString("en-IN")}`,
            icon: <FaRupeeSign size={26} />,
            color: "bg-gray-600",
        },
    ];

    return (
        <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto h-[calc(100vh-15px)]">
            <Header title="Dashboard" />

            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className={`p-4 rounded-full ${stat.color} text-white`}>
                            {stat.icon}
                        </div>
                        <div className="ml-4">
                            <h4 className="text-gray-500 text-sm">{stat.title}</h4>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
