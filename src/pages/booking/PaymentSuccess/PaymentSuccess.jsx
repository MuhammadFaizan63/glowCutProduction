import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdDownload, MdHome } from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { booking, totalPrice, resetBooking } = useBooking();

  const invoiceNumber = `GC-${Math.floor(9000 + Math.random() * 999)}`;
  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const lineItems = booking.services.length
    ? booking.services
    : [{ id: 'svc-default', name: 'Signature Service', price: totalPrice || 2000 }];

  const grandTotal = totalPrice || lineItems.reduce((sum, s) => sum + (s.price || 0), 0);

  const handleDownload = () => {
    toast.success('Receipt downloaded (simulated)');
  };

  const handleBackHome = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-margin-mobile text-on-surface antialiased">
      {/* Success Feedback */}
      <div className="flex flex-col items-center mb-lg">
        <div className="relative mb-md">
          <div className="w-24 h-24 rounded-full bg-secondary-container/20 flex items-center justify-center shadow-neon-emerald border border-secondary/30">
            <MdCheckCircle className="text-secondary text-[48px]" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-secondary/10 opacity-30" />
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface text-center">
          Payment Successful
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant/80 mt-xs">
          Your transformation is confirmed.
        </p>
      </div>

      {/* Digital Invoice Card */}
      <main className="w-full max-w-md glass-card rounded-xl overflow-hidden relative mb-xl">
        <div className="p-md space-y-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mb-xs block">
                Invoice
              </span>
              <p className="font-headline-md text-headline-md text-on-surface">#{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-body-md text-body-md text-on-surface-variant">{dateLabel}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{timeLabel}</p>
            </div>
          </div>

          <div className="space-y-sm pt-sm border-t border-white/5">
            {lineItems.map((item) => (
              <div className="flex justify-between items-center" key={item.id}>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.name}</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {item.price.toLocaleString()} PKR
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-md">
            <p className="font-headline-md text-headline-md text-on-surface-variant">Total Amount</p>
            <p className="font-headline-md text-headline-md text-secondary font-bold">
              {grandTotal.toLocaleString()} PKR
            </p>
          </div>
        </div>

        {/* Perforated Tear-off */}
        <div className="relative h-6 flex items-center">
          <div className="absolute left-[-12px] w-6 h-6 rounded-full bg-background" />
          <div className="w-full tear-off-line h-[1px]" />
          <div className="absolute right-[-12px] w-6 h-6 rounded-full bg-background" />
        </div>

        {/* Verification Section */}
        <div className="p-md bg-white/5 flex flex-col items-center">
          <div className="p-base bg-white rounded-lg mb-sm">
            <img
              alt="Verification QR Code"
              className="w-24 h-24"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsJtQQXKIb5BNsaP8oMmWBPUKior9Rh67rr2uGdxAuOi6rmuhID6U8PEH4-xr0OGSNGQlyvcX_LJn_ocviiJSRNXRDFuSBNh0w0XvSxPlt74dNyfXl2YJyul4F-WQLQUyWSwXn8HXOYZWmeQbjKqzDqCw_d6MF_GYtPgo5aKHY43fZeAjElDrn9SA-ru05veyq-8xfHQW77L09MrQw-xXZrFqfrCbdlXW0Cpx3Nf3Wls33X-LBDxhgyuWJc_8Bj65w58HB34_Pkg0"
            />
          </div>
          <p className="font-caption text-caption text-on-surface-variant tracking-wider uppercase">
            Scan for verification
          </p>
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="w-full max-w-md flex flex-col gap-md">
        <button
          onClick={handleDownload}
          className="w-full h-14 bg-primary-container text-on-primary-fixed font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-sm active:scale-95 transition-all shadow-neon-orange"
        >
          <MdDownload />
          Download PDF Receipt
        </button>
        <button
          onClick={handleBackHome}
          className="w-full h-14 border border-secondary/40 text-secondary font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-sm active:scale-95 transition-all hover:bg-secondary/5"
        >
          <MdHome />
          Back to Home
        </button>
      </footer>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
