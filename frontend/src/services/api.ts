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

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/notifications/mark-all');
  return response.data;
};

export const getReportSummary = async () => {
  const response = await api.get('/reports/summary');
  return response.data;
};

export default api;
