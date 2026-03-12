import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import VisitPlan from '../pages/VisitPlan';
import VisitDetail from '../pages/VisitDetail';
import VisitHistory from '../pages/VisitHistory';
import Profile from '../pages/Profile';
import Login from '../pages/Login';

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="app-container">
            <div className="app-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/visit-plan" element={<VisitPlan />} />
                <Route path="/visit-detail/:id" element={<VisitDetail />} />
                <Route path="/visit-history" element={<VisitHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <BottomNavigation />
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppContent;
