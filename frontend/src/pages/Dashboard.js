import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeToken';
import { getTrips, deleteTrip, createTrip } from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    if (token) {
      getTrips(token).then(setTrips).catch((err) => {
        console.error("Errore caricamento viaggi:", err);
      });
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTrip(token, formData);
      alert("Viaggio creato!");
      const nuovi = await getTrips(token);
      setTrips(nuovi);
      setFormData({ destination: '', date: '', notes: '' });
    } catch (err) {
      alert("Errore creazione viaggio.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(token, id);
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      alert("Errore durante l'eliminazione");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout effettuato con successo!");
    navigate("/login");
  };

  return (
    <div className="dashboard-container d-flex justify-content-center align-items-start">
      <div className="dashboard-box w-100" style={{ maxWidth: "900px" }}>
        <h2>👋 Ciao {user?.username || "utente"}!</h2>
        <p className="lead">Gestisci i tuoi viaggi personali con TravelMate.</p>

        <h4 className="mt-4 mb-3">🌍 I tuoi viaggi</h4>
        <div className="row">
          {trips.length === 0 ? (
            <p>Nessun viaggio trovato.</p>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="col-md-6 mb-4">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title">{trip.destination}</h5>
                    <p className="card-text">📅 {trip.date}</p>
                    <p className="card-text">{trip.notes}</p>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(trip.id)}>
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <h4 className="mt-5">➕ Crea nuovo viaggio</h4>
        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label className="form-label">Destinazione</label>
            <input type="text" className="form-control" name="destination" value={formData.destination} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Data</label>
            <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Note</label>
            <textarea className="form-control" name="notes" rows="3" value={formData.notes} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-success">Salva</button>
        </form>

        <button className="btn btn-danger mt-4" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
