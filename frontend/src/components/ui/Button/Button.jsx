import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlowCut Button
 * Variants map directly to the patterns observed across the Stitch prototype:
 * - primary   -> solid neon-orange fill, glowing shadow (main CTAs e.g. "Book Now")
 * - secondary -> solid emerald fill, glowing shadow (confirmation / "Try Now" actions)
 * - ghost     -> glass background, subtle border (secondary actions)
 * - outline   -> transparent bg, colored border, fills on hover (card-level CTAs)
 * - text      -> no background, just colored text (links / "View All")
 */
const VARIANTS = {
  primary:
    'bg-primary text-on-primary shadow-neon-orange hover:scale-[1.02] active:scale-95',
  secondary:
    'bg-secondary text-on-secondary shadow-neon-emerald hover:scale-[1.02] active:scale-95',
  outline:
    'bg-white/5 border border-primary-container text-primary-container hover:bg-primary-container hover:text-white active:scale-95',
  ghost:
    'bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95',
  text: 'bg-transparent text-primary-container hover:gap-sm',
  danger: 'bg-error text-on-error hover:scale-[1.02] active:scale-95',
};

const SIZES = {
  sm: 'px-sm py-xs text-xs rounded-full',
  md: 'px-md py-sm text-label-md rounded-full',
  lg: 'px-xl py-md text-headline-md rounded-xl',
  full: 'w-full h-14 rounded-lg text-label-md',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`
        font-sora font-bold inline-flex items-center justify-center gap-2
        transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="text-lg" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="text-lg" />}
        </>
      )}
    </motion.button>
  );
}
