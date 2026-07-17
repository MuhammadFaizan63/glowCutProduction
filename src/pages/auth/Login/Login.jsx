import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth'; // Context hook ko sahi use karne ke liye

export default function Login() {
  const navigate = useNavigate();
  
  // 1️⃣ Apne useAuth hook se actual state/login functions nikalein
  // Agar aapke useAuth me setToken ya user state update karne ka function hai, to use extract karein
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
      const response = await fetch('https://glow-cut-product-complete-backend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.identifier.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2️⃣ Token ko save karna (Dono key names ke sath safe side rehne ke liye)
        const tokenToSave = data.accessToken || data.token;
        if (tokenToSave) {
          localStorage.setItem('token', tokenToSave);
          localStorage.setItem('accessToken', tokenToSave);
        }

        // 3️⃣ Global Auth State Update karna (CRITICAL FIX)
        // Agar aapke useAuth hook me custom login/setToken function hai, to use call karein:
        if (auth && typeof auth.setToken === 'function') {
          auth.setToken(tokenToSave);
        } else if (auth && typeof auth.login === 'function') {
          // Agar apka custom login function login(user, token) accept karta hai:
          auth.login(data.user, tokenToSave);
        }

        toast.success(data.message || 'Welcome back!');
        
        // 4️⃣ Forcefully Redirect to UI (Home/Dashboard)
        // Kuch cases me React Router state lost kar deta hai, isliye window trigger ya direct push safe hota hai
        navigate('/'); 
        
      } else {
        // Unverified User Handling
        if (response.status === 401 || data.message?.toLowerCase().includes('not verified')) {
          toast.error('Email not verified. Redirecting to verification page...');
          setTimeout(() => {
            navigate('/auth/verify-otp', { state: { email: form.identifier.trim() } });
          }, 1500);
        } else {
          toast.error(data.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Something went wrong. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    if (auth && typeof auth.loginAsGuest === 'function') {
      auth.loginAsGuest();
    }
    toast('Browsing as guest — booking is disabled', { icon: '👀' });
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      {/* Brand mark */}
      <div className="mb-xl text-center relative z-10">
        <div className="flex items-center justify-center gap-base mb-sm">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary-container rounded-full shadow-neon-orange" />
            <div className="w-3 h-3 bg-secondary rounded-full shadow-neon-emerald" />
          </div>
          <span className="font-display-lg text-headline-lg font-bold text-primary-container tracking-tighter">
            GlowCut
          </span>
        </div>
        <p className="text-on-surface-variant font-body-md">
          Pakistan's premium grooming platform
        </p>
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-margin-mobile"
      >
        <div className="glass-panel rounded-2xl p-lg border-white/10 shadow-2xl">
          <h2 className="font-headline-lg text-headline-lg text-white mb-xs">Welcome back</h2>
          <p className="text-on-surface-variant font-body-md mb-xl">
            Sign in to access your bookings and rewards.
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
            className="w-full py-sm text-center text-secondary font-label-md hover:underline decoration-secondary/30 underline-offset-4 transition-all"
          >
            Continue as Guest →
          </button>

          <p className="mt-lg text-center text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-primary-container font-bold hover:text-primary transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>

      <p className="relative z-10 mt-lg text-caption text-on-surface-variant/60 text-center px-margin-mobile">
        © 2026 GlowCut Cyber-Chic Salons. All rights reserved.
      </p>
    </div>
  );
}