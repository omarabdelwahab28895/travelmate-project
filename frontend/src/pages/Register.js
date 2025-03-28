import React, { useState } from 'react';
import { register } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      console.log("Registrazione riuscita:", res);
      alert("Registrazione completata!");
    } catch (err) {
      console.error("Errore registrazione:", err);
      alert("Errore durante la registrazione.");
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
