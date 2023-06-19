import axiosClient from './axiosClient';

const categoryApi = {
  createCategory: (name) => {
    return axiosClient.post('/categories', { name });
  },
  getCategories: (params) => {
    return axiosClient.get('/categories', params);
  },
  getCategoryBySlug: (slug) => {
    return axiosClient.get(`/categories/${slug}`);
  },
  getQuantityProductsOfCategory: (slug) => {
    return axiosClient.get(`/categories/quantity/${slug}`);
  },
  updateCategory: (slug, name) => {
    return axiosClient.put(`/categories/${slug}`, { name });
  },
  deleteCategory: (slug) => {
    return axiosClient.delete(`/categories/${slug}`);
  },
};

export default categoryApi;
