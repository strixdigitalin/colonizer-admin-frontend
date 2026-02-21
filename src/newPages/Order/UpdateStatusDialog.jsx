import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";
import { toast } from "react-toastify";

const UpdateStatusDialog = ({ open, onClose, order, token, onUpdated }) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus || "pending");
      setPaymentMethod(order.paymentMethod || "COD");
      setIsActive(order.isActive ?? true);
    }
  }, [order]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${API_URI}/api/course/order/${order._id}`,
        {
          paymentStatus,
          paymentMethod,
          isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(err?.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Course Order</DialogTitle>

      <DialogContent dividers>
        {/* Order Summary */}
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Order Details
          </Typography>

          <Typography variant="body2">
            <strong>Order ID:</strong>{" "}
            {order.orderId || order._id.slice(-6).toUpperCase()}
          </Typography>
          <Typography variant="body2">
            <strong>Customer:</strong> {order.user?.name || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {order.user?.email || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Course:</strong> {order.course?.name || "N/A"}
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> ₹{order.amount}
          </Typography>
          <Typography variant="body2">
            <strong>Created At:</strong>{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Editable Fields */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentStatus}
            label="Payment Status"
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            label="Payment Method"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="COD">COD</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </Select>
        </FormControl>

        {/* <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Active Order"
        /> */}
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

export default UpdateStatusDialog;
