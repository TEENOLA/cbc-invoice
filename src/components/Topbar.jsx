import { Menu, Sun, Moon } from "lucide-react";

export default function Topbar({ title, subtitle, dark, setDark, setMobileOpen }) {
  return (
    <div
      className="flex items-center justify-between px-5 lg:px-8 py-5 border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
        <div>
          <h1 className="cbc-display text-xl lg:text-2xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-xs lg:text-sm mt-0.5" style={{ color: "var(--choc-soft)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => setDark((d) => !d)}
        className="cbc-btn-outline w-10 h-10 rounded-full flex items-center justify-center"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </div>
  );
}
