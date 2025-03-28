import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout effettuato con successo!");
    navigate("/"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">
        <span role="img" aria-label="logo">🌍</span> TravelMate
      </Link>

      <div className="ms-auto">
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-outline-primary me-2">Dashboard</Link>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-success">Registrati</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
