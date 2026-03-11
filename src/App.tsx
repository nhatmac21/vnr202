import DeskCalendar from "./components/DeskCalendar";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-stone-900">
      <header className="mx-auto max-w-6xl px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
          Lịch 3D Năm 2026
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Chủ đề: Việt Nam trong kháng chiến chống Mỹ (1965 - 1975)
        </p>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border border-amber-200/60 bg-white/60 shadow-[0_30px_90px_rgba(0,0,0,0.10)] backdrop-blur">
          <DeskCalendar />
        </div>
      </main>

      <footer className="px-4 pb-8 text-center text-sm text-stone-600">
        Đây là sản phẩm sáng tạo phục vụ cho bộ môn VNR202.
      </footer>
    </div>
  );
}

