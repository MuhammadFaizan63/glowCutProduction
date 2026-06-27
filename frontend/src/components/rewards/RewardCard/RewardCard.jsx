import React from 'react';
import Button from '../../ui/Button';

/**
 * RewardCard
 * Matches the "Gift Shop" redeemable items: image, points cost badge,
 * name, description, and a Redeem button. Disabled when user lacks points.
 */
export default function RewardCard({ reward, userPoints = 0, onRedeem }) {
  const { name, description, image, pointsCost, redeemed = false } = reward;
  const affordable = userPoints >= pointsCost;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className="h-32 bg-surface-container-high relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-label-md text-label-md text-primary">
          {pointsCost} PTS
        </div>
      </div>
      <div className="p-md">
        <div className="font-label-md text-label-md text-white">{name}</div>
        <div className="font-caption text-caption text-outline mb-md">{description}</div>
        <Button
          variant={affordable ? 'primary' : 'outline'}
          size="full"
          className="!h-auto !w-full py-2 !rounded-lg"
          disabled={!affordable || redeemed}
          onClick={() => onRedeem?.(reward)}
        >
          {redeemed ? 'Redeemed' : 'Redeem Now'}
        </Button>
      </div>
    </div>
  );
}
