import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdStorefront } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (clientChoice) => {
    if (loading) return;

    // 1️⃣ Backend Model Enum ke sath sync kiya: 
    // 'customer' ko 'user' banaya aur 'shopkeeper' ko 'admin' taake backend models reject na karein.
    const backendValidRole = clientChoice === 'customer' ? 'user' : 'admin';

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // 2️⃣ URL ko aapke router mapping ke mutabiq set kiya hai.
      // (Agar server.js/app.js mein main prefix '/api/users' hai to yahan users kar dein, warna auth)
      const res = await fetch(`https://glow-cut-product-complete-backend.vercel.app/api/auth/update-role`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: backendValidRole })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Role synchronized to ${backendValidRole} successfully!`);
        
        // 3️⃣ Token update logic jo aapke controller se generate ho kar aa raha hai
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }

        // Frontend routing based on successful authorization
        if (backendValidRole === 'user') {
          navigate('/');
        } else if (backendValidRole === 'admin') {
          navigate('/setup-salon');
        }
      } else {
        toast.error(data.message || "Failed to sync role with server matrix.");
      }
    } catch (err) {
      console.error("Role Sync Error:", err);
      toast.error("Network issue, please check database connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-extrabold tracking-wider text-primary mb-2 shadow-neon-orange-sm">
          GLOWCUT
        </h1>
        <p className="text-outline text-sm uppercase tracking-widest">
          {loading ? "Re-structuring Profile Grid..." : "Select Your Experience"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl z-10">
        
        {/* Customer Box */}
        <button
          disabled={loading}
          onClick={() => handleRoleSelect('customer')}
          className={`glass-card p-8 rounded-2xl border border-white/5 text-left transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-container/30 group hover:-translate-y-1'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 group-hover:bg-primary-container/20 group-hover:text-primary-container transition-colors">
            <MdPerson className="text-2xl text-outline group-hover:text-primary-container" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            I'm a Customer
          </h3>
          <p className="text-sm text-outline">
            Discover elite barbers, book instant premium haircuts, and manage your appointments.
          </p>
        </button>

        {/* Shopkeeper / Salon Owner Box */}
        <button
          disabled={loading}
          onClick={() => handleRoleSelect('shopkeeper')}
          className={`glass-card p-8 rounded-2xl border border-white/5 text-left transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-container/30 group hover:-translate-y-1'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 group-hover:bg-primary-container/20 group-hover:text-primary-container transition-colors">
            <MdStorefront className="text-2xl text-outline group-hover:text-primary-container" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            I'm a Salon Owner
          </h3>
          <p className="text-sm text-outline">
            Register your shop, manage your dynamic staff schedule, set service prices, and track live earnings.
          </p>
        </button>

      </div>
    </div>
  );
}