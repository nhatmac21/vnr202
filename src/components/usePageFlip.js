import { useMemo, useRef, useState } from "react";
import { MathUtils, Vector2 } from "three";
import { useSpring } from "@react-spring/three";

/**
 * Page flip controller (two-direction):
 * - Drag UP => forward flip (0 -> -PI) then advance month
 * - Drag DOWN => backward flip (0 -> +PI) then go prev month
 *
 * We keep a small visible stack and reorder after commit.
 */
export function usePageFlip({ pageCount = 12, onForward, onBackward }) {
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0); // -1 forward, +1 backward
  const drag = useRef({ start: new Vector2(), progress: 0, corner: { u: 0.9, v: 0.1 } });

  const [{ rot }, api] = useSpring(() => ({
    rot: 0,
    config: { tension: 280, friction: 34, mass: 1.05 }
  }));

  const onDown = (e) => {
    setIsDragging(true);
    drag.current.start.set(e.clientX, e.clientY);
    drag.current.progress = 0;
    drag.current.corner = {
      u: MathUtils.clamp(e.uv?.x ?? 0.9, 0, 1),
      v: MathUtils.clamp(e.uv?.y ?? 0.1, 0, 1)
    };
    setDirection(0);
    api.start({ rot: 0, immediate: true });
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const cur = new Vector2(e.clientX, e.clientY);
    const dy = drag.current.start.y - cur.y; // up => +
    const tRaw = dy / 220;
    const dir = tRaw >= 0 ? -1 : +1;
    setDirection(dir);

    const t = MathUtils.clamp(Math.abs(tRaw), 0, 1);
    drag.current.progress = t;
    api.start({ rot: dir * t * Math.PI, immediate: true });
  };

  const onUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const t = drag.current.progress;
    const dir = direction || -1;
    const commit = t > 0.33;

    if (!commit) {
      api.start({ rot: 0, immediate: false });
      drag.current.progress = 0;
      setDirection(0);
      return;
    }

    // Land
    api.start({
      rot: dir * Math.PI,
      immediate: false,
      onRest: () => {
        if (dir === -1) onForward?.();
        else onBackward?.();
        api.start({ rot: 0, immediate: true });
        drag.current.progress = 0;
        setDirection(0);
      }
    });
  };

  const apiObj = useMemo(
    () => ({
      rot,
      isDragging,
      direction,
      progress: drag.current.progress,
      corner: drag.current.corner,
      bind: { onDown, onMove, onUp }
    }),
    [rot, isDragging, direction]
  );

  return apiObj;
}

