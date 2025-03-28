import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeToken';
import {
  getTrips,
  deleteTrip,
  createTrip,
  updateTrip,
  exportTripsPdf,
  exportTripsCsv
} from '../api';
import { fetchWeather } from '../utils/weatherApi';
import './Dashboard.css';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [formData, setFormData] = useState({ destination: '', date: '', endDate: '', notes: '', itinerary: [] });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStep, setNewStep] = useState({ title: '', description: '', date: '' });

  const fetchTrips = async () => {
    try {
      const data = await getTrips(token);
      setTrips(data);
    } catch (err) {
      console.error("Errore caricamento viaggi:", err);
      setTrips([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTrips();
    }
  }, [token]);

  useEffect(() => {
    const loadWeather = async () => {
      if (formData.destination) {
        setWeatherLoading(true);
        try {
          const data = await fetchWeather(formData.destination);
          setWeather(data);
        } catch (err) {
          console.error("Errore meteo:", err);
          setWeather(null);
        }
        setWeatherLoading(false);
      }
    };
    loadWeather();
  }, [formData.destination]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewStepChange = (e) => {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  };

  const addItineraryStep = () => {
    if (!newStep.title || !newStep.date) return alert("Compila almeno titolo e data");
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newStep]
    });
    setNewStep({ title: '', description: '', date: '' });
  };

  const removeItineraryStep = (index) => {
    const updated = [...formData.itinerary];
    updated.splice(index, 1);
    setFormData({ ...formData, itinerary: updated });
  };

  const resetForm = () => {
    setFormData({ destination: '', date: '', endDate: '', notes: '', itinerary: [] });
    setSelectedTrip(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTrip(token, formData);
      alert("Viaggio creato!");
      await fetchTrips();
      resetForm();
    } catch (err) {
      alert("Errore creazione viaggio.");
    }
  };

  const handleEdit = (trip) => {
    setFormData({
      destination: trip.destination,
      date: trip.date,
      endDate: trip.endDate || '',
      notes: trip.notes,
      itinerary: trip.itinerary || []
    });
    setSelectedTrip(trip);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTrip(token, selectedTrip.id, formData);
      alert("Viaggio aggiornato!");
      await fetchTrips();
      resetForm();
    } catch (err) {
      alert("Errore aggiornamento.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(token, id);
      await fetchTrips();
    } catch (err) {
      alert("Errore durante l'eliminazione");
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container d-flex justify-content-center align-items-start py-5 px-3">
      <div className="dashboard-box shadow-sm p-4 bg-white rounded" style={{ maxWidth: "800px", width: "100%" }}>
        <div className="mb-3">
          <h2>👋 Ciao <strong>{user?.username || "utente"}</strong>!</h2>
        </div>

        <p className="lead">Gestisci i tuoi viaggi personali con <strong>TravelMate</strong>.</p>

        <h4 className="mt-4 mb-3">🌍 I tuoi viaggi</h4>

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-outline-dark btn-sm" onClick={() => exportTripsPdf(token)}>📄 Esporta PDF</button>
          <button className="btn btn-outline-dark btn-sm" onClick={() => exportTripsCsv(token)}>📁 Esporta CSV</button>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="🔍 Cerca per destinazione..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="row">
          {filteredTrips.length === 0 ? (
            <div className="alert alert-warning text-center">
              Nessun viaggio trovato. Inizia aggiungendone uno sotto! 😊
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className="col-md-6 mb-4">
                <div className="card border-primary shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {trip.destination}
                      <span className="badge bg-primary float-end">{trip.date}</span>
                    </h5>
                    <p className="card-text">{trip.notes}</p>

                    {trip.itinerary?.length > 0 && (
                      <ul className="list-group list-group-flush mt-2">
                        {trip.itinerary.map((step, index) => (
                          <li key={index} className="list-group-item">
                            <strong>{step.title}</strong> – {step.date} <br />
                            <small>{step.description}</small>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(trip)}>Modifica</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(trip.id)}>Elimina</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <h4 className="mt-5">{selectedTrip ? '✏️ Modifica viaggio' : '➕ Crea nuovo viaggio'}</h4>
        <form onSubmit={selectedTrip ? handleUpdate : handleCreate}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Destinazione</label>
              <input
                type="text"
                className="form-control"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>

            {weatherLoading && (
              <div className="col-md-8 mb-3">
                <div className="alert alert-secondary">
                  ⏳ Caricamento meteo in corso...
                </div>
              </div>
            )}

            {weather && (
              <div className="col-md-12 mb-3">
                <div className="alert alert-info d-flex align-items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt="Icona meteo"
                    style={{ width: 50 }}
                  />
                  <div>
                    <strong>{weather.name}</strong><br />
                    ☁️ {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}<br />
                    🌡️ {weather.temp}°C | 💧 {weather.humidity}% | 🌬️ {weather.wind} m/s
                  </div>
                </div>
              </div>
            )}


            <div className="col-md-4 mb-3">
              <label className="form-label">Data Inizio</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Data Fine</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Descrizione</label>
            <textarea
              className="form-control"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Tappe dell'itinerario</label>
            <div className="row mb-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Tappa"
                  value={newStep.title}
                  onChange={handleNewStepChange}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Descrizione"
                  value={newStep.description}
                  onChange={handleNewStepChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={newStep.date}
                  onChange={handleNewStepChange}
                />
              </div>
              <div className="col-md-1 d-grid">
                <button type="button" className="btn btn-outline-success" onClick={addItineraryStep}>➕</button>
              </div>
            </div>

            {formData.itinerary.length > 0 && (
              <ul className="list-group">
                {formData.itinerary.map((step, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{step.title}</strong> – {step.date} <br />
                      <small>{step.description}</small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeItineraryStep(index)}
                    >✖</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">{selectedTrip ? "Aggiorna" : "Salva"}</button>
            {selectedTrip && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Annulla</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
