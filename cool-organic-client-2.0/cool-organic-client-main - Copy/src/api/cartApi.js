import axiosClient from './axiosClient';

const cartApi = {
  createCart: (userId) => {
    return axiosClient.post('/cart', { userId });
  },
  getCart: () => {
    return axiosClient.get('/cart');
  },
  updateCart: (products) => {
    return axiosClient.put('/cart', { products });
  },
  updateQuantity: (productId, quantity) => {
    return axiosClient.put('/cart/update-quantity', { productId, quantity });
  },
  deleteProductInCart: (productId) => {
    return axiosClient.delete('/cart/delete-product', {
      data: { productId },
    });
  },
  deleteCart: (id) => {
    return axiosClient.delete(`/cart/${id}`);
  },
};

export default cartApi;
