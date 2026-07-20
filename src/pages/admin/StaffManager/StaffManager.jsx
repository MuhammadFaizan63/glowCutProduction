import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  MdPeople, 
  MdPersonAdd, 
  MdDeleteOutline, 
  MdStar, 
  MdEdit, 
  MdClose,
  MdToggleOn,
  MdToggleOff,
  MdAttachMoney
} from 'react-icons/md';

const BASE_URL = 'https://glow-cut-product-complete-backend.vercel.app';

export default function StaffManager() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBarber, setEditingBarber] = useState(null);

  // Form States strictly matching Mongoose schema
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [experience, setExperience] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');
  const [salary, setSalary] = useState('');
  const [commission, setCommission] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const getSalonId = () => localStorage.getItem('salonId') || '';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 1. Fetch Barbers for current active Salon
  const fetchBarbers = async () => {
    const salonId = getSalonId();
    if (!salonId) {
      toast.error("Salon reference missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/barbers/salon/${salonId}`);
      const data = await res.json();
      if (data.success) {
        setBarbers(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to fetch barber records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  // 2. Register new Barber profile
  const handleAddBarber = async (e) => {
    e.preventDefault();
    const salonId = getSalonId();

    if (!name || !email || !phone || !startTime || !endTime) {
      toast.error("Please fill all required mandatory fields.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/barbers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          salonId,
          name,
          email,
          phone,
          gender,
          experience: Number(experience) || 0,
          startTime,
          endTime,
          salary: Number(salary) || 0,
          commission: Number(commission) || 0,
          description: description || undefined,
          profileImage: profileImage || undefined
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Barber registered successfully!");
        resetForm();
        fetchBarbers();
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("API communications breakdown.");
    }
  };

  // 3. Update Existing Details (PUT)
  const handleUpdateBarber = async (e) => {
    e.preventDefault();
    if (!editingBarber) return;

    try {
      const res = await fetch(`${BASE_URL}/api/barbers/${editingBarber._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          email,
          phone,
          gender,
          experience: Number(experience) || 0,
          startTime,
          endTime,
          salary: Number(salary) || 0,
          commission: Number(commission) || 0,
          description,
          profileImage
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Barber records updated!");
        closeEditMode();
        fetchBarbers();
      } else {
        toast.error(data.message || "Update execution rejected.");
      }
    } catch (err) {
      toast.error("Server synchronization mismatch.");
    }
  };

  // 4. Toggle Availability Live (PATCH)
  const toggleAvailability = async (id, currentVal) => {
    try {
      const res = await fetch(`${BASE_URL}/api/barbers/${id}/availability`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable: !currentVal })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Availability updated!");
        fetchBarbers();
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // 5. Toggle Status Duty State (PATCH)
  const changeDutyStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`${BASE_URL}/api/barbers/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Barber set to ${nextStatus}`);
        fetchBarbers();
      }
    } catch (err) {
      toast.error("Status toggling failure.");
    }
  };

  // 6. Delete Barber Entry
  const handleDeleteBarber = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specialist profile?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/barbers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Barber deleted successfully.");
        fetchBarbers();
      }
    } catch (err) {
      toast.error("Network communication failed.");
    }
  };

  const startEditMode = (barber) => {
    setEditingBarber(barber);
    setName(barber.name);
    setEmail(barber.email);
    setPhone(barber.phone);
    setGender(barber.gender);
    setExperience(barber.experience);
    setStartTime(barber.startTime);
    setEndTime(barber.endTime);
    setSalary(barber.salary);
    setCommission(barber.commission);
    setDescription(barber.description || '');
    setProfileImage(barber.profileImage || '');
  };

  const closeEditMode = () => {
    setEditingBarber(null);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setGender('Male');
    setExperience(''); setStartTime('09:00'); setEndTime('21:00');
    setSalary(''); setCommission(''); setDescription(''); setProfileImage('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-white ml-64">
      <div>
        <h2 className="text-2xl font-bold tracking-wide">Barbers Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Direct backend integration mapping with custom salary splits and availability matrices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <section className="lg:col-span-4">
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5 space-y-4 sticky top-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-wider uppercase text-orange-400 flex items-center gap-1.5">
                {editingBarber ? <><MdEdit /> Edit Profile</> : <><MdPersonAdd /> Register Barber</>}
              </h3>
              {editingBarber && (
                <button onClick={closeEditMode} className="text-slate-400 hover:text-white"><MdClose className="text-base" /></button>
              )}
            </div>

            <form onSubmit={editingBarber ? handleUpdateBarber : handleAddBarber} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Barber Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Email Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@glowcut.com" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Phone Number *</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+923001234567" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Gender *</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Experience (Years)</label>
                  <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="3" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Start Time *</label>
                  <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="09:00" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">End Time *</label>
                  <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="21:00" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Base Salary</label>
                  <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="250" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Commission %</label>
                  <input type="number" value={commission} onChange={e => setCommission(e.target.value)} placeholder="10" className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Image URL</label>
                <input type="url" value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50" />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Bio Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" placeholder="Brief expert review..." className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
              </div>

              <button type="submit" className={`w-full font-bold py-2.5 rounded-lg transition-all ${editingBarber ? 'bg-amber-500 text-slate-950' : 'bg-orange-500 text-white'}`}>
                {editingBarber ? 'Update Profile' : 'Register Specialist'}
              </button>
            </form>
          </div>
        </section>

        {/* Dynamic Cards Output Grid */}
        <section className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2].map(n => <div key={n} className="h-36 bg-white/5 animate-pulse rounded-xl" />)
            ) : barbers.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 bg-white/5 rounded-xl border border-white/5 text-xs">
                No active specialist profiles currently mapped to this salon database branch.
              </div>
            ) : (
              barbers.map(barber => (
                <div key={barber._id} className="p-4 bg-slate-800/20 border border-white/5 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors relative">
                  <div className="flex gap-3">
                    <img 
                      src={barber.profileImage || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=150&h=150&fit=crop&q=80'} 
                      alt={barber.name} 
                      className="w-12 h-12 rounded-full object-cover bg-slate-700 flex-shrink-0 border border-white/10"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white">{barber.name}</h4>
                      <p className="text-[10px] text-slate-400">{barber.email} • {barber.phone}</p>
                      <p className="text-[10px] text-orange-400 font-semibold">{barber.gender} • {barber.experience} Yrs Exp • Shift: {barber.startTime} - {barber.endTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 items-center">
                    {/* Live Availability Switch */}
                    <button onClick={() => toggleAvailability(barber._id, barber.isAvailable)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${barber.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {barber.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    {/* Live Duty Status Switch */}
                    <button onClick={() => changeDutyStatus(barber._id, barber.status)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${barber.status === 'active' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                      {barber.status === 'active' ? 'Active Duty' : 'Inactive'}
                    </button>
                    <span className="text-[10px] text-amber-400 font-bold ml-auto flex items-center gap-0.5"><MdStar /> {barber.rating}</span>
                  </div>

                  {/* Operational Settings Button Bars */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button onClick={() => startEditMode(barber)} className="text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"><MdEdit className="text-sm" /></button>
                    <button onClick={() => handleDeleteBarber(barber._id)} className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"><MdDeleteOutline className="text-sm" /></button>
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