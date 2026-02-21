import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from "@mui/material";
import axios from "axios";
import { API_URI } from "../../utils/Global/main";

const ReturnManagementDialog = ({ open, onClose, order, token, onUpdated }) => {
    console.log(order);
    const [preferredReturnDate, setDate] = useState(order.returnRequest?.preferredReturnDate?.slice(0, 10) || "");
    const [adminMessage, setMessage] = useState("");

    const handleUpdate = async (action) => {
        if (!window.confirm("Are you sure you want to update the return status?")) return;
        try {
            await axios.put(
                `${API_URI}/api/order/admin/return/status/${order._id}`,
                { preferredReturnDate, status: action },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating return status:", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Manage Return for Order #{order._id.slice(-6).toUpperCase()}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Preferred Return Date"
                    type="date"
                    value={preferredReturnDate}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleUpdate("approved")} variant="contained">Approve</Button>
                <Button onClick={() => handleUpdate("pickup_scheduled")} variant="contained">Pickup Scheduled</Button>
                <Button onClick={() => handleUpdate("rejected")} variant="outlined">Reject</Button>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReturnManagementDialog;
