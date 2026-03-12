import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useCallback } from "react";
import CalendarPage from "./CalendarPage";
import TriangularBase from "./TriangularBase";
import BindingRings from "./BindingRings";
import { useDragRotate } from "../hooks/useDragRotate";
import { usePageFlip } from "../hooks/usePageFlip";
import { a } from "@react-spring/three";

const CAL = {
  baseWidth: 1.25,
  baseDepth: 1.1,
  baseHeight: 1.15,
  hingeY: 1.15,
  hingeZ: 0.06,
  liftY: 1.55,
};

type NavApi = {
  flipForward: () => void;
  flipBackward: () => void;
  resetView: () => void;
  activeMonth: number;
};

export default function DeskCalendar() {
  const navRef = useRef<NavApi | null>(null);
  const [activeMonth, setActiveMonth] = useState(1);

  const handlePrev = useCallback(() => navRef.current?.flipBackward(), []);
  const handleNext = useCallback(() => navRef.current?.flipForward(), []);
  const handleReset = useCallback(() => navRef.current?.resetView(), []);

  return (
    <div className="relative h-screen min-h-[800px] w-full overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{
          position: [0, 1.95, 2.6],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 1.85, 0);
        }}
        style={{ touchAction: "none" }}
      >
        <color attach="background" args={["#fff7ed"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[3, 6, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-2, 3, -1]} intensity={0.25} />
        <pointLight position={[0, 2, 3]} intensity={0.15} decay={2} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <SceneCalendar navRef={navRef} onMonthChange={setActiveMonth} />
          <ContactShadows
            position={[0, -0.18, 0]}
            opacity={0.5}
            scale={25}
            blur={2.5}
            far={4}
          />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.18, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
              color="#fff7ed"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        </Suspense>
      </Canvas>

      {/* Navigation buttons — DOM overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center px-4">
        <div className="flex select-none items-center gap-2">
          <button
            className="pointer-events-auto rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-stone-600 shadow-md backdrop-blur transition hover:bg-white hover:text-stone-900"
            onClick={handlePrev}
          >
            ← Tháng trước
          </button>
          <span className="rounded-full bg-red-800/90 px-3 py-1.5 text-xs font-bold text-amber-300 shadow-md">
            {activeMonth === 0 ? "Năm 2026" : `Tháng ${String(activeMonth).padStart(2, "0")} / 2026`}
          </span>
          <button
            className="pointer-events-auto rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-stone-600 shadow-md backdrop-blur transition hover:bg-white hover:text-stone-900"
            onClick={handleNext}
          >
            Tháng sau →
          </button>
          <button
            className="pointer-events-auto rounded-full bg-white/85 px-2.5 py-1.5 text-xs text-stone-500 shadow-md backdrop-blur transition hover:bg-white hover:text-stone-900"
            onClick={handleReset}
          >
            ↺
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-4">
        <div className="rounded-full bg-white/70 px-4 py-2 text-xs text-stone-700 shadow-sm backdrop-blur">
          Kéo nền để xoay 360° • Kéo trang lên = tháng sau, xuống = tháng trước • Nhấn ô ngày lễ để xem chi tiết
        </div>
      </div>
    </div>
  );
}

function SceneCalendar({
  navRef,
  onMonthChange,
}: {
  navRef: React.MutableRefObject<NavApi | null>;
  onMonthChange: (m: number) => void;
}) {
  const orbit = useDragRotate();
  const flip = usePageFlip({ pageCount: 13 });

  useEffect(() => {
    navRef.current = {
      flipForward: flip.flipForward,
      flipBackward: flip.flipBackward,
      resetView: orbit.resetView,
      activeMonth: flip.activeMonth,
    };
  }, [flip.flipForward, flip.flipBackward, orbit.resetView, flip.activeMonth, navRef]);

  useEffect(() => {
    // Month 0 is cover, actual months start from index 1
    const displayMonth = flip.activeMonth === 0 ? 0 : flip.activeMonth;
    onMonthChange(displayMonth);
  }, [flip.activeMonth, onMonthChange]);

  return (
    <group position={[0, CAL.liftY, 0]}>
      <a.group rotation={orbit.rotation as any}>
        <TriangularBase
          width={CAL.baseWidth}
          depth={CAL.baseDepth}
          height={CAL.baseHeight}
        />
        <BindingRings
          width={CAL.baseWidth}
          hinge={[0, CAL.hingeY, CAL.hingeZ]}
        />
        <group>
          {flip.visiblePages.map((p, stackIndex) => (
            <CalendarPage
              key={p.index}
              index={p.index}
              isTop={p.isTop}
              isUnder={p.isUnder}
              stackZOffset={stackIndex * 0.002}
              flip={flip}
              orbit={orbit}
              hingeY={CAL.hingeY}
              hingeZ={CAL.hingeZ}
            />
          ))}
        </group>
      </a.group>
    </group>
  );
}
