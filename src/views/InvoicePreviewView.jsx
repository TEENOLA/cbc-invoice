import { useRef, useState } from "react";
import {
  Cake,
  Phone,
  Mail,
  MapPin,
  QrCode,
  Printer,
  Download,
  ArrowLeft,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { naira, fmtDate } from "../utils/format.js";

export default function InvoicePreviewView({ invoice, customer, setView }) {
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current || downloading) return;
    setDownloading(true);
    const node = invoiceRef.current;
    const hiddenEls = node.querySelectorAll(".pdf-hide");
    const prevDisplay = Array.from(hiddenEls).map((el) => el.style.display);
    try {
      hiddenEls.forEach((el) => {
        el.style.display = "none";
      });
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: getComputedStyle(node).backgroundColor || "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const widthPt = canvas.width / 2;
      const heightPt = canvas.height / 2;
      const pdf = new jsPDF({
        orientation: widthPt > heightPt ? "landscape" : "portrait",
        unit: "pt",
        format: [widthPt, heightPt],
      });
      pdf.addImage(imgData, "PNG", 0, 0, widthPt, heightPt);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("Could not generate PDF", err);
    } finally {
      hiddenEls.forEach((el, i) => {
        el.style.display = prevDisplay[i];
      });
      setDownloading(false);
    }
  };

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--choc-soft)" }}>No invoice selected.</p>
        <button
          onClick={() => setView("history")}
          className="cbc-btn-primary mt-4 px-5 py-2 rounded-full text-sm"
        >
          Go to history
        </button>
      </div>
    );
  }
  const custName =
    customer?.name || invoice.customerNameOverride || "Walk-in Customer";
  return (
    <div className="p-5 lg:p-8">
      <button
        onClick={() => setView("history")}
        className="flex items-center gap-1 text-sm font-medium mb-5"
        style={{ color: "var(--caramel)" }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div
        ref={invoiceRef}
        className="max-w-2xl mx-auto cbc-card scallop-top scallop-bottom mt-2 mb-3 p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "var(--caramel)" }}
            >
              <Cake size={22} color="#FFFDF9" />
            </div>
            <div>
              <p className="cbc-display text-lg font-semibold leading-tight">
                Cakes b' Caking
              </p>
              <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
                Bakery &amp; Confectioneries
              </p>
              <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
                Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="cbc-display text-xl font-semibold">Invoice</p>
            <p
              className="cbc-mono text-sm"
              style={{ color: "var(--choc-soft)" }}
            >
              {invoice.invoiceNumber}
            </p>
            <div className="mt-2 pdf-hide">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        <div
          className="grid sm:grid-cols-2 gap-6 text-sm mb-6 pb-6 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: "var(--choc-soft)" }}
            >
              Billed to
            </p>
            <p className="font-medium">{custName}</p>
            {(invoice.phone || customer?.phone) && (
              <p
                className="mt-1.5 text-xs flex items-center"
                style={{ color: "var(--choc-soft)" }}
              >
                {/* <Phone
                  size={12}
                  className="align-middle"
                  style={{ marginRight: 6 }}
                /> */}
                {invoice.phone || customer?.phone}
              </p>
            )}
            {(invoice.email || customer?.email) && (
              <p
                className="mt-1.5 text-xs"
                style={{ color: "var(--choc-soft)" }}
              >
                {/* <Mail
                  size={12}
                  className="align-middle"
                  style={{ marginRight: 6 }}
                /> */}
                {invoice.email || customer?.email}
              </p>
            )}
            {invoice.address && (
              <p
                className="mt-1.5 text-xs"
                style={{ color: "var(--choc-soft)" }}
              >
                {/* <MapPin
                  size={12}
                  className="align-middle"
                  style={{ marginRight: 6 }}
                /> */}
                {invoice.address}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: "var(--choc-soft)" }}
            >
              Details
            </p>
            <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
              Issue date:{" "}
              <span style={{ color: "var(--choc)" }}>
                {fmtDate(invoice.issueDate)}
              </span>
            </p>
            {invoice.dueDate && (
              <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
                Due date:{" "}
                <span style={{ color: "var(--choc)" }}>
                  {fmtDate(invoice.dueDate)}
                </span>
              </p>
            )}
            {invoice.eventDate && (
              <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
                Event date:{" "}
                <span style={{ color: "var(--choc)" }}>
                  {fmtDate(invoice.eventDate)}
                </span>
              </p>
            )}
            <p className="text-xs" style={{ color: "var(--choc-soft)" }}>
              Fulfillment:{" "}
              <span style={{ color: "var(--choc)" }}>
                {invoice.fulfillment || "Pickup"}
              </span>
            </p>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr
              className="text-left border-b"
              style={{ borderColor: "var(--line)", color: "var(--choc-soft)" }}
            >
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 pl-4 font-medium text-right w-16">Qty</th>
              <th className="pb-2 pl-4 font-medium text-right w-28">Price</th>
              <th className="pb-2 pl-4 font-medium text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it, idx) => (
              <tr
                key={idx}
                className="border-b"
                style={{ borderColor: "var(--line)" }}
              >
                <td className="py-2 pr-2">{it.name}</td>
                <td className="py-2 pl-4 text-right w-16">{it.qty}</td>
                <td className="py-2 pl-4 text-right cbc-mono w-28">
                  {naira(it.price)}
                </td>
                <td className="py-2 pl-4 text-right cbc-mono font-medium w-32">
                  {naira(it.qty * it.price - (it.discount || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--choc-soft)" }}>Subtotal</span>
              <span className="cbc-mono">{naira(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--choc-soft)" }}>Discount</span>
              <span className="cbc-mono">-{naira(invoice.discount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--choc-soft)" }}>Delivery Fee</span>
              <span className="cbc-mono">
                {naira(invoice.deliveryFee || 0)}
              </span>
            </div>
            <div
              className="flex justify-between font-semibold text-base pt-2 border-t"
              style={{ borderColor: "var(--line)" }}
            >
              <span>Grand Total</span>
              <span className="cbc-mono">{naira(invoice.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span style={{ color: "var(--choc-soft)" }}>
                Paid ({invoice.paymentMethod || "—"})
              </span>
              <span className="cbc-mono">{naira(invoice.amountPaid || 0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Balance</span>
              <span
                className="cbc-mono"
                style={{
                  color:
                    invoice.balance > 0 ? "var(--rose-deep)" : "var(--sage)",
                }}
              >
                {naira(invoice.balance || 0)}
              </span>
            </div>
          </div>
        </div>

        {invoice.specialInstructions && (
          <div className="mb-4 text-xs">
            <span className="font-semibold">Special instructions: </span>
            {invoice.specialInstructions}
          </div>
        )}

        <div
          className="flex items-end justify-between pt-6 border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p
              className="text-xs italic mb-4 max-w-xs"
              style={{ color: "var(--choc-soft)" }}
            >
              {invoice.thankYou || "Thank you for your order!"}
            </p>
            <div
              className="cbc-display text-lg"
              style={{ fontStyle: "italic", color: "var(--choc-soft)" }}
            >
              Cakes b' Caking
            </div>
            <p
              className="text-[10px] uppercase tracking-wide"
              style={{ color: "var(--choc-soft)" }}
            >
              Authorized Signature
            </p>
          </div>
          <div
            className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: "var(--line)" }}
          >
            <QrCode size={28} style={{ color: "var(--choc-soft)" }} />
          </div>
        </div>
        {invoice.terms && (
          <p
            className="text-[11px] mt-5 pt-4 border-t"
            style={{ borderColor: "var(--line)", color: "var(--choc-soft)" }}
          >
            {invoice.terms}
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto flex gap-3 justify-end">
        <button
          onClick={() => window.print()}
          className="cbc-btn-outline px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
        >
          <Printer size={15} /> Print
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="cbc-btn-primary px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          <Download size={15} /> {downloading ? "Preparing…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
