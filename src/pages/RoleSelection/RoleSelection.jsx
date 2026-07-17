import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdStorefront } from 'react-icons/md';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'customer') {
      // Normal Customer dashboard ya home pe bhejdo
      navigate('/dashboard');
    } else if (role === 'shopkeeper') {
      // Salon setup form par redirect karein
      navigate('/setup-salon');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-extrabold tracking-wider text-primary mb-2 shadow-neon-orange-sm">
          GLOWCUT
        </h1>
        <p className="text-outline text-sm uppercase tracking-widest">Select Your Experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl z-10">
        
        {/* Customer Box */}
        <button
          onClick={() => handleRoleSelect('customer')}
          className="glass-card p-8 rounded-2xl border border-white/5 hover:border-primary-container/30 group text-left transition-all duration-300 hover:-translate-y-1"
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
          onClick={() => handleRoleSelect('shopkeeper')}
          className="glass-card p-8 rounded-2xl border border-white/5 hover:border-primary-container/30 group text-left transition-all duration-300 hover:-translate-y-1"
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