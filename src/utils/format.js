export const naira = (n) => `\u20a6${Math.round(n).toLocaleString("en-NG")}`;

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export function nextInvoiceNumber(invoices) {
  const nums = invoices
    .map((i) => parseInt(i.invoiceNumber.split("-")[1], 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1036;
  return `CBC-${max + 1}`;
}
