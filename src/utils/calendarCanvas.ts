import * as THREE from "three";
import { useEffect, useState } from "react";
import type { MonthTheme } from "../data/calendarData";
import { HOLIDAYS_2026 } from "../data/calendarData";
import { getLunarDay } from "./lunarCalendar";

export const CW = 2048;
export const CH = Math.round(CW * 0.70 / 1.8);
export const PADDING_TOP = Math.round(CH * 0.08);

const FONT = "'Segoe UI', system-ui, Arial, sans-serif";
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export type CalendarLayout = "A" | "B" | "C" | "D";

export function getLayoutForMonth(month: number): CalendarLayout {
  // Keep a consistent design like month 1: large image on the left + calendar grid on the right.
  // This also ensures the requested monthly photos are clearly visible.
  void month;
  return "A";
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  maxLines = 3
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  let lines = 0;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxW && line) {
      lines++;
      if (lines >= maxLines) {
        ctx.fillText(line + "…", x, cy);
        return;
      }
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface GridArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

function getMonthData(month: number, year: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const holidays = HOLIDAYS_2026.filter(
    (h) => parseInt(h.date.split("-")[1], 10) === month
  );
  const holidayDaySet = new Set(
    holidays.map((h) => parseInt(h.date.split("-")[2], 10))
  );
  const holidayMap = new Map(
    holidays.map((h) => [parseInt(h.date.split("-")[2], 10), h.name])
  );
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const currentDay = isCurrentMonth ? today.getDate() : -1;
  return { cells, holidays, holidayDaySet, holidayMap, currentDay, daysInMonth };
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  area: GridArea,
  month: number,
  year: number,
  fontSize: number
) {
  const { cells, holidayDaySet, currentDay } = getMonthData(month, year);
  const numRows = cells.length / 7;
  const cellW = area.width / 7;
  const weekdayH = Math.min(50, area.height * 0.11);
  const dayAreaTop = area.top + weekdayH + 4;
  const dayAreaH = area.height - weekdayH - 4;
  const cellH = dayAreaH / numRows;
  const lunarFontSize = Math.max(14, fontSize * 0.44);

  ctx.font = `bold ${Math.max(20, fontSize * 0.72)}px ${FONT}`;
  ctx.textBaseline = "middle";
  WEEKDAYS.forEach((d, i) => {
    const cx = area.left + i * cellW + cellW / 2;
    ctx.fillStyle = i === 6 ? "#dc2626" : i === 5 ? "#2563eb" : "#1f2937";
    ctx.textAlign = "center";
    ctx.fillText(d, cx, area.top + weekdayH / 2);
  });

  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(area.left, area.top + weekdayH);
  ctx.lineTo(area.left + area.width, area.top + weekdayH);
  ctx.stroke();

  for (let r = 0; r < numRows; r++) {
    if (r % 2 === 1) {
      ctx.fillStyle = "rgba(0,0,0,0.025)";
      ctx.fillRect(area.left, dayAreaTop + r * cellH, area.width, cellH);
    }
  }

  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  for (let r = 1; r < numRows; r++) {
    const y = dayAreaTop + r * cellH;
    ctx.beginPath();
    ctx.moveTo(area.left, y);
    ctx.lineTo(area.left + area.width, y);
    ctx.stroke();
  }
  for (let c = 1; c < 7; c++) {
    const x = area.left + c * cellW;
    ctx.beginPath();
    ctx.moveTo(x, dayAreaTop);
    ctx.lineTo(x, dayAreaTop + numRows * cellH);
    ctx.stroke();
  }

  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(area.left, dayAreaTop, area.width, numRows * cellH);

  cells.forEach((day, i) => {
    if (day === null) return;
    const col = i % 7;
    const row = Math.floor(i / 7);
    const cx = area.left + col * cellW + cellW / 2;
    const cy = dayAreaTop + row * cellH + cellH * 0.35;
    const x0 = area.left + col * cellW + 3;
    const y0 = dayAreaTop + row * cellH + 3;
    const w0 = cellW - 6;
    const h0 = cellH - 6;

    const isHoliday = holidayDaySet.has(day);
    const isToday = day === currentDay;
    const isSun = col === 6;
    const isSat = col === 5;

    if (isToday) {
      roundRect(ctx, x0, y0, w0, h0, 6);
      ctx.fillStyle = "#dbeafe";
      ctx.fill();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      roundRect(ctx, x0, y0, w0, h0, 6);
      ctx.stroke();
    } else if (isHoliday) {
      roundRect(ctx, x0, y0, w0, h0, 6);
      ctx.fillStyle = "#fef2f2";
      ctx.fill();
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2.5;
      roundRect(ctx, x0, y0, w0, h0, 6);
      ctx.stroke();
    }

    ctx.fillStyle = isToday
      ? "#1d4ed8"
      : isHoliday || isSun
        ? "#dc2626"
        : isSat
          ? "#2563eb"
          : "#111827";
    ctx.font = `bold ${fontSize}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(day), cx, cy);

    const lunar = getLunarDay(day, month, year);
    ctx.save();
    ctx.font = `bold ${lunarFontSize}px ${FONT}`;
    ctx.fillStyle = isHoliday || isSun ? "#ef4444" : isSat ? "#2563eb" : "#4b5563";
    ctx.shadowColor = "rgba(0,0,0,0.20)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillText(`${lunar.day}/${lunar.month}`, cx, cy + fontSize * 0.72);
    ctx.restore();
  });
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  month: number,
  year: number,
  x: number,
  y: number,
  w: number,
  h: number,
  style: "dark" | "light" = "dark"
) {
  if (style === "dark") {
    roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = "#7f1d1d";
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.font = `bold ${Math.round(h * 0.50)}px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(`THÁNG ${String(month).padStart(2, "0")}`, x + 24, y + h / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(h * 0.38)}px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(`NĂM ${year}`, x + w - 24, y + h / 2);
  } else {
    ctx.fillStyle = "#111827";
    ctx.font = `bold ${Math.round(h * 0.52)}px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(`THÁNG ${String(month).padStart(2, "0")}`, x + 16, y + h / 2);
    ctx.fillStyle = "#4b5563";
    ctx.font = `bold ${Math.round(h * 0.38)}px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(`NĂM ${year}`, x + w - 16, y + h / 2);
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
  }
  ctx.textAlign = "left";
}

function drawImageArea(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (img) {
    ctx.save();
    roundRect(ctx, x, y, w, h, 8);
    ctx.clip();
    const scale = Math.max(w / img.width, h / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
    ctx.restore();
  } else {
    roundRect(ctx, x, y, w, h, 8);
    ctx.fillStyle = "#f3f4f6";
    ctx.fill();
    ctx.fillStyle = "#9ca3af";
    ctx.font = `bold 22px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Đang tải…", x + w / 2, y + h / 2);
    ctx.textAlign = "left";
  }
}

function drawEventCaption(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  holidays: typeof HOLIDAYS_2026,
  x: number,
  y: number,
  w: number,
  maxH: number
) {
  ctx.textBaseline = "top";
  ctx.fillStyle = "#111827";
  ctx.font = `bold 24px ${FONT}`;
  wrapText(ctx, theme.topic, x, y, w, 30, 2);
  ctx.fillStyle = "#4b5563";
  ctx.font = `bold 18px ${FONT}`;
  wrapText(ctx, theme.meaning, x, y + 56, w, 24, 2);
  const monthHolidays = holidays.filter(
    (h) => parseInt(h.date.split("-")[1], 10) === theme.month
  );
  if (monthHolidays.length > 0) {
    let iy = y + 108;
    ctx.font = `bold 17px ${FONT}`;
    monthHolidays.slice(0, 2).forEach((h) => {
      if (iy > y + maxH - 20) return;
      const d = h.date.split("-")[2];
      ctx.fillStyle = "#dc2626";
      ctx.fillText(`★ ${d}/${theme.month}: ${h.name}`, x, iy);
      iy += 24;
    });
  }
}

/* ─── Layout A: Left image + Right grid ─── */
function drawLayoutA(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  year: number,
  img: HTMLImageElement | null
) {
  ctx.fillStyle = "#fefce8";
  ctx.fillRect(0, 0, CW, CH);
  const headerH = 86;
  drawHeader(ctx, theme.month, year, 0, PADDING_TOP, CW, headerH);
  const bodyTop = PADDING_TOP + headerH + 6;
  const bodyH = CH - bodyTop;
  const imgColW = Math.round(CW * 0.38);
  drawImageArea(ctx, img, 8, bodyTop + 6, imgColW - 16, bodyH * 0.54);
  drawEventCaption(
    ctx, theme, HOLIDAYS_2026,
    16, bodyTop + bodyH * 0.54 + 18, imgColW - 32, bodyH * 0.44
  );
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(imgColW, bodyTop);
  ctx.lineTo(imgColW, CH);
  ctx.stroke();
  drawGrid(
    ctx,
    { left: imgColW + 10, top: bodyTop + 8, width: CW - imgColW - 20, height: bodyH - 16 },
    theme.month, year, 38
  );
}

/* ─── Layout B: Top image + Bottom grid ─── */
function drawLayoutB(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  year: number,
  img: HTMLImageElement | null
) {
  ctx.fillStyle = "#fefce8";
  ctx.fillRect(0, 0, CW, CH);
  const headerH = 82;
  drawHeader(ctx, theme.month, year, 0, PADDING_TOP, CW, headerH);
  const imgH = Math.round((CH - PADDING_TOP - headerH) * 0.34);
  drawImageArea(ctx, img, 8, PADDING_TOP + headerH + 6, CW - 16, imgH - 10);
  const captionH = 64;
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(8, PADDING_TOP + headerH + 6 + imgH - captionH - 10, CW - 16, captionH);
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 22px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(theme.topic, 22, PADDING_TOP + headerH + imgH - captionH / 2 - 6);
  ctx.textAlign = "left";
  const gridTop = PADDING_TOP + headerH + imgH + 8;
  drawGrid(
    ctx,
    { left: 16, top: gridTop, width: CW - 32, height: CH - gridTop - 8 },
    theme.month, year, 36
  );
}

/* ─── Layout C: Full grid + image watermark ─── */
function drawLayoutC(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  year: number,
  img: HTMLImageElement | null
) {
  ctx.fillStyle = "#fefce8";
  ctx.fillRect(0, 0, CW, CH);
  if (img) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    const scale = Math.max(CW / img.width, CH / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    ctx.drawImage(img, (CW - sw) / 2, (CH - sh) / 2, sw, sh);
    ctx.restore();
  }
  const headerH = 90;
  drawHeader(ctx, theme.month, year, 12, PADDING_TOP + 8, CW - 24, headerH, "light");
  const captionY = PADDING_TOP + headerH + 16;
  ctx.fillStyle = "#374151";
  ctx.font = `bold 20px ${FONT}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(`${theme.topic} — ${theme.meaning}`, 20, captionY);
  const gridTop = captionY + 36;
  drawGrid(
    ctx,
    { left: 20, top: gridTop, width: CW - 40, height: CH - gridTop - 12 },
    theme.month, year, 42
  );
}

/* ─── Layout D: Minimal modern ─── */
function drawLayoutD(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  year: number,
  _img: HTMLImageElement | null
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CW, CH);
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(0, 0, 14, CH);
  const headerH = 100;
  ctx.fillStyle = "#111827";
  ctx.font = `bold 60px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(`THÁNG ${String(theme.month).padStart(2, "0")}`, 40, PADDING_TOP + headerH / 2);
  ctx.fillStyle = "#6b7280";
  ctx.font = `bold 32px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(`${year}`, CW - 32, PADDING_TOP + headerH / 2);
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, PADDING_TOP + headerH);
  ctx.lineTo(CW - 32, PADDING_TOP + headerH);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#374151";
  ctx.font = `bold 18px ${FONT}`;
  ctx.textBaseline = "top";
  ctx.fillText(theme.topic, 40, PADDING_TOP + headerH + 10);
  const gridTop = PADDING_TOP + headerH + 40;
  drawGrid(
    ctx,
    { left: 40, top: gridTop, width: CW - 80, height: CH - gridTop - 16 },
    theme.month, year, 42
  );
}

const layoutDrawers: Record<CalendarLayout, typeof drawLayoutA> = {
  A: drawLayoutA,
  B: drawLayoutB,
  C: drawLayoutC,
  D: drawLayoutD,
};

export function drawCalendarFace(
  ctx: CanvasRenderingContext2D,
  theme: MonthTheme,
  year: number,
  img: HTMLImageElement | null,
  layout: CalendarLayout = "A"
) {
  ctx.clearRect(0, 0, CW, CH);
  layoutDrawers[layout](ctx, theme, year, img);
}

export type DayCellInfo = {
  day: number;
  col: number;
  row: number;
  holiday: string | null;
  lunarDay: number;
  lunarMonth: number;
};

export function hitTestDayCell(
  u: number,
  v: number,
  month: number,
  year: number,
  layout: CalendarLayout
): DayCellInfo | null {
  const px = u * CW;
  const py = (1 - v) * CH;

  let gridArea: GridArea;
  const { cells, holidayMap } = getMonthData(month, year);
  const numRows = cells.length / 7;

  if (layout === "A") {
    const imgColW = Math.round(CW * 0.38);
    const bodyTop = PADDING_TOP + 92;
    gridArea = {
      left: imgColW + 10,
      top: bodyTop + 8,
      width: CW - imgColW - 20,
      height: CH - bodyTop - 16,
    };
  } else if (layout === "B") {
    const headerH = 82;
    const imgH = Math.round((CH - PADDING_TOP - headerH) * 0.34);
    const gridTop = PADDING_TOP + headerH + imgH + 8;
    gridArea = { left: 16, top: gridTop, width: CW - 32, height: CH - gridTop - 8 };
  } else if (layout === "C") {
    const gridTop = PADDING_TOP + 142;
    gridArea = { left: 20, top: gridTop, width: CW - 40, height: CH - gridTop - 12 };
  } else {
    const gridTop = PADDING_TOP + 140;
    gridArea = { left: 40, top: gridTop, width: CW - 80, height: CH - gridTop - 16 };
  }

  const weekdayH = Math.min(50, gridArea.height * 0.11);
  const dayTop = gridArea.top + weekdayH + 4;
  const dayH = gridArea.height - weekdayH - 4;
  const cellW = gridArea.width / 7;
  const cellH = dayH / numRows;

  if (px < gridArea.left || px > gridArea.left + gridArea.width) return null;
  if (py < dayTop || py > dayTop + dayH) return null;

  const col = Math.floor((px - gridArea.left) / cellW);
  const row = Math.floor((py - dayTop) / cellH);
  const idx = row * 7 + col;
  const day = cells[idx];
  if (day == null) return null;

  const lunar = getLunarDay(day, month, year);
  return {
    day,
    col,
    row,
    holiday: holidayMap.get(day) ?? null,
    lunarDay: lunar.day,
    lunarMonth: lunar.month,
  };
}

export function useCalendarTexture(
  theme: MonthTheme,
  year: number = 2026,
  layout?: CalendarLayout
): THREE.CanvasTexture | null {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const effectiveLayout = layout ?? getLayoutForMonth(theme.month);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext("2d")!;

    drawCalendarFace(ctx, theme, year, null, effectiveLayout);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.generateMipmaps = false;
    setTex(texture);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      drawCalendarFace(ctx, theme, year, img, effectiveLayout);
      texture.needsUpdate = true;
    };
    img.src = theme.image;

    return () => {
      texture.dispose();
    };
  }, [theme.month, year, effectiveLayout]);

  return tex;
}
