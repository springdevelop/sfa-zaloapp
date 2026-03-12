import api, { USE_MOCK_DATA } from './api';
import { mockVisitTargets, mockVisitHistory } from './mockData';
import { VisitTarget, Visit } from '../state/atoms';

interface CheckInData {
  visit_target_id: number;
  customer_id: number;
  checkin_latitude: number;
  checkin_longitude: number;
}

interface CheckOutData {
  checkout_latitude: number;
  checkout_longitude: number;
  photos: string[];
  notes?: string;
}

export const visitService = {
  // Get visit targets list
  getVisitTargets: async (): Promise<VisitTarget[]> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockVisitTargets), 300);
      });
    }
    try {
      console.log('📋 Fetching visit targets from API...');
      const response = await api.get('/visit-targets');
      console.log('✅ Visit targets response:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching visit targets:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      throw error;
    }
  },

  // Get visit target detail
  getVisitTargetDetail: async (id: string | number): Promise<VisitTarget> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        const target = mockVisitTargets.find(t => t.id === parseInt(id.toString()));
        if (target) {
          setTimeout(() => resolve(target), 300);
        } else {
          reject(new Error('Visit target not found'));
        }
      });
    }
    return api.get(`/visit-targets/${id}`);
  },

  // Check-in
  checkIn: async (data: CheckInData): Promise<Visit> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => {
          const target = mockVisitTargets.find(t => t.id === data.visit_target_id);
          const newVisit: Visit = {
            id: Date.now(),
            visit_target_id: data.visit_target_id,
            customer_id: data.customer_id,
            checkin_time: new Date().toISOString(),
            checkin_latitude: data.checkin_latitude,
            checkin_longitude: data.checkin_longitude,
            status: 'in_progress',
            customer: target?.customer,
          };
          
          // Add to visit history
          mockVisitHistory.unshift(newVisit);
          console.log(`✅ Created new visit ${newVisit.id} for target ${data.visit_target_id}`);
          
          resolve(newVisit);
        }, 500);
      });
    }
    return api.post('/visits/check-in', data);
  },

  // Check-out
  checkOut: async (visitId: number, data: CheckOutData): Promise<Visit> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => {
          // Find the visit target and update actual_visits
          const visit = mockVisitHistory.find(v => v.id === visitId);
          if (visit && visit.visit_target_id) {
            const target = mockVisitTargets.find(t => t.id === visit.visit_target_id);
            if (target) {
              target.actual_visits += 1;
              console.log(`✅ Updated actual_visits for target ${target.id}: ${target.actual_visits}`);
            }
          }
          
          // Update the visit with checkout data
          const updatedVisit: Visit = {
            id: visitId,
            visit_target_id: visit?.visit_target_id || 0,
            customer_id: visit?.customer_id || 0,
            checkin_time: visit?.checkin_time || '',
            checkin_latitude: visit?.checkin_latitude || 0,
            checkin_longitude: visit?.checkin_longitude || 0,
            checkout_time: new Date().toISOString(),
            checkout_latitude: data.checkout_latitude,
            checkout_longitude: data.checkout_longitude,
            notes: data.notes,
            photos: data.photos,
            photos_count: data.photos?.length || 0,
            status: 'completed',
            customer: visit?.customer,
          };
          
          // Add to history if not already there
          const existingIndex = mockVisitHistory.findIndex(v => v.id === visitId);
          if (existingIndex >= 0) {
            mockVisitHistory[existingIndex] = updatedVisit;
          } else {
            mockVisitHistory.unshift(updatedVisit);
          }
          
          resolve(updatedVisit);
        }, 500);
      });
    }
    return api.post(`/visits/${visitId}/check-out`, data);
  },

  // Get visit history
  getVisitHistory: async (params?: { date?: string; period?: string }): Promise<Visit[]> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockVisitHistory), 300);
      });
    }
    return api.get('/visits/history', { params });
  },
};
