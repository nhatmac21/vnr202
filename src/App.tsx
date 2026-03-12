import DeskCalendar from "./components/DeskCalendar";
import WarBackground from "./components/WarBackground";
import HistoricalOverlay from "./components/HistoricalOverlay";
import AtmosphericEffects from "./components/AtmosphericEffects";

export default function App() {
  return (
    <div className="min-h-screen text-stone-100 relative overflow-hidden">
      {/* Animated war-themed background */}
      <WarBackground />
      <HistoricalOverlay />
      <AtmosphericEffects />
      
      <header className="mx-auto max-w-6xl px-4 pt-8 pb-4 text-center relative z-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-amber-100 sm:text-3xl drop-shadow-lg">
          Lịch 3D Năm 2026
        </h1>
        <p className="mt-2 text-sm text-amber-200/90 drop-shadow">
          Chủ đề: Việt Nam trong kháng chiến chống Mỹ (1965 - 1975)
        </p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="inline-block w-8 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-yellow-500"></span>
          <span className="text-xs text-amber-300/80 font-medium">Chiến thắng và Hòa bình</span>
          <span className="inline-block w-8 h-0.5 bg-gradient-to-r from-yellow-500 via-red-500 to-transparent"></span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 relative z-10">
        <div className="rounded-2xl border border-amber-500/20 shadow-[0_30px_90px_rgba(0,0,0,0.30)]" style={{ background: 'transparent' }}>
          <DeskCalendar />
        </div>
      </main>

      <footer className="px-4 pb-8 text-center text-sm text-amber-200/70 relative z-10 drop-shadow">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/30 backdrop-blur-sm border border-amber-500/20">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Đây là sản phẩm sáng tạo phục vụ cho bộ môn VNR202
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

