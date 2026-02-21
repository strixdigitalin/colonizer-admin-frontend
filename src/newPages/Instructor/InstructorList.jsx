import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";

const InstructorList = ({ token, routepath, permissions=[] }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isSubAdmin = routepath === "/office/";

    const canAdd = !isSubAdmin || permissions.includes("instructor_management_add");
    const canEdit = !isSubAdmin || permissions.includes("instructor_management_edit");
    const canDelete = canEdit;

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URI}/api/instructor`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const instructors = res.data?.data || [];
            const formatted = instructors.map((item, index) => ({
                ...item,
                index: index + 1,
            }));

            setData(formatted);
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) logoutUtil();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const handleDelete = async (instructor) => {
        if (!window.confirm("Are you sure you want to delete this instructor?")) return;

        try {
            await axios.delete(
                `${API_URI}/api/instructor/delete/${instructor._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setData((prev) => prev.filter((i) => i._id !== instructor._id));
        } catch (err) {
            if ([401, 403].includes(err.response?.status)) logoutUtil();
            else alert("Failed to delete instructor");
        }
    };

    const handleEdit = (instructor) => {
        canEdit && navigate(`${routepath}instructor/edit/${instructor._id}`);
    };

    const actions = [
        canEdit && {
            name: "Edit",
            handleClick: handleEdit,
            icon: <EditIcon />,
        },
        canDelete && {
            name: "Delete",
            handleClick: handleDelete,
            icon: <DeleteIcon />,
        },
    ].filter(Boolean);

    const tableStructure = [
        { header: "S.No", accessKey: "index" },
        {
            header: "Image",
            accessKey: "imageUrl",
            cell: (value) => (
                <img
                    src={value}
                    alt="Instructor"
                    className="h-12 w-12 rounded-full object-cover border"
                />
            ),
        },
        { header: "Name", accessKey: "name" },
        { header: "Profession", accessKey: "profession" },
        {
            header: "Created At",
            accessKey: "createdAt",
            cell: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    return (
        <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
            <Header
                title="Instructors"
                handleClick={() => canAdd && navigate(`${routepath}instructor/add`)}
                addTitle="Instructor"
                add={canAdd}
            />

            <div className="md:my-8 my-4 mx-auto md:mx-4">
                <NormalTable
                    tableStructure={tableStructure}
                    data={data}
                    isLoading={loading}
                    options={actions}
                />
            </div>
        </div>
    );
};

export default InstructorList;
