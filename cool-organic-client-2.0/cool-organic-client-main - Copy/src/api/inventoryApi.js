import axiosClient from './axiosClient';

const inventoryApi = {
  getProductsInventory: (params) => {
    return axiosClient.get('/inventory', params);
  },
  updateQuantity: (id, quantity) => {
    return axiosClient.put(`/inventory/${id}`, { quantity });
  },
  deleteProduct: (id) => {
    return axiosClient.delete(`/inventory/${id}`);
  },
};

export default inventoryApi;
