import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdPsychology,
  MdSpeed,
  MdSell,
  MdLocalBar,
  MdLock,
  MdCreditCard,
  MdAccountBalanceWallet,
  MdContactless,
  MdArrowForward,
} from 'react-icons/md';

const BENEFITS = [
  {
    icon: MdPsychology,
    title: 'Unlimited AI Style Analysis',
    description: 'Harness generative vision to find the perfect cut for your unique face shape, every single time.',
  },
  {
    icon: MdSpeed,
    title: 'Priority Booking',
    description: 'Skip the waiting lounge queue with instant-access slots reserved exclusively for Gold members.',
  },
  {
    icon: MdSell,
    title: 'Member-Only Discounts',
    description: 'Enjoy 25% off all premium grooming products and curated skincare collections.',
  },
  {
    icon: MdLocalBar,
    title: 'Ad-Free Entertainment',
    description: 'Relax in our digital lounge with premium streaming and news without any interruptions.',
  },
];

const MONTHLY_PRICE = 29;
const YEARLY_DISCOUNT = 0.2;

export default function GoldSubscription() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  const isYearly = billingCycle === 'yearly';
  const displayPrice = isYearly
    ? Math.round(MONTHLY_PRICE * (1 - YEARLY_DISCOUNT))
    : MONTHLY_PRICE;

  const handleJoin = () => {
    toast.success(`Welcome to GlowCut Gold (${isYearly ? 'Yearly' : 'Monthly'})!`);
    navigate('/profile');
  };

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop text-center mb-24 pt-12">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
          <span className="material-symbols-outlined text-[80px] text-primary relative z-10 drop-shadow-[0_0_15px_rgba(242,202,80,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>
            crown
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[72px] text-primary mb-6 max-w-4xl mx-auto">
          Upgrade to Gold: The Ultimate Grooming Experience
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Step into a world of exclusive privilege, cutting-edge AI styling, and uncompromising
          luxury designed for the modern gentleman.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="glass-card p-8 rounded-xl flex flex-col items-start gap-4 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="text-primary text-[28px]" />
                </div>
                <h3 className="font-headline-md text-on-surface text-lg">{b.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{b.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing & Action */}
      <section className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] -z-10 rounded-full" />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <span
            className={`font-label-md text-label-md ${
              !isYearly ? 'text-on-surface' : 'text-on-surface-variant'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(isYearly ? 'monthly' : 'yearly')}
            className="w-14 h-8 rounded-full bg-surface-container-highest relative flex items-center p-1 cursor-pointer"
          >
            <div
              className={`absolute w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary-container transition-all ${
                isYearly ? 'right-1' : 'left-1'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`font-label-md text-label-md ${isYearly ? 'text-primary' : 'text-on-surface-variant'}`}>
              Yearly
            </span>
            <span className="bg-secondary/20 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              20% OFF
            </span>
          </div>
        </div>

        {/* Main CTA */}
        <div className="max-w-2xl mx-auto glass-card p-12 rounded-2xl relative overflow-hidden">
          <div className="mb-8">
            <span className="font-body-md text-body-md text-on-surface-variant block mb-2">
              Ultimate Value
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-display-lg font-display-lg text-primary">$</span>
              <span className="text-[72px] font-display-lg text-primary leading-none">
                {displayPrice}
              </span>
              <span className="font-body-lg text-body-lg text-on-surface-variant self-end mb-2">
                / month{isYearly ? ', billed yearly' : ''}
              </span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-10" />

          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-primary to-primary-container py-6 rounded-xl font-display-lg text-headline-md text-on-primary shadow-[0_0_30px_rgba(242,202,80,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mb-8"
          >
            Join GlowCut Gold
            <MdArrowForward />
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MdLock className="text-[18px]" />
              <span className="font-label-md text-label-md uppercase tracking-widest">
                Secure Checkout
              </span>
            </div>
            <div className="flex gap-6 opacity-60">
              <MdCreditCard className="text-[32px]" />
              <MdAccountBalanceWallet className="text-[32px]" />
              <MdContactless className="text-[32px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Anchor */}
      <section className="mt-section-gap max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden glass-card relative">
          <img
            alt="Luxury Grooming Experience"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5dIuvrAM7Zs3lvxKjdwLhK-5XORW9k3DcDxfvaCXL08qdg9H9Cr15lemcGrcs7Ek5b0WAUjXjdcWYeW5YV9lJF4aOSTIVJooURCcx39cTC6tqrWnaRdCBp7neYmFWd-JVG2vC40Ynl74FhLyoj-r-HDHwOjGssvN4WG8qzZ34Mog2jp_cKoDkO7Zdd0sXMsnnlkVhrXILltFPeeq71-eD_SR0S620KR7_hrT7fSZSlGEBhfe5gKeEoDLsLwzgmFDNsLubgXojUtA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div className="max-w-lg">
              <h2 className="font-display-lg text-headline-md text-on-surface mb-2">
                The Gold Standard
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Join over 15,000 members who have redefined their personal style with GlowCut
                Gold's proprietary AI and world-class artisans.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-center backdrop-blur-md">
                <div className="text-primary font-display-lg text-headline-md">4.9/5</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Member Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
