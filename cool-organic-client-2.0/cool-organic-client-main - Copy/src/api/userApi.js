import axiosClient from './axiosClient';

const userApi = {
  createUser: (data) => {
    return axiosClient.post('/users', data);
  },
  getUsers: (params = {}) => {
    return axiosClient.get('/users', params);
  },
  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },
  changePassword: (data) => {
    return axiosClient.post('/users/change-password', data);
  },
  updateUser: (data) => {
    return axiosClient.put('/users', data);
  },
  updateRole: (id, role) => {
    return axiosClient.put(`/users/role/${id}`, { role });
  },
  deleteUser: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },
};

export default userApi;
