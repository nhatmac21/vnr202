import { useMemo, useRef, useState, useCallback } from "react";
import { MathUtils, Vector2 } from "three";
import { useSpring } from "@react-spring/three";
import type { SpringValue } from "@react-spring/three";

type Options = {
  pageCount: number;
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
  dragCorner: { u: number; v: number };
  flipForward: () => void;
  flipBackward: () => void;
};

export function usePageFlip({ pageCount }: Options): PageFlipApi {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStrengthRef = useRef(0);
  const cornerRef = useRef({ u: 0.9, v: 0.1 });
  const drag = useRef({ start: new Vector2(), index: 0 });
  const flipDirectionRef = useRef<1 | -1>(1);
  const animatingRef = useRef(false);

  const [{ rot }, api] = useSpring(() => ({
    rot: 0,
    config: { tension: 260, friction: 30, mass: 1.0 },
  }));

  const visiblePages = useMemo(() => {
    const under = (activeIndex + 1) % pageCount;
    const prev = (activeIndex - 1 + pageCount) % pageCount;
    return [
      { index: prev, isTop: false, isUnder: false },
      { index: under, isTop: false, isUnder: true },
      { index: activeIndex, isTop: true, isUnder: false },
    ];
  }, [activeIndex, pageCount]);

  const onPagePointerDown = (e: any, index: number) => {
    if (index !== activeIndex || animatingRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStrengthRef.current = 0;
    drag.current.index = index;
    drag.current.start.set(e.clientX, e.clientY);
    const u = MathUtils.clamp(e.uv?.x ?? 0.9, 0, 1);
    const v = MathUtils.clamp(e.uv?.y ?? 0.1, 0, 1);
    cornerRef.current = { u, v };
    api.start({ rot: rot.get(), immediate: true });
  };

  const onPagePointerMove = (e: any) => {
    if (!isDraggingRef.current) return;
    const cur = new Vector2(e.clientX, e.clientY);
    const dy = drag.current.start.y - cur.y;
    
    // Lưu độ mạnh của cử chỉ kéo, animation chỉ xuất hiện khi thả tay
    if (dy > 0) {
      // Kéo lên - đánh dấu để sang tháng sau
      const t = MathUtils.clamp(dy / 160, 0, 1);
      dragStrengthRef.current = t;
      flipDirectionRef.current = -1;
      // Không animate trong khi kéo
      api.start({ rot: 0, immediate: true });
    } else {
      // Kéo xuống - đánh dấu để về tháng trước
      const t = MathUtils.clamp(Math.abs(dy) / 160, 0, 1);
      dragStrengthRef.current = t;
      flipDirectionRef.current = 1;
      // Không animate trong khi kéo
      api.start({ rot: 0, immediate: true });
    }
  };

  const onPagePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const dir = flipDirectionRef.current;
    const strength = dragStrengthRef.current;

    if (dir === -1 && strength > 0.25) {
      // Kéo lên đủ mạnh - lật sang tháng sau
      animatingRef.current = true;
      api.start({
        rot: -Math.PI,
        config: { tension: 200, friction: 26 },
      });
      setTimeout(() => {
        if (!animatingRef.current) return;
        setActiveIndex((i) => (i + 1) % pageCount);
        api.set({ rot: 0 });
        dragStrengthRef.current = 0;
        animatingRef.current = false;
      }, 600);
    } else if (dir === 1 && strength > 0.25) {
      // Kéo xuống đủ mạnh - quay về tháng trước
      // Chuyển ngay sang tháng trước và animate trang từ phía sau
      const prevIndex = (activeIndex - 1 + pageCount) % pageCount;
      setActiveIndex(prevIndex);
      animatingRef.current = true;
      api.set({ rot: Math.PI });
      api.start({
        rot: 0,
        config: { tension: 200, friction: 26 },
      });
      setTimeout(() => {
        dragStrengthRef.current = 0;
        animatingRef.current = false;
      }, 600);
    } else {
      // Không đủ mạnh - quay về vị trí ban đầu
      api.start({ rot: 0 });
      dragStrengthRef.current = 0;
    }
  };

  const flipForward = useCallback(() => {
    if (animatingRef.current || isDraggingRef.current) return;
    animatingRef.current = true;
    api.start({
      from: { rot: 0 },
      to: { rot: -Math.PI },
      config: { tension: 200, friction: 26 },
    });
    setTimeout(() => {
      if (!animatingRef.current) return;
      setActiveIndex((i) => (i + 1) % pageCount);
      api.set({ rot: 0 });
      animatingRef.current = false;
    }, 700);
  }, [api, pageCount]);

  const flipBackward = useCallback(() => {
    if (animatingRef.current || isDraggingRef.current) return;
    animatingRef.current = true;
    api.start({
      from: { rot: 0 },
      to: { rot: Math.PI },
      config: { tension: 200, friction: 26 },
    });
    setTimeout(() => {
      if (!animatingRef.current) return;
      setActiveIndex((i) => (i - 1 + pageCount) % pageCount);
      api.set({ rot: 0 });
      animatingRef.current = false;
    }, 700);
  }, [api, pageCount]);

  return {
    activeIndex,
    activeMonth: activeIndex,
    visiblePages,
    rot,
    onPagePointerDown,
    onPagePointerMove,
    onPagePointerUp,
    isDragging,
    dragStrength: dragStrengthRef.current,
    dragCorner: cornerRef.current,
    flipForward,
    flipBackward,
  };
}
