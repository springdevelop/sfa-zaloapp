import React, { useEffect, useState } from 'react';
import { Page, Box, Text, Button, Select, useNavigate } from '../components/UIComponents';
import { useRecoilState, useRecoilValue } from 'recoil';
import { visitTargetsState, filterState, currentVisitState } from '../state/atoms';
import { visitService } from '../services/visitService';
import { currentVisitService } from '../services/currentVisitService';
import {
  getStatusBadge,
  calculateProgress,
  formatAddress,
} from '../utils/helpers';
import { formatDaysRemaining } from '../utils/date';
import { formatDistance, calculateDistance, getCurrentLocation } from '../utils/location';

interface UserLocation {
  latitude: number;
  longitude: number;
}

const VisitPlan: React.FC = () => {
  const navigate = useNavigate();
  const [visitTargets, setVisitTargets] = useRecoilState(visitTargetsState);
  const [filter, setFilter] = useRecoilState(filterState);
  const [currentVisit, setCurrentVisit] = useRecoilState(currentVisitState);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    loadVisitTargets();
    loadUserLocation();
    loadCurrentVisit();
    
    // Reload data when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📋 VisitPlan visible, reloading data...');
        loadVisitTargets();
        loadCurrentVisit();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadVisitTargets = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading visit targets...');
      const data = await visitService.getVisitTargets();
      console.log('✅ Loaded visit targets:', data?.length || 0, 'items');
      setVisitTargets(data);
    } catch (error: any) {
      console.error('❌ Error loading visit targets:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      console.log('📍 Vị trí hiện tại của bạn:', location);
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const loadCurrentVisit = async () => {
    try {
      const visit = await currentVisitService.getCurrentVisit();
      if (visit) {
        console.log('✅ Loaded current visit from storage:', visit);
        setCurrentVisit(visit);
      }
    } catch (error) {
      console.error('Error loading current visit:', error);
    }
  };

  const getFilteredAndSortedTargets = () => {
    let filtered = [...visitTargets];

    // Filter by status
    if (filter.status === 'incomplete') {
      filtered = filtered.filter((t) => t.actual_visits < t.target_visits);
    } else if (filter.status === 'complete') {
      filtered = filtered.filter((t) => t.actual_visits >= t.target_visits);
    }

    // Sort
    if (filter.sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.customer.latitude,
          a.customer.longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.customer.latitude,
          b.customer.longitude
        );
        return distA - distB;
      });
    } else if (filter.sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    }

    return filtered;
  };

  const handleCardClick = (target: any) => {
    navigate(`/visit-detail/${target.id}`);
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

  const targets = getFilteredAndSortedTargets();

  return (
    <Page className="visit-plan-page">
      <Box p={4}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold' }}>
          Tuyến thăm
        </h1>

        {/* Current Visit Alert */}
        {currentVisit && (
          <div
            className="card"
            style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              marginBottom: '16px',
            }}
          >
            <Text bold style={{ color: '#856404' }}>
              ⚠️ Bạn đang trong lượt thăm
            </Text>
            <Text style={{ color: '#856404', marginTop: '4px' }}>
              {currentVisit.customer?.name}
            </Text>
            <Button
              size="small"
              onClick={() => navigate(`/visit-detail/${currentVisit.visit_target_id}`)}
              style={{ marginTop: '8px' }}
            >
              Tiếp tục thăm
            </Button>
          </div>
        )}

        {/* Filters */}
        <div
          className="card"
          style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}
        >
          <Select
            value={filter.status}
            onChange={(value) => setFilter({ ...filter, status: value as any })}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'incomplete', label: 'Chưa đủ chỉ tiêu' },
              { value: 'complete', label: 'Đã xong' },
            ]}
            style={{ flex: 1 }}
          />

          <Select
            value={filter.sortBy}
            onChange={(value) => setFilter({ ...filter, sortBy: value as any })}
            options={[
              { value: 'deadline', label: 'Sắp hết hạn' },
              { value: 'distance', label: 'Gần tôi nhất' },
            ]}
            style={{ flex: 1 }}
          />
        </div>

        {/* Debug Panel - Hiển thị vị trí hiện tại */}
        {userLocation && (
          <div
            className="card"
            style={{
              marginBottom: '16px',
              background: userLocation.latitude === 16.450744681143224 ? '#fff3cd' : '#f0f9ff',
              border: `1px solid ${userLocation.latitude === 16.450744681143224 ? '#ffc107' : '#0ea5e9'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text bold style={{ color: userLocation.latitude === 16.450744681143224 ? '#856404' : '#0369a1', marginBottom: '8px' }}>
                  📍 Vị trí hiện tại của bạn:
                  {userLocation.latitude === 16.450744681143224 && ' (MOCK)'}
                </Text>
                <Text size="small" style={{ color: userLocation.latitude === 16.450744681143224 ? '#856404' : '#0369a1' }}>
                  Latitude: {userLocation.latitude.toFixed(6)}
                  <br />
                  Longitude: {userLocation.longitude.toFixed(6)}
                </Text>
              </div>
              <button
                onClick={() => loadUserLocation()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginLeft: '8px',
                  opacity: 0.7,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                🔄
              </button>
            </div>
            {userLocation.latitude === 16.450744681143224 && (
              <Text size="xSmall" style={{ color: '#856404', marginTop: '8px' }}>
                ⚠️ Đang sử dụng vị trí giả lập. Mở Console (F12) để xem chi tiết.
              </Text>
            )}
          </div>
        )}

        {/* Visit Targets List */}
        {targets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <Text>Không có khách hàng nào</Text>
          </div>
        ) : (
          targets.map((target) => {
            const status = getStatusBadge(target.actual_visits, target.target_visits);
            const progress = calculateProgress(target.actual_visits, target.target_visits);
            
            // Calculate distance and log it for debugging
            let distance = 0;
            if (userLocation && target.customer?.latitude) {
              distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                target.customer.latitude,
                target.customer.longitude
              );
              console.log(`📏 Khoảng cách đến ${target.customer.name}:`, {
                from: `${userLocation.latitude}, ${userLocation.longitude}`,
                to: `${target.customer.latitude}, ${target.customer.longitude}`,
                distance: `${formatDistance(distance)} (${distance.toFixed(2)}m)`
              });
            }

            return (
              <div
                key={target.id}
                className="card"
                style={{
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => handleCardClick(target)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <Text bold size="large" style={{ 
                      display: 'block',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      color: '#1a1a1a'
                    }}>
                      {target.customer?.name}
                    </Text>
                    <Text size="small" style={{ 
                      display: 'block',
                      color: '#666',
                      lineHeight: '1.5'
                    }}>
                      📍 {formatAddress(target.customer?.address)}
                    </Text>
                    {/* Debug: Hiển thị tọa độ khách hàng */}
                    <Text size="xSmall" style={{ 
                      display: 'block',
                      color: '#999',
                      marginTop: '4px',
                      fontFamily: 'monospace'
                    }}>
                      GPS: {target.customer?.latitude && target.customer?.longitude 
                        ? `${Number(target.customer.latitude).toFixed(6)}, ${Number(target.customer.longitude).toFixed(6)}`
                        : 'N/A'}
                    </Text>
                  </div>
                  <span className={`badge ${status.className}`}>{status.text}</span>
                </div>

                {/* Progress */}
                <div style={{ marginTop: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <Text size="small">Đã thăm</Text>
                    <Text size="small" bold>
                      {target.actual_visits} / {target.target_visits}
                    </Text>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                  }}
                >
                  <Text size="xSmall" style={{ color: '#999' }}>
                    {formatDaysRemaining(target.end_date)}
                  </Text>
                  {userLocation && target.customer?.latitude && (
                    <Text size="xSmall" style={{ color: '#0068ff' }}>
                      📍 {formatDistance(distance)}
                    </Text>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Box>
    </Page>
  );
};

export default VisitPlan;
