import React from 'react';
import { MdStar } from 'react-icons/md';

/**
 * ReviewCard
 * Matches "Community Feedback" items: reviewer name, star rating,
 * relative timestamp, comment text.
 */
export default function ReviewCard({ review }) {
  const { author, rating, timeAgo, comment } = review;

  return (
    <div className="glass-panel p-md rounded-xl">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-label-md text-white">{author}</span>
          <div className="flex text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <MdStar key={i} className={`text-base ${i < rating ? 'opacity-100' : 'opacity-25'}`} />
            ))}
          </div>
        </div>
        <span className="text-caption text-on-surface-variant">{timeAgo}</span>
      </div>
      <p className="text-body-md text-on-surface-variant">{comment}</p>
    </div>
  );
}
