import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdContentCut,
  MdPeople,
  MdChat,
  MdLogout
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/shop', icon: <MdDashboard /> },
    { name: 'Service Menu', path: '/admin/services', icon: <MdContentCut /> },
    { name: 'Barbers / Staff', path: '/admin/barbers', icon: <MdPeople /> },
    { name: 'Booking Manage', path: '/admin/booking', icon: <MdPeople /> },
  ];

  return (
    <aside className="w-64 h-screen bg-surface border-r border-primary/10 flex flex-col justify-between p-4 fixed left-0 top-0">
      <div className="space-y-8">
        <div className="flex items-center gap-2 px-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full" />
            <div className="absolute inset-0 border border-primary/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
          <span className="text-xl font-black tracking-wider text-on-surface">
            GLOW<span className="text-primary">CUT</span>
          </span>
          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase font-bold">
            Admin
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-warm'
                    : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all active:scale-95"
      >
        <MdLogout className="text-lg" />
        Logout
      </button>
    </aside>
  );
}
