import axiosClient from './axiosClient';

const cakeTemplateService = {
  getAll() {
    return axiosClient.get('/cakeTemplates').then(res => res.data);
  },

  getByCategory(category) {
    return axiosClient.get(`/cakeTemplates?category=${encodeURIComponent(category)}`).then(res => res.data);
  },
};

export default cakeTemplateService;
