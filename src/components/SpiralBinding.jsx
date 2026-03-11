import React, { useMemo } from "react";
import * as THREE from "three";

export default function SpiralBinding({
  width = 2.35,
  radius = 0.035,
  ringSpacing = 0.12,
  position = [0, 0.28, 0.33]
}) {
  const barGeom = useMemo(() => new THREE.CylinderGeometry(radius, radius, width, 16), [radius, width]);
  const ringGeom = useMemo(() => new THREE.TorusGeometry(radius * 1.8, radius * 0.45, 10, 22), [radius]);

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3b3b3b",
        roughness: 0.35,
        metalness: 0.85
      }),
    []
  );

  const ringCount = Math.floor(width / ringSpacing);
  const ringX = Array.from({ length: ringCount }).map((_, i) => {
    const t = i / Math.max(1, ringCount - 1);
    return THREE.MathUtils.lerp(-width / 2 + 0.08, width / 2 - 0.08, t);
  });

  return (
    <group position={position}>
      {/* Binding bar */}
      <mesh geometry={barGeom} material={metal} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow />

      {/* Spiral rings */}
      {ringX.map((x) => (
        <mesh
          key={x}
          geometry={ringGeom}
          material={metal}
          position={[x, 0.015, 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

