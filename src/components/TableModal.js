import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (event.target.className.includes('modal-backdrop')) {
          onClose();
        }
      };
  
      if (isOpen) {
        window.addEventListener('click', handleOutsideClick);
      }
  
      return () => {
        window.removeEventListener('click', handleOutsideClick);
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="close-button">Close</button>
      </div>


      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
        }
        .close-button {
            background-color: red;
            color: white;
            padding: 2px 5px;
            font-size: 0.75rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .close-button:hover {
            background-color: darkred;
          }
      `}</style>
    </div>
  );
};

export default Modal;
