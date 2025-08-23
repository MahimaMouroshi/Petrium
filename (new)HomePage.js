import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/1000041784.png";
import PetList from "../components/PetList";
import { UserContext } from "../Context/UserContext"; 
import "./HomePage.css";



function HomePage() {
  const { user } = useContext(UserContext); 
  const isAdmin = localStorage.getItem("role") === "admin";
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`homepage ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <div className="logo-section">
          <img src={logoImg} alt="Petrium Logo" className="logo-img" />
          <div className="brand-info">
            <h1 className="brand-name">PETRIUM</h1>
            <p className="brand-tagline">Where Tails Meet Tales</p>
          </div>
        </div>

        <nav className="nav-buttons">
          
          <Link to="/cart" className="nav-btn">🛒 Cart</Link>
         {user && user.email ? (
          <>
             <Link to="/profile" className="nav-btn">👤 {user.name || "Profile"}</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">👤 Login</Link>
           <Link to="/signup" className="nav-btn">📋 Signup</Link>
        </>
      )}
          <Link to="/admin-login" className="nav-btn">🛡 Admin Login</Link>
          <div className="pastel-toggle-container">
            <label className="pastel-toggle">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="slider"></span>
            </label>
          </div>
        </nav>
      </header>

      <section className="rescue-banner">
        🚨 Need help rescuing a pet? Call: <a href="tel:+880123456789" className="rescue-phone">+880-123-456-789</a>
      </section>

      <section className="vet-info">
        <h2>🐾 Vet Contacts & Emergency Info</h2>
        <ul>
          <li><strong>Dr. Rahman</strong> - <a href="tel:+8801712345678">+8801712345678</a></li>
          <li><strong>Animal Care Clinic</strong> - <a href="tel:+8801912345678">+8801912345678</a></li>
          <li><strong>Emergency Vet</strong> - <a href="tel:+8801812345678">+8801812345678</a></li>
        </ul>
      </section>

      <section className="search-section">
        <input type="text" placeholder="Search pets to adopt..." className="search-bar" />
        <button className="search-btn">🔍 Search</button>
      </section>  

      <main className="pet-list-container">
        <PetList />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Petrium. Where Tails Meet Tales.</p>
      </footer>
    </div>
  );
}

export default HomePage;
