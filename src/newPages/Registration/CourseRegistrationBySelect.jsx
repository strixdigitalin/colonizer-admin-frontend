import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import { API_URI } from "../../utils/Global/main";

const CourseRegistrationBySelect = ({ token, routepath, permissions = [] }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const isSubAdmin = routepath === "/office/";
    const canList =
        !isSubAdmin || permissions.includes("course_registration_list");

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URI}/api/course`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formatted = res.data?.data?.map((course) => ({
                _id: course._id,
                name: course.name,
            })) || [];

            setCourses(formatted);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        if (!selectedCourse) return;

        try {
            setLoading(true);

            const res = await axios.get(
                `${API_URI}/api/course/registration/class/${selectedCourse}`,
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
                isActive: reg.isActive ? "Active" : "Inactive",
                enrolledAt: reg.enrolledAt
                    ? new Date(reg.enrolledAt).toLocaleDateString()
                    : "N/A",
                createdAt: reg.createdAt
                    ? new Date(reg.createdAt).toLocaleDateString()
                    : "N/A",
            }));

            setData(formatted || []);
        } catch (error) {
            console.error("Error fetching registrations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (canList) {
            fetchCourses();
        }
    }, []);

    const tableStructure = [
        { header: "S.NO", accessKey: "index" },
        { header: "Student Name", accessKey: "name" },
        { header: "Email", accessKey: "email" },
        { header: "Enrollment Status", accessKey: "enrollmentStatus" },
        { header: "Active", accessKey: "isActive" },
        { header: "Enrolled At", accessKey: "enrolledAt" },
        { header: "Created At", accessKey: "createdAt" },
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
            <Header title="Course Registered Students" />

            <div className="my-6 mx-4 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="block mb-1 font-semibold">
                        Select Course
                    </label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Select Course --</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={fetchRegistrations}
                    disabled={!selectedCourse || loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
                >
                    Fetch Students
                </button>
            </div>

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

export default CourseRegistrationBySelect;
