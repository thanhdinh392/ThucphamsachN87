import axiosClient from './axiosClient';

const orderApi = {
  createOrder: async (order) => {
    return await axiosClient.post('/orders', order);
  },
  getOrders: async (param) => {
    return await axiosClient.get('/orders', param);
  },
  getOrdersByUserId: async (userId, param) => {
    return await axiosClient.get(`/orders/user/${userId}`, param);
  },
  getOrderByOrderId: async (orderId) => {
    return await axiosClient.get(`/orders/${orderId}`);
  },
  getTotalRevenue: async () => {
    return await axiosClient.get('/orders/get-total-revenue');
  },
  updateStatusOrder: async (orderId, order) => {
    return await axiosClient.patch(`/orders/${orderId}`, order);
  },
  deleteOrder: async (orderId) => {
    return await axiosClient.delete(`/orders/${orderId}`);
  },
};

export default orderApi;
