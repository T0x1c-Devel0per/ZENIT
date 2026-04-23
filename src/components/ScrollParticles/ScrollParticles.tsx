import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ScrollParticles.css';

interface ParticleConfig {
  side: 'left' | 'right';
  top: string;
  size: number;
  speed: number;
  color: 'primary' | 'secondary' | 'accent';
  opacity: number;
  blur?: number;
}

interface ScrollParticlesProps {
  particles: ParticleConfig[];
  className?: string;
}

// Shader para simular el resplandor suave sin afectar el DOM
const fragmentShader = `
varying vec2 vUv;
uniform vec3 color;
uniform float opacity;
void main() {
  float dist = distance(vUv, vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, dist) * opacity;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function parseColor(token: string, isDark: boolean): THREE.Color {
  if (token === 'primary') return new THREE.Color(isDark ? '#38bdf8' : '#0ea5e9');
  if (token === 'secondary') return new THREE.Color(isDark ? '#a78bfa' : '#8b5cf6');
  if (token === 'accent') return new THREE.Color(isDark ? '#fbbf24' : '#f59e0b');
  return new THREE.Color('#ffffff');
}

function Orb({ config, containerRef }: { config: ParticleConfig, containerRef: React.RefObject<HTMLDivElement> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const targetColor = useMemo(() => parseColor(config.color, isDark), [config.color, isDark]);

  const [basePos, setBasePos] = useState<THREE.Vector3>(new THREE.Vector3());
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Scale mapping to WebGL units
    const sizeRatio = config.size / rect.width;
    const sizeInViewport = sizeRatio * viewport.width;
    
    // To keep it proportional, we map the height ratio too, 
    // but since the canvas uses object-fit cover logic by default, we just use width scale for a perfect circle.
    // The viewport coordinates map EXACTLY to the canvas size.
    // However, if the container is very tall, viewport.width and viewport.height describe the canvas in 3D units.
    
    const scaleX = sizeInViewport;
    const scaleY = (config.size / rect.height) * viewport.height;
    
    // Use the max to keep it a circle that matches the pixel size roughly
    const finalScale = Math.max(scaleX, scaleY);
    setScale([finalScale, finalScale, 1]);

    const isLeft = config.side === 'left';
    const xPct = isLeft ? -0.05 : 1.05;
    const x = (xPct - 0.5) * viewport.width;

    const topPct = parseFloat(config.top) / 100;
    const y = -(topPct - 0.5) * viewport.height;

    setBasePos(new THREE.Vector3(x, y, 0));
  }, [config, viewport, containerRef]);

  useFrame(() => {
    if (!containerRef.current || !meshRef.current || !materialRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.bottom < 0 || rect.top > windowH) return;

    const progress = 1 - (rect.bottom / (windowH + rect.height));

    const parallaxPx = (progress - 0.5) * config.speed * 80;
    const parallaxVp = -(parallaxPx / rect.height) * viewport.height;

    meshRef.current.position.set(
      basePos.x,
      basePos.y + parallaxVp,
      0
    );

    const pulse = 1 + Math.sin(progress * Math.PI) * 0.1;
    meshRef.current.scale.set(scale[0] * pulse, scale[1] * pulse, 1);

    materialRef.current.uniforms.opacity.value = config.opacity * (0.5 + Math.sin(progress * Math.PI) * 0.5);
  });

  const uniforms = useMemo(() => ({
    color: { value: targetColor },
    opacity: { value: config.opacity }
  }), [targetColor, config.opacity]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function ScrollParticles({ particles, className = '' }: ScrollParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`scroll-particles ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 2]}
        eventSource={containerRef.current || undefined}
      >
        {particles.map((p, i) => (
          <Orb key={i} config={p} containerRef={containerRef} />
        ))}
      </Canvas>
    </div>
  );
}
