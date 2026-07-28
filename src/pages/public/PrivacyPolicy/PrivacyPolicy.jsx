import React from 'react';
import { MdPrivacyTip, MdShield } from 'react-icons/md';

export default function PrivacyPolicy() {
  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto font-body-md text-on-surface">
      <header className="mb-xl text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center mx-auto mb-6 border border-secondary shadow-neon-emerald">
          <MdPrivacyTip className="text-3xl text-secondary" />
        </div>
        <h1 className="font-display-lg text-display-lg text-white mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant font-label-md">Last Updated: July 28, 2026</p>
      </header>

      <article className="glass-panel p-lg md:p-xl rounded-2xl space-y-lg border-t-4 border-secondary">
        <section>
          <h2 className="font-headline-lg text-headline-lg text-white flex items-center gap-2 mb-4">
            <MdShield className="text-secondary" /> 1. Information We Collect
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            At Glow Cut, we prioritize the protection of your personal data. We collect information you provide directly to us when you create an account, book a service, or communicate with us. This includes your name, email address, phone number, payment details, and any stylistic preferences or appointment history you choose to save in your profile.
          </p>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-white mb-4">2. How We Use Your Data</h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
            <li>Process and manage your salon bookings and transactions.</li>
            <li>Provide personalized styling recommendations via our AI Consultant.</li>
            <li>Communicate with you regarding updates, promotions, and scheduling changes.</li>
            <li>Improve the functionality and security of the Glow Cut platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-white mb-4">3. Data Sharing & Security</h2>
          <p className="text-on-surface-variant leading-relaxed">
            We do not sell your personal information. We share your booking details only with the specific salons and stylists you choose to book with. All data is encrypted at rest and in transit using industry-standard security protocols to ensure your Cyber-Chic grooming experience remains entirely confidential.
          </p>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-white mb-4">4. Your Privacy Rights</h2>
          <p className="text-on-surface-variant leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time. You can manage your preferences directly through your Profile Settings or by contacting our data protection officer at <span className="text-secondary font-bold">privacy@glowcut.com</span>.
          </p>
        </section>
      </article>
    </main>
  );
}
