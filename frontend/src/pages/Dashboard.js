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
import {
  getItineraryReviews,
  addItineraryReview,
  deleteItineraryReview
} from '../api';
import { FaStar } from 'react-icons/fa';


const cityImages = {
  roma: "/images/roma.jpeg",
  napoli: "/images/napoli.jpeg",
  firenze: "/images/firenze.jpeg",
};


const Dashboard = () => {
  const token = localStorage.getItem("token");
  const user = decodeToken(token);
  const navigate = useNavigate();

  const username = user?.username
  ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
  : "Viaggiatore";


  const [trips, setTrips] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '', description: '', itineraryItems: [] });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStep, setNewStep] = useState({ title: '',  date: '' });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [reviews, setReviews] = useState({});


  const loadReviewsForTrips = async (tripsData) => {
    const allReviews = {};
  
    for (const trip of tripsData) {
      for (const item of trip.itineraryItems || []) {
        try {
          const reviews = await getItineraryReviews(item.id, token);
          allReviews[item.id] = reviews;
        } catch (err) {
          console.error(`Errore caricamento recensioni per tappa ${item.id}`, err);
        }
      }
    }
  
    setReviews(allReviews);
  };
  

  
  const fetchTrips = async () => {
    try {
      const data = await getTrips(token);
      console.log("Dati ricevuti dal backend:", data);
      setTrips(data);
      await loadReviewsForTrips(data); // 🔁 Carica le recensioni per le tappe
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
      const city = formData.destination?.trim();
      if (city && city.length >= 3) {
        setWeatherLoading(true);
        const data = await fetchWeather(city);
        setWeather(data);
        setWeatherLoading(false);
      } else {
        setWeather(null);
      }
    };
    loadWeather();
  }, [formData.destination]);
  

  useEffect(() => {
    const cityKey = formData.destination?.toLowerCase().trim();
    const foundImage = cityImages[cityKey] || cityImages["default"];
    setFormData(prev => ({
      ...prev,
      imageUrl: foundImage
    }));
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
      itineraryItems: [...formData.itineraryItems, newStep]
    });
    setNewStep({ title: '',  date: '' });
  };

  const removeItineraryStep = (index) => {
    const updated = [...formData.itineraryItems];
    updated.splice(index, 1);
    setFormData({ ...formData, itineraryItems: updated });
  };

  const resetForm = () => {
    setFormData({ destination: '', startDate: '', endDate: '', description: '', itineraryItems: [] });
    setSelectedTrip(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    // 🔍 Settiamo immagine corretta prima di salvare
    const cityKey = formData.destination?.toLowerCase().trim();
    const foundImage = cityImages[cityKey] || "/images/default.jpg";
  
    const completeData = {
      ...formData,
      imageUrl: foundImage
    };
  
    try {
      await createTrip(token, completeData);
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
      startDate: trip.startDate,
      endDate: trip.endDate || '',
      description: trip.description,
      itineraryItems: trip.itineraryItems || []
    });
    setSelectedTrip(trip);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTrip(token, selectedTrip.id, formData);
      //alert("Viaggio aggiornato!");
      showSuccess("Viaggio aggiornato con successo!");
      await fetchTrips();
      resetForm();
    } catch (err) {
      alert("Errore aggiornamento.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrip(token, id);
      showSuccess("Viaggio eliminato!");
      window.location.reload();
      await fetchTrips();
    } catch (err) {
      alert("Errore durante l'eliminazione");
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const showSuccess = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
 
  const handleAddReview = async (stepId) => {
    const rating = parseInt(prompt("Inserisci una valutazione da 1 a 5"), 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return alert("Valore non valido. Inserisci un numero tra 1 e 5.");
    }
  
    try {
      console.log("TOKEN:", token);

      await addItineraryReview(stepId, { rating, comment: null }, token);
      const updatedReviews = await getItineraryReviews(stepId, token);
      setReviews(prev => ({ ...prev, [stepId]: updatedReviews }));
      alert("Recensione aggiunta con successo!");
      
    } catch (err) {
      console.error("Errore salvataggio recensione:", err);
      alert("Errore nel salvataggio della recensione.");
    }
  };
  

//modifiche 

  return (
    <div className="dashboard-container d-flex justify-content-center align-items-start py-5 px-3">
      <div className="dashboard-box shadow-sm p-4 bg-white rounded" style={{ maxWidth: "800px", width: "100%" }}>
        <div className="mb-3">
        <h2>👋 Ciao <strong>{user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Viaggiatore"}</strong>!</h2>

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
                {trip.imageUrl && (
                  <img
                  src={trip.imageUrl}
                  alt={trip.destination}
                  className="card-img-top"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                  <div className="card-body">
                  <h5 className="card-title mb-1">
                    <strong>{trip.destination}</strong>
                  </h5>
                      <small className="text-muted d-block mb-2">
                          📅 dal {trip.startDate} al {trip.endDate}
                      </small>
                  <p className="card-text">{trip.description}</p>
                    {trip.itineraryItems?.length > 0 && (
                      <ul className="list-group list-group-flush mt-2">
                        {trip.itineraryItems.map((step, index) => {
                          const stepReviewsRaw = reviews[step.id];
                          const stepReviews = Array.isArray(stepReviewsRaw)
                          ? stepReviewsRaw.filter(r => typeof r.rating === "number") : [];
                            const avgRating = stepReviews.length > 0
                          ? Number(
                              (
                                  stepReviews.reduce((sum, r) => sum + r.rating, 0) /
                                  stepReviews.length
                              ).toFixed(1)
                              )
                        : null;                         
                        return (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{step.title}</strong>
                            
                            <small className="text-muted">{step.date}</small>
                            </div>
                            <div>
                                {avgRating !== null ? (
                                  <span title={`Media: ${avgRating}`}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <FaStar key = {s} style={{ color: s <= Math.round(avgRating) ? 'gold' : '#ccc', marginRight: '2px' }}/>
                                    ))}
                                  </span>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleAddReview(step.id)}
                                  >
                                    Aggiungi voto
                                  </button>
                                )}
                              </div>
                          </li>
                        );
                        })}
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
                name="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
              name="description"
              rows="3"
              value={formData.description}
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

            {formData.itineraryItems.length > 0 && (
              <ul className="list-group">
                {formData.itineraryItems.map((step, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{step.title}</strong> – {step.date} <br />
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


      <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast align-items-center text-white bg-success border-0 ${showToast ? 'show' : ''}`} role="alert">
        <div className="d-flex">
            <div className="toast-body">
              {toastMessage}
            </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
      </div>
  </div>
</div>
    </div>
  );
};

export default Dashboard;