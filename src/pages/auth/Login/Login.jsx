import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdArrowForward, MdContentCut, MdStar, MdSmartToy } from 'react-icons/md';
import toast from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/apiClient';

const BENEFITS = [
  { icon: MdContentCut, text: 'Access premium grooming services' },
  { icon: MdStar, text: 'Earn & redeem GlowRewards points' },
  { icon: MdSmartToy, text: 'AI-powered style consultations' },
];

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) {
      e.identifier = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)) {
      e.identifier = 'Please enter a valid email address';
    }
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await auth.login({
        email: form.identifier.trim(),
        password: form.password,
      });
      toast.success(res.message || 'Welcome back!');

      const userRole = res.user?.role;

      if (userRole === 'admin' || userRole === 'owner') {
        try {
          const { data: salonData } = await apiClient.get('/salons/my');
          const hasSalon = Boolean(salonData?.success && salonData?.data);
          if (hasSalon) {
            navigate(userRole === 'admin' ? '/admin/shop' : '/admin/shop');
          } else {
            navigate('/setup-salon');
          }
        } catch (salonErr) {
          navigate('/setup-salon');
        }
      } else if (userRole === 'user' || userRole === 'customer') {
        navigate('/');
      } else {
        navigate('/role-selection');
      }
    } catch (error) {
      const message = error?.message || 'Invalid credentials';
      if (message.toLowerCase().includes('not verified')) {
        toast.error('Email not verified. Redirecting to verification page...');
        setTimeout(() => {
          navigate('/auth/verify-otp', { state: { email: form.identifier.trim() } });
        }, 1500);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    auth.loginAsGuest();
    toast('Browsing as guest — booking is disabled', { icon: '👀' });
    navigate('/');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl w-full max-w-6xl items-center">
      {/* Left: Brand & Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center md:items-start justify-center space-y-lg"
      >
        <div className="flex items-center gap-base mb-md">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl" />
            <div className="absolute inset-0 border-2 border-primary/40 rounded-2xl" />
            <div className="w-4 h-4 bg-primary rounded-full shadow-warm" />
          </div>
          <span className="font-display-lg text-headline-lg font-bold text-primary tracking-tight">
            GlowCut
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Welcome back to <span className="text-primary">premium</span> grooming
        </h2>
        <p className="font-body-md text-on-surface-variant max-w-sm">
          Sign in to continue your journey with Pakistan's premium grooming platform.
        </p>
        <div className="space-y-md mt-md">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.text} className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon className="text-primary text-lg" />
                </div>
                <span className="text-on-surface-variant font-body-md">{b.text}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Right: Login Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="w-full max-w-md p-lg rounded-2xl bg-surface-container/80 backdrop-blur-2xl border border-primary/20 shadow-soft">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Sign in</h2>
          <p className="text-on-surface-variant font-body-md mb-xl">
            Access your bookings and rewards.
          </p>

          <form onSubmit={handleLogin} className="space-y-md">
            <Input
              name="identifier"
              label="Email"
              placeholder="name@email.com"
              icon={MdEmail}
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              error={errors.identifier}
              variant="filled"
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Your password"
              icon={MdLock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              variant="filled"
            />
            <Button
              type="submit"
              variant="primary"
              size="full"
              loading={submitting}
              disabled={submitting}
              icon={MdArrowForward}
              iconPosition="right"
            >
              Login
            </Button>
          </form>

          <div className="flex items-center my-lg gap-base">
            <div className="h-px flex-grow bg-white/10" />
            <span className="text-caption text-on-surface-variant">OR</span>
            <div className="h-px flex-grow bg-white/10" />
          </div>

          <button
            onClick={handleGuest}
            className="w-full py-sm text-center text-primary font-label-md hover:underline decoration-primary/30 underline-offset-4 transition-all"
          >
            Continue as Guest →
          </button>

          <p className="mt-lg text-center text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-primary font-bold hover:text-primary-fixed transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
