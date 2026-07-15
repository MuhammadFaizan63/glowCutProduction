import React from 'react';
import { MdPinDrop, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

/**
 * SalonCard
 * Matches the "Top-Rated Salons" cards from the homepage and the list
 * cards from Nearby Salons: image w/ rating chip, name, location, price tier, CTA.
 */
export default function SalonCard({ salon }) {
  const navigate = useNavigate();
  const { id, name, image, location, rating, priceTier = '$$' } = salon;

  return (
    <Card hoverable className="group overflow-hidden">
      <div className="relative h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs border border-secondary/50">
          <MdStar className="text-secondary text-sm" />
          <span className="text-white font-label-md text-label-md">{rating}</span>
        </div>
      </div>
      <div className="p-md">
        <h4 className="font-headline-md text-headline-md mb-xs">{name}</h4>
        <p className="font-caption text-caption text-on-surface-variant mb-md flex items-center gap-xs">
          <MdPinDrop className="text-sm" /> {location}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary-container font-bold text-lg">{priceTier}</span>
          <Button variant="outline" size="sm" onClick={() => navigate(`/salons/${id}`)}>
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
