# Cakes b' Caking — Invoice Generator

A portfolio invoice management app for a bakery, built with React + Vite + Tailwind CSS.

## Structure

```
src/
  data/mockData.js         mock products, customers, invoices, sales data
  utils/format.js          currency/date formatting, invoice number generator
  components/              shared UI: Sidebar, Topbar, StatusBadge, StatCard,
                            Toast, ConfirmModal, MiniPreview
  views/                   one file per screen: Dashboard, CreateInvoice,
                            InvoicePreview, History, Customers, Analytics
  App.jsx                  layout + view routing (state-based, no react-router)
  index.css                design tokens (CSS variables), fonts, component classes
```

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Notes

- All data is mock and held in React state — refreshing the page resets it.
- Dark mode and view switching are handled with local state in `App.jsx`; swap in
  `react-router-dom` if you want real URLs per view.
- Fonts: Fraunces (display), Manrope (body), IBM Plex Mono (invoice numbers/figures).
- Design tokens live as CSS custom properties in `src/index.css` — change them there
  to retheme the whole app.
# cbc-invoice
