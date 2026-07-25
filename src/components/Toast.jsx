import { Sparkles } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 cbc-animate">
      <div
        className="cbc-card px-4 py-3 flex items-center gap-2 text-sm font-medium"
        style={{ borderColor: "var(--caramel)" }}
      >
        <Sparkles size={16} style={{ color: "var(--caramel)" }} />
        {toast}
      </div>
    </div>
  );
}
