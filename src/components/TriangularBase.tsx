import { useMemo } from "react";
import * as THREE from "three";

type Props = {
  width?: number;
  depth?: number;
  height?: number;
};

export default function TriangularBase({
  width = 1.6,
  depth = 0.85,
  height = 0.60,
}: Props) {
  const geom = useMemo(() => {
    const frontZ = depth * 0.6;
    const backZ = -depth * 0.75;
    const ridgeZ = depth * 0.05;

    const shape = new THREE.Shape();
    shape.moveTo(frontZ, 0);
    shape.lineTo(backZ, 0);
    shape.lineTo(ridgeZ, height);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: width,
      bevelEnabled: false,
      steps: 1,
    });

    geometry.rotateY(-Math.PI / 2);
    geometry.translate(width / 2, 0, 0);
    geometry.computeVertexNormals();
    return geometry;
  }, [width, depth, height]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={geom} material={mat} castShadow receiveShadow />
    </group>
  );
}
