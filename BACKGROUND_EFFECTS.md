# Hiệu Ứng Background - Chủ Đề Kháng Chiến Chống Mỹ (1965-1975)

## Tổng Quan
Dự án lịch 3D đã được nâng cấp với hệ thống background đa tầng, tái hiện không khí chiến tranh Việt Nam giai đoạn 1965-1975.

---

## 🎨 Các Component Hiệu Ứng

### 1. **WarBackground.tsx** - Hiệu ứng chiến tranh
**Chức năng:**
- ✓ Gradient động với màu rừng núi miền Trung (xanh lá, nâu đất, nâu đen)
- ✓ Particles canvas với 3 loại: lá rơi, bụi đất, tia lửa
- ✓ Silhouette núi non chuyển động
- ✓ Tia sáng động (ánh nắng xuyên qua tán rừng)
- ✓ Texture noise (hiệu ứng phim cũ)

**Particles:**
- `leaf` (60%): Lá cây rơi - biểu tượng rừng núi
- `dust` (20%): Bụi đất - không khí chiến trường  
- `spark` (20%): Tia lửa nhỏ - ám chỉ cuộc chiến

**Màu sắc chủ đạo:**
- Emerald-900: Rừng nhiệt đới
- Amber-900: Đất đỏ basalt
- Stone-900: Núi đá vôi

---

### 2. **HistoricalOverlay.tsx** - Lớp phủ lịch sử
**Chức năng:**
- ✓ Pattern tre (bamboo) mờ ám - biểu tượng sức sống Việt Nam
- ✓ 3 ngôi sao trang trí - tinh thần chiến thắng
- ✓ Horizon glow - hoàng hôn chiến tranh
- ✓ Vignette effect - tạo chiều sâu và tập trung
- ✓ Atmospheric fade - mờ dần khí quyển

**Biểu tượng:**
- 🎋 Tre: Sức mạnh và tinh thần bất khuất
- ⭐ Sao: Chiến thắng và vinh quang
- 🌅 Hoàng hôn: Thời gian và ký ức

---

### 3. **AtmosphericEffects.tsx** - Hiệu ứng khí quyển
**Chức năng:**
- ✓ 2 lớp sương mù di chuyển (fog drift) - sương núi Trường Sơn
- ✓ Khói bay lên (smoke rise) - dấu tích chiến trường
- ✓ Depth haze - độ sâu khí quyển
- ✓ Cloud shadow - bóng mây trôi

**Timing:**
- Fog layer 1: 25s cycle
- Fog layer 2: 30s cycle (delay 3s)
- Smoke 1: 20s rise
- Smoke 2: 25s rise (delay 5s)
- Cloud shadow: 40s linear

---

## 🎬 Animations Được Thêm

| Animation | Thời gian | Mô tả |
|-----------|-----------|-------|
| `gradient-shift` | 20s | Chuyển màu nền từ từ |
| `light-ray-1/2` | 8-10s | Tia sáng dao động |
| `noise` | 8s | Texture film cổ |
| `horizon-glow` | 6s | Ánh sáng chân trời |
| `pulse-slow` | 4s | Nhấp nháy sao |
| `fog-drift-1/2` | 25-30s | Sương mù trôi |
| `smoke-rise-1/2` | 20-25s | Khói bay lên |
| `cloud-shadow` | 40s | Bóng mây di chuyển |

---

## 🎯 Màu Sắc Lịch Sử

### Palette chính:
```css
/* Rừng nhiệt đới */
emerald-900, emerald-950

/* Đất đỏ Tây Nguyên */
amber-900, amber-950, orange-600

/* Đá vôi & hang động */
stone-900, stone-950

/* Lửa & ánh nắng */
yellow-500, orange-500, red-600

/* Khói & sương mù */
rgba(139, 92, 46) - nâu khói
rgba(180, 160, 120) - sương vàng
```

---

## 🔧 Cấu Trúc Layer

```
z-index hierarchy:
├─ -z-10: WarBackground (nền chính)
├─ -z-8:  AtmosphericEffects (sương khói)
├─ -z-5:  HistoricalOverlay (lớp phủ)
└─ z-10:  Content (calendar + UI)
```

---

## 📱 Tối Ưu Performance

**Particles:** 80 particles (cân bằng giữa hiệu ứng và hiệu năng)
**Canvas:** Tự động resize, cleanup khi unmount
**Animations:** CSS-based, GPU-accelerated
**Blur:** backdrop-blur-xl chỉ dùng ở calendar container

---

## 🎨 Design Philosophy

**Tôn trọng lịch sử:**
- Không dùng hình ảnh bạo lực
- Tập trung vào thiên nhiên & cảnh quan
- Màu sắc tái hiện môi trường thực tế

**Tính nghệ thuật:**
- Abstract & symbolic
- Atmospher > Realism
- Subtle > Overwhelming

**Cảm xúc:**
- Ký ức
- Chiến thắng
- Hòa bình

---

## 💡 Cách Tùy Chỉnh

### Điều chỉnh số lượng particles:
```typescript
// WarBackground.tsx, line 28
const particleCount = 80; // Tăng/giảm theo nhu cầu
```

### Đổi màu gradient:
```tsx
// WarBackground.tsx, line 117
from-emerald-900 via-amber-900 to-stone-900
```

### Tốc độ hoạt ảnh:
```css
/* styles.css hoặc tailwind.config.js */
animation-duration: 20s; /* Chỉnh thời gian */
```

---

## 🚀 Kết Quả

✅ Background động với 8+ animations
✅ 80 particles bay linh động
✅ 4 layer hiệu ứng độc lập
✅ Màu sắc lịch sử chính xác
✅ Performance tối ưu
✅ Responsive design
✅ Zero TypeScript errors

---

**Tác giả:** GitHub Copilot  
**Ngày:** March 12, 2026  
**Phiên bản:** 1.0  
**Chủ đề:** Việt Nam trong kháng chiến chống Mỹ (1965-1975)
