import React from 'react'
import './LoginModal.css'

const LoginModal = ({open, handleClose}) => {
  return (
    <div className={`modal fade ${open ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login</h5>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <input type="text" className="form-control mb-3" placeholder="User ID" />
            <input type="password" className="form-control mb-3" placeholder="Password" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">Log In</button>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal