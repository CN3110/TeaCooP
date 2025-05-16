import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ setShowLogin }) => {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Morawakkorale Tea CO-OP
        </a>

        {/*toggle button*/}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">


            {/*About Us*/}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/aboutus"
                onMouseEnter={() => setHoveredLink("aboutus")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {" "}
                About Us{" "}
              </a>
            </li>

            
            {/*Contact*/}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/contact"
                onMouseEnter={() => setHoveredLink("contact")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {" "}
                Contact{" "}
              </a>
            </li>
          </ul>
          

          {/*Login In*/}
          <button
            className="btn btn-outline-light me-2"
            onClick={() => setShowLogin(true)}
          >
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
