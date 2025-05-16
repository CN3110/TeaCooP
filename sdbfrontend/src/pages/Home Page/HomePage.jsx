import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import img1 from "../../assets/Carousel-img1.jpg";
import img2 from "../../assets/Carousel-img2.jpg";
import img3 from "../../assets/Carousel-img3.jpg";
import img4 from "../../assets/Carousel-img4.jpg";
import Login from "./Login/Login";

const HomePage = ({ showLogin, setShowLogin }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="modern-homepage">
      {/* Hero Section with Full-width Image */}
      <section id="home" className="hero-section">
        <div className="hero-image-container">
          <img src={img1} alt="Morawakkorale Tea Plantation" className="hero-image" />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Morawakkorale Tea Factory</h1>
              <p className="hero-subtitle">Premium Ceylon Tea Since 1955</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => navigate("/login")}>
                  Login 
                </button>
                <button className="btn-outline" onClick={() => navigate("/view-tea-varieties")}>
                  Discover Teas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section with Cards */}
      <section id="about" className={`about-section ${activeSection === "about" ? "active" : ""}`}>
        <div className="section-header">
          <h2>Our Legacy in Tea</h2>
          <p className="section-subtitle">Crafting excellence since 1955</p>
        </div>
        
        <div className="about-cards">
          <div className="about-card">
            <div className="card-icon">🌱</div>
            <h3>Our Heritage</h3>
            <p>Established in 1955, Morawakkorale Tea Factory blends traditional craftsmanship with modern technology to produce high-quality orthodox teas with a daily capacity of 15,000 kg of green leaf.</p>
          </div>
          
          <div className="about-card">
            <div className="card-icon">🌍</div>
            <h3>Sustainable Practices</h3>
            <p>We're committed to ethical and sustainable tea production, ensuring environmental and social responsibility in every leaf we cultivate.</p>
          </div>
          
          <div className="about-card">
            <div className="card-icon">🍃</div>
            <h3>Premium Varieties</h3>
            <p>Discover our diverse range of orthodox black teas, green teas, and specialty blends that consistently perform well at Sri Lanka's tea auctions.</p>
            <button className="card-button" onClick={() => navigate("/view-tea-varieties")}>
              Explore Our Teas →
            </button>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-grid">
          <div className="gallery-item tall" style={{ backgroundImage: `url(${img2})` }}></div>
          <div className="gallery-item" style={{ backgroundImage: `url(${img3})` }}></div>
          <div className="gallery-item" style={{ backgroundImage: `url(${img4})` }}></div>
          <div className="gallery-item wide" style={{ backgroundImage: `url(${img1})` }}></div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Connect With Us</h2>
            <p>We'd love to hear from you about our teas, partnerships, or any inquiries.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Visit Us</h4>
                  <p>Morawakkorale Tea Factory, Deniyaya Road, Kotapola</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p><a href="tel:+94412271400">+94 412271400</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email Us</h4>
                  <p><a href="mailto:morawakkoraleteacoop@gmail.com">morawakkoraleteacoop@gmail.com</a></p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <span className="icon">📘</span> Facebook
              </a>
            </div>
          </div>
          
          <div className="business-hours">
            <h3>Business Hours</h3>
            <ul>
              <li><span>Mon-Fri:</span> 9:00 AM – 5:00 PM</li>
              <li><span>Sat:</span> 9:00 AM – 1:00 PM</li>
              <li><span>Sun:</span> Closed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Login Section - Only show if needed */}
      {showLogin && (
        <section className="login-section">
          <Login setShowLogin={setShowLogin} />
        </section>
      )}
    </div>
  );
};

export default HomePage;