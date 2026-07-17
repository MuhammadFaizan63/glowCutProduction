import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';

// 🌐 Updated backend URL
const BASE_URL = 'https://glow-cut-product-complete-backend.vercel.app/api/auth';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Signup page se pass kiya gaya email
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const hasRequestedInitialOtp = useRef(false); // Double calling se bachne ke liye ref

  // 1️⃣ Protection & Auto-Send on Load
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please register first to get your OTP.');
      navigate('/auth/signup');
      return;
    }

    // React 18 StrictMode double-trigger se bachne ke liye check aur Auto-Send trigger
    if (!hasRequestedInitialOtp.current) {
      hasRequestedInitialOtp.current = true;
      triggerInitialOtp();
    }
  }, [email, navigate]);

  // Initial land hone par OTP send karne wala function
  const triggerInitialOtp = async () => {
    setResending(true);
    try {
      // Backend ke forgot-password endpoint ko use karke verification code verify page load par trigger karna
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Verification OTP code sent to your email!');
      }
    } catch (error) {
      console.error('Initial OTP Send Error:', error);
    } finally {
      setResending(false);
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Agle box me auto-focus
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace par pichle box me focus
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  // 2️⃣ Verify OTP API Hit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length < 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Email verified successfully!');
        navigate('/auth/login');
      } else {
        toast.error(data.message || 'Invalid OTP code. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      toast.error('Network error. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3️⃣ Resend Code API Hit (Manual)
  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    const toastId = toast.loading('Sending new OTP code...');

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'A fresh OTP has been sent to your email!', { id: toastId });
        setOtp(['', '', '', '', '', '']); // OTP fields clear
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      } else {
        toast.error(data.message || 'Failed to resend OTP.', { id: toastId });
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      toast.error('Could not connect to the server. Try again.', { id: toastId });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl w-full max-w-6xl items-center">
      {/* Left side: Holographic Theme Visual */}
      <div className="flex flex-col items-center justify-center space-y-lg">
        <div className="relative w-full aspect-square max-w-md flex items-center justify-center">
          <div className="absolute inset-0 hologram-effect animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="material-symbols-outlined text-[120px] text-primary drop-shadow-[0_0_20px_rgba(255,181,156,0.8)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
            <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-secondary shadow-[0_0_15px_#66dd8b] opacity-80" />
            <Loader variant="scan" className="mt-md" />
          </div>
        </div>
        <div className="text-center w-full">
          <h2 className="font-headline-lg text-headline-lg text-white mb-xs">
            Secure Verification
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
            We have sent a 6-digit verification code to your registered email address.
          </p>
        </div>
      </div>

      {/* Right side: Verification Card */}
      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-md p-lg rounded-xl shadow-2xl flex flex-col">
          <div className="mb-lg">
            <h3 className="font-headline-md text-headline-md text-white mb-xs">
              Verify Your Email
            </h3>
            <p className="font-body-md text-on-surface-variant break-all">
              Enter the OTP code sent to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="flex justify-between gap-xs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-white/5 border border-white/10 rounded-lg text-center text-white text-xl font-bold font-sora focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" size="full" loading={submitting}>
              Verify &amp; Activate Account
            </Button>
          </form>

          <div className="mt-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              Didn't get the code?{' '}
              <button 
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-primary-container font-bold hover:text-primary transition-colors underline underline-offset-4 disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </p>
            <p className="mt-md">
              <Link to="/auth/signup" className="text-caption font-caption text-outline hover:text-white transition-colors">
                ← Back to Registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}