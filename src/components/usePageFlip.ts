import { useMemo, useRef, useState } from "react";
import { MathUtils, Vector2 } from "three";
import { useSpring } from "@react-spring/three";
import type { SpringValue } from "@react-spring/three";

type Options = {
  pageCount: number;
};

export type PageState = {
  index: number;
  rotationX: number;
  flip: number;
};

export type PageFlipApi = {
  activeIndex: number;
  activeMonth: number;
  visiblePages: { index: number; isTop: boolean; isUnder: boolean }[];
  rot: SpringValue<number>;
  onPagePointerDown: (e: any, index: number) => void;
  onPagePointerMove: (e: any) => void;
  onPagePointerUp: () => void;
  isDragging: boolean;
  dragStrength: number;
};

export function usePageFlip({ pageCount }: Options): PageFlipApi {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStrengthRef = useRef(0);
  const drag = useRef({ start: new Vector2(), index: 0, direction: 1 });

  // Single-page spring: we animate the top page rotation
  const [{ rot }, api] = useSpring(() => ({
    rot: 0,
    config: { tension: 260, friction: 30, mass: 1.0 }
  }));

  const visiblePages = useMemo(() => {
    const under = (activeIndex + 1) % pageCount;
    const prev = (activeIndex - 1 + pageCount) % pageCount;
    // Render 3 pages for realism: prev stack, top, under
    return [
      { index: prev, isTop: false, isUnder: false },
      { index: under, isTop: false, isUnder: true },
      { index: activeIndex, isTop: true, isUnder: false }
    ];
  }, [activeIndex, pageCount]);

  const onPagePointerDown = (e: any, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    dragStrengthRef.current = 0;
    drag.current.index = index;
    drag.current.start.set(e.clientX, e.clientY);

    // Determine direction from which corner is grabbed (left vs right)
    const nx = e.uv?.x ?? 0.5;
    drag.current.direction = nx < 0.5 ? 1 : -1;
    api.start({ rot: 0, immediate: true });
  };

  const onPagePointerMove = (e: any) => {
    if (!isDragging) return;
    const cur = new Vector2(e.clientX, e.clientY);
    const dy = drag.current.start.y - cur.y;

    // Flip around ring axis (top edge): dy controls rotation
    const t = MathUtils.clamp(dy / 260, -1, 1);
    const rotX = MathUtils.clamp(t * Math.PI, -Math.PI, Math.PI);
    dragStrengthRef.current = Math.min(1, Math.abs(t));
    api.start({ rot: rotX, immediate: true });
  };

  const onPagePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const r = rot.get();
    const t = r / Math.PI;

    const commit = Math.abs(t) > 0.35;
    if (commit) {
      const dir = t > 0 ? 1 : -1;
      api.start({
        rot: dir * Math.PI,
        immediate: false,
        onRest: () => {
          setActiveIndex((i) => (i + dir + pageCount) % pageCount);
          api.start({ rot: 0, immediate: true });
          dragStrengthRef.current = 0;
        }
      });
    } else {
      api.start({ rot: 0, immediate: false });
      dragStrengthRef.current = 0;
    }
  };

  return {
    activeIndex,
    activeMonth: activeIndex + 1,
    visiblePages,
    rot,
    onPagePointerDown,
    onPagePointerMove,
    onPagePointerUp,
    isDragging,
    dragStrength: dragStrengthRef.current
  };
}

