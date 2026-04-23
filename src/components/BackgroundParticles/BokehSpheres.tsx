import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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

export function BokehSphere({ 
  colorToken, 
  sizePx, 
  baseX, 
  baseY, 
  animType,
  isDark
}: { 
  colorToken: string, 
  sizePx: number, 
  baseX: string,
  baseY: string,
  animType: 1 | 2 | 3,
  isDark: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const targetColor = useMemo(() => parseColor(colorToken, isDark), [colorToken, isDark]);

  // Mapeamos el tamaño aproximado en píxeles a unidades WebGL
  const scale = (sizePx / window.innerWidth) * viewport.width * 2.5;

  // Posición inicial
  const x = baseX === 'right' ? viewport.width * 0.35 : (baseX === 'left' ? -viewport.width * 0.35 : (baseX === 'center' ? 0 : viewport.width * 0.2));
  const y = baseY === 'top' ? viewport.height * 0.35 : (baseY === 'bottom' ? -viewport.height * 0.35 : (baseY === 'center' ? 0 : 0));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    // Animaciones flotantes sutiles
    if (animType === 1) {
      meshRef.current.position.y = y + Math.sin(time * 0.4) * 0.5;
    } else if (animType === 2) {
      meshRef.current.position.x = x + Math.sin(time * 0.3) * 0.5;
    } else {
      meshRef.current.position.x = x + Math.cos(time * 0.25) * 0.4;
      meshRef.current.position.y = y + Math.sin(time * 0.25) * 0.4;
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: targetColor },
    opacity: { value: 0.4 } // Opacidad base sutil
  }), [targetColor]);

  return (
    <mesh ref={meshRef} position={[x, y, 0]} scale={[scale, scale, 1]}>
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
