import { useState, useRef } from "react";
import { Plus, Trash2, Pencil, Cake } from "lucide-react";
import MiniPreview from "../components/MiniPreview.jsx";
import CakeConfigurator from "../components/CakeConfigurator.jsx";
import { PRODUCT_CATALOG, CATEGORIES } from "../data/mockData.js";
import { nextInvoiceNumber } from "../utils/format.js";
import { calcCakePrice, cakeSummaryName } from "../utils/cakePricing.js";

function emptyForm(invoiceNumber) {
  return {
    customerName: "",
    phone: "",
    email: "",
    address: "",
    eventDate: "",
    fulfillment: "Pickup",
    invoiceNumber,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    status: "Draft",
    items: [
      {
        id: 1,
        name: "",
        category: "Cakes",
        qty: 1,
        price: 0,
        discount: 0,
        cakeConfig: null,
      },
    ],
    deliveryFee: 0,
    discount: 0,
    tax: 0,
    paymentMethod: "Cash",
    amountPaid: 0,
    specialInstructions: "",
    thankYou:
      "Thank you for choosing Cakes b' Caking! We hope every bite brings a smile.",
    terms: "Balance due on delivery. Custom orders require 48 hours notice.",
  };
}

export default function CreateInvoiceView({
  invoices,
  setInvoices,
  customers,
  setView,
  setSelectedInvoiceId,
  showToast,
}) {
  const [form, setForm] = useState(() =>
    emptyForm(nextInvoiceNumber(invoices))
  );
  const [cakeConfigItemId, setCakeConfigItemId] = useState(null);
  const nextItemId = useRef(2);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateItem = (id, patch) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  const addItem = () => {
    const id = nextItemId.current++;
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          id,
          name: "",
          category: "Cakes",
          qty: 1,
          price: 0,
          discount: 0,
          cakeConfig: null,
        },
      ],
    }));
  };
  const removeItem = (id) => {
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }));
    if (cakeConfigItemId === id) setCakeConfigItemId(null);
  };

  const subtotal = form.items.reduce((s, it) => s + it.qty * it.price, 0);
  const itemDiscounts = form.items.reduce(
    (s, it) => s + Number(it.discount || 0),
    0
  );
  const taxAmount = subtotal * (Number(form.tax || 0) / 100);
  const grandTotal =
    subtotal -
    itemDiscounts -
    Number(form.discount || 0) +
    Number(form.deliveryFee || 0) +
    taxAmount;
  const balance = grandTotal - Number(form.amountPaid || 0);

  const handleSave = () => {
    if (!form.customerName || form.items.every((it) => !it.name)) {
      showToast("Add a customer name and at least one item first.");
      return;
    }
    let customerId = customers.find(
      (c) => c.name.toLowerCase() === form.customerName.toLowerCase()
    )?.id;
    if (!customerId) customerId = "C-NEW-" + Date.now();

    const newInvoice = {
      id: "I-" + Date.now(),
      invoiceNumber: form.invoiceNumber,
      customerId,
      customerNameOverride: form.customerName,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: form.status,
      fulfillment: form.fulfillment,
      phone: form.phone,
      email: form.email,
      address: form.address,
      eventDate: form.eventDate,
      items: form.items.filter((it) => it.name),
      deliveryFee: Number(form.deliveryFee || 0),
      discount: Number(form.discount || 0),
      tax: Number(form.tax || 0),
      subtotal,
      grandTotal,
      paymentMethod: form.paymentMethod,
      amountPaid: Number(form.amountPaid || 0),
      balance,
      specialInstructions: form.specialInstructions,
      thankYou: form.thankYou,
      terms: form.terms,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoiceId(newInvoice.id);
    showToast(`Invoice ${form.invoiceNumber} created`);
    setView("preview");
  };

  const inputCls = "cbc-input w-full rounded-xl px-3.5 py-2.5 text-sm";
  const labelCls = "text-xs font-semibold mb-1.5 block";
  const miniLabelCls = "text-[11px] font-medium block mb-1";

  return (
    <div className="p-5 lg:p-8 grid lg:grid-cols-5 gap-6 items-start">
      {/* FORM */}
      <div className="lg:col-span-3 space-y-6">
        <section className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">
            Customer Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Customer Name</label>
              <input
                className={inputCls}
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                placeholder="e.g. Amaka Johnson"
              />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="080X XXX XXXX"
              />
            </div>
            <div>
              <label className={labelCls}>Email Address (optional)</label>
              <input
                className={inputCls}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className={labelCls}>Event Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Delivery Address</label>
              <input
                className={inputCls}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Street, area, city"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Fulfillment</label>
              <div className="flex gap-2">
                {["Pickup", "Delivery"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update("fulfillment", opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      form.fulfillment === opt
                        ? "cbc-btn-primary"
                        : "cbc-btn-outline"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">Invoice Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Invoice Number</label>
              <input
                className={`${inputCls} cbc-mono`}
                value={form.invoiceNumber}
                readOnly
              />
            </div>
            <div>
              <label className={labelCls}>Issue Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.issueDate}
                onChange={(e) => update("issueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Payment Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {["Draft", "Pending", "Paid", "Overdue"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="cbc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="cbc-display font-semibold">Order Items</h3>
            <button
              onClick={addItem}
              className="cbc-btn-outline px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {form.items.map((it) => (
              <div
                key={it.id}
                className="rounded-xl p-3 border space-y-3"
                style={{ borderColor: "var(--line)" }}
              >
                {/* Row 1: what they're ordering — gets full width so nothing wraps or fights for room */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-1">
                    <label
                      className={miniLabelCls}
                      style={{ color: "var(--choc-soft)" }}
                    >
                      Category
                    </label>
                    <select
                      className={inputCls}
                      value={it.category}
                      onChange={(e) => {
                        updateItem(it.id, {
                          category: e.target.value,
                          name: "",
                          price: 0,
                          cakeConfig: null,
                        });
                        if (
                          e.target.value !== "Cakes" &&
                          cakeConfigItemId === it.id
                        )
                          setCakeConfigItemId(null);
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      className={miniLabelCls}
                      style={{ color: "var(--choc-soft)" }}
                    >
                      Product
                    </label>
                    {it.category === "Cakes" ? (
                      it.cakeConfig ? (
                        <div className="cbc-input rounded-xl px-3.5 py-2.5 text-sm flex items-center justify-between gap-2">
                          <span className="truncate">{it.name}</span>
                          <button
                            onClick={() => setCakeConfigItemId(it.id)}
                            className="shrink-0 cbc-btn-outline p-1.5 rounded-lg"
                            aria-label="Edit cake configuration"
                          >
                            <Pencil size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCakeConfigItemId(it.id)}
                          className="cbc-btn-outline w-full rounded-xl px-3.5 py-2.5 text-sm text-left flex items-center gap-2 whitespace-nowrap"
                        >
                          <Cake size={14} className="shrink-0" /> Configure Cake
                        </button>
                      )
                    ) : (
                      <select
                        className={inputCls}
                        value={it.name}
                        onChange={(e) => {
                          const prod = PRODUCT_CATALOG[it.category].find(
                            (p) => p.name === e.target.value
                          );
                          updateItem(it.id, {
                            name: e.target.value,
                            price: prod ? prod.price : it.price,
                          });
                        }}
                      >
                        <option value="">Select product</option>
                        {PRODUCT_CATALOG[it.category].map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Row 2: the numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-end">
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      className={miniLabelCls}
                      style={{ color: "var(--choc-soft)" }}
                    >
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={inputCls}
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(it.id, { qty: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-5">
                    <label
                      className={miniLabelCls}
                      style={{ color: "var(--choc-soft)" }}
                    >
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`${inputCls} ${
                        it.cakeConfig ? "opacity-70" : ""
                      }`}
                      value={it.price}
                      readOnly={!!it.cakeConfig}
                      onChange={(e) =>
                        updateItem(it.id, { price: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-4">
                    <label
                      className={miniLabelCls}
                      style={{ color: "var(--choc-soft)" }}
                    >
                      Discount
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={inputCls}
                      value={it.discount}
                      onChange={(e) =>
                        updateItem(it.id, { discount: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-1 flex sm:justify-end">
                    <button
                      onClick={() => removeItem(it.id)}
                      className="p-2.5 rounded-xl cbc-btn-outline shrink-0 w-full sm:w-auto flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Cake configurator — only for Cakes, always rendered below everything else */}
                {it.category === "Cakes" && cakeConfigItemId === it.id && (
                  <div
                    className="pt-3 border-t"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <CakeConfigurator
                      initial={it.cakeConfig}
                      onCancel={() => setCakeConfigItemId(null)}
                      onSave={(config) => {
                        const price = calcCakePrice(config);
                        updateItem(it.id, {
                          cakeConfig: config,
                          name: cakeSummaryName(config),
                          price,
                        });
                        setCakeConfigItemId(null);
                      }}
                    />
                  </div>
                )}

                <div
                  className="text-right text-xs cbc-mono"
                  style={{ color: "var(--choc-soft)" }}
                >
                  Line total:{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--choc)" }}
                  >
                    {(it.qty * it.price - (it.discount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">Pricing Summary</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Delivery Fee</label>
              <input
                type="number"
                className={inputCls}
                value={form.deliveryFee}
                onChange={(e) => update("deliveryFee", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Extra Discount</label>
              <input
                type="number"
                className={inputCls}
                value={form.discount}
                onChange={(e) => update("discount", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Tax (%)</label>
              <input
                type="number"
                className={inputCls}
                value={form.tax}
                onChange={(e) => update("tax", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">
            Payment Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Payment Method</label>
              <select
                className={inputCls}
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
              >
                {["Cash", "Bank Transfer", "POS", "Card"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Amount Paid</label>
              <input
                type="number"
                className={inputCls}
                value={form.amountPaid}
                onChange={(e) => update("amountPaid", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="cbc-card p-5">
          <h3 className="cbc-display font-semibold mb-4">Notes</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Special Instructions</label>
              <textarea
                className={inputCls}
                rows={2}
                value={form.specialInstructions}
                onChange={(e) => update("specialInstructions", e.target.value)}
                placeholder="e.g. no nuts, deliver before 4pm"
              />
            </div>
            <div>
              <label className={labelCls}>Thank You Message</label>
              <textarea
                className={inputCls}
                rows={2}
                value={form.thankYou}
                onChange={(e) => update("thankYou", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Terms &amp; Conditions</label>
              <textarea
                className={inputCls}
                rows={2}
                value={form.terms}
                onChange={(e) => update("terms", e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="cbc-btn-primary px-6 py-3 rounded-full font-semibold text-sm"
          >
            Save Invoice
          </button>
          <button
            onClick={() => setForm(emptyForm(nextInvoiceNumber(invoices)))}
            className="cbc-btn-outline px-6 py-3 rounded-full font-semibold text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="lg:col-span-2 lg:sticky lg:top-6">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--choc-soft)" }}
        >
          Live Preview
        </p>
        <MiniPreview
          form={form}
          subtotal={subtotal}
          itemDiscounts={itemDiscounts}
          taxAmount={taxAmount}
          grandTotal={grandTotal}
          balance={balance}
        />
      </div>
    </div>
  );
}
