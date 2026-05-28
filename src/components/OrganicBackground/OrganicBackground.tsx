import React from 'react';
import './styles.css';

export const OrganicBackground: React.FC = () => {
  return (
    <div className="organic-bg-container">
      <div className="organic-bg-blob organic-bg-blob--1"></div>
      <div className="organic-bg-blob organic-bg-blob--2"></div>
      <div className="organic-bg-blob organic-bg-blob--3"></div>
      <div className="organic-bg-overlay"></div>
    </div>
  );
};
