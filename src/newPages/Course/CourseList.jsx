import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";
import { RiOrderPlayFill } from "react-icons/ri";
import { ListAltRounded } from "@mui/icons-material";

const CourseList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  const canAdd = !isSubAdmin || permissions.includes("course_management_add");
  const canEdit = !isSubAdmin || permissions.includes("course_management_edit");
  const canViewOrders = !isSubAdmin || permissions.includes("order_management_list");
  const canViewRegisters = !isSubAdmin || permissions.includes("Register_Student_list");
  const canDelete = canEdit;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/course`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const courses = res.data?.data || [];
      const formatted = courses.map((course, index) => ({
        ...course,
        index: index + 1,
        image: course.images && course.images[0],
        time: `${course.startTime} - ${course.endTime}`,
        isActiveKey: course.isActive ? "Active" : "Inactive",
      }));

      setData(formatted);
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_URI}/api/course/delete/${course._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData((prev) => prev.filter((c) => c._id !== course._id));
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
      else alert("Failed to delete course");
    }
  };

  const handleToggle = async (course) => {
    try {
      const res = await axios.patch(
        `${API_URI}/api/course/${course._id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // setData((prev) =>
      //   prev.map((c) =>
      //     c._id === course._id ? res.data.data : c
      //   )
      // );

      fetchCourses();
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logoutUtil();
    }
  };

  const handleEdit = (course) => {
    canEdit && navigate(`${routepath}course/edit/${course._id}`);
  };

  const handleCourseOrder = (course) => {
    canViewOrders && navigate(`${routepath}course/order/${course._id}`);
  };
  const handleRegistrations = (course) => {
    canViewRegisters && navigate(`${routepath}course/registrations/${course._id}`);
  };
  const handleStudyMaterial = (course) => {
    navigate(`${routepath}course/${course._id}/study-materials`);
  };

  const actions = [
    canEdit && {
      name: "Toggle",
      handleClick: handleToggle,
      icon: <ToggleOnIcon />
    },
    canViewOrders && {
      name: "Course order",
      handleClick: handleCourseOrder,
      icon: <RiOrderPlayFill />,
    },
    canViewRegisters && {
      name: "View Registrer Students",
      handleClick: handleRegistrations,
      icon: <ListAltRounded />,
    },
    canEdit && {
      name: "Study Material",
      handleClick: handleStudyMaterial,
      icon: <ListAltRounded />,
    },
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
    // { header: "S.No", accessKey: "index" },
    { header: "Status", accessKey: "isActiveKey" },
    {
      header: "Image",
      accessKey: "image",
    },
    { header: "Course Name", accessKey: "name" },
    // { header: "Timing", accessKey: "timing" },
    { header: "Lessons", accessKey: "numberOfLessons" },
    {
      header: "Price",
      accessKey: "price",
      cell: (value) => `₹${value}`,
    },
    // {
    //   header: "Timings",
    //   accessKey: "timing",
    //   cell: (value) => (
    //     <span
    //       className={`px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
    //         }`}
    //     >
    //       {value ? "Live" : "In Progress"}
    //     </span>
    //   ),
    // },
    {
      header: "Time",
      accessKey: "time",
    },
    {
      header: "Created At",
      accessKey: "createdAt",
      cell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto">
      <Header
        title="Courses"
        handleClick={() => canAdd && navigate(`${routepath}course/add`)}
        addTitle="Course"
        add = {canAdd}
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

export default CourseList;
