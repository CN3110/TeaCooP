import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <footer className="footer">
        <p>©2025 Morawakkorale co-op PVT LTD. All Rights Reserved.</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12279.636726742514!2d80.53701987249987!3d6.29690112582338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae15f3514ece025%3A0xc5fdab288901288a!2sMorawakkorale%20Tea%20Factory!5e0!3m2!1sen!2slk!4v1743678142692!5m2!1sen!2slk"
          width="600"
          height="300"
          style={{ border: "0" }}  // ✅ Fixed style
          allowFullScreen  // ✅ Fixed attribute
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"  // ✅ Fixed attribute
        ></iframe>
      </footer>
    </div>
  );
};

export default Footer;
