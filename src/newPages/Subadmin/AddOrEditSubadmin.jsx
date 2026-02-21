import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URI } from "../../utils/Global/main";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../../components/designs/TopComponents/Header";

// MUI Components
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Switch
} from "@mui/material";

import { availablePermissions } from "./permissionhelper"

const AddOrEditSubadmin = ({ token, routepath }) => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    assignedArea: "Finance",
    permissions: [],
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  const availableAreas = ["Finance", "Office"];

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`${API_URI}/api/subadmin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 200) {
            const subadmin = res?.data?.data;
            setFormData({
              name: subadmin.name,
              email: subadmin.email,
              password: "", // Password not included in edit
              assignedArea: subadmin.assignedArea || "",
              permissions: subadmin.permissions || [],
              isActive: subadmin.isActive
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch subadmin details");
        })
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    if (!isEdit && !formData.password) {
      toast.error("Password is required for new subadmin");
      return;
    }

    try {
      setLoading(true);

      // Remove password from update data if editing
      const submitData = formData
      // ? { ...formData}
      // : formData;

      const res = isEdit
        ? await axios.put(`${API_URI}/api/subadmin/${id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        : await axios.post(`${API_URI}/api/subadmin/create`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        })

      if (res.status === 200 || res.status === 201) {
        toast.success(`Subadmin ${isEdit ? "updated" : "created"} successfully!`);
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (event) => {
    const { target: { value }, } = event;

    const selectedValues = typeof value === 'string' ? value.split(',') : value;

    const validPermissions = selectedValues.filter((val) =>
      availablePermissions.some((permission) => permission.key === val)
    );

    setFormData({
      ...formData,
      permissions: validPermissions,
    });
  };

  return (
    <Box className="my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl border shadow overflow-y-auto bg-white h-full">
      <Header title={isEdit ? "Edit Subadmin" : "Add Subadmin"} add={false} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4 }}
        p={3}
        width="100%"
      >
        {/* <Typography variant="h6" mb={3}>
          {isEdit ? "Edit" : "Add"} Subadmin
        </Typography> */}

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            {/* {!isEdit && ( */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                fullWidth
                required={isEdit ? false : true}
                variant="outlined"
              />
            </Grid>
            {/* )} */}

            {/* <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned Area</InputLabel>
                <Select
                  value={formData.assignedArea}
                  label="Assigned Area"
                  onChange={(e) =>
                    setFormData({ ...formData, assignedArea: e.target.value })
                  }
                >
                  <MenuItem value="">
                    <em>Select Area</em>
                  </MenuItem>
                  {availableAreas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Permissions</InputLabel>
                <Select
                  multiple
                  value={formData.permissions}
                  onChange={handlePermissionChange}
                  input={<OutlinedInput label="Permissions" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={availablePermissions.find(permission => permission.key === value)?.label || value} />
                      ))}
                    </Box>
                  )}
                >
                  {availablePermissions.map((permission) => (
                    <MenuItem key={permission.key} value={permission.key}>
                      <Checkbox checked={formData.permissions.indexOf(permission.key) > -1} />
                      <ListItemText primary={permission.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                }
                label="Active Status"
              />
            </Grid>

            <Grid item xs={12} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ px: 4, py: 1 }}
              >
                {isEdit ? "Update" : "Add"} Subadmin
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AddOrEditSubadmin; 