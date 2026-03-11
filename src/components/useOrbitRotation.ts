import { useMemo, useRef, useState } from "react";
import { Euler, MathUtils, Vector2 } from "three";
import { useSpring } from "@react-spring/three";

export type OrbitApi = {
  rotation: ReturnType<typeof useSpring>["0"]["rotation"];
  bind: {
    onPointerDown: (e: any) => void;
    onPointerMove: (e: any) => void;
    onPointerUp: () => void;
  };
  setMode: (mode: "orbit" | "page") => void;
};

export function useOrbitRotation(): OrbitApi {
  const [mode, setMode] = useState<"orbit" | "page">("orbit");
  const down = useRef(false);
  const last = useRef(new Vector2());
  const vel = useRef(new Vector2());

  const [{ rotation }, api] = useSpring(() => ({
    rotation: [0.15, -0.55, 0] as [number, number, number],
    config: { tension: 220, friction: 26, mass: 1.0 }
  }));

  const bind = useMemo(() => {
    const onPointerDown = (e: any) => {
      if (mode !== "orbit") return;
      down.current = true;
      last.current.set(e.clientX, e.clientY);
      vel.current.set(0, 0);
    };

    const onPointerMove = (e: any) => {
      if (mode !== "orbit") return;
      if (!down.current) return;
      const cur = new Vector2(e.clientX, e.clientY);
      const delta = cur.clone().sub(last.current);
      last.current.copy(cur);

      vel.current.lerp(delta, 0.35);
      api.start((prev) => {
        const rx = MathUtils.clamp(prev.rotation[0] + delta.y * 0.004, -1.2, 1.2);
        const ry = prev.rotation[1] + delta.x * 0.004;
        return { rotation: [rx, ry, 0] };
      });
    };

    const onPointerUp = () => {
      if (mode !== "orbit") return;
      if (!down.current) return;
      down.current = false;

      // Inertia: “throw” a bit using the last velocity
      const throwX = vel.current.y * 0.0025;
      const throwY = vel.current.x * 0.0025;
      api.start((prev) => {
        const rx = MathUtils.clamp(prev.rotation[0] + throwX, -1.2, 1.2);
        const ry = prev.rotation[1] + throwY;
        return { rotation: [rx, ry, 0] };
      });
    };

    return { onPointerDown, onPointerMove, onPointerUp };
  }, [api, mode]);

  return { rotation, bind, setMode };
}

