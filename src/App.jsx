import React from "react";
import Calendar3D from "./components/Calendar3D.jsx";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Lịch 3D Năm 2026</h1>
        <p>
          Chủ đề: Việt Nam trong kháng chiến chống Mỹ (1965 - 1975)
        </p>
      </header>
      <main>
        <Calendar3D />
      </main>
      <footer className="app-footer">
        <p>
          Ảnh minh họa: hãy đặt file ảnh vào thư mục{" "}
          <code>public/images/1965-1975/</code> tương ứng với từng tháng.
        </p>
      </footer>
    </div>
  );
}

export default App;

