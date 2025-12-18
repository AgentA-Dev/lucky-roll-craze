export interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold: number;
  luckReward: number;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_100',
    name: 'Getting Started',
    description: 'Roll 100 or higher',
    threshold: 100,
    luckReward: 0.1,
    icon: '🎯',
  },
  {
    id: 'first_1k',
    name: 'Thousand Club',
    description: 'Roll 1,000 or higher',
    threshold: 1_000,
    luckReward: 0.25,
    icon: '⭐',
  },
  {
    id: 'first_10k',
    name: 'Rising Star',
    description: 'Roll 10,000 or higher',
    threshold: 10_000,
    luckReward: 0.5,
    icon: '🌟',
  },
  {
    id: 'first_100k',
    name: 'High Roller',
    description: 'Roll 100,000 or higher',
    threshold: 100_000,
    luckReward: 2,
    icon: '💎',
  },
  {
    id: 'first_1m',
    name: 'Millionaire',
    description: 'Roll 1,000,000 or higher',
    threshold: 1_000_000,
    luckReward: 3,
    icon: '👑',
  },
  {
    id: 'first_10m',
    name: 'Master Roller',
    description: 'Roll 10,000,000 or higher',
    threshold: 10_000_000,
    luckReward: 4,
    icon: '🔥',
  },
  {
    id: 'first_100m',
    name: 'Legend',
    description: 'Roll 100,000,000 or higher',
    threshold: 100_000_000,
    luckReward: 5,
    icon: '🏆',
  },
  {
    id: 'first_1b',
    name: 'Billionaire',
    description: 'Roll 1,000,000,000 or higher',
    threshold: 1_000_000_000,
    luckReward: 10,
    icon: '💫',
  },
];
