
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function BugattiModel() {
  const { scene } = useGLTF('/bugatti/scene.gltf');
  return <primitive object={scene} scale={0.015} />;
}

export default function Carviwe360() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [2, 1, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <BugattiModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
