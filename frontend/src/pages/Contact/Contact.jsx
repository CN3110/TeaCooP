import React from 'react'
import './Contact.css';
import backgroundImage from '../../assets/contact-us-background-img.jpg';

const Contact = () => {
  return (
    <div className='contact-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='contact'>
        <h2>Contact Us</h2>
          <p>
            We'd love to hear from you! Whether you have a question, feedback, feel free to reach out.
          </p>
      </div>

      <div className="contact-info">
        <h5>Our Contact Details:</h5>
          <ul>
          <li><strong>Address:</strong> Morawakkorale Tea Factory, Deniyaya Road, Kotapola. </li>
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
          <p>Follow us on social media for the latest Updates and News.<br />
              <strong>Facebook:</strong> <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">www.facebook.com</a></p>
      </div>

      
    </div> 
  )
}

export default Contact