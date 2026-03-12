import { atom } from 'recoil';

export interface User {
  id: string | number;
  name: string;
  avatar?: string;
  phone?: string;
}

export interface Customer {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
}

export interface VisitTarget {
  id: number;
  customer_id: number;
  start_date: string;
  end_date: string;
  target_visits: number;
  actual_visits: number;
  customer: Customer;
}

export interface Visit {
  id: number;
  visit_target_id: number;
  customer_id: number;
  checkin_time: string;
  checkout_time?: string;
  checkin_latitude: number;
  checkin_longitude: number;
  checkout_latitude?: number;
  checkout_longitude?: number;
  notes?: string;
  photos?: string[];
  photos_count?: number;
  status: 'in_progress' | 'completed';
  customer?: Customer;
}

export interface FilterState {
  status: 'all' | 'incomplete' | 'complete';
  sortBy: 'deadline' | 'distance';
}

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const currentVisitState = atom<Visit | null>({
  key: 'currentVisitState',
  default: null,
});

export const visitTargetsState = atom<VisitTarget[]>({
  key: 'visitTargetsState',
  default: [],
});

export const visitHistoryState = atom<Visit[]>({
  key: 'visitHistoryState',
  default: [],
});

export const filterState = atom<FilterState>({
  key: 'filterState',
  default: {
    status: 'all',
    sortBy: 'deadline',
  },
});
