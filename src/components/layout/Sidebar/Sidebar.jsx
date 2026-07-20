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
    <aside className="w-64 h-screen bg-slate-900 border-r border-white/5 flex flex-col justify-between p-4 fixed left-0 top-0">
      <div className="space-y-8">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl font-black tracking-wider text-white">
            GLOW<span className="text-orange-500">CUT</span>
          </span>
          <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase font-bold">
            Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95"
      >
        <MdLogout className="text-lg" />
        Logout
      </button>
    </aside>
  );
}