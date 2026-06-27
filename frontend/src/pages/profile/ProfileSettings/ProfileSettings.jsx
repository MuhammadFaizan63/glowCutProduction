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
} from 'react-icons/md';
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
  {
    date: 'Jun 2, 2023',
    style: 'Modern Buzz',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBy0eDF3XTeNluL-UIzNVP3wLR8iEpqOf4KQE86y4ElU3YKg7PY4u7gflAzT0Mx3r4C4EaId8RZNRecr9HayQ1eMoYUaC_DHyxJOyTJKsbH3tnIXgd2aTcqo2oSg4PQAw6hCuUczegAvNTI1EP6psW-ZwfjfTghWujMUUgdgdHX-_CoKi--R8652nXRh8zZgka3t2GAXiEjHQDcZ1Thwn5oBPRc-NHmfHXu1tdi3CJ6ds1Hv9f2G3riSYP1Otmv6lEhiT998bw4oMY',
  },
];

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={checked} onChange={onChange} className="sr-only peer" type="checkbox" />
      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
    </label>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile, notifications, toggleNotification } = useContext(UserContext);
  const { logout } = useAuth();
  const [darkMode] = useState(true); // app is dark-mode-only by design

  const handleSignOut = () => {
    logout();
    navigate('/auth/signup');
  };

  return (
    <main className="pt-32 px-margin-mobile md:max-w-4xl md:mx-auto pb-xl">
      {/* Profile Header */}
      <section className="flex flex-col items-center mb-xl">
        <div className="relative mb-md">
          <div className="w-32 h-32 rounded-full border-2 border-secondary p-1 shadow-neon-emerald">
            <img
              className="w-full h-full rounded-full object-cover"
              alt={profile.name}
              src={profile.avatarUrl}
            />
          </div>
          {profile.isGoldMember && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full flex items-center gap-xs shadow-lg whitespace-nowrap">
              <MdWorkspacePremium className="text-[16px]" />
              <span className="font-label-md text-label-md">
                Membership Status: {profile.tier}
              </span>
            </div>
          )}
        </div>
        <h1 className="font-display-lg text-display-lg mb-xs">{profile.name}</h1>
        <p className="text-on-surface-variant font-body-md">Elite Member since Jan 2023</p>
      </section>

      {/* Hair History */}
      <section className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-md text-headline-md font-sora">My Hair History</h2>
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
          <button
            onClick={() => toast('Upload coming soon!')}
            className="flex-shrink-0 w-40 glass-card rounded-xl h-48 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="text-center p-md">
              <MdAddAPhoto className="text-primary mb-xs text-2xl mx-auto" />
              <p className="text-caption text-on-surface-variant">Add new story</p>
            </div>
          </button>
        </div>
      </section>

      {/* Settings List */}
      <section className="space-y-md mb-xl">
        {/* Linked Accounts */}
        <div className="glass-card rounded-xl p-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-lg">
              🔗
            </div>
            <div>
              <h3 className="font-headline-md font-sora text-[18px]">Linked Accounts</h3>
              <p className="text-caption text-on-surface-variant">
                Connected to {profile.email}
              </p>
            </div>
          </div>
          <ToggleSwitch checked={true} onChange={() => toast('Manage linked accounts')} />
        </div>

        {/* Saved Salons */}
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
              <p className="text-caption text-on-surface-variant">3 favorite locations</p>
            </div>
          </div>
          <MdChevronRight className="text-on-surface-variant" />
        </button>

        {/* Booking History */}
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
              <p className="text-caption text-on-surface-variant">
                Manage your past &amp; upcoming slots
              </p>
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
            <button
              onClick={() => toast('Notification preferences updated below')}
              className="w-full flex items-center justify-between py-xs border-b border-white/5"
            >
              <span className="text-body-md">Push Notifications</span>
              <ToggleSwitch
                checked={notifications.push}
                onChange={() => toggleNotification('push')}
              />
            </button>
            <div className="flex items-center justify-between py-xs border-b border-white/5">
              <span className="text-body-md">Dark Mode</span>
              <div className="flex items-center gap-xs text-secondary">
                <span className="font-label-md text-label-md">{darkMode ? 'On' : 'Off'}</span>
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
      <section className="mt-lg">
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
      </section>
    </main>
  );
}
