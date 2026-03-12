import React, { useEffect, useState } from 'react';
import { Page, Box, Text } from '../components/UIComponents';
import { dashboardService } from '../services/dashboardService';
import { formatDate } from '../utils/date';
import { calculateProgress } from '../utils/helpers';

interface DashboardStats {
  currentPeriod?: {
    start_date: string;
    end_date: string;
  };
  totalVisits?: number;
  targetVisits?: number;
  customersCovered?: number;
  totalCustomers?: number;
  todayVisits?: number;
  weekVisits?: number;
  pendingCustomers?: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Reload data when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📊 Dashboard visible, reloading data...');
        loadDashboardData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data as DashboardStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <Box p={4}>
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="dashboard-page">
      <Box p={4}>
        {/* Header */}
        <div className="dashboard-header">
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>
            Trang chủ
          </h1>
          <Text size="small" style={{ color: '#666' }}>
            Chào mừng bạn trở lại! 👋
          </Text>
        </div>

        {/* Current Period Card */}
        <div className="period-card">
          <div className="period-card-icon">📅</div>
          <div style={{ flex: 1 }}>
            <Text style={{ display: 'block', color: '#fff', opacity: 0.9, fontSize: '14px', letterSpacing: '0.3px', marginBottom: '10px' }}>
              Kỳ hiện tại
            </Text>
            <Text bold style={{ display: 'block', color: '#fff', fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.2px' }}>
              {stats?.currentPeriod?.start_date && stats?.currentPeriod?.end_date
                ? `${formatDate(stats.currentPeriod.start_date)} - ${formatDate(
                    stats.currentPeriod.end_date
                  )}`
                : 'Chưa có kỳ'}
            </Text>
          </div>
        </div>

        {/* Stats Grid - Today & This Week */}
        <div className="stats-grid">
          <div className="stat-card stat-card-today">
            <div className="stat-card-icon">☀️</div>
            <div className="stat-card-content">
              <Text size="small" style={{ color: '#fff', opacity: 0.9 }}>
                Hôm nay
              </Text>
              <Text size="xxLarge" bold style={{ color: '#fff', lineHeight: '1.2', marginTop: '8px' }}>
                {stats?.todayVisits || 0}
              </Text>
              <Text size="small" style={{ color: '#fff', opacity: 0.9, marginTop: '4px' }}>
                lượt thăm
              </Text>
            </div>
          </div>

          <div className="stat-card stat-card-week">
            <div className="stat-card-icon">📊</div>
            <div className="stat-card-content">
              <Text size="small" style={{ color: '#fff', opacity: 0.9 }}>
                Tuần này
              </Text>
              <Text size="xxLarge" bold style={{ color: '#fff', lineHeight: '1.2', marginTop: '8px' }}>
                {stats?.weekVisits || 0}
              </Text>
              <Text size="small" style={{ color: '#fff', opacity: 0.9, marginTop: '4px' }}>
                lượt thăm
              </Text>
            </div>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="card kpi-card">
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
            📈 Tổng quan KPI thăm viếng
          </h2>

          {/* Total Visits */}
          <div className="kpi-item">
            <div className="kpi-header">
              <Text style={{ color: '#333' }}>Tổng lượt thăm</Text>
              <Text bold style={{ color: '#0068ff' }}>
                {stats?.totalVisits || 0} / {stats?.targetVisits || 0}
              </Text>
            </div>
            <div className="progress-bar progress-bar-enhanced">
              <div
                className="progress-bar-fill progress-bar-fill-blue"
                style={{
                  width: `${calculateProgress(stats?.totalVisits || 0, stats?.targetVisits || 0)}%`,
                }}
              />
            </div>
            <Text size="xSmall" style={{ color: '#999', marginTop: '4px' }}>
              {calculateProgress(stats?.totalVisits || 0, stats?.targetVisits || 0)}% hoàn thành
            </Text>
          </div>

          {/* Customers Covered */}
          <div className="kpi-item">
            <div className="kpi-header">
              <Text style={{ color: '#333' }}>Khách hàng đã phủ</Text>
              <Text bold style={{ color: '#00c851' }}>
                {stats?.customersCovered || 0} / {stats?.totalCustomers || 0}
              </Text>
            </div>
            <div className="progress-bar progress-bar-enhanced">
              <div
                className="progress-bar-fill progress-bar-fill-green"
                style={{
                  width: `${calculateProgress(
                    stats?.customersCovered || 0,
                    stats?.totalCustomers || 0
                  )}%`,
                }}
              />
            </div>
            <Text size="xSmall" style={{ color: '#999', marginTop: '4px' }}>
              {calculateProgress(stats?.customersCovered || 0, stats?.totalCustomers || 0)}% hoàn thành
            </Text>
          </div>
        </div>

        {/* Pending Customers Alert */}
        <div className="alert-card">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <Text bold style={{ color: '#1a1a1a' }}>Khách hàng cần thăm</Text>
            <Text size="small" style={{ color: '#666', marginTop: '2px' }}>
              Còn {stats?.pendingCustomers || 0} khách hàng chưa thăm
            </Text>
          </div>
          <div className="alert-badge">
            <Text bold size="large" style={{ color: '#ff4444' }}>
              {stats?.pendingCustomers || 0}
            </Text>
          </div>
        </div>
      </Box>
    </Page>
  );
};

export default Dashboard;
