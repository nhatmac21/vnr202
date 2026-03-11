import { useCallback, useEffect, useRef } from "react";
import { MathUtils } from "three";
import { useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";

const DEFAULT_ROTATION: [number, number, number] = [0.08, -0.15, 0];

export type DragRotateApi = {
  rotation: ReturnType<typeof useSpring>[0]["rotation"];
  setEnabled: (v: boolean) => void;
  resetView: () => void;
};

/**
 * Orbit rotation using native DOM events on the canvas element.
 * pointerdown on canvas, pointermove/up on document for reliable tracking.
 * R3F mesh events (page flip) fire first on the same canvas element;
 * the page handler calls setEnabled(false) via ref before our listener runs.
 */
export function useDragRotate(): DragRotateApi {
  const { gl } = useThree();
  const enabledRef = useRef(true);
  const downRef = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const currentRot = useRef<[number, number, number]>([...DEFAULT_ROTATION]);

  const [{ rotation }, api] = useSpring(() => ({
    rotation: DEFAULT_ROTATION as [number, number, number],
    config: { tension: 180, friction: 24, mass: 1.0 },
    onChange: ({ value }: any) => {
      if (value.rotation) {
        currentRot.current = value.rotation as [number, number, number];
      }
    },
  }));

  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: PointerEvent) => {
      if (!downRef.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velX.current = velX.current * 0.65 + dx * 0.35;
      velY.current = velY.current * 0.65 + dy * 0.35;

      const [rx, ry] = currentRot.current;
      apiRef.current.start({
        rotation: [
          MathUtils.clamp(rx + dy * 0.004, -Math.PI * 0.98, Math.PI * 0.98),
          ry + dx * 0.004,
          0,
        ] as [number, number, number],
        immediate: true,
      });
    };

    const onUp = () => {
      if (!downRef.current) return;
      downRef.current = false;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      canvas.style.cursor = "grab";
      document.body.style.userSelect = "";

      if (!enabledRef.current) return;
      const [rx, ry] = currentRot.current;
      const vx = velY.current * 0.003;
      const vy = velX.current * 0.003;
      apiRef.current.start({
        rotation: [
          MathUtils.clamp(rx + vx, -Math.PI * 0.98, Math.PI * 0.98),
          ry + vy,
          0,
        ] as [number, number, number],
      });
    };

    const onDown = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      downRef.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velX.current = 0;
      velY.current = 0;
      canvas.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      canvas.style.cursor = "";
      canvas.style.touchAction = "";
      document.body.style.userSelect = "";
    };
  }, [gl]);

  const setEnabled = useCallback((v: boolean) => {
    enabledRef.current = v;
    if (!v) downRef.current = false;
  }, []);

  const resetView = useCallback(() => {
    apiRef.current.start({
      rotation: [...DEFAULT_ROTATION] as [number, number, number],
    });
  }, []);

  return { rotation, setEnabled, resetView };
}
