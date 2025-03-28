import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const getTrips = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/trips`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createTrip = async (token, tripData) => {
  const res = await axios.post(`${API_BASE_URL}/trips`, tripData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteTrip = async (token, id) => {
  const res = await axios.delete(`${API_BASE_URL}/trips/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
