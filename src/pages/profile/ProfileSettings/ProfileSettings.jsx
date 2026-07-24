import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdWorkspacePremium,
  MdAddAPhoto,
  MdFavorite,
  MdCalendarMonth,
  MdSettings,
  MdChevronRight,
  MdDarkMode,
  MdLogout,
  MdSave,
  MdEdit,
  MdErrorOutline,
} from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { useAuth } from '../../../hooks/useAuth';
import * as bookingService from '../../../services/bookingService';
import EmptyState from '../../../components/ui/EmptyState';

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Hyderabad',
  'Sialkot',
  'Gujranwala',
];

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={checked} onChange={onChange} className="sr-only peer" type="checkbox" />
      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
    </label>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile, updateProfile, updateProfileImage } = useContext(AuthContext);
  const { notifications, toggleNotification } = useContext(UserContext);
  const { logout } = useAuth();

  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    userName: '',
    phone: '',
    cities: 'Karachi',
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Backend Sync
  useEffect(() => {
    if (profile && !editing) {
      setForm({
        name: profile.name || profile.userName || '',
        userName: profile.userName || profile.name || '',
        phone: profile.phone || profile.PhoneNumber || '',
        cities: profile.cities || 'Karachi',
      });
      setErrorMessage('');
    }
  }, [profile, editing]);

  // Real booking history — replaces the old hardcoded "Hair History" mock.
  useEffect(() => {
    if (!profile?.id) {
      setLoadingHistory(false);
      return;
    }
    let isMounted = true;
    setLoadingHistory(true);
    bookingService
      .getMyBookings(profile.id, { limit: 6, status: 'completed' })
      .then((list) => {
        if (isMounted) setBookingHistory(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (isMounted) setBookingHistory([]);
      })
      .finally(() => {
        if (isMounted) setLoadingHistory(false);
      });
    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  const setField = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errorMessage) setErrorMessage(''); // Clear error on typing
  };

  // Profile Save Handler with Error Notification & Display
  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');

    try {
      // Backend updateProfile validator aur controller ke mutabiq keys
      const payload = {
        name: form.name.trim(),
        userName: form.userName.trim(),
        phone: form.phone.trim(),
        PhoneNumber: form.phone.trim(),
        cities: form.cities,
      };

      await updateProfile(payload);

      setEditing(false);
      toast.success('Profile Updated Successfully!', {
        style: {
          background: 'rgba(26, 26, 26, 0.95)',
          color: '#66DD8B',
          border: '1px solid rgba(102, 221, 139, 0.3)',
          borderRadius: '12px',
        },
        iconTheme: { primary: '#66DD8B', secondary: '#1A1A1A' },
      });
    } catch (error) {
      const backendError = error?.message || 'Failed to update profile. Please try again.';

      setErrorMessage(backendError);

      // UI Popup Alert (Red Styling)
      toast.error(backendError, {
        style: {
          background: 'rgba(30, 10, 10, 0.95)',
          color: '#FF6B6B',
          border: '1px solid rgba(255, 107, 107, 0.4)',
          borderRadius: '12px',
        },
        iconTheme: { primary: '#FF6B6B', secondary: '#1A1A1A' },
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Image Upload Handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage('');

    try {
      await updateProfileImage(file);
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <main className="pt-32 px-margin-mobile md:max-w-4xl md:mx-auto pb-xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Header */}
      <section className="flex flex-col items-center mb-xl">
        <div className="relative mb-md group">
          <div className="w-32 h-32 rounded-full border-2 border-secondary p-1 shadow-neon-emerald relative">
            <img
              className="w-full h-full rounded-full object-cover"
              alt={profile?.name || 'User Profile'}
              src={profile?.profileImage || 'https://via.placeholder.com/150'}
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary-container shadow-neon-orange flex items-center justify-center border-2 border-background hover:scale-110 transition-transform disabled:opacity-50"
          >
            <MdAddAPhoto className="text-on-primary text-base" />
          </button>
          {profile?.role === 'owner' || profile?.role === 'admin' ? (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full flex items-center gap-xs shadow-lg whitespace-nowrap">
              <MdWorkspacePremium className="text-[16px]" />
              <span className="font-label-md text-label-md capitalize">{profile.role}</span>
            </div>
          ) : null}
        </div>

        <h1 className="font-display-lg text-display-lg mb-xs mt-6">
          {profile?.name || profile?.userName || 'GlowCut User'}
        </h1>
        <p className="text-on-surface-variant font-body-md">{profile?.email}</p>
      </section>

      {/* Personal Info Form */}
      <section className="glass-panel rounded-xl p-lg mb-xl">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-headline-md text-headline-md">Personal Information</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-xs text-primary-container font-label-md hover:underline"
            >
              <MdEdit className="text-base" /> Edit
            </button>
          )}
        </div>

        {/* Dynamic Error Box on UI */}
        {errorMessage && (
          <div className="mb-md p-md bg-error/10 border border-error/40 rounded-xl flex items-center gap-sm text-error animate-fade-in">
            <MdErrorOutline className="text-xl flex-shrink-0" />
            <p className="font-body-md text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Full Name */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={setField('name')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            ) : (
              <p className="font-body-md text-white">{profile?.name || profile?.userName || 'N/A'}</p>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Username</label>
            {editing ? (
              <input
                value={form.userName}
                onChange={setField('userName')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            ) : (
              <p className="font-body-md text-white">@{profile?.userName || 'username'}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
            {editing ? (
              <input
                value={form.phone}
                onChange={setField('phone')}
                placeholder="+923000000000"
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            ) : (
              <p className="font-body-md text-white">{profile?.phone || profile?.PhoneNumber || 'N/A'}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
            <p className="font-body-md text-on-surface-variant italic">{profile?.email}</p>
          </div>

          {/* City */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="font-label-md text-label-md text-on-surface-variant">City</label>
            {editing ? (
              <select
                value={form.cities}
                onChange={setField('cities')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-surface text-black">
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-body-md text-white">{profile?.cities || 'Karachi'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex gap-sm mt-lg">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-sm px-xl py-md bg-secondary text-on-secondary rounded-xl font-bold font-label-md shadow-neon-emerald active:scale-95 transition-all disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdSave />
              )}
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setErrorMessage('');
              }}
              className="px-xl py-md glass-panel rounded-xl font-label-md text-on-surface-variant hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Booking History (real data, replaces the old mocked "Hair History") */}
      <section className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-md text-headline-md">My Booking History</h2>
          <button type="button" onClick={() => navigate('/booking/summary')} className="text-primary font-label-md text-label-md">
            View All
          </button>
        </div>
        {loadingHistory ? (
          <div className="flex gap-md overflow-x-auto pb-md">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-shrink-0 w-40 h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : bookingHistory.length === 0 ? (
          <EmptyState
            icon={MdCalendarMonth}
            title="No past bookings yet"
            description="Once you complete a visit at a GlowCut salon, it will show up here."
          />
        ) : (
          <div className="flex gap-md overflow-x-auto pb-md [&::-webkit-scrollbar]:hidden">
            {bookingHistory.map((item) => (
              <div className="flex-shrink-0 w-40" key={item._id}>
                <div className="glass-card rounded-xl h-48 mb-xs group cursor-pointer overflow-hidden flex items-center justify-center bg-surface-container">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt={item.serviceId?.name || 'Booking'}
                    src={item.salonId?.coverImage || item.salonId?.logo || 'https://via.placeholder.com/300x400?text=GlowCut'}
                  />
                </div>
                <p className="font-label-md text-label-md text-on-surface">
                  {new Date(item.bookingDate).toLocaleDateString()}
                </p>
                <p className="text-caption text-on-surface-variant">
                  {item.serviceId?.name || 'Service'} @ {item.salonId?.name || 'Salon'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Settings List */}
      <section className="space-y-md mb-xl">
        <button
          type="button"
          onClick={() => navigate('/salons/nearby')}
          className="w-full glass-card rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <MdFavorite />
            </div>
            <div className="text-left">
              <h3 className="font-headline-md font-sora text-[18px]">Saved Salons</h3>
              <p className="text-caption text-on-surface-variant">3 favourite locations</p>
            </div>
          </div>
          <MdChevronRight className="text-on-surface-variant" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/booking/summary')}
          className="w-full glass-card rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <MdCalendarMonth />
            </div>
            <div className="text-left">
              <h3 className="font-headline-md font-sora text-[18px]">Booking History</h3>
              <p className="text-caption text-on-surface-variant">Past &amp; upcoming slots</p>
            </div>
          </div>
          <MdChevronRight className="text-on-surface-variant" />
        </button>

        {/* App Settings */}
        <div className="glass-card rounded-xl p-md space-y-md">
          <div className="flex items-center gap-md mb-xs">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <MdSettings />
            </div>
            <h3 className="font-headline-md font-sora text-[18px]">App Settings</h3>
          </div>
          <div className="pl-xl space-y-md">
            <div className="flex items-center justify-between py-xs border-b border-white/5">
              <span className="text-body-md">Push Notifications</span>
              <ToggleSwitch
                checked={notifications.push}
                onChange={() => toggleNotification('push')}
              />
            </div>
            <div className="flex items-center justify-between py-xs border-b border-white/5">
              <span className="text-body-md">Dark Mode</span>
              <div className="flex items-center gap-xs text-secondary">
                <span className="font-label-md text-label-md">Always On</span>
                <MdDarkMode />
              </div>
            </div>
            <div className="flex items-center justify-between py-xs">
              <span className="text-body-md">Marketing Emails</span>
              <ToggleSwitch
                checked={notifications.marketing}
                onChange={() => toggleNotification('marketing')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <button
        type="button"
        onClick={handleSignOut}
        className="w-full py-md rounded-xl glass-card border border-error/20 text-error flex items-center justify-center gap-sm hover:bg-error/10 transition-all active:scale-[0.98]"
      >
        <MdLogout />
        <span className="font-sora font-bold">Sign Out</span>
      </button>
    </main>
  );
}