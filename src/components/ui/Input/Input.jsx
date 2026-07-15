import React, { useState } from 'react';

/**
 * GlowCut Input
 * "Ghost-style" inputs per DESIGN.md: bottom-border only or subtle dark container,
 * focus transitions border to Neon Orange.
 * Supports inline validation (error prop) and left/right icons.
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  variant = 'underline', // 'underline' | 'filled'
  name,
  required = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  const baseClasses =
    'w-full bg-white/5 text-white placeholder-white/30 font-body-md text-body-md transition-all duration-300 focus:outline-none';

  const variantClasses =
    variant === 'underline'
      ? `border-0 border-b-2 ${
          error
            ? 'border-error'
            : focused
            ? 'border-primary-container shadow-[0_4px_8px_-4px_rgba(255,95,31,0.4)]'
            : 'border-outline-variant'
        } px-2 py-3 bg-transparent`
      : `border rounded-lg px-4 py-3 ${
          error
            ? 'border-error'
            : focused
            ? 'border-primary-container'
            : 'border-white/10'
        }`;

  return (
    <div className="flex flex-col gap-xs w-full">
      {label && (
        <label
          htmlFor={name}
          className="font-label-md text-label-md text-on-surface-variant"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 text-outline text-lg pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClasses} ${variantClasses} ${Icon ? 'pl-10' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-error text-caption font-caption">{error}</p>}
    </div>
  );
}
