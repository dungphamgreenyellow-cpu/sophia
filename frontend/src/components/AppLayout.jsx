import { NavLink } from "react-router-dom";

const navItem = (to, label) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "px-3 py-2 rounded-lg text-sm transition",
        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")
    }
  >
    {label}
  </NavLink>
);

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black" />
            <div className="leading-tight">
              <div className="font-semibold">Quản lý Thu/Chi</div>
              <div className="text-xs text-gray-500">Bản final • Không Báo cáo/Cài đặt</div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {navItem("/", "Trang chủ")}
            {navItem("/thu-chi", "Thu / Chi")}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} • Dữ liệu lưu SQLite (backend/data.sqlite)
        </div>
      </footer>
    </div>
  );
}
