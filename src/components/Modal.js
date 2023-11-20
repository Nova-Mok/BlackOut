import React from 'react';

const Modal = ({ isOpen, message }) => {
  if (!isOpen) return null;

  const isLoading = message === "Getting User Profile Please wait...";

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        {isLoading && (
          <div className="loader"></div>
        )}
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Modal;
