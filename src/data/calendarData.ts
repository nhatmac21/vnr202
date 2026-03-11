export type MeaningPlacement = "overlay" | "outside";
export type LayoutVariant =
  | "diagonal-left"
  | "diagonal-right"
  | "split-top"
  | "split-bottom"
  | "full-bleed"
  | "badge-corner"
  | "poster";

export type MonthTheme = {
  month: number; // 1..12
  title: string;
  image: string;
  topic: string;
  meaning: string;
  layout: LayoutVariant;
  meaningPlacement: MeaningPlacement;
};

const AVAILABLE_IMAGES = new Set([1, 2, 3, 4, 5, 10]);
const FALLBACK_CYCLE = [1, 2, 3, 4, 5];
const getImagePath = (month: number) => {
  if (AVAILABLE_IMAGES.has(month)) return `/images/thang${month}.jpg`;
  return `/images/thang${FALLBACK_CYCLE[(month - 1) % FALLBACK_CYCLE.length]}.jpg`;
};

export const MONTH_THEMES: MonthTheme[] = [
  {
    month: 1,
    title: "Tháng 1 - Cánh đồng lúa và súng trường",
    image: getImagePath(1),
    topic: "Cánh đồng lúa và súng trường",
    meaning: 'Tinh thần "Tay cày tay súng" những năm 1965',
    layout: "diagonal-left",
    meaningPlacement: "overlay"
  },
  {
    month: 2,
    title: "Tháng 2 - Đoàn xe vận tải trên đường mòn",
    image: getImagePath(2),
    topic: "Đoàn xe vận tải trên đường mòn",
    meaning: "Đường Trường Sơn - Tuyến đường huyết mạch",
    layout: "split-top",
    meaningPlacement: "outside"
  },
  {
    month: 3,
    title: "Tháng 3 - Hoa xe tăng và niềm vui chiến thắng",
    image: getImagePath(3),
    topic: "Hoa xe tăng và niềm vui chiến thắng",
    meaning: "Gợi nhớ chiến dịch Tây Nguyên (3/1975)",
    layout: "full-bleed",
    meaningPlacement: "overlay"
  },
  {
    month: 4,
    title: "Tháng 4 - Dinh Độc Lập và lá cờ giải phóng",
    image: getImagePath(4),
    topic: "Dinh Độc Lập và lá cờ giải phóng",
    meaning: "Đại thắng mùa Xuân 30/4/1975",
    layout: "badge-corner",
    meaningPlacement: "outside"
  },
  {
    month: 5,
    title: "Tháng 5 - Chân dung Bác Hồ",
    image: getImagePath(5),
    topic: "Chân dung Bác Hồ",
    meaning: "Kỷ niệm ngày sinh của Bác (19/5)",
    layout: "poster",
    meaningPlacement: "overlay"
  },
  {
    month: 6,
    title: "Tháng 6 - Đội nữ du kích miền Nam",
    image: getImagePath(6),
    topic: "Đội nữ du kích miền Nam",
    meaning: 'Hình ảnh "Đội quân tóc dài"',
    layout: "diagonal-right",
    meaningPlacement: "outside"
  },
  {
    month: 7,
    title: "Tháng 7 - Những cánh thư thời chiến",
    image: getImagePath(7),
    topic: "Những cánh thư thời chiến",
    meaning: "Tình cảm hậu phương và tiền tuyến",
    layout: "split-bottom",
    meaningPlacement: "overlay"
  },
  {
    month: 8,
    title: "Tháng 8 - Thanh niên xung phong",
    image: getImagePath(8),
    topic: "Thanh niên xung phong",
    meaning: "Sức trẻ trên những cung đường lửa",
    layout: "full-bleed",
    meaningPlacement: "outside"
  },
  {
    month: 9,
    title: "Tháng 9 - Lớp học dưới hầm tăng xê",
    image: getImagePath(9),
    topic: "Lớp học dưới hầm tăng xê",
    meaning: "Tinh thần hiếu học trong mưa bom",
    layout: "badge-corner",
    meaningPlacement: "overlay"
  },
  {
    month: 10,
    title: "Tháng 10 - Cầu Hiền Lương - Sông Bến Hải",
    image: getImagePath(10),
    topic: "Cầu Hiền Lương - Sông Bến Hải",
    meaning: "Biểu tượng khát vọng thống nhất",
    layout: "diagonal-left",
    meaningPlacement: "outside"
  },
  {
    month: 11,
    title: "Tháng 11 - Nhà máy, xí nghiệp miền Bắc",
    image: getImagePath(11),
    topic: "Nhà máy, xí nghiệp miền Bắc",
    meaning: "Thi đua sản xuất vì miền Nam ruột thịt",
    layout: "poster",
    meaningPlacement: "outside"
  },
  {
    month: 12,
    title: "Tháng 12 - Pháo cao xạ và bầu trời Hà Nội",
    image: getImagePath(12),
    topic: "Pháo cao xạ và bầu trời Hà Nội",
    meaning: 'Chiến thắng "Điện Biên Phủ trên không" (1972)',
    layout: "split-top",
    meaningPlacement: "overlay"
  }
];

export const HOLIDAYS_2026 = [
  { date: "2026-01-01", name: "Tết Dương lịch" },
  { date: "2026-02-03", name: "Ngày thành lập Đảng Cộng sản Việt Nam" },
  { date: "2026-02-16", name: "Tất niên - 30 Tết (29 tháng Chạp)" },
  { date: "2026-02-17", name: "Mùng 1 Tết Nguyên Đán Bính Ngọ 2026" },
  { date: "2026-02-18", name: "Mùng 2 Tết Nguyên Đán" },
  { date: "2026-02-19", name: "Mùng 3 Tết Nguyên Đán" },
  { date: "2026-02-20", name: "Mùng 4 Tết Nguyên Đán" },
  { date: "2026-04-26", name: "Giỗ Tổ Hùng Vương (10/3 âm lịch)" },
  { date: "2026-04-30", name: "Ngày Giải phóng miền Nam, Thống nhất đất nước" },
  { date: "2026-05-01", name: "Ngày Quốc tế Lao động" },
  { date: "2026-05-19", name: "Ngày sinh Chủ tịch Hồ Chí Minh" },
  { date: "2026-08-27", name: "Lễ Vu Lan - Rằm tháng 7 âm lịch" },
  { date: "2026-09-25", name: "Tết Trung Thu - Rằm tháng 8 âm lịch" },
  { date: "2026-09-02", name: "Quốc khánh nước CHXHCN Việt Nam" }
];

