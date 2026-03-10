import thang1Img from "../images/thang1.jpg";
import thang2Img from "../images/thang2.jpg";
import thang3Img from "../images/thang3.jpg";
import thang4Img from "../images/thang4.jpg";
import thang5Img from "../images/thang5.jpg";

export const MONTH_THEMES = [
  {
    month: 1,
    title: "Tháng 1 - Cánh đồng lúa và súng trường",
    image: thang1Img,
    topic: "Cánh đồng lúa và súng trường",
    meaning: 'Tinh thần "Tay cày tay súng" những năm 1965'
  },
  {
    month: 2,
    title: "Tháng 2 - Đoàn xe vận tải trên đường mòn",
    image: thang2Img,
    topic: "Đoàn xe vận tải trên đường mòn",
    meaning: "Đường Trường Sơn - Tuyến đường huyết mạch"
  },
  {
    month: 3,
    title: "Tháng 3 - Hoa xe tăng và niềm vui chiến thắng",
    image: thang3Img,
    topic: "Hoa xe tăng và niềm vui chiến thắng",
    meaning: "Gợi nhớ chiến dịch Tây Nguyên (3/1975)"
  },
  {
    month: 4,
    title: "Tháng 4 - Dinh Độc Lập và lá cờ giải phóng",
    image: thang4Img,
    topic: "Dinh Độc Lập và lá cờ giải phóng",
    meaning: "Đại thắng mùa Xuân 30/4/1975"
  },
  {
    month: 5,
    title: "Tháng 5 - Chân dung Bác Hồ",
    image: thang5Img,
    topic: "Chân dung Bác Hồ",
    meaning: "Kỷ niệm ngày sinh của Bác (19/5)"
  },
  {
    month: 6,
    title: "Tháng 6 - Đội nữ du kích miền Nam",
    image: "/images/1965-1975/thang6.jpg",
    topic: "Đội nữ du kích miền Nam",
    meaning: 'Hình ảnh "Đội quân tóc dài"'
  },
  {
    month: 7,
    title: "Tháng 7 - Những cánh thư thời chiến",
    image: "/images/1965-1975/thang7.jpg",
    topic: "Những cánh thư thời chiến",
    meaning: "Tình cảm hậu phương và tiền tuyến"
  },
  {
    month: 8,
    title: "Tháng 8 - Thanh niên xung phong",
    image: "/images/1965-1975/thang8.jpg",
    topic: "Thanh niên xung phong",
    meaning: "Sức trẻ trên những cung đường lửa"
  },
  {
    month: 9,
    title: "Tháng 9 - Lớp học dưới hầm tăng xê",
    image: "/images/1965-1975/thang9.jpg",
    topic: "Lớp học dưới hầm tăng xê",
    meaning: "Tinh thần hiếu học trong mưa bom"
  },
  {
    month: 10,
    title: "Tháng 10 - Cầu Hiền Lương - Sông Bến Hải",
    image: "/images/1965-1975/thang10.jpg",
    topic: "Cầu Hiền Lương - Sông Bến Hải",
    meaning: "Biểu tượng khát vọng thống nhất"
  },
  {
    month: 11,
    title: "Tháng 11 - Nhà máy, xí nghiệp miền Bắc",
    image: "/images/1965-1975/thang11.jpg",
    topic: "Nhà máy, xí nghiệp miền Bắc",
    meaning: "Thi đua sản xuất vì miền Nam ruột thịt"
  },
  {
    month: 12,
    title: "Tháng 12 - Pháo cao xạ và bầu trời Hà Nội",
    image: "/images/1965-1975/thang12.jpg",
    topic: "Pháo cao xạ và bầu trời Hà Nội",
    meaning: 'Chiến thắng "Điện Biên Phủ trên không" (1972)'
  }
];

// Danh sách ngày lễ / sự kiện Việt Nam năm 2026 (lịch dương)
// Kết hợp cả ngày nghỉ lễ chính thức và một số ngày lễ truyền thống quan trọng.
export const HOLIDAYS_2026 = [
  // Lễ, Tết dương lịch và sự kiện chính trị
  { date: "2026-01-01", name: "Tết Dương lịch" },
  { date: "2026-02-03", name: "Ngày thành lập Đảng Cộng sản Việt Nam" },

  // Tết Nguyên Đán Bính Ngọ 2026 (tham chiếu từ lịch nhà nước)
  { date: "2026-02-16", name: "Tất niên - 30 Tết (29 tháng Chạp)" },
  { date: "2026-02-17", name: "Mùng 1 Tết Nguyên Đán Bính Ngọ 2026" },
  { date: "2026-02-18", name: "Mùng 2 Tết Nguyên Đán" },
  { date: "2026-02-19", name: "Mùng 3 Tết Nguyên Đán" },
  { date: "2026-02-20", name: "Mùng 4 Tết Nguyên Đán" },

  // Giỗ Tổ, 30/4, 1/5
  { date: "2026-04-26", name: "Giỗ Tổ Hùng Vương (10/3 âm lịch)" },
  { date: "2026-04-30", name: "Ngày Giải phóng miền Nam, Thống nhất đất nước" },
  { date: "2026-05-01", name: "Ngày Quốc tế Lao động" },
  { date: "2026-05-19", name: "Ngày sinh Chủ tịch Hồ Chí Minh" },

  // Vu Lan & Trung Thu (lễ truyền thống, không phải tất cả đều là ngày nghỉ)
  { date: "2026-08-27", name: "Lễ Vu Lan - Rằm tháng 7 âm lịch" },
  { date: "2026-09-25", name: "Tết Trung Thu - Rằm tháng 8 âm lịch" },

  // Quốc khánh
  { date: "2026-09-02", name: "Quốc khánh nước CHXHCN Việt Nam" }
];

