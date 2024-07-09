// src/components/Modal.js
import React from 'react';
import './Modal.css';  // Make sure to create a corresponding CSS file for styling

const Modal = ({ show, children, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
