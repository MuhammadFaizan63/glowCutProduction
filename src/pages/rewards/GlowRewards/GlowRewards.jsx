import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  MdMilitaryTech,
  MdQuiz,
  MdSchedule,
  MdGroups,
  MdCoffee,
} from 'react-icons/md';
import RewardHistory from '../../../components/rewards/RewardHistory';
import RewardCard from '../../../components/rewards/RewardCard';
import Loader from '../../../components/ui/Loader';
import { getAvailableRewards, redeemReward } from '../../../services/rewardService';

const POINTS_TO_NEXT_RANK = 550;
const PROGRESS_PERCENT = 75;

const ACHIEVEMENTS = [
  { label: 'Trivia Master', icon: MdQuiz, color: 'secondary', unlocked: true },
  { label: 'Early Bird', icon: MdSchedule, color: 'primary', unlocked: true },
  { label: 'Frequent Visitor', icon: MdGroups, color: 'secondary', unlocked: true },
  { label: 'Brew Connoisseur', icon: MdCoffee, color: 'outline', unlocked: false },
];

// The prototype's "Daily Quests" module has no backend concept yet (only
// rewardService's gift-shop catalogue + reward history exist), so quest
// progress is modeled locally until a quests endpoint is introduced.
const INITIAL_QUESTS = [
  { type: 'booking', label: 'Book an Appointment', points: 50, completed: true },
  { type: 'review', label: 'Leave a Review', points: 100, completed: true },
  { type: 'share', label: 'Share with a Friend', points: 75, completed: false },
];

const GIFT_SHOP_IMAGES = {
  'Free Beard Trim':
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB9tM_yjJrVx1sfvOXA-jdDQDBqXrnQVikMErFei4m9yBCxw6vP7IBkQw9d-K2BQweH3rL9Bg2obOua2FCnRzvTG9pjGGksFKqwVR4qa9fkPgbUPBBxWSGyixF96vrJ3zpW6bzIFG4Fk0FPDHaQmIUDQ80bVnb83AkB8IQDu2VXzPjjrrdKsD50Z5A7DUZ558eEfqkwXPdih5T8Zad3wTy_RgBRIj9of_cWOX-_UBsa8A1pnLMTYvbtpkHelIGLKkRBfbTU43tGTfo',
};
const DEFAULT_REWARD_IMAGE = GIFT_SHOP_IMAGES['Free Beard Trim'];

const REWARD_DESCRIPTIONS = {
  'Free Beard Trim': 'Redeemable on any service.',
  '20% Off Hair Color': 'Valid on all premium color treatments.',
  'Free Scalp Treatment': 'Includes a 30-minute neon glow detox.',
  'GlowCut Gold (1 Month)': 'Unlocks Gold-tier perks for 30 days.',
};

export default function GlowRewards() {
  const [points, setPoints] = useState(2450);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemed, setRedeemed] = useState({});
  const [redeemingId, setRedeemingId] = useState(null);

  useEffect(() => {
    getAvailableRewards()
      .then((data) => {
        setRewards(
          data.map((r) => ({
            id: r.id,
            name: r.title,
            description: REWARD_DESCRIPTIONS[r.title] || 'Redeemable on any service.',
            pointsCost: r.pointsCost,
            image: GIFT_SHOP_IMAGES[r.title] || DEFAULT_REWARD_IMAGE,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleQuestAction = (entry) => {
    setQuests((prev) =>
      prev.map((q) => (q.label === entry.label ? { ...q, completed: true } : q))
    );
    setPoints((p) => p + entry.points);
    toast.success(`+${entry.points} points earned!`);
  };

  const handleRedeem = async (reward) => {
    if (points < reward.pointsCost) {
      toast.error('Not enough points yet');
      return;
    }
    setRedeemingId(reward.id);
    try {
      await redeemReward(reward.id);
      setPoints((p) => p - reward.pointsCost);
      setRedeemed((r) => ({ ...r, [reward.id]: true }));
      toast.success(`Redeemed "${reward.name}"!`);
    } catch {
      toast.error('Could not redeem right now');
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) return <Loader variant="full" label="Loading Rewards" />;

  return (
    <main className="px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto py-md space-y-section-gap">
      {/* Points & Status */}
      <section className="relative overflow-hidden rounded-3xl p-base bg-gradient-to-br from-primary-container/20 to-transparent">
        <div className="glass-card rounded-2xl p-md md:p-xl flex flex-col md:flex-row items-center gap-lg">
          <div className="flex-shrink-0 relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-primary-container to-primary flex items-center justify-center shadow-neon-orange">
              <MdMilitaryTech className="text-[64px] md:text-[96px] text-on-primary-container" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white mb-xs">
              Style Points
            </h1>
            <div className="font-display-lg text-display-lg text-primary mb-md">
              {points.toLocaleString()}
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-end font-label-md text-label-md mb-xs">
                <span className="text-on-surface-variant">
                  Next Rank: <span className="text-secondary font-bold">Diamond Member</span>
                </span>
                <span className="text-primary">{PROGRESS_PERCENT}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary shadow-neon-emerald rounded-full"
                  style={{ width: `${PROGRESS_PERCENT}%` }}
                />
              </div>
              <p className="font-caption text-caption text-outline">
                Spend {POINTS_TO_NEXT_RANK} more points to unlock Diamond status benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-white">
            Waiting Lounge Achievements
          </h2>
          <button className="font-label-md text-label-md text-primary hover:underline">
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-md [&::-webkit-scrollbar]:hidden">
          {ACHIEVEMENTS.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className={`flex-shrink-0 w-32 flex flex-col items-center gap-sm ${
                  badge.unlocked ? '' : 'opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-full glass-card flex items-center justify-center border ${
                    badge.color === 'secondary'
                      ? 'border-secondary/30'
                      : badge.color === 'primary'
                      ? 'border-primary/30'
                      : 'border-outline/30'
                  }`}
                >
                  <Icon
                    className={`text-3xl ${
                      badge.color === 'secondary'
                        ? 'text-secondary'
                        : badge.color === 'primary'
                        ? 'text-primary'
                        : 'text-outline'
                    }`}
                  />
                </div>
                <span
                  className={`font-label-md text-label-md text-center ${
                    badge.unlocked ? 'text-on-surface' : 'text-outline'
                  }`}
                >
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quests + Gift Shop Bento */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-white mb-md">Daily Quests</h2>
          <RewardHistory entries={quests} onAction={handleQuestAction} />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-white mb-md">Gift Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={{ ...reward, redeemed: !!redeemed[reward.id] }}
                userPoints={points}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
