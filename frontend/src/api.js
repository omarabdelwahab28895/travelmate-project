import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const login = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await axiosInstance.post("/auth/register", userData);
  return res.data;
};

export const getTrips = async (token) => {
  const res = await axiosInstance.get("/trips", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  console.log("Risposta completa dal backend:", res); // Stampa la risposta completa
  
  return Array.isArray(res.data) ? res.data : [];
};

export const createTrip = async (token, tripData) => {
  const res = await axiosInstance.post("/trips", tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};

export const deleteTrip = async (token, id) => {
  const res = await axiosInstance.delete(`/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};

export const updateTrip = async (token, id, data) => {
  const res = await axiosInstance.put(`/trips/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};

// 📄 Esporta PDF
export const exportTripsPdf = async (token) => {
  const res = await axiosInstance.get("/trips/export/pdf", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "viaggi.pdf");
  document.body.appendChild(link);
  link.click();
};

// 📁 Esporta CSV
export const exportTripsCsv = async (token) => {
  const res = await axiosInstance.get("/trips/export/csv", {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "viaggi.csv");
  document.body.appendChild(link);
  link.click();
};

// ⭐ Ottieni tutte le recensioni per una tappa
export const getItineraryReviews = async (itemId, token) => {
  const res = await axiosInstance.get(`/reviews/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};


// ➕ Aggiungi una recensione a una tappa
export const addItineraryReview = async (itemId, review, token) => {
  const res = await axiosInstance.post(`/reviews/${itemId}`, review, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};

// 🗑️ Elimina una recensione di una tappa
export const deleteItineraryReview = async (reviewId, token) => {
  const res = await axiosInstance.delete(`/reviews/delete/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};
