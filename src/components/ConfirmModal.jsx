export default function ConfirmModal({ open, title, body, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="cbc-card w-full max-w-sm p-6 cbc-animate">
        <h3 className="cbc-display text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-5" style={{ color: "var(--choc-soft)" }}>
          {body}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="cbc-btn-outline px-4 py-2 rounded-full text-sm font-medium">
            Cancel
          </button>
          <button onClick={onConfirm} className="cbc-btn-primary px-4 py-2 rounded-full text-sm font-medium">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
