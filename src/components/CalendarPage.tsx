import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group } from "three";
import type { PageFlipApi } from "../hooks/usePageFlip";
import type { DragRotateApi } from "../hooks/useDragRotate";
import { MONTH_THEMES } from "../data/calendarData";
import {
  useCalendarTexture,
  hitTestDayCell,
  getLayoutForMonth,
  type DayCellInfo,
} from "../utils/calendarCanvas";

type Props = {
  index: number;
  isTop: boolean;
  isUnder: boolean;
  stackZOffset?: number;
  flip: PageFlipApi;
  orbit: DragRotateApi;
  hingeY?: number;
  hingeZ?: number;
};

const PAPER = { w: 1.8, h: 0.70 };
const FRONT_FACE_ANGLE = Math.atan(0.17 / 0.60);

export default function CalendarPage({
  index,
  isTop,
  isUnder,
  stackZOffset = 0,
  flip,
  orbit,
  hingeY = 0.61,
  hingeZ = 0.06,
}: Props) {
  const theme = MONTH_THEMES[index];
  const group = useRef<Group>(null);
  const layout = getLayoutForMonth(theme.month);
  const [tooltip, setTooltip] = useState<DayCellInfo | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>();

  const frontGeom = useMemo(
    () => new THREE.PlaneGeometry(PAPER.w, PAPER.h, 1, 1),
    []
  );
  const backGeom = useMemo(
    () => new THREE.PlaneGeometry(PAPER.w, PAPER.h, 1, 1),
    []
  );

  const frontMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.82,
        metalness: 0,
        side: THREE.FrontSide,
      }),
    []
  );

  const backMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5f5f4",
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    []
  );

  const calTex = useCalendarTexture(theme, 2026, layout);

  useEffect(() => {
    frontMat.map = calTex;
    frontMat.needsUpdate = true;
  }, [calTex, frontMat]);

  const isTopPage = index === flip.activeIndex;
  const pageThickness = 0.005;
  const zPos = hingeZ + stackZOffset;
  const yPos = hingeY + (isTop ? 0.003 : 0) + index * 0.0005;
  const pageOrder = isTop ? 3 : isUnder ? 2 : 1;

  const flipCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      flipCleanupRef.current?.();
    };
  }, []);

  const onDown = useCallback(
    (e: any) => {
      e.stopPropagation();

      if (e.uv) {
        const hit = hitTestDayCell(e.uv.x, e.uv.y, theme.month, 2026, layout);
        if (hit && hit.holiday) {
          setTooltip(hit);
          clearTimeout(tooltipTimer.current);
          tooltipTimer.current = setTimeout(() => setTooltip(null), 4000);
          return;
        }
      }

      setTooltip(null);
      orbit.setEnabled(false);
      flip.onPagePointerDown(e, index);

      const onDocMove = (ev: PointerEvent) => {
        flip.onPagePointerMove(ev);
      };

      const onDocUp = () => {
        flip.onPagePointerUp();
        orbit.setEnabled(true);
        document.removeEventListener("pointermove", onDocMove);
        document.removeEventListener("pointerup", onDocUp);
        flipCleanupRef.current = null;
      };

      document.addEventListener("pointermove", onDocMove);
      document.addEventListener("pointerup", onDocUp);
      flipCleanupRef.current = () => {
        document.removeEventListener("pointermove", onDocMove);
        document.removeEventListener("pointerup", onDocUp);
      };
    },
    [flip, orbit, index, theme.month, layout]
  );

  useFrame(() => {
    if (!group.current) return;
    const flipRot = isTopPage ? flip.rot.get() : 0;
    group.current.rotation.x = -FRONT_FACE_ANGLE + flipRot;
  });

  const ringSpacing = PAPER.w * 0.8;
  const ringPositions = useMemo(() => {
    const count = 7;
    const half = ringSpacing / 2;
    return Array.from({ length: count }, (_, i) =>
      -half + (ringSpacing / (count - 1)) * i
    );
  }, [ringSpacing]);

  return (
    <group ref={group} position={[0, yPos, zPos]}>
      <mesh
        geometry={frontGeom}
        material={frontMat}
        castShadow
        receiveShadow
        renderOrder={pageOrder * 10}
        position={[0, -PAPER.h / 2, 0]}
        onPointerDown={isTop ? onDown : undefined}
      />

      <mesh
        geometry={backGeom}
        material={backMat}
        rotation={[0, Math.PI, 0]}
        position={[0, -PAPER.h / 2, -pageThickness]}
        castShadow
        receiveShadow
        renderOrder={pageOrder * 10}
      />

      {ringPositions.map((x) => (
        <mesh
          key={x}
          position={[x, 0.01, 0.001]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.018, 0.032, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {tooltip && isTop && (
        <Html
          position={[0, -PAPER.h / 2, 0.01]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "#1f2937",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              maxWidth: 260,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            <strong style={{ color: "#fbbf24" }}>
              Ngày {tooltip.day}/{theme.month}
            </strong>
            <br />
            {tooltip.holiday}
            <br />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              Âm lịch: {tooltip.lunarDay}/{tooltip.lunarMonth}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
