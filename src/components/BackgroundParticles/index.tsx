import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PolyParticles } from './Particles.js';
import './styles.css';

export const BackgroundParticles: React.FC = () => {
  return (
    <div className="background-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={window.devicePixelRatio}
      >
        <PolyParticles count={100} connectionDistance={3} />
      </Canvas>
    </div>
  );
};
