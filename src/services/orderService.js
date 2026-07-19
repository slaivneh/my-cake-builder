/*
API đơn hàng

- Tạo đơn
- Lấy đơn
- Cập nhật trạng thái
*/
import axiosClient from "./axiosClient";

// Mock data for orders
let mockOrders = [
  {
    id: 'ORD-001',
    userId: 'user123',
    date: '2026-07-15T10:30:00Z',
    total: 350000,
    status: 'Completed',
    paymentStatus: 'Paid',
    items: [
      {
        type: 'custom',
        details: { size: 'small', layer: 1, sponge: 'vanilla', color: '#ffb6c1', toppings: ['macaron'] }
      }
    ]
  },
  {
    id: 'ORD-002',
    userId: 'user123',
    date: '2026-07-18T14:20:00Z',
    total: 550000,
    status: 'Preparing',
    paymentStatus: 'Paid',
    items: [
      {
        type: 'custom',
        details: { size: 'medium', layer: 2, sponge: 'chocolate', color: '#ffffff', text: 'Happy Birthday' }
      }
    ]
  }
];

const orderService = {
  getAll() {
    return new Promise((resolve) => setTimeout(() => resolve(mockOrders), 500));
  },

  getByUserId(userId) {
    return new Promise((resolve) => setTimeout(() => resolve(mockOrders.filter(o => o.userId === userId)), 500));
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o.id === id);
        if (order) resolve(order);
        else reject(new Error('Order not found'));
      }, 500);
    });
  },

  create(order) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString(),
          status: 'Pending',
          paymentStatus: 'Pending',
          ...order
        };
        mockOrders.push(newOrder);
        resolve(newOrder);
      }, 1000);
    });
  },

  updateStatus(id, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockOrders = mockOrders.map(o => o.id === id ? { ...o, status } : o);
        resolve(true);
      }, 500);
    });
  },
};

export const getOrderById = (id) => {
  return axiosClient.get(`/orders/${id}`);
};

export const createOrder = (data) => {
  return axiosClient.post("/orders", data);
};

export const updateStatus = (id, data) => {
  return axiosClient.patch(`/orders/${id}`, data);
};
