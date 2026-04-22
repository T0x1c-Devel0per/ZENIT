import React from 'react';
import './styles.css';

export const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Cargando experiencia...</p>
    </div>
  );
};
