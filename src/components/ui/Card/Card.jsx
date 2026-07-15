import React from 'react';

/**
 * GlowCut Card
 * The "glass-panel" treatment used throughout: semi-transparent surface +
 * backdrop blur + subtle white border. This is the single most reused
 * visual primitive in the whole prototype.
 */
export default function Card({
  children,
  className = '',
  glow, // 'orange' | 'emerald' | undefined
  hoverable = false,
  edgeLight = false,
  as: Component = 'div',
  ...rest
}) {
  const glowClass =
    glow === 'orange'
      ? 'shadow-neon-orange'
      : glow === 'emerald'
      ? 'shadow-neon-emerald'
      : '';

  return (
    <Component
      className={`
        glass-panel rounded-xl
        ${edgeLight ? 'edge-light border-t-white/20' : ''}
        ${hoverable ? 'hover:border-primary-container/30 transition-all' : ''}
        ${glowClass}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Component>
  );
}
