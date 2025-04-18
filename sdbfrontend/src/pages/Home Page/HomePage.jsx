import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import img1 from "../../assets/Carousel-img1.jpg";
import img2 from "../../assets/Carousel-img2.jpg";
import img3 from "../../assets/Carousel-img3.jpg";
import img4 from "../../assets/Carousel-img4.jpg";

const HomePage = ({ showLogin, setShowLogin }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section with Carousel */}
      <section id="home" className="carousel-container">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active"><img src={img1} className="d-block w-100" alt="Slide 1" /></div>
            <div className="carousel-item"><img src={img2} className="d-block w-100" alt="Slide 2" /></div>
            <div className="carousel-item"><img src={img3} className="d-block w-100" alt="Slide 3" /></div>
            <div className="carousel-item"><img src={img4} className="d-block w-100" alt="Slide 4" /></div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>Established in 1955, Morawakkorale Tea Factory is operated by the Morawakkorale Tea Producers' Cooperative Society Ltd., located in Kotapola, Sri Lanka. For decades, we have upheld a legacy of excellence in tea cultivation and processing, ensuring that every leaf we produce meets the highest standards of quality and authenticity. With a daily processing capacity of approximately 15,000 kg of green leaf, our factory specializes in producing high-quality orthodox teas. By blending traditional craftsmanship with modern technology, we guarantee that each batch of tea retains its freshness, aroma, and rich flavors. Our teas have consistently performed well at Sri Lanka’s tea auctions, further reinforcing our reputation for excellence.</p>        <div className='our-story-container'>

          <div className='our-heritage-container'>
            <h3>Our Heritage & Commitment to Quality</h3>
            <p>As an export-only tea producer, we take pride in delivering the purest flavors of Sri Lanka to tea lovers worldwide. Our commitment to sustainability and ethical practices ensures that every tea leaf is cultivated with environmental and social responsibility. Whether you're a tea enthusiast or a business looking for premium Ceylon tea, our diverse range of handpicked and expertly processed teas caters to every preference. We continuously strive to maintain the highest standards in tea production while preserving the rich heritage of Ceylon tea.</p>
            </div>

          <div className='sustainable-ethical-practices-container'>
            <h3>Sustainable & Ethical Practices</h3>
            <p>As an export-only tea producer, we take pride in delivering the purest flavors of Sri Lanka to tea lovers worldwide. Our commitment to sustainability and ethical practices ensures that every tea leaf is cultivated with environmental and social responsibility. Whether you're a tea enthusiast or a business looking for premium Ceylon tea, our diverse range of handpicked and expertly processed teas caters to every preference. We continuously strive to maintain the highest standards in tea production while preserving the rich heritage of Ceylon tea.</p>
            </div>

          <div className='our-tea-varieties-container'>
            <h3>Our Tea Varieties & The Taste of Ceylon</h3>
            <p>We offer a diverse selection of premium tea types, each carefully crafted to highlight the finest flavors of Ceylon tea. Our range includes orthodox black teas, green teas, and specialty blends, all produced with expertise and passion. From our lush plantations to your cup, Morawakkorale Tea Factory ensures that every sip is a celebration of quality, heritage, and sustainability. Join us in exploring the world of authentic Ceylon tea and discover the exquisite flavors that make our teas truly special.</p>
            <button onClick={() => navigate("/view-tea-varieties")}>Discover Our Tea Varieties</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Whether you have a question, feedback, feel free to reach out.</p>
        <div className="contact-info">
          <h5>Our Contact Details:</h5>
          <ul>
            <li><strong>Address:</strong> Morawakkorale Tea Factory, Deniyaya Road, Kotapola.</li>
            <li><strong>Phone:</strong> <a href="tel:+94412271400">+94 412271400</a></li>
            <li><strong>Email:</strong> <a href="mailto:morawakkoraleteacoop@gmail.com">morawakkoraleteacoop@gmail.com</a></li>
          </ul>
        </div>

        <div className="business-hours">
          <h5>Business Hours:</h5>
          <ul>
            <li>Monday to Friday: 9:00 AM – 5:00 PM</li>
            <li>Saturday: 9:00 AM – 1:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div className="social-media">
          <h5>Connect With Us:</h5>
          <p>Follow us on social media for the latest updates and news.<br />
            <strong>Facebook:</strong> <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">www.facebook.com</a></p>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <section id="login" className="login-section">
          <div className="login-modal">
            <div className="login-box">
              <h3>Login</h3>
              <input type="text" placeholder="User ID" />
              <input type="password" placeholder="Password" />
              <button className="btn btn-primary">Login</button>
              <button className="btn btn-secondary" onClick={() => setShowLogin(false)}>Close</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
