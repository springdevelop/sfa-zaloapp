import React, { useEffect, useState } from 'react';
import { Page, Box, Text, Button, useNavigate } from '../components/UIComponents';
import { visitService } from '../services/visitService';
import { Visit } from '../state/atoms';
import { formatDateTime, formatDuration, calculateDuration } from '../utils/date';

const VisitHistory: React.FC = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    loadVisitHistory();
  }, [filter]);

  const loadVisitHistory = async () => {
    try {
      setLoading(true);
      const params: { date?: string; period?: string } = {};
      if (filter === 'today') {
        params.date = new Date().toISOString().split('T')[0];
      } else if (filter === 'week') {
        params.period = 'week';
      } else if (filter === 'month') {
        params.period = 'month';
      }
      const data = await visitService.getVisitHistory(params);
      setVisits(data);
    } catch (error) {
      console.error('Error loading visit history:', error);
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
    <Page className="visit-history-page">
      <Box p={4}>
        <div style={{ marginBottom: '20px' }}>
          <Button
            size="small"
            variant="tertiary"
            onClick={() => navigate('/profile')}
            style={{ marginBottom: '12px' }}
          >
            ← Quay lại
          </Button>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            Lịch sử thăm viếng
          </h1>
        </div>

        {/* Filter Tabs */}
        <div
          className="card"
          style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
        >
          <Button
            size="small"
            variant={filter === 'today' ? 'primary' : 'secondary'}
            onClick={() => setFilter('today')}
            style={{ flex: 1 }}
          >
            Hôm nay
          </Button>
          <Button
            size="small"
            variant={filter === 'week' ? 'primary' : 'secondary'}
            onClick={() => setFilter('week')}
            style={{ flex: 1 }}
          >
            Tuần này
          </Button>
          <Button
            size="small"
            variant={filter === 'month' ? 'primary' : 'secondary'}
            onClick={() => setFilter('month')}
            style={{ flex: 1 }}
          >
            Tháng này
          </Button>
        </div>

        {/* Visit List */}
        {visits.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <Text>Chưa có lượt thăm nào</Text>
          </div>
        ) : (
          visits.map((visit) => {
            const duration = visit.checkout_time 
              ? calculateDuration(visit.checkin_time, visit.checkout_time)
              : 0;

            return (
              <div key={visit.id} className="card" style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <Text bold size="large">
                    {visit.customer?.name}
                  </Text>
                  <span className="badge badge-success">✓ Hoàn thành</span>
                </div>

                <Text size="small" style={{ color: '#666', marginBottom: '8px' }}>
                  📍 {visit.customer?.address}
                </Text>

                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e0e0e0',
                  }}
                >
                  <Text size="xSmall" style={{ color: '#999' }}>
                    ⏱ {formatDuration(duration)}
                  </Text>
                  <Text size="xSmall" style={{ color: '#999' }}>
                    📅 {formatDateTime(visit.checkin_time)}
                  </Text>
                  {visit.photos_count && visit.photos_count > 0 && (
                    <Text size="xSmall" style={{ color: '#999' }}>
                      📷 {visit.photos_count} ảnh
                    </Text>
                  )}
                </div>

                {visit.notes && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      background: '#f5f5f5',
                      borderRadius: '4px',
                    }}
                  >
                    <Text size="small">{visit.notes}</Text>
                  </div>
                )}
              </div>
            );
          })
        )}
      </Box>
    </Page>
  );
};

export default VisitHistory;
