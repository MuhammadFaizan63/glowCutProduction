import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import { useAuth } from '../../../hooks/useAuth';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationOtp } = useAuth();

  // Email passed in from the Signup page (registration already triggered
  // the first OTP email server-side, so we don't need to re-send on load).
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please register first to get your OTP.');
      navigate('/auth/signup');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length < 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }

    setSubmitting(true);

    try {
      const res = await verifyEmail({ email, otp: otpString });
      toast.success(res.message || 'Email verified successfully!');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error?.message || 'Invalid OTP code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    const toastId = toast.loading('Sending new OTP code...');

    try {
      const res = await resendVerificationOtp({ email });
      toast.success(res.message || 'A fresh OTP has been sent to your email!', { id: toastId });
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (error) {
      toast.error(error?.message || 'Failed to resend OTP.', { id: toastId });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl w-full max-w-6xl items-center">
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

            <Button type="submit" variant="primary" size="full" loading={submitting} disabled={submitting}>
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
