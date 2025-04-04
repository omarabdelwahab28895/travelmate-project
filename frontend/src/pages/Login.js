import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      const token = res.token; 
      localStorage.setItem("token", token);
      alert("Login avvenuto con successo!");
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Errore login:", err);
      alert("Login fallito. Controlla le credenziali.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Accedi a TravelMate ✈️</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <div className="mt-3">
        <p>Non hai un account? <a href="/register">Registrati</a></p>
      </div>
    </div>
  );
};

export default Login;
