import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PolyParticles = ({ count = 120, connectionDistance = 2.5 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  
  // Particle Data: Home position, current position, velocity
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        temp.push({
            home: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 5
            ),
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            )
        });
        temp[i].position.copy(temp[i].home);
    }
    return temp;
  }, [count]);

  // Buffer Arrays
  const [positions, linePositions] = useMemo(() => {
    return [
      new Float32Array(count * 3),
      new Float32Array(count * count * 6) // Max potential lines
    ];
  }, [count]);

  const mouseRef = useRef(new THREE.Vector2(0, 0));

  // Global listener because the canvas is at -1 z-index and pointer-events: none
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to -1 to 1 range (R3F style)
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  useFrame((state) => {
    const { clock, viewport } = state;
    const time = clock.getElapsedTime();
    
    // Detect theme and update colors dynamically
    const isDark = document.documentElement.classList.contains('dark');
    const targetColor = isDark ? '#ffffff' : '#0ea5e9';
    const targetOpacity = isDark ? 0.15 : 0.2; // Back to minimalist levels

    // Update Materials
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).color.lerp(new THREE.Color(targetColor), 0.05);
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
          (linesRef.current.material as THREE.LineBasicMaterial).opacity,
          targetOpacity,
          0.05
      );
    }
    
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.PointsMaterial).color.lerp(new THREE.Color(targetColor), 0.05);
    }

    // Improved mouse mapping using viewport and global listener
    const mousePos = new THREE.Vector3(
        (mouseRef.current.x * viewport.width) / 2,
        (mouseRef.current.y * viewport.height) / 2,
        0
    );

    let lineIndex = 0;

    // 1. Update Particle Positions (Physics)
    particles.forEach((p, i) => {
        // Drift
        p.position.x += Math.sin(time * 0.3 + i) * 0.002 + p.velocity.x;
        p.position.y += Math.cos(time * 0.2 + i) * 0.002 + p.velocity.y;

        // Enhanced Mouse Repulsion
        const distToMouse = p.position.distanceTo(mousePos);
        const radius = 5.0; 
        if (distToMouse < radius) {
            const dir = p.position.clone().sub(mousePos).normalize();
            const force = Math.pow(1 - distToMouse / radius, 2) * 0.8;
            p.position.add(dir.multiplyScalar(force));
        }

        // Elastic return to home
        p.position.lerp(p.home, 0.05);

        // Update Buffer
        positions[i * 3] = p.position.x;
        positions[i * 3 + 1] = p.position.y;
        positions[i * 3 + 2] = p.position.z;
    });

    // 2. Update Lines (Connections)
    const distLimit = connectionDistance * 1.1; // Reduced multiplier for minimalist look
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            const dist = particles[i].position.distanceTo(particles[j].position);
            if (dist < distLimit) {
                linePositions[lineIndex++] = particles[i].position.x;
                linePositions[lineIndex++] = particles[i].position.y;
                linePositions[lineIndex++] = particles[i].position.z;
                
                linePositions[lineIndex++] = particles[j].position.x;
                linePositions[lineIndex++] = particles[j].position.y;
                linePositions[lineIndex++] = particles[j].position.z;
            }
        }
    }

    // Update Refs
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    // We need to set the draw range for lines because the number of connections changes
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12} // Slightly larger points
          color="#0ea5e9"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Connections (The "Poly" lines) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </lineSegments>
    </group>
  );
};
