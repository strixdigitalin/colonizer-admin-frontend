import Header from "../../components/designs/TopComponents/Header";
import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URI } from "../../utils/Global/main";

import { 
    FaShoppingCart, 
    FaUsers, 
    FaCheckCircle, 
    FaClock, 
    FaRupeeSign,
    FaBookOpen
} from "react-icons/fa";

const Dashboard = ({ token, routepath }) => {

    const [statsData, setStatsData] = useState(null);

    useEffect(() => {
        //  API CALL COMMENTED (API abhi exist nahi karti)
        /*
        const getData = async () => {
            try {
                const res = await axios.get(`${API_URI}/api/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatsData(res.data?.data);
            } catch (error) {
                console.log("Dashboard API Error:", error);
            }
        };
        getData();
        */

        const dummyData = {
            users: {
                total: 1200,
                newToday: 18
            },
            orders: {
                total: 560,
                completed: 420,
                pending: 140,
                todayOrders: 22,
                todayRevenue: 15400,
                monthlyRevenue: 325000
            },
            courses: {
                total: 35,
                active: 28
            }
        };

        setStatsData(dummyData);
    }, []);

    if (!statsData) {
        return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
    }

    const { users, orders, courses } = statsData;

    const stats = [
        {
            title: "Total Users",
            value: users.total,
            icon: <FaUsers size={26} />,
            color: "bg-green-500"
        },
        {
            title: "Total Brokers",
            value: users.newToday,
            icon: <FaUsers size={26} />,
            color: "bg-blue-500"
        },
        {
            title: "Total Colonys",
            value: orders.total,
            icon: <FaShoppingCart size={26} />,
            color: "bg-purple-500"
        },
        // {
        //     title: "Completed Orders",
        //     value: orders.completed,
        //     icon: <FaCheckCircle size={26} />,
        //     color: "bg-teal-500"
        // },
        // {
        //     title: "Pending Orders",
        //     value: orders.pending,
        //     icon: <FaClock size={26} />,
        //     color: "bg-yellow-500"
        // },
        // {
        //     title: "Today's Orders",
        //     value: orders.todayOrders,
        //     icon: <FaShoppingCart size={26} />,
        //     color: "bg-indigo-500"
        // },
        // {
        //     title: "Today's Revenue",
        //     value: `₹ ${orders.todayRevenue.toLocaleString()}`,
        //     icon: <FaRupeeSign size={26} />,
        //     color: "bg-red-500"
        // },
        // {
        //     title: "Monthly Revenue",
        //     value: `₹ ${orders.monthlyRevenue.toLocaleString()}`,
        //     icon: <FaRupeeSign size={26} />,
        //     color: "bg-orange-500"
        // },
        // {
        //     title: "Total Courses",
        //     value: courses.total,
        //     icon: <FaBookOpen size={26} />,
        //     color: "bg-gray-700"
        // },
        // {
        //     title: "Active Courses",
        //     value: courses.active,
        //     icon: <FaBookOpen size={26} />,
        //     color: "bg-green-600"
        // }
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
