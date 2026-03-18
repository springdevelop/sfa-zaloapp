import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { currentVisitState } from '../state/atoms';
import { currentVisitService } from '../services/currentVisitService';
import { authService } from '../services/authService';
import BottomNavigation from './BottomNavigation';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import VisitPlan from '../pages/VisitPlan';
import VisitDetail from '../pages/VisitDetail';
import VisitHistory from '../pages/VisitHistory';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Policy from '../pages/Policy';

const AppContent: React.FC = () => {
  const setCurrentVisit = useSetRecoilState(currentVisitState);

  useEffect(() => {
    // Load current visit when app starts (only if authenticated)
    loadCurrentVisitOnStartup();
  }, []);

  const loadCurrentVisitOnStartup = async () => {
    try {
      // Check if user is authenticated first
      const isAuth = await authService.isAuthenticated();
      if (!isAuth) {
        console.log('ℹ️ User not authenticated, skipping visit check');
        return;
      }

      console.log('🚀 App startup: Checking for ongoing visit...');
      const visit = await currentVisitService.getCurrentVisit();
      if (visit) {
        console.log('✅ Found ongoing visit on startup:', visit.id);
        setCurrentVisit(visit);
      } else {
        console.log('ℹ️ No ongoing visit found on startup');
      }
    } catch (error: any) {
      // Only log error if it's not an authentication error
      if (error?.response?.status !== 401) {
        console.error('❌ Error loading current visit on startup:', error);
      }
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/policy" element={<Policy />} />
      
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
