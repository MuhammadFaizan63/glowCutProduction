import React from 'react';
import { MdSchedule, MdCheckCircle } from 'react-icons/md';

/**
 * ServiceCard
 * Matches the Services Menu items from Salon Detail: name, price, description,
 * duration. Supports a `selected` state for use in booking flows (Confirm Booking).
 */
export default function ServiceCard({ service, selected = false, onSelect }) {
  const { name, price, description, duration } = service;

  return (
    <div
      onClick={onSelect}
      className={`glass-panel p-md rounded-xl transition-colors cursor-pointer group relative ${
        selected
          ? 'border-primary-container shadow-neon-orange'
          : 'hover:border-primary-container/40'
      }`}
    >
      {selected && (
        <MdCheckCircle className="absolute top-3 right-3 text-primary-container text-xl" />
      )}
      <div className="flex justify-between items-start mb-xs pr-6">
        <h4 className="font-headline-md text-headline-md group-hover:text-primary transition-colors">
          {name}
        </h4>
        <span className="font-bold text-primary-container font-headline-md whitespace-nowrap ml-sm">
          {price}
        </span>
      </div>
      {description && (
        <p className="text-on-surface-variant font-body-md mb-sm opacity-80">
          {description}
        </p>
      )}
      {duration && (
        <span className="text-caption font-caption flex items-center gap-xs opacity-60">
          <MdSchedule className="text-base" /> {duration}
        </span>
      )}
    </div>
  );
}
