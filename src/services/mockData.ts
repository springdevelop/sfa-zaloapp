import { VisitTarget, Visit } from '../state/atoms';

// Mock data for development without backend
export const mockDashboardStats = {
  currentPeriod: {
    start_date: "2026-02-01",
    end_date: "2026-02-28"
  },
  totalVisits: 23,
  targetVisits: 100,
  customersCovered: 12,
  totalCustomers: 30,
  todayVisits: 3,
  weekVisits: 8,
  pendingCustomers: 18
};

export const mockVisitTargets: VisitTarget[] = [
  {
    id: 1,
    customer_id: 10,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    target_visits: 4,
    actual_visits: 2,
    customer: {
      id: 10,
      name: "Quán Cafe ABC",
      address: "Đà Nẵng, Việt Nam",
      latitude: 16.450744681143224,
      longitude: 107.5854334289142,
      phone: "0901234567"
    }
  },
  {
    id: 2,
    customer_id: 11,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    target_visits: 3,
    actual_visits: 0,
    customer: {
      id: 11,
      name: "Nhà Hàng XYZ",
      address: "456 Lê Lợi, Q.1, TP.HCM",
      latitude: 10.7750,
      longitude: 106.7020,
      phone: "0909876543"
    }
  },
  {
    id: 3,
    customer_id: 12,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    target_visits: 4,
    actual_visits: 4,
    customer: {
      id: 12,
      name: "Siêu Thị Mini 123",
      address: "789 Võ Văn Tần, Q.3, TP.HCM",
      latitude: 10.7780,
      longitude: 106.6950,
      phone: "0912345678"
    }
  },
  {
    id: 4,
    customer_id: 13,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    target_visits: 2,
    actual_visits: 1,
    customer: {
      id: 13,
      name: "Cửa Hàng Tạp Hóa DEF",
      address: "321 Pasteur, Q.1, TP.HCM",
      latitude: 10.7790,
      longitude: 106.6980,
      phone: "0898765432"
    }
  },
  {
    id: 5,
    customer_id: 14,
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    target_visits: 3,
    actual_visits: 0,
    customer: {
      id: 14,
      name: "Phở Hòa Pasteur",
      address: "159 Pasteur, Q.3, TP.HCM",
      latitude: 10.7800,
      longitude: 106.6930,
      phone: "0987654321"
    }
  }
];

export const mockVisitHistory: Visit[] = [
  {
    id: 100,
    visit_target_id: 1,
    customer_id: 10,
    checkin_time: "2026-02-05T09:00:00Z",
    checkout_time: "2026-02-05T09:30:00Z",
    checkin_latitude: 16.450744681143224,
    checkin_longitude: 107.5854334289142,
    checkout_latitude: 16.450744681143224,
    checkout_longitude: 107.5854334289142,
    notes: "Khách hàng đặt thêm 10 thùng sản phẩm A",
    photos_count: 3,
    status: 'completed',
    customer: {
      id: 10,
      name: "Quán Cafe ABC",
      address: "Đà Nẵng, Việt Nam",
      latitude: 16.450744681143224,
      longitude: 107.5854334289142,
      phone: "0901234567"
    }
  },
  {
    id: 99,
    visit_target_id: 1,
    customer_id: 10,
    checkin_time: "2026-02-03T14:00:00Z",
    checkout_time: "2026-02-03T14:25:00Z",
    checkin_latitude: 16.450744681143224,
    checkin_longitude: 107.5854334289142,
    checkout_latitude: 16.450744681143224,
    checkout_longitude: 107.5854334289142,
    notes: "Giới thiệu sản phẩm mới",
    photos_count: 2,
    status: 'completed',
    customer: {
      id: 10,
      name: "Quán Cafe ABC",
      address: "Đà Nẵng, Việt Nam",
      latitude: 16.450744681143224,
      longitude: 107.5854334289142,
      phone: "0901234567"
    }
  },
  {
    id: 98,
    visit_target_id: 4,
    customer_id: 13,
    checkin_time: "2026-02-01T10:30:00Z",
    checkout_time: "2026-02-01T11:00:00Z",
    checkin_latitude: 10.7790,
    checkin_longitude: 106.6980,
    checkout_latitude: 10.7790,
    checkout_longitude: 106.6980,
    notes: "Thu tiền đơn hàng tháng trước",
    photos_count: 1,
    status: 'completed',
    customer: {
      id: 13,
      name: "Cửa Hàng Tạp Hóa DEF",
      address: "321 Pasteur, Q.1, TP.HCM",
      latitude: 10.7790,
      longitude: 106.6980,
      phone: "0898765432"
    }
  }
];

export const mockCurrentVisit: Visit | null = null;
