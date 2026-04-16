import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

export const getOutbreaks = async () => {
  const response = await api.get('/outbreaks');
  return response.data;
};
