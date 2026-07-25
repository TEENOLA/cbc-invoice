export const PRODUCT_CATALOG = {
  Cakes: [
    { name: "Buttercream Cake", price: 18000 },
    { name: "Fondant Cake", price: 26000 },
    { name: "Wedding Cake (tier)", price: 120000 },
    { name: "Birthday Cake", price: 20000 },
    { name: "Cupcakes (dozen)", price: 9000 },
    { name: "Red Velvet Cake", price: 22000 },
    { name: "Chocolate Cake", price: 20000 },
  ],
  Pastries: [
    { name: "Meat Pie (each)", price: 700 },
    { name: "Chicken Pie (each)", price: 800 },
    { name: "Doughnuts (dozen)", price: 3500 },
    { name: "Sausage Roll (each)", price: 600 },
    { name: "Croissant (each)", price: 900 },
  ],
  Bread: [
    { name: "White Bread", price: 1200 },
    { name: "Wheat Bread", price: 1500 },
    { name: "Banana Bread", price: 2500 },
  ],
  Desserts: [
    { name: "Brownies (pack)", price: 3000 },
    { name: "Cookies (pack)", price: 2500 },
    { name: "Cheesecake (slice)", price: 3500 },
    { name: "Cinnamon Rolls (pack)", price: 4000 },
  ],
  Drinks: [
    { name: "Fresh Juice", price: 1000 },
    { name: "Coffee", price: 800 },
    { name: "Hot Chocolate", price: 1200 },
  ],
};

export const CATEGORIES = Object.keys(PRODUCT_CATALOG);

/* Cake configurator options — only used when category === "Cakes" */
export const CAKE_FLAVORS = ["Red Velvet", "Chocolate", "Plain"];
export const CAKE_SIZES = [8, 9, 10, 11];
export const CAKE_COVERINGS = [
  { name: "Buttercream", addon: 0 },
  { name: "Whipped Cream", addon: 4000 },
  { name: "Fondant", addon: 9000 },
];
export const CAKE_PRICE_PER_LAYER = 15000;
export const CAKE_SIZE_BASE = 8;
export const CAKE_PRICE_PER_INCH = 2000;

export const CUSTOMERS_SEED = [
  {
    id: "C-001",
    name: "Amaka Johnson",
    phone: "0803 214 5567",
    email: "amaka.j@gmail.com",
    totalOrders: 7,
    lastOrder: "2026-07-02",
    totalSpent: 184000,
    preferred: ["Wedding Cake (tier)", "Cupcakes (dozen)"],
    notes: "Prefers vanilla sponge, allergic to nuts.",
  },
  {
    id: "C-002",
    name: "Tunde Bakare",
    phone: "0805 662 1190",
    email: "tunde.bakare@yahoo.com",
    totalOrders: 3,
    lastOrder: "2026-06-18",
    totalSpent: 52000,
    preferred: ["Meat Pie (each)", "Chocolate Cake"],
    notes: "Orders for office monthly meetings.",
  },
  {
    id: "C-003",
    name: "Ifeoma Chukwu",
    phone: "0701 883 0921",
    email: "",
    totalOrders: 12,
    lastOrder: "2026-07-10",
    totalSpent: 310500,
    preferred: ["Fondant Cake", "Cheesecake (slice)"],
    notes: "Regular customer, always pays on delivery.",
  },
  {
    id: "C-004",
    name: "Emeka Obi",
    phone: "0812 447 2098",
    email: "emeka.obi@outlook.com",
    totalOrders: 1,
    lastOrder: "2026-05-29",
    totalSpent: 20000,
    preferred: ["Birthday Cake"],
    notes: "",
  },
  {
    id: "C-005",
    name: "Blessing Adeyemi",
    phone: "0908 331 7742",
    email: "blessing.a@gmail.com",
    totalOrders: 5,
    lastOrder: "2026-06-30",
    totalSpent: 96500,
    preferred: ["Doughnuts (dozen)", "Fresh Juice"],
    notes: "Runs a small event planning business, bulk orders.",
  },
];

function makeInvoice(
  id,
  num,
  customerId,
  date,
  status,
  items,
  deliveryFee,
  discount,
  amountPaid
) {
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const itemDiscount = items.reduce((s, it) => s + (it.discount || 0), 0);
  const grandTotal = subtotal - itemDiscount - discount + deliveryFee;
  return {
    id,
    invoiceNumber: num,
    customerId,
    issueDate: date,
    status,
    items,
    deliveryFee,
    discount,
    subtotal,
    grandTotal,
    amountPaid,
    balance: grandTotal - amountPaid,
  };
}

export const INVOICES_SEED = [
  makeInvoice(
    "I-1",
    "CBC-1042",
    "C-001",
    "2026-07-14",
    "Paid",
    [
      {
        id: 1,
        name: "Wedding Cake (tier)",
        category: "Cakes",
        qty: 1,
        price: 120000,
        discount: 5000,
      },
      {
        id: 2,
        name: "Cupcakes (dozen)",
        category: "Cakes",
        qty: 2,
        price: 9000,
        discount: 0,
      },
    ],
    5000,
    0,
    143000
  ),
  makeInvoice(
    "I-2",
    "CBC-1041",
    "C-003",
    "2026-07-12",
    "Pending",
    [
      {
        id: 1,
        name: "Fondant Cake",
        category: "Cakes",
        qty: 1,
        price: 26000,
        discount: 0,
      },
      {
        id: 2,
        name: "Cheesecake (slice)",
        category: "Desserts",
        qty: 4,
        price: 3500,
        discount: 0,
      },
    ],
    2000,
    0,
    20000
  ),
  makeInvoice(
    "I-3",
    "CBC-1040",
    "C-002",
    "2026-07-08",
    "Overdue",
    [
      {
        id: 1,
        name: "Meat Pie (each)",
        category: "Pastries",
        qty: 20,
        price: 700,
        discount: 1000,
      },
    ],
    1500,
    0,
    0
  ),
  makeInvoice(
    "I-4",
    "CBC-1039",
    "C-005",
    "2026-07-05",
    "Paid",
    [
      {
        id: 1,
        name: "Doughnuts (dozen)",
        category: "Pastries",
        qty: 3,
        price: 3500,
        discount: 0,
      },
      {
        id: 2,
        name: "Fresh Juice",
        category: "Drinks",
        qty: 10,
        price: 1000,
        discount: 500,
      },
    ],
    2500,
    0,
    24000
  ),
  makeInvoice(
    "I-5",
    "CBC-1038",
    "C-004",
    "2026-06-29",
    "Paid",
    [
      {
        id: 1,
        name: "Birthday Cake",
        category: "Cakes",
        qty: 1,
        price: 20000,
        discount: 0,
      },
    ],
    1000,
    0,
    21000
  ),
  makeInvoice(
    "I-6",
    "CBC-1037",
    "C-003",
    "2026-06-20",
    "Draft",
    [
      {
        id: 1,
        name: "Wedding Cake (tier)",
        category: "Cakes",
        qty: 1,
        price: 120000,
        discount: 10000,
      },
    ],
    5000,
    0,
    0
  ),
];

export const SALES_TREND = [
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 265000 },
  { month: "Apr", revenue: 241000 },
  { month: "May", revenue: 298000 },
  { month: "Jun", revenue: 322000 },
  { month: "Jul", revenue: 356500 },
];

export const TOP_PRODUCTS = [
  { name: "Wedding Cake", value: 250000 },
  { name: "Fondant Cake", value: 78000 },
  { name: "Cupcakes", value: 54000 },
  { name: "Meat Pie", value: 42000 },
  { name: "Doughnuts", value: 31500 },
];

export const PIE_COLORS = [
  "#E2812E",
  "#E0487B",
  "#EFB93E",
  "#5E9E5B",
  "#7D5B49",
];
