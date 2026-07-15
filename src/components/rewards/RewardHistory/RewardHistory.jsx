import React from 'react';
import { MdEventAvailable, MdRateReview, MdShare, MdCheck, MdAdd } from 'react-icons/md';

const ICON_MAP = {
  booking: MdEventAvailable,
  review: MdRateReview,
  share: MdShare,
};

/**
 * RewardHistory
 * Matches "Daily Quests" list: icon + label + points value, with a
 * completed check or an actionable "+" button depending on quest state.
 *
 * entries: [{ type: 'booking'|'review'|'share', label, points, completed }]
 */
export default function RewardHistory({ entries = [], onAction }) {
  return (
    <div className="glass-card rounded-2xl p-base flex flex-col gap-sm">
      {entries.map((entry, i) => {
        const Icon = ICON_MAP[entry.type] || MdEventAvailable;
        return (
          <div
            key={i}
            className="flex items-center justify-between p-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-sm">
              <Icon className="text-primary text-xl" />
              <div>
                <div className="font-label-md text-label-md text-white">{entry.label}</div>
                <div className="font-caption text-caption text-outline">
                  +{entry.points} Points
                </div>
              </div>
            </div>

            {entry.completed ? (
              <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary flex items-center justify-center">
                <MdCheck className="text-secondary text-xl" />
              </div>
            ) : (
              <button
                onClick={() => onAction?.(entry)}
                className="w-8 h-8 rounded-lg border border-outline/30 flex items-center justify-center hover:border-primary transition-all"
              >
                <MdAdd className="text-outline text-xl" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
