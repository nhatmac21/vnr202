import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type Props = {
  width?: number;
  hinge?: [number, number, number];
  ringCount?: number;
};

export default function BindingRings({
  width = 1.6,
  hinge = [0, 0.61, 0.06],
  ringCount = 7,
}: Props) {
  const ringX = useMemo(() => {
    return Array.from({ length: ringCount }).map((_, i) => {
      const t = i / Math.max(1, ringCount - 1);
      return THREE.MathUtils.lerp(-width / 2 + 0.16, width / 2 - 0.16, t);
    });
  }, [ringCount, width]);

  return (
    <group position={hinge}>
      <RoundedBox
        args={[width * 0.96, 0.045, 0.07]}
        radius={0.022}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#a1a1aa"
          roughness={0.25}
          metalness={0.85}
        />
      </RoundedBox>

      {ringX.map((x) => (
        <mesh key={x} position={[x, 0.028, 0.02]} castShadow receiveShadow>
          <torusGeometry args={[0.045, 0.01, 12, 24]} />
          <meshStandardMaterial
            color="#d4d4d8"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
