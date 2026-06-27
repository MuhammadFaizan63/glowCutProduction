import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth
import Signup from '../pages/auth/Signup';

// Home
import Home from '../pages/home/Home';

// Salons
import NearbySalons from '../pages/salons/NearbySalons';
import SalonDetail from '../pages/salons/SalonDetail';
import StyleGallery from '../pages/salons/StyleGallery';

// Booking
import ConfirmBooking from '../pages/booking/ConfirmBooking';
import BookingSummary from '../pages/booking/BookingSummary';
import WaitingLounge from '../pages/booking/WaitingLounge';
import LiveTracking from '../pages/booking/LiveTracking';
import PaymentSuccess from '../pages/booking/PaymentSuccess';

// AI
import AIStyleConsultant from '../pages/ai/AIStyleConsultant';
import ARVirtualMirror from '../pages/ai/ARVirtualMirror';

// Rewards
import GlowRewards from '../pages/rewards/GlowRewards';
import InviteAndEarn from '../pages/rewards/InviteAndEarn';
import GoldSubscription from '../pages/rewards/GoldSubscription';

// Support
import LiveChat from '../pages/support/LiveChat';
import HelpSupport from '../pages/support/HelpSupport';
import Updates from '../pages/support/Updates';

// Profile
import ProfileSettings from '../pages/profile/ProfileSettings';
import Feedback from '../pages/profile/Feedback';
import PrivacyCenter from '../pages/profile/PrivacyCenter';

// Admin
import ShopkeeperDashboard from '../pages/admin/ShopkeeperDashboard';
import GlobalDashboard from '../pages/admin/GlobalDashboard';

// Misc
import NotFound from '../pages/NotFound';

/**
 * AppRoutes
 *
 * Route tree organized by layout:
 *  - AuthLayout  -> /auth/*               (no header/footer/bottom-nav chrome)
 *  - UserLayout  -> everything client-facing (header + footer + mobile nav)
 *  - AdminLayout -> /admin/*              (sidebar + localized admin header)
 *  - ARVirtualMirror renders its own full-screen immersive chrome, so it is
 *    deliberately NOT nested inside UserLayout (it would duplicate nav bars).
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------------- Auth ---------------- */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/signup" element={<Signup />} />
      </Route>

      {/* ---------------- Standalone (own chrome) ---------------- */}
      <Route path="/ai/ar-mirror" element={<ARVirtualMirror />} />

      {/* ---------------- User-facing app ---------------- */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />

        {/* Salons */}
        <Route path="/salons/nearby" element={<NearbySalons />} />
        <Route path="/salons/:id" element={<SalonDetail />} />
        <Route path="/salons/style-gallery" element={<StyleGallery />} />

        {/* Booking */}
        <Route path="/booking/confirm" element={<ConfirmBooking />} />
        <Route path="/booking/summary" element={<BookingSummary />} />
        <Route path="/booking/waiting-lounge" element={<WaitingLounge />} />
        <Route path="/booking/live-tracking" element={<LiveTracking />} />
        <Route path="/booking/payment-success" element={<PaymentSuccess />} />

        {/* AI */}
        <Route path="/ai/style-consultant" element={<AIStyleConsultant />} />

        {/* Rewards */}
        <Route path="/rewards/glow" element={<GlowRewards />} />
        <Route path="/rewards/invite" element={<InviteAndEarn />} />
        <Route path="/rewards/gold" element={<GoldSubscription />} />

        {/* Support */}
        <Route path="/support/chat" element={<LiveChat />} />
        <Route path="/support/help" element={<HelpSupport />} />
        <Route path="/support/updates" element={<Updates />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/profile/feedback" element={<Feedback />} />
        <Route path="/profile/privacy" element={<PrivacyCenter />} />
      </Route>

      {/* ---------------- Admin ---------------- */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/shop" element={<ShopkeeperDashboard />} />
        <Route path="/admin/global" element={<GlobalDashboard />} />
      </Route>

      {/* ---------------- Fallbacks ---------------- */}
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
