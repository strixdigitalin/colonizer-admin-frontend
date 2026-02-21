import React, { useEffect, useState } from "react";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { API_URI, logoutUtil } from "../../utils/Global/main";
import { useNavigate } from "react-router-dom";

const BlogList = ({ token, routepath, permissions = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSubAdmin = routepath === "/office/";

  const canAdd = !isSubAdmin || permissions.includes("blog_management_add");
  const canEdit = !isSubAdmin || permissions.includes("blog_management_edit");
  const canDelete = canEdit;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URI}/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blogs = res.data?.data || [];
      const updated = blogs.map((blog, idx) => ({
        ...blog,
        index: idx + 1,
      }));

      setData(updated);
    } catch (error) {
      console.error("Error fetching blogs:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        logoutUtil();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  const handleDelete = async (blog) => {
    if (!canDelete) return;

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_URI}/api/blog/delete/${blog._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prev) => prev.filter((b) => b._id !== blog._id));
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logoutUtil();
        } else {
          alert(error.response?.data?.message || "Something went wrong");
        }
      }
    }
  };


  const handleEdit = (blog) => {
    if (canEdit) navigate(`${routepath}blog/edit/${blog._id}`);
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


  const blogTableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Title", accessKey: "title" },
    { header: "Author", accessKey: "author" },
    {
      header: "Image",
      accessKey: "imageUrl",
      cell: (value) =>
        value ? (
          <img
            src={value}
            alt="Blog"
            className="w-24 h-12 object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      header: "Published",
      accessKey: "isPublished",
      cell: (value) => (value ? "Yes" : "No"),
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
        title={"Blogs"}
        handleClick={() => canAdd && navigate(`${routepath}blog/add`)}
        addTitle={"Blog"}
        add={canAdd}
      />

      <div className="md:my-8 my-4 mx-auto md:mx-4">
        <NormalTable
          tableStructure={blogTableStructure}
          data={data}
          isLoading={loading}
          options={actions}
        />
      </div>
    </div>
  );
};

export default BlogList;
