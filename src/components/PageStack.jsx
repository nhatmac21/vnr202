import React, { useMemo } from "react";
import CalendarPage from "./CalendarPage";

/**
 * Render a realistic stack:
 * - top page (interactive)
 * - a few under pages (static)
 * - a few behind pages (static)
 */
export default function PageStack({
  year,
  monthIndex,
  flip,
  onFlipModeChange
}) {
  // Render limited pages for perf
  const visible = useMemo(() => {
    const prev = (monthIndex - 1 + 12) % 12;
    const next = (monthIndex + 1) % 12;
    const under2 = (monthIndex + 2) % 12;
    const back1 = (monthIndex - 2 + 12) % 12;
    return {
      top: monthIndex,
      under: [next, under2],
      behind: [prev, back1]
    };
  }, [monthIndex]);

  return (
    <group>
      {/* Under stack (front) */}
      {visible.under.map((idx, i) => (
        <CalendarPage
          key={`u-${idx}`}
          year={year}
          monthIndex={idx}
          zOffset={-0.01 - i * 0.006}
          yOffset={0.0 - i * 0.002}
          interactive={false}
          flip={flip}
          onFlipModeChange={onFlipModeChange}
          stackRole="under"
        />
      ))}

      {/* Top page (interactive) */}
      <CalendarPage
        year={year}
        monthIndex={visible.top}
        zOffset={0}
        yOffset={0.004}
        interactive={true}
        flip={flip}
        onFlipModeChange={onFlipModeChange}
        stackRole="top"
      />

      {/* Behind stack */}
      {visible.behind.map((idx, i) => (
        <CalendarPage
          key={`b-${idx}`}
          year={year}
          monthIndex={idx}
          zOffset={0.035 + i * 0.006}
          yOffset={-0.004 - i * 0.002}
          interactive={false}
          flip={flip}
          onFlipModeChange={onFlipModeChange}
          stackRole="behind"
        />
      ))}
    </group>
  );
}

