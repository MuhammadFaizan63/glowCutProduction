import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMail, MdLock, MdPerson } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import { useAuth } from '../../../hooks/useAuth';

const SLIDES = [
  {
    title: 'Discover Top Salons',
    body: 'Explore exclusive grooming destinations curated for the modern elite.',
  },
  {
    title: 'AI-Powered Styling',
    body: 'Get instant style recommendations tailored to your face and vibe.',
  },
  {
    title: 'Earn GlowRewards',
    body: 'Every visit earns Style Points redeemable for premium perks.',
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginAsGuest, login } = useAuth();

  const [mode, setMode] = useState('choice'); // 'choice' | 'email-form'
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6)
      next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup({ name: form.name, email: form.email, method: 'email' });
      navigate('/');
    } catch {
      // toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await login({ email: 'google.user@gmail.com', password: 'google-oauth' });
      navigate('/');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl w-full max-w-6xl items-center">
      {/* Left: Hologram + Slider */}
      <div className="flex flex-col items-center justify-center space-y-lg">
        <div className="relative w-full aspect-square max-w-md flex items-center justify-center">
          <div className="absolute inset-0 hologram-effect animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="material-symbols-outlined text-[120px] text-primary drop-shadow-[0_0_20px_rgba(255,181,156,0.8)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chair
            </span>
            <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-secondary shadow-[0_0_15px_#66dd8b] opacity-80" />
            <Loader variant="scan" className="mt-md" />
          </div>
        </div>

        <div className="text-center w-full">
          <div className="h-24 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-headline-lg text-headline-lg text-white mb-xs">
                  {SLIDES[slide].title}
                </h2>
                <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
                  {SLIDES[slide].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-sm mt-md">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? 'w-8 bg-primary shadow-[0_0_8px_#ffb59c]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Signup Card */}
      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-md p-lg rounded-xl shadow-2xl flex flex-col">
          <div className="mb-lg">
            <h3 className="font-headline-md text-headline-md text-white mb-xs">
              Welcome to GlowCut
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Elevate your grooming experience with precision and AI-driven style.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'choice' ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-md"
              >
                <Button
                  variant="primary"
                  size="full"
                  loading={googleLoading}
                  onClick={handleGoogleSignup}
                  className="font-sora font-bold"
                >
                  {!googleLoading && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <Button
                  variant="ghost"
                  size="full"
                  icon={MdMail}
                  onClick={() => setMode('email-form')}
                  className="font-sora font-semibold"
                >
                  Sign Up with Email
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="email-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleEmailSubmit}
                className="space-y-md"
              >
                <Input
                  name="name"
                  label="Full Name"
                  placeholder="Ayesha Khan"
                  icon={MdPerson}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                />
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  icon={MdMail}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="At least 6 characters"
                  icon={MdLock}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />
                <Button type="submit" variant="primary" size="full" loading={submitting}>
                  Create Account
                </Button>
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="text-on-surface-variant text-caption font-caption hover:text-white transition-colors w-full text-center"
                >
                  ← Back to options
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-lg flex flex-col items-center gap-md">
            <div className="flex items-center w-full gap-base">
              <div className="h-[1px] flex-grow bg-white/10" />
              <span className="text-caption font-caption text-on-surface-variant">OR</span>
              <div className="h-[1px] flex-grow bg-white/10" />
            </div>
            <button
              onClick={handleGuest}
              className="text-label-md font-label-md text-secondary hover:text-secondary-fixed transition-colors underline-offset-4 hover:underline decoration-secondary/30"
            >
              Continue as Guest
            </button>
          </div>

          <p className="mt-xl text-center text-caption font-caption text-on-tertiary-fixed-variant leading-relaxed">
            By continuing, you agree to GlowCut's <br />
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>{' '}
            &amp;{' '}
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
