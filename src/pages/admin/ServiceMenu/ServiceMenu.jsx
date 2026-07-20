import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  MdContentCut, 
  MdAttachMoney, 
  MdAccessTime, 
  MdDeleteOutline, 
  MdEdit,
  MdAdd,
  MdClose
} from 'react-icons/md';

const BASE_URL = 'https://glow-cut-product-complete-backend.vercel.app/api/services';

export default function ServiceMenu() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Edit Mode State
  const [editingService, setEditingService] = useState(null);

  // Form States (Both Create & Edit)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  // Local storage se salonId get karne ke liye helper (ya token decode)
  const getSalonId = () => {
    return localStorage.getItem('salonId') || ''; 
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 1. Fetch Services (Using GET /api/services/salons/:id/services)
  const fetchSalonServices = async () => {
    const salonId = getSalonId();
    if (!salonId) {
      toast.error("Salon reference missing. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/salons/${salonId}/services`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch services.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonServices();
  }, []);

  // 2. Create Service (POST /api/services)
  const handleAddService = async (e) => {
    e.preventDefault();
    const salonId = getSalonId();

    if (!name.trim() || !price || !duration) {
      toast.error("Name, Price, and Duration are required.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          salon: salonId,
          name: name.trim(),
          price: Number(price),
          duration: Number(duration),
          description: description.trim() || undefined
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Service added successfully!");
        setName('');
        setPrice('');
        setDuration('');
        setDescription('');
        fetchSalonServices();
      } else {
        toast.error(data.message || "Failed to add service.");
      }
    } catch (err) {
      toast.error("Error connecting to backend.");
    }
  };

  // 3. Update Service (PUT /api/services/service/:id)
  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch(`${BASE_URL}/service/${editingService._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          duration: Number(duration),
          description: description.trim() || ""
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Service updated successfully!");
        closeEditMode();
        fetchSalonServices();
      } else {
        toast.error(data.message || "Failed to update service.");
      }
    } catch (err) {
      toast.error("Error updating configuration.");
    }
  };

  // 4. Delete Service (DELETE /api/services/service/:id)
  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service permanently?")) return;

    try {
      const res = await fetch(`${BASE_URL}/service/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Service deleted successfully.");
        fetchSalonServices();
      } else {
        toast.error(data.message || "Could not complete deletion.");
      }
    } catch (err) {
      toast.error("Error communicating with server.");
    }
  };

  // Helper to trigger edit form values
  const startEditMode = (service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price);
    setDuration(service.duration);
    setDescription(service.description || '');
  };

  const closeEditMode = () => {
    setEditingService(null);
    setName('');
    setPrice('');
    setDuration('');
    setDescription('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-white ml-64">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-wide">Service Catalog Management</h2>
        <p className="text-xs text-slate-400 mt-1">Direct sync with Mongo Dynamic Service schemas for absolute mapping control.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Contextual Form (Add / Edit state) */}
        <section className="lg:col-span-4">
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5 space-y-4 sticky top-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-wider uppercase text-orange-400 flex items-center gap-1.5">
                {editingService ? <><MdEdit /> Edit Service</> : <><MdAdd /> Add New Service</>}
              </h3>
              {editingService && (
                <button onClick={closeEditMode} className="text-slate-400 hover:text-white transition-colors">
                  <MdClose className="text-base" />
                </button>
              )}
            </div>
            
            <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">Service Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Skin Fade & Lineup" 
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-medium">Price ($) *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2.5 text-slate-500"><MdAttachMoney /></span>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="30" 
                      className="w-full bg-white/5 border border-white/5 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-medium">Duration (Mins) *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2.5 text-slate-500"><MdAccessTime /></span>
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="45" 
                      className="w-full bg-white/5 border border-white/5 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-medium">Description (Optional)</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Outline the detailed parameters of the styling method..." 
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>

              <button 
                type="submit" 
                className={`w-full font-bold py-2.5 rounded-lg transition-all active:scale-[0.98] ${
                  editingService 
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                }`}
              >
                {editingService ? 'Update Configuration' : 'Save Service Configuration'}
              </button>
            </form>
          </div>
        </section>

        {/* Right Section: Active Service Grid Layout (8 Columns) */}
        <section className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(n => <div key={n} className="h-32 bg-white/5 animate-pulse rounded-xl border border-white/5" />)
            ) : services.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 bg-white/5 rounded-xl border border-white/5 text-xs">
                No active service models found for this shop profile yet.
              </div>
            ) : (
              services.map((service) => (
                <div key={service._id} className="p-4 bg-slate-800/20 border border-white/5 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span className="text-orange-500 text-base"><MdContentCut /></span> {service.name}
                      </h4>
                      {!service.isActive && (
                        <span className="text-[10px] bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full font-semibold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {service.description || 'No descriptive summary custom mapped to this entry.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5 text-xs">
                    <div className="flex gap-3 text-slate-300">
                      <span className="flex items-center gap-0.5 font-bold text-orange-400">
                        <MdAttachMoney />{service.price}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MdAccessTime className="text-[14px]" /> {service.duration}m
                      </span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => startEditMode(service)}
                        className="text-slate-400 hover:text-amber-400 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        title="Edit setup"
                      >
                        <MdEdit className="text-base" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service._id)}
                        className="text-slate-400 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove service model"
                      >
                        <MdDeleteOutline className="text-base" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}