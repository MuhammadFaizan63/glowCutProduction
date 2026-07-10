import React, { useContext, useState } from 'react';
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
} from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { useAuth } from '../../../hooks/useAuth';

const HAIR_HISTORY = [
  {
    date: 'Oct 12, 2023',
    style: 'Cyber-Fade Elite',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCN-iJjhj7GIep3vIBfGSAA6ZTt4SOZjVz2Dd_95557DHPdG_ZEGBR25VEVmlE3rNIxXue6FOBDl7Tw2D6CTvNbIea8GExwXqNUNzqhY220tnhkogoevYk0qUmZe1YWjrumFYpX0u-9BA010iMQpEkIIqpdiBavUNN_HO26DPq3h1w977ggHMeYBm--ogLuxUPvpIQUkH9TNmMcTYtVH-ZE1PN35VWk6bnIQGhAxUDd6fmw54kXkVOmJ8B190RMZ5bxyMWtwx0S0bc',
  },
  {
    date: 'Aug 24, 2023',
    style: 'Classic Taper',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUWFMMufOTHeFb6s4cdrwDZEHfSyJZEnLyMkcOeTMZYoNrpO9eO3VIh_I1QmjKE-xqcRxQ4i6vjtKapdpumTYYfaCUjB-DcH_an5HlU1Z06cLYQYQwb8i4pPZphoiX0QxUC4qXmag_B4Q02c8KWuntXVveflKkbSne4B1ofWR4CPzf7YO2HpF7OnIbyjF7j8NJpfQ7yL4R6GkgTQx7yEsGiAyL9zpIncrNOSdR6xy9QSAB7edghykm6_CyWTq0sXr_9PxO4-8SPJ8',
  },
];

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Peshawar', 'Multan'];

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
  const { profile, updateProfile } = useContext(AuthContext);
  const { notifications, toggleNotification } = useContext(UserContext);
  const { logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    avatar: profile?.avatar || '',
    city: profile?.city || 'Karachi',
  });
  const [saving, setSaving] = useState(false);

  // Sync form if profile changes from outside
  React.useEffect(() => {
    if (!editing) {
      setForm({
        name: profile?.name || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        avatar: profile?.avatar || '',
        city: profile?.city || 'Karachi',
      });
    }
  }, [profile, editing]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    updateProfile({
      name: form.name,
      phone: form.phone,
      avatar: form.avatar,
      city: form.city,
    });
    setEditing(false);
    setSaving(false);
    toast.success('Profile Updated Successfully!', {
      style: {
        background: 'rgba(26, 26, 26, 0.95)',
        color: '#66DD8B',
        border: '1px solid rgba(102, 221, 139, 0.3)',
        borderRadius: '12px',
      },
      iconTheme: { primary: '#66DD8B', secondary: '#1A1A1A' },
    });
  };

  const handleSignOut = () => {
    logout();
    navigate('/auth/login');
  };

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="pt-32 px-margin-mobile md:max-w-4xl md:mx-auto pb-xl">
      {/* Profile Header */}
      <section className="flex flex-col items-center mb-xl">
        <div className="relative mb-md group">
          <div className="w-32 h-32 rounded-full border-2 border-secondary p-1 shadow-neon-emerald">
            <img
              className="w-full h-full rounded-full object-cover"
              alt={form.name}
              src={form.avatar || profile?.avatar}
            />
          </div>
          <button
            onClick={() => setEditing(true)}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary-container shadow-neon-orange flex items-center justify-center border-2 border-background hover:scale-110 transition-transform"
          >
            <MdAddAPhoto className="text-on-primary text-base" />
          </button>
          {profile?.isGoldMember && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full flex items-center gap-xs shadow-lg whitespace-nowrap">
              <MdWorkspacePremium className="text-[16px]" />
              <span className="font-label-md text-label-md">Gold Member</span>
            </div>
          )}
        </div>

        <h1 className="font-display-lg text-display-lg mb-xs mt-6">{profile?.name}</h1>
        <p className="text-on-surface-variant font-body-md">{profile?.email}</p>
      </section>

      {/* Editable Profile Form */}
      <section className="glass-panel rounded-xl p-lg mb-xl">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-headline-md text-headline-md">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-xs text-primary-container font-label-md hover:underline"
            >
              <MdEdit className="text-base" /> Edit
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Name */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={setField('name')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            ) : (
              <p className="font-body-md text-white">{profile?.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
            {editing ? (
              <input
                value={form.phone}
                onChange={setField('phone')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            ) : (
              <p className="font-body-md text-white">{profile?.phone}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
            <p className="font-body-md text-on-surface-variant italic">{profile?.email}</p>
          </div>

          {/* City */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant">City</label>
            {editing ? (
              <select
                value={form.city}
                onChange={setField('city')}
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-surface">{c}</option>
                ))}
              </select>
            ) : (
              <p className="font-body-md text-white">{profile?.city || 'Karachi'}</p>
            )}
          </div>

          {/* Avatar URL */}
          {editing && (
            <div className="flex flex-col gap-xs md:col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Profile Picture URL
              </label>
              <input
                value={form.avatar}
                onChange={setField('avatar')}
                placeholder="https://example.com/photo.jpg"
                className="bg-white/5 border border-primary-container/50 rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container"
              />
            </div>
          )}
        </div>

        {editing && (
          <div className="flex gap-sm mt-lg">
            <button
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
              onClick={() => { setEditing(false); }}
              className="px-xl py-md glass-panel rounded-xl font-label-md text-on-surface-variant hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Hair History */}
      <section className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-md text-headline-md">My Hair History</h2>
          <button className="text-primary font-label-md text-label-md">View All</button>
        </div>
        <div className="flex gap-md overflow-x-auto pb-md [&::-webkit-scrollbar]:hidden">
          {HAIR_HISTORY.map((item) => (
            <div className="flex-shrink-0 w-40" key={item.date}>
              <div className="glass-card rounded-xl h-48 mb-xs group cursor-pointer overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  alt={item.style}
                  src={item.image}
                />
              </div>
              <p className="font-label-md text-label-md text-on-surface">{item.date}</p>
              <p className="text-caption text-on-surface-variant">{item.style}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings List */}
      <section className="space-y-md mb-xl">
        <button
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
              <ToggleSwitch checked={notifications.push} onChange={() => toggleNotification('push')} />
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
              <ToggleSwitch checked={notifications.marketing} onChange={() => toggleNotification('marketing')} />
            </div>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full py-md rounded-xl glass-card border border-error/20 text-error flex items-center justify-center gap-sm hover:bg-error/10 transition-all active:scale-[0.98]"
      >
        <MdLogout />
        <span className="font-sora font-bold">Sign Out</span>
      </button>
      <p className="text-center mt-xl text-caption text-on-tertiary-fixed-variant">
        © 2024 GlowCut Cyber-Chic Salon. All rights reserved.
      </p>
    </main>
  );
}
