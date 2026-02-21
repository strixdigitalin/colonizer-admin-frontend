import axios from "axios";
import { API_URI } from "../utils/Global/main";

// Login subadmin
export const loginSubadmin = async (credentials) => {
  try {
    const res = await axios.post(`${API_URI}/api/subadmin/login`, credentials, {
      headers: { "Content-Type": "application/json" }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get all subadmins
export const getAllSubadmins = async (token) => {
  try {
    const res = await axios.get(`${API_URI}/api/subadmin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get single subadmin by ID
export const getSubadminById = async (id, token) => {
  try {
    const res = await axios.get(`${API_URI}/api/subadmin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Create new subadmin
export const createSubadmin = async (data, token) => {
  try {
    const res = await axios.post(`${API_URI}/api/subadmin/create`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update subadmin
export const updateSubadmin = async (id, data, token) => {
  try {
    const res = await axios.put(`${API_URI}/api/subadmin/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete subadmin
export const deleteSubadmin = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URI}/api/subadmin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}; 