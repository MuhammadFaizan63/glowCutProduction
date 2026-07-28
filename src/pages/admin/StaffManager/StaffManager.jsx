import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import {
  MdPersonAdd,
  MdDeleteOutline,
  MdStar,
  MdEdit,
  MdClose,
  MdBadge,
} from 'react-icons/md';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import AuthContext from '../../../context/AuthContext';

export default function StaffManager() {
  const { profile } = useContext(AuthContext);
  const salonId = profile?.salon?._id || profile?.salon?.id || localStorage.getItem('salonId') || '';

  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  // Form states strictly matching the Barber Mongoose schema
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
  const [workingDays, setWorkingDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  
  // Image Upload State
  const [profileImageFile, setProfileImageFile] = useState(null);

  const fetchBarbers = async () => {
    if (!salonId) {
      toast.error('No salon linked to this account yet.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/barbers/salon/${salonId}`);
      setBarbers(data.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch barber records.');
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salonId]);

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setGender('Male');
    setExperience(''); setStartTime('09:00'); setEndTime('21:00');
    setSalary(''); setCommission(''); setDescription('');
    setWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    setProfileImageFile(null);
  };

  const handleAddBarber = async (e) => {
    e.preventDefault();
    if (!salonId) return toast.error('No salon linked to this account yet.');
    if (!name || !email || !phone || !startTime || !endTime) {
      toast.error('Please fill all required mandatory fields.');
      return;
    }
    if (workingDays.length === 0) {
      toast.error('Please select at least one working day for the barber schedule.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiClient.post('/barbers', {
        salonId,
        name,
        email,
        phone,
        gender,
        experience: Number(experience) || 0,
        startTime,
        endTime,
        workingDays,
        salary: Number(salary) || 0,
        commission: Number(commission) || 0,
        description: description || undefined,
      });
      if (data.success) {
        // Upload image if provided
        if (profileImageFile) {
          const barberId = data.data._id || data.data.id;
          const formData = new FormData();
          formData.append('profileImage', profileImageFile);
          await apiClient.patch(`/barbers/${barberId}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Barber registered successfully!');
        resetForm();
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBarber = async (e) => {
    e.preventDefault();
    if (!editingBarber) return;
    if (workingDays.length === 0) {
      toast.error('Please select at least one working day for the barber schedule.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiClient.patch(`/barbers/${editingBarber._id}`, {
        name,
        email,
        phone,
        gender,
        experience: Number(experience) || 0,
        startTime,
        endTime,
        workingDays,
        salary: Number(salary) || 0,
        commission: Number(commission) || 0,
        description,
      });
      if (data.success) {
        // Upload image if provided
        if (profileImageFile) {
          const formData = new FormData();
          formData.append('profileImage', profileImageFile);
          await apiClient.patch(`/barbers/${editingBarber._id}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Barber records updated!');
        closeEditMode();
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (id, currentVal) => {
    try {
      const { data } = await apiClient.patch(`/barbers/${id}/availability`, { isAvailable: !currentVal });
      if (data.success) {
        toast.success('Availability updated!');
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const changeDutyStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { data } = await apiClient.patch(`/barbers/${id}/status`, { status: nextStatus });
      if (data.success) {
        toast.success(`Barber set to ${nextStatus}`);
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Status toggling failed.');
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specialist profile?')) return;
    try {
      const { data } = await apiClient.delete(`/barbers/${id}`);
      if (data.success) {
        toast.success('Barber deleted successfully.');
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
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
    setWorkingDays(barber.workingDays && barber.workingDays.length > 0 ? barber.workingDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    setSalary(barber.salary);
    setCommission(barber.commission);
    setDescription(barber.description || '');
    setProfileImageFile(null); // Reset file picker state when opening edit mode
  };

  const closeEditMode = () => {
    setEditingBarber(null);
    resetForm();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 text-white md:ml-64">
      <div>
        <h2 className="text-2xl font-bold tracking-wide">Barbers Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Manage the specialists working at your salon — schedules, pay, and live availability.</p>
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
                <label className="text-slate-400 block mb-1 font-medium">Profile Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setProfileImageFile(e.target.files[0])}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-white focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 cursor-pointer"
                  />
                  {editingBarber && editingBarber.profileImage && !profileImageFile && (
                    <img src={editingBarber.profileImage} alt="Current" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  )}
                </div>
              </div>

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

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Working Days *</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center gap-1.5 bg-white/5 px-2 py-1.5 rounded border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                      <input 
                        type="checkbox"
                        className="accent-orange-500"
                        checked={workingDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWorkingDays([...workingDays, day]);
                          } else {
                            setWorkingDays(workingDays.filter(d => d !== day));
                          }
                        }}
                      />
                      <span className="text-[10px]">{day.slice(0,3)}</span>
                    </label>
                  ))}
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
                <label className="text-slate-400 block mb-1 font-medium">Bio Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" placeholder="Brief expert review..." className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${editingBarber ? 'bg-amber-500 text-slate-950' : 'bg-orange-500 text-white'}`}
              >
                {submitting && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
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
              <div className="col-span-full">
                <EmptyState
                  icon={MdBadge}
                  title="No barbers on staff yet"
                  description="Register your first specialist using the form on the left to start accepting bookings."
                />
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
                    <button onClick={() => toggleAvailability(barber._id, barber.isAvailable)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${barber.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {barber.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <button onClick={() => changeDutyStatus(barber._id, barber.status)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${barber.status === 'active' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                      {barber.status === 'active' ? 'Active Duty' : 'Inactive'}
                    </button>
                    <span className="text-[10px] text-amber-400 font-bold ml-auto flex items-center gap-0.5"><MdStar /> {barber.rating ?? 0}</span>
                  </div>

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
