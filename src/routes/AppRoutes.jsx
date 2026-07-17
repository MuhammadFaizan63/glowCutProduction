import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Guard
import AuthGuard from '../components/auth/AuthGuard';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import VerifyOtp from '../pages/auth/VerifyOtp/VerifyOtp';

// Home
import Home from '../pages/home/Home';

// Salons
import NearbySalons from '../pages/salons/NearbySalons';
import SalonDetail from '../pages/salons/SalonDetail';
import StyleGallery from '../pages/salons/StyleGallery';

// New split pages
import Services from '../pages/services/Services';
import Stylists from '../pages/stylists/Stylists';

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
 * Gate logic:
 *  - null (unauthenticated) → /auth/login (AuthGuard redirects)
 *  - 'guest' → full browse access, booking actions blocked at component level
 *  - 'authenticated' → unrestricted access
 *
 * ARVirtualMirror renders its own full-screen chrome → outside UserLayout.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Auth (no guard needed) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/setup-salon" element={<SalonSetup />} />
      </Route>



      {/* ── Standalone immersive (own chrome) ── */}
      <Route
        path="/ai/ar-mirror"
        element={
          <AuthGuard>
            <ARVirtualMirror />
          </AuthGuard>
        }
      />

      {/* ── All guarded user-facing routes ── */}
      <Route
        element={
          <AuthGuard>
            <UserLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Home />} />

        {/* Salons */}
        <Route path="/salons/nearby" element={<NearbySalons />} />
        <Route path="/salons/:id" element={<SalonDetail />} />
        <Route path="/salons/style-gallery" element={<StyleGallery />} />

        {/* Split Service & Stylist pages */}
        <Route path="/services" element={<Services />} />
        <Route path="/stylists" element={<Stylists />} />

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

      {/* ── Admin ── */}
      <Route
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route path="/admin/shop" element={<ShopkeeperDashboard />} />
        <Route path="/admin/global" element={<GlobalDashboard />} />
      </Route>

      {/* ── Fallbacks / legacy redirects ── */}
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
