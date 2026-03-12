import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: '🏠',
    },
    {
      path: '/visit-plan',
      label: 'Tuyến thăm',
      icon: '📋',
    },
    {
      path: '/profile',
      label: 'Cá nhân',
      icon: '👤',
    },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <a
          key={item.path}
          href="#"
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(item.path);
          }}
        >
          <div className="nav-item-icon">{item.icon}</div>
          <div>{item.label}</div>
        </a>
      ))}
    </div>
  );
};

export default BottomNavigation;
