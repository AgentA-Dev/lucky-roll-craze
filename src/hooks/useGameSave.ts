import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface GameState {
  highestRoll: number;
  rollCount: number;
  prestigeCount: number;
  voidPoints: number;
  currency: number;
  upgradeLevels: Record<string, number>;
  voidUpgrades: Record<string, number>;
  unlockedAchievements: Record<string, boolean>;
}

export const useGameSave = (user: User | null) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  const loadGame = useCallback(async (): Promise<GameState | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading game:', error);
      return null;
    }

    if (!data) return null;

    // Parse JSONB fields
    const upgradeLevels = typeof data.upgrade_levels === 'object' ? data.upgrade_levels as Record<string, number> : {};
    const voidUpgrades = typeof data.void_upgrades === 'object' ? data.void_upgrades as Record<string, number> : {};
    
    // Convert array to Record for achievements
    const unlockedAchievements: Record<string, boolean> = {};
    if (Array.isArray(data.unlocked_achievements)) {
      data.unlocked_achievements.forEach((id: string) => {
        unlockedAchievements[id] = true;
      });
    }

    return {
      highestRoll: Number(data.highest_roll) || 0,
      rollCount: Number(data.total_rolls) || 0,
      prestigeCount: data.prestige_count || 0,
      voidPoints: data.void_points || 0,
      currency: Number(data.currency) || 0,
      upgradeLevels,
      voidUpgrades,
      unlockedAchievements,
    };
  }, [user]);

  const saveGame = useCallback(async (state: GameState) => {
    if (!user) return;

    // Convert achievements Record to array
    const unlockedAchievementsArray = Object.entries(state.unlockedAchievements)
      .filter(([_, unlocked]) => unlocked)
      .map(([id]) => id);

    // Debounce saves
    const stateKey = JSON.stringify(state);
    if (stateKey === lastSaveRef.current) return;
    lastSaveRef.current = stateKey;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          highest_roll: state.highestRoll,
          total_rolls: state.rollCount,
          prestige_count: state.prestigeCount,
          void_points: state.voidPoints,
          currency: state.currency,
          upgrade_levels: state.upgradeLevels,
          void_upgrades: state.voidUpgrades,
          unlocked_achievements: unlockedAchievementsArray,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving game:', error);
      }
    }, 1000); // Debounce 1 second
  }, [user]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return { loadGame, saveGame };
};
