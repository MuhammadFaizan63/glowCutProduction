import React from 'react';

const VARIANTS = {
  primary: 'bg-primary-container/10 text-primary-container border border-primary-container/20',
  secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
  neutral: 'bg-white/5 text-on-surface-variant border border-white/10',
  success: 'bg-secondary-container/20 text-secondary border border-secondary',
  rating: 'bg-background/80 backdrop-blur-md text-white border border-secondary/50',
  outline: 'bg-transparent text-on-surface-variant border border-outline-variant',
};

/**
 * GlowCut Badge
 * Small pill used for: "New AI Feature", "Available Now" dot+label,
 * rating chips (4.9★), price tiers ($/$$/$$$), status tags.
 */
export default function Badge({
  children,
  variant = 'neutral',
  icon: Icon,
  dot = false,
  dotColor = 'bg-secondary',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-sm py-1 rounded-full
        font-label-md text-label-md
        ${VARIANTS[variant] || VARIANTS.neutral}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {Icon && <Icon className="text-sm" />}
      {children}
    </span>
  );
}
