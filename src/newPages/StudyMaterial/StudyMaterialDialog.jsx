import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { toast } from "react-toastify";

const StudyMaterialDialog = ({
  open,
  onClose,
  token,
  courseId,
  material,
  onUpdated,
}) => {
  const isEdit = Boolean(material);

  const [form, setForm] = useState({
    title: "",
    description: "",
    materialDate: "",
    sessionLink: "",
    recordingLink: "",
    visibility: "private",
    isActive: true,
  });

  useEffect(() => {
    if (material) {
      setForm({
        title: material.title || "",
        description: material.description || "",
        materialDate: material.materialDate?.substring(0, 10) || "",
        sessionLink: material.sessionLink || "",
        recordingLink: material.recordingLink || "",
        visibility: material.visibility || "private",
        isActive: material.isActive ?? true,
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, course: courseId };

      if (isEdit) {
        await axios.put(
          `${API_URI}/api/studyMaterial/${material._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Study material updated");
      } else {
        await axios.post(`${API_URI}/api/studyMaterial`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Study material added");
      }

      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit" : "Add"} Study Material</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Material Date"
          name="materialDate"
          InputLabelProps={{ shrink: true }}
          value={form.materialDate}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Session Link"
          name="sessionLink"
          value={form.sessionLink}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Recording Link"
          name="recordingLink"
          value={form.recordingLink}
          onChange={handleChange}
        />

        {/* <FormControl fullWidth margin="normal">
          <InputLabel>Visibility</InputLabel>
          <Select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
          >
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </Select>
        </FormControl> */}

        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              onChange={handleChange}
              name="isActive"
            />
          }
          label="Active"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudyMaterialDialog;
