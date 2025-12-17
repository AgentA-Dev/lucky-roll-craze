export interface ShopItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  category: 'luck' | 'speed' | 'potion';
}

export interface PlayerUpgrades {
  permanentLuck: number;
  autoRollSpeed: number;
  potionSlots: number;
  potionDuration: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'permanent_luck',
    name: 'Lucky Charm',
    description: '+0.25 permanent luck multiplier',
    baseCost: 100,
    costMultiplier: 2.5,
    maxLevel: 20,
    category: 'luck',
  },
  {
    id: 'luck_power',
    name: 'Fortune Crystal',
    description: '+0.5 permanent luck multiplier',
    baseCost: 1000,
    costMultiplier: 3,
    maxLevel: 10,
    category: 'luck',
  },
  {
    id: 'auto_speed',
    name: 'Speed Boost',
    description: 'Faster auto-roll (50ms faster)',
    baseCost: 500,
    costMultiplier: 2,
    maxLevel: 6,
    category: 'speed',
  },
  {
    id: 'potion_slots',
    name: 'Potion Belt',
    description: '+1 max potion stack',
    baseCost: 2000,
    costMultiplier: 4,
    maxLevel: 5,
    category: 'potion',
  },
  {
    id: 'potion_duration',
    name: 'Extended Brew',
    description: '+2 minutes potion duration',
    baseCost: 1500,
    costMultiplier: 2.5,
    maxLevel: 5,
    category: 'potion',
  },
];

export const calculateCost = (item: ShopItem, currentLevel: number): number => {
  return Math.floor(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
};
