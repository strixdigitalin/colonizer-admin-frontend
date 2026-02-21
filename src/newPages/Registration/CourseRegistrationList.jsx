import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const CourseRegistrationList = ({ token, routepath, permissions = [] }) => {
    const { courseId } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const isSubAdmin = routepath === "/office/";
    const canList = !isSubAdmin || permissions.includes("Register_Student_list");

    useEffect(() => {
        if (!canList || !courseId) return;
        fetchRegistrations();
    }, [courseId]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${API_URI}/api/course/registration/class/${courseId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const formatted = res.data?.data?.map((reg, index) => ({
                _id: reg._id,
                index: index + 1,
                name: reg.user?.name || "N/A",
                email: reg.user?.email || "N/A",
                enrollmentStatus: reg.enrollmentStatus ? "Enrolled" : "Not Enrolled",
                enrolledAt: new Date(reg.enrolledAt).toLocaleDateString(),
                isActive: reg.isActive ? "Active" : "Inactive",
                createdAt: reg.createdAt,
            }));

            setData(formatted || []);
        } catch (err) {
            console.error("Error fetching registrations:", err);
        } finally {
            setLoading(false);
        }
    };

    const tableStructure = [
        { header: "S.NO", accessKey: "index" },
        { header: "Student Name", accessKey: "name" },
        { header: "Email", accessKey: "email" },
        { header: "Enrollment Status", accessKey: "enrollmentStatus", },
        { header: "Active", accessKey: "isActive", },
        { header: "Enrolled At", accessKey: "enrolledAt", },
        { header: "Created At", accessKey: "createdAt", },
    ];

    if (!canList) {
        return (
            <div className="p-10 text-center text-red-600 text-xl font-semibold">
                You do not have permission to view registrations.
            </div>
        );
    }

    return (
        <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
            <Header title={"Course Registered Students"} />

            <div className="md:my-8 my-4 mx-auto md:mx-4">
                <NormalTable
                    tableStructure={tableStructure}
                    data={data}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};

export default CourseRegistrationList;
