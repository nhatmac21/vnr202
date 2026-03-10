import React, { useMemo, useState } from "react";
import { LunarDate } from "vietnamese-lunar-calendar";
import { MONTH_THEMES, HOLIDAYS_2026 } from "../data/calendarData.js";

const WEEK_DAYS = ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"];

function getDaysInMonth(year, month) {
  const first = new Date(year, month - 1, 1);
  const days = [];
  const firstDay = (first.getDay() + 6) % 7; // đổi: T2=0 ... CN=6

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  const lastDate = new Date(year, month, 0).getDate();

  for (let d = 1; d <= lastDate; d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const baseHoliday = HOLIDAYS_2026.find((h) => h.date === iso);

    // Dùng thư viện vietnamese-lunar-calendar để tính âm lịch & ngày lễ VN
    const lunarObj = new LunarDate(year, month, d);
    const lunarLabel = `Âm lịch: ${String(lunarObj.date).padStart(2, "0")}/${String(
      lunarObj.month
    ).padStart(2, "0")}${lunarObj.isLeap ? " (nhuận)" : ""}`;

    // holiday trong thư viện là ngày lễ chính thức của Việt Nam (kể cả Tết âm)
    const holidayName = lunarObj.holiday || (baseHoliday ? baseHoliday.name : null);

    days.push({
      d,
      iso,
      lunarLabel,
      lunarDay: lunarObj.date,
      lunarMonth: lunarObj.month,
      lunarYear: lunarObj.year,
      isLeap: lunarObj.isLeap,
      holidayName
    });
  }

  return days;
}

function MonthCard({ year, theme, isActive }) {
  const days = useMemo(() => getDaysInMonth(year, theme.month), [year, theme.month]);

  return (
    <div className={`month-card-wrapper ${isActive ? "active" : ""}`}>
      <div className="month-card-inner">
        <div className="month-card-face month-card-front">
          {/* Phần hình ảnh minh họa */}
          <div className="month-image">
            <img
              className="month-image-img"
              src={theme.image}
              alt={theme.topic}
              loading="eager"
              draggable={false}
            />
            <div className="month-overlay">
              <h2>{theme.title}</h2>
              <p>{theme.meaning}</p>
            </div>
          </div>

          {/* Thanh tiêu đề tháng và chủ đề */}
          <div className="month-meta">
            <span className="month-label">Tháng {theme.month}</span>
            <span className="month-topic">{theme.topic}</span>
          </div>

          {/* Khung lịch ngày ngay bên dưới, cùng một mặt với hình ảnh */}
          <div className="month-back-header">
            <h3>Lịch {year} - Tháng {theme.month}</h3>
            <p>{theme.meaning}</p>
          </div>
          <div className="month-calendar-grid">
            <div className="weekdays-row">
              {WEEK_DAYS.map((w) => (
                <div key={w} className="weekday-cell">
                  {w}
                </div>
              ))}
            </div>
            <div className="days-grid">
              {days.map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="day-cell empty" />;
                }

                return (
                  <div
                    key={day.iso}
                    className={`day-cell ${day.holidayName ? "holiday" : ""}`}
                    title={`${day.iso}\n${day.lunarLabel}${
                      day.holidayName ? `\n${day.holidayName}` : ""
                    }`}
                  >
                    <span className="day-number">{day.d}</span>
                    <span className="day-lunar">
                      {String(day.lunarDay).padStart(2, "0")}/
                      {String(day.lunarMonth).padStart(2, "0")}
                      {day.isLeap ? "N" : ""}
                    </span>
                    {day.holidayName && (
                      <span className="day-holiday-dot" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="month-back-footer">
            <p>
              Âm lịch và các ngày lễ chi tiết có thể được mở rộng thêm theo nhu cầu
              (dùng file dữ liệu riêng).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calendar3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [turning, setTurning] = useState(null); // "next" | "prev" | null

  const activeTheme = MONTH_THEMES[activeIndex];
  const nextTheme = MONTH_THEMES[(activeIndex + 1) % MONTH_THEMES.length];
  const prevTheme =
    MONTH_THEMES[(activeIndex - 1 + MONTH_THEMES.length) % MONTH_THEMES.length];
  const underTheme =
    turning === "prev" ? prevTheme : turning === "next" ? nextTheme : activeTheme;

  const handlePrev = () => {
    if (turning) return;
    setTurning("prev");
    window.setTimeout(() => {
      setActiveIndex((i) => (i - 1 + MONTH_THEMES.length) % MONTH_THEMES.length);
      setTurning(null);
    }, 650);
  };

  const handleNext = () => {
    if (turning) return;
    setTurning("next");
    window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % MONTH_THEMES.length);
      setTurning(null);
    }, 650);
  };

  return (
    <section className="calendar-3d-section">
      <div className="calendar-controls">
        <button onClick={handlePrev}>◀ Tháng trước</button>
        <div className="calendar-info">
          <span className="year-label">Năm 2026</span>
          <span className="month-info">
            Đang xem: Tháng {activeTheme.month}
          </span>
        </div>
        <button onClick={handleNext}>Tháng sau ▶</button>
      </div>

      <div className="calendar-book-viewport" aria-label="Bộ lịch lật dạng lò xo">
        <div className="calendar-spiral" aria-hidden="true">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="spiral-ring" />
          ))}
        </div>

        <div className={`page-stage ${turning ? "is-turning" : ""}`}>
          {/* Trang đích (để lộ phía dưới khi lật) */}
          <div className="page under">
            <MonthCard
              year={2026}
              theme={underTheme}
              isActive={true}
            />
          </div>

          {/* Trang hiện tại (thực hiện animation lật) */}
          <div className={`page top ${turning ? `turn-${turning}` : ""}`}>
            <MonthCard
              year={2026}
              theme={activeTheme}
              isActive={true}
            />
          </div>
        </div>
      </div>

      <p className="calendar-hint">
        Bấm các nút Tháng trước / Tháng sau để lật trang lịch lên theo từng tháng.
      </p>
    </section>
  );
}

export default Calendar3D;

