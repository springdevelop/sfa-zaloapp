import api, { USE_MOCK_DATA } from './api';
import { mockDashboardStats, mockVisitTargets, mockVisitHistory } from './mockData';

// Calculate dynamic dashboard stats from current data
const calculateDashboardStats = () => {
  const totalVisits = mockVisitTargets.reduce((sum, target) => sum + target.actual_visits, 0);
  const targetVisits = mockVisitTargets.reduce((sum, target) => sum + target.target_visits, 0);
  const customersCovered = mockVisitTargets.filter(t => t.actual_visits > 0).length;
  const totalCustomers = mockVisitTargets.length;
  const pendingCustomers = mockVisitTargets.filter(t => t.actual_visits < t.target_visits).length;
  
  // Calculate today's visits (assuming today is March 4, 2026)
  const today = new Date('2026-03-04').toDateString();
  const todayVisits = mockVisitHistory.filter(visit => {
    const visitDate = new Date(visit.checkin_time).toDateString();
    return visitDate === today;
  }).length;
  
  // Calculate this week's visits (last 7 days)
  const sevenDaysAgo = new Date('2026-02-26');
  const weekVisits = mockVisitHistory.filter(visit => {
    const visitDate = new Date(visit.checkin_time);
    return visitDate >= sevenDaysAgo;
  }).length;
  
  return {
    ...mockDashboardStats,
    totalVisits,
    targetVisits,
    customersCovered,
    totalCustomers,
    todayVisits,
    weekVisits,
    pendingCustomers
  };
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve(calculateDashboardStats()), 300);
      });
    }
    try {
      console.log('📊 Fetching dashboard stats from API...');
      const response = await api.get('/dashboard/stats');
      console.log('✅ Dashboard stats response:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching dashboard stats:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      throw error;
    }
  },

  // Get KPI progress
  getKPIProgress: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve(calculateDashboardStats()), 300);
      });
    }
    return api.get('/dashboard/kpi-progress');
  },
};
