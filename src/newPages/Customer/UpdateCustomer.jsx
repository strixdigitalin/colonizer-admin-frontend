import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const UpdateCustomer = ({ open, onClose, customer, token, refresh }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setIsActive(customer.isActive);
    }
  }, [customer]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${API_URI}/api/v1/customer/owner/reset/${customer._id}`,
        {
          name,
          email,
          phone,
          password,
          isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      refresh();
      onClose();
    } catch (error) {
      console.error("Update customer error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Customer</DialogTitle>

      <DialogContent >

        {/* Editable Fields */}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Leave empty if you don't want to change password"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Active Customer"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          onClick={handleUpdate}
          disabled={loading}
          variant="contained"
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCustomer;