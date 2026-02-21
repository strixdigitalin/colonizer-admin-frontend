import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/designs/TopComponents/Header";
import NormalTable from "../../components/designs/Tables/NormalTable";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import StudyMaterialDialog from "./StudyMaterialDialog";

const StudyMaterialList = ({ token }) => {
  const { courseId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    if (courseId) fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URI}/api/studyMaterial/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formatted = res.data?.data?.map((m, index) => ({
        _id: m._id,
        index: index + 1,
        title: m.title,
        materialDate: new Date(m.materialDate).toLocaleDateString(),
        visibility: m.visibility,
        isActive: m.isActive?"Active":"Inactive",
        raw: m,
      }));

      setData(formatted || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      handleClick: (row) => {
        setSelectedMaterial(row.raw);
        setOpenDialog(true);
      },
    },
  ];

  const tableStructure = [
    { header: "S.NO", accessKey: "index" },
    { header: "Title", accessKey: "title" },
    {
      header: "Material Date",
      accessKey: "materialDate",
    },
    // { header: "Visibility", accessKey: "visibility" },
    {
      header: "Active",
      accessKey: "isActive",
    },
  ];

  return (
    <div className="bg-white p-6 shadow rounded">
      <Header
        title="Study Materials"
        add
        addTitle="Material"
        handleClick={() => setOpenDialog(true)}
      />

      <NormalTable
        tableStructure={tableStructure}
        data={data}
        isLoading={loading}
        options={actions}
      />

      <StudyMaterialDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        token={token}
        courseId={courseId}
        material={selectedMaterial}
        onUpdated={fetchMaterials}
      />
    </div>
  );
};

export default StudyMaterialList;
