import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PolyParticles } from './Particles.js';
import { BokehSphere } from './BokehSpheres.js';
import './styles.css';

export const BackgroundParticles: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="background-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={window.devicePixelRatio}
      >
        <PolyParticles count={100} connectionDistance={1.5} />
        
        {/* Global Bokeh Spheres */}
        <group position={[0, 0, -2]}>
          <BokehSphere colorToken="primary" sizePx={400} baseX="right" baseY="top" animType={1} isDark={isDark} />
          <BokehSphere colorToken="secondary" sizePx={300} baseX="left" baseY="bottom" animType={2} isDark={isDark} />
          <BokehSphere colorToken="accent" sizePx={200} baseX="right" baseY="center" animType={3} isDark={isDark} />
          <BokehSphere colorToken="primary" sizePx={250} baseX="left" baseY="top" animType={3} isDark={isDark} />
          <BokehSphere colorToken="accent" sizePx={350} baseX="center" baseY="bottom" animType={1} isDark={isDark} />
          <BokehSphere colorToken="secondary" sizePx={150} baseX="center" baseY="top" animType={2} isDark={isDark} />
        </group>
      </Canvas>
    </div>
  );
};
