import React from 'react';
import { MdStar } from 'react-icons/md';
import Badge from '../../ui/Badge';

/**
 * BarberCard
 * Matches "Master Stylists" cards: avatar with status ring, name, specialty,
 * rating, and an availability badge (AVAILABLE / NEXT: 2PM style).
 */
export default function BarberCard({ barber, onClick }) {
  const { name, specialty, rating, reviewCount, image, available, nextSlot } = barber;

  return (
    <div
      onClick={onClick}
      className="glass-panel p-md rounded-xl flex items-center gap-md relative overflow-hidden group cursor-pointer hover:border-primary-container/30 transition-colors"
    >
      <div className="absolute top-0 right-0 p-sm">
        {available ? (
          <Badge variant="success" dot className="text-[10px] tracking-widest">
            AVAILABLE
          </Badge>
        ) : (
          <Badge variant="neutral" className="text-[10px] tracking-widest">
            NEXT: {nextSlot}
          </Badge>
        )}
      </div>
      <div
        className={`w-24 h-24 rounded-full border-2 p-1 flex-shrink-0 ${
          available ? 'border-secondary' : 'border-white/10'
        }`}
      >
        <img src={image} alt={name} className="w-full h-full object-cover rounded-full" />
      </div>
      <div>
        <h4 className="font-headline-md text-headline-md">{name}</h4>
        <p className="text-secondary font-label-md text-label-md mb-xs">{specialty}</p>
        <div className="flex items-center gap-xs text-primary-container mb-sm">
          <MdStar className="text-lg" />
          <span className="font-bold">{rating}</span>
          <span className="text-on-surface-variant opacity-60 text-caption font-caption">
            ({reviewCount} Reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
