import { Cake } from "lucide-react";
import { naira } from "../utils/format.js";

export default function MiniPreview({
  form,
  subtotal,
  itemDiscounts,
  taxAmount,
  grandTotal,
  balance,
}) {
  return (
    <div className="cbc-card mt-2 p-5 space-y-4 text-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--caramel)" }}
          >
            <Cake size={15} color="#FFFDF9" />
          </div>
          <div>
            <p className="cbc-display font-semibold leading-tight">
              Cakes b' Caking
            </p>
            <p className="text-[11px]" style={{ color: "var(--choc-soft)" }}>
              Bakery &amp; Confectioneries
            </p>
          </div>
        </div>
        <p className="cbc-mono text-xs" style={{ color: "var(--choc-soft)" }}>
          {form.invoiceNumber}
        </p>
      </div>
      <div
        className="grid grid-cols-2 gap-2 text-xs pt-2 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        <div>
          <span style={{ color: "var(--choc-soft)" }}>Bill to</span>
          <br />
          {form.customerName || "—"}
        </div>
        <div>
          <span style={{ color: "var(--choc-soft)" }}>Fulfillment</span>
          <br />
          {form.fulfillment}
        </div>
      </div>
      <div className="border-t pt-3" style={{ borderColor: "var(--line)" }}>
        {form.items.filter((it) => it.name).length === 0 && (
          <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
            No items yet.
          </p>
        )}
        {form.items
          .filter((it) => it.name)
          .map((it) => (
            <div key={it.id} className="flex justify-between py-1 text-xs">
              <span>
                {it.qty}× {it.name}
              </span>
              <span className="cbc-mono">
                {naira(it.qty * it.price - (it.discount || 0))}
              </span>
            </div>
          ))}
      </div>
      <div
        className="border-t pt-3 space-y-1 text-xs"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex justify-between">
          <span style={{ color: "var(--choc-soft)" }}>Subtotal</span>
          <span className="cbc-mono">{naira(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--choc-soft)" }}>Discounts</span>
          <span className="cbc-mono">
            -{naira(itemDiscounts + Number(form.discount || 0))}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--choc-soft)" }}>Delivery</span>
          <span className="cbc-mono">
            {naira(Number(form.deliveryFee || 0))}
          </span>
        </div>
        {Number(form.tax) > 0 && (
          <div className="flex justify-between">
            <span style={{ color: "var(--choc-soft)" }}>Tax</span>
            <span className="cbc-mono">{naira(taxAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-sm pt-1">
          <span>Grand Total</span>
          <span className="cbc-mono">{naira(grandTotal)}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span style={{ color: "var(--choc-soft)" }}>Balance</span>
          <span
            className="cbc-mono font-semibold"
            style={{ color: balance > 0 ? "var(--rose-deep)" : "var(--sage)" }}
          >
            {naira(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
