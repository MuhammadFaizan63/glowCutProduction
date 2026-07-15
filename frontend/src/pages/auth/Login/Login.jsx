import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdPhone, MdLock, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth(); // custom hook se login ko hata diya kyunki hum directly yahan call kar rahe hain

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) e.identifier = 'Email is required';
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
          email: form.identifier, // API jo email expect kar rahi hai
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Token save karna (agar backend token return kar raha hai)
        if (data.token) {
          localStorage.setItem('token', data.token);
        } else if (data.data?.token) {
          localStorage.setItem('token', data.data.token);
        }
        
        toast.success(data.message || 'Welcome back!');
        navigate('/');
      } else {
        // Backend se aane wala error message dikhane ke liye
        toast.error(data.message || 'Invalid credentials — try again');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Something went wrong. Please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
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
              icon={MdPhone}
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
        © 2024 GlowCut Cyber-Chic Salons. All rights reserved.
      </p>
    </div>
  );
}