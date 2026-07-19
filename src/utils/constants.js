export const ROLE = {
  CUSTOMER: "customer",
  STAFF: "staff",
  OWNER: "owner",
};

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  SHIPPING: "Shipping",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
};

export const CAKE_SIZES = [
  { id: 'small', label: 'Small (16cm)', price: 150000 },
  { id: 'medium', label: 'Medium (20cm)', price: 250000 },
  { id: 'large', label: 'Large (24cm)', price: 350000 },
];

export const CAKE_LAYERS = [
  { id: 1, label: '1 Layer', price: 0 },
  { id: 2, label: '2 Layers', price: 50000 },
  { id: 3, label: '3 Layers', price: 100000 },
];

export const CAKE_SPONGES = [
  { id: 'vanilla', label: 'Vanilla Sponge', price: 0 },
  { id: 'chocolate', label: 'Chocolate Sponge', price: 20000 },
  { id: 'matcha', label: 'Matcha Sponge', price: 30000 },
];

export const CAKE_FILLINGS = [
  { id: 'strawberry', label: 'Strawberry Jam', price: 15000 },
  { id: 'chocolate', label: 'Chocolate Ganache', price: 25000 },
  { id: 'passionfruit', label: 'Passion Fruit Curd', price: 20000 },
  { id: 'none', label: 'No Filling', price: 0 },
];

export const CAKE_CREAMS = [
  { id: 'buttercream', label: 'Buttercream', price: 0 },
  { id: 'freshcream', label: 'Fresh Cream', price: 30000 },
  { id: 'creamcheese', label: 'Cream Cheese', price: 50000 },
];

export const CAKE_TOPPINGS = [
  { id: 'macaron', label: 'Macarons', price: 30000 },
  { id: 'fruits', label: 'Fresh Fruits', price: 40000 },
  { id: 'sprinkles', label: 'Sprinkles', price: 10000 },
  { id: 'chocolate_drip', label: 'Chocolate Drip', price: 20000 },
];

export const CAKE_COLORS = [
  { id: 'white', label: 'Trắng Sữa (White)', value: '#f8f9fa' },
  { id: 'pink', label: 'Hồng Pastel (Pink)', value: '#ffb6c1' },
  { id: 'blue', label: 'Xanh Ngọc (Blue)', value: '#add8e6' },
  { id: 'yellow', label: 'Vàng Chanh (Yellow)', value: '#fffacd' },
  { id: 'chocolate', label: 'Nâu Cacao (Chocolate)', value: '#a0522d' },
  { id: 'purple', label: 'Tím Taro (Purple)', value: '#e6e6fa' },
  { id: 'green', label: 'Xanh Lá (Green)', value: '#98fb98' },
  { id: 'red', label: 'Đỏ Ruby (Red)', value: '#ff6b6b' },
];
