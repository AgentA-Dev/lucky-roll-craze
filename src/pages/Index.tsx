import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointerClick, Zap } from "lucide-react";
import RollButton from "@/components/RollButton";
import NumberDisplay from "@/components/NumberDisplay";
import StatCard from "@/components/StatCard";
import HighestRoll from "@/components/HighestRoll";
import AutoRollButton from "@/components/AutoRollButton";
import LuckPotion from "@/components/LuckPotion";
import SuperRollIndicator from "@/components/SuperRollIndicator";
import ShopButton from "@/components/ShopButton";
import ShopModal from "@/components/ShopModal";
import PrestigeButton from "@/components/PrestigeButton";
import VoidShopModal from "@/components/VoidShopModal";
import VoidShopButton from "@/components/VoidShopButton";
import LogoHeader from "@/components/LogoHeader";
import AchievementButton from "@/components/AchievementButton";
import AchievementPanel from "@/components/AchievementPanel";
import AuthModal from "@/components/AuthModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import UserHeader from "@/components/UserHeader";
import { ACHIEVEMENTS } from "@/lib/achievementData";
import { useAuth } from "@/hooks/useAuth";
import { useGameSave } from "@/hooks/useGameSave";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "@/hooks/use-toast";

const MAX_NUMBER = 2_500_000_000;
const PRESTIGE_THRESHOLD = 1_000_000_000;
const BASE_POTION_DURATION = 300;
const POTION_BONUS = 0.5;
const BASE_AUTO_ROLL_SPEED = 200;

const Index = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [luckMultiplier, setLuckMultiplier] = useState(1);
  const [highestRoll, setHighestRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isRare, setIsRare] = useState(false);
  
  // Auto-roll & potions
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [potionCount, setPotionCount] = useState(0);
  const [potionTimeLeft, setPotionTimeLeft] = useState(0);
  const [rollsUntilSuper, setRollsUntilSuper] = useState(10);
  const [isSuperRoll, setIsSuperRoll] = useState(false);
  
  // Shop & upgrades
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [currency, setCurrency] = useState(0);
  const [upgradeLevels, setUpgradeLevels] = useState<Record<string, number>>({});
  
  // Prestige & Void system
  const [prestigeCount, setPrestigeCount] = useState(0);
  const [voidPoints, setVoidPoints] = useState(0);
  const [voidUpgrades, setVoidUpgrades] = useState<Record<string, number>>({});
  const [isVoidShopOpen, setIsVoidShopOpen] = useState(false);
  
  // Achievement system (permanent, never resets)
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, boolean>>({});
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  
  // Auth & UI modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  
  const autoRollRef = useRef<NodeJS.Timeout | null>(null);
  const potionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auth & save hooks
  const { user, loading: authLoading, signOut } = useAuth();
  const { loadGame, saveGame } = useGameSave(user);
  const { 
    playRollSound, 
    playSuperRollSound, 
    playAchievementSound, 
    playHighScoreSound,
    playPrestigeSound,
    playPurchaseSound 
  } = useSoundEffects();

  // Load game on login
  useEffect(() => {
    if (user && !gameLoaded) {
      loadGame().then((state) => {
        if (state) {
          setHighestRoll(state.highestRoll);
          setRollCount(state.rollCount);
          setPrestigeCount(state.prestigeCount);
          setVoidPoints(state.voidPoints);
          setCurrency(state.currency);
          setUpgradeLevels(state.upgradeLevels);
          setVoidUpgrades(state.voidUpgrades);
          setUnlockedAchievements(state.unlockedAchievements);
          toast({
            title: 'Game Loaded',
            description: `Welcome back! Highest roll: ${state.highestRoll.toLocaleString()}`,
          });
        }
        setGameLoaded(true);
      });
    } else if (!user) {
      setGameLoaded(false);
    }
  }, [user, loadGame, gameLoaded]);

  // Save game on state changes
  useEffect(() => {
    if (user && gameLoaded) {
      saveGame({
        highestRoll,
        rollCount,
        prestigeCount,
        voidPoints,
        currency,
        upgradeLevels,
        voidUpgrades,
        unlockedAchievements,
      });
    }
  }, [user, gameLoaded, highestRoll, rollCount, prestigeCount, voidPoints, currency, upgradeLevels, voidUpgrades, unlockedAchievements, saveGame]);

  // Calculate upgrade bonuses
  const permanentLuckBonus = (upgradeLevels['permanent_luck'] || 0) * 0.25 + 
                              (upgradeLevels['luck_power'] || 0) * 0.5;
  const autoRollSpeed = BASE_AUTO_ROLL_SPEED - (upgradeLevels['auto_speed'] || 0) * 50;
  const maxPotionStacks = 3 + (upgradeLevels['potion_slots'] || 0);
  const basePotionDuration = BASE_POTION_DURATION + (upgradeLevels['potion_duration'] || 0) * 120;
  
  // Void upgrades
  const voidSuperRollBoost = (voidUpgrades['super_roll_boost'] || 0) * 5;
  const voidPotionPower = (voidUpgrades['void_potion_power'] || 0) * 1;
  const voidPotionDuration = (voidUpgrades['void_potion_duration'] || 0) * 300;
  
  const potionDuration = basePotionDuration + voidPotionDuration;
  const effectivePotionBonus = POTION_BONUS + voidPotionPower;

  // Achievement luck bonus (permanent)
  const achievementLuckBonus = ACHIEVEMENTS.reduce((total, achievement) => {
    return total + (unlockedAchievements[achievement.id] ? achievement.luckReward : 0);
  }, 0);

  // Calculate effective luck (base + permanent + achievement + potion bonus)
  const effectiveLuck = luckMultiplier + permanentLuckBonus + achievementLuckBonus + (potionCount * effectivePotionBonus);

  const generateNumber = useCallback((useSuperRoll: boolean) => {
    // Super roll now gets base 2x PLUS void upgrade bonus
    const superRollMultiplier = useSuperRoll ? (2 + voidSuperRollBoost) : 1;
    const currentLuck = effectiveLuck * superRollMultiplier;
    const luckPower = Math.pow(currentLuck, 4);
    const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
    const random = Math.random();
    const biasedRandom = Math.pow(random, 2);
    const number = Math.floor(biasedRandom * effectiveMax) + 1;
    return number;
  }, [effectiveLuck, voidSuperRollBoost]);

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    setIsRare(false);

    const useSuperRoll = isSuperRoll;
    
    // Play sound
    if (useSuperRoll) {
      playSuperRollSound();
    } else {
      playRollSound();
    }
    
    setTimeout(() => {
      const number = generateNumber(useSuperRoll);
      setCurrentNumber(number);
      setRollCount((prev) => prev + 1);
      
      setLuckMultiplier((prev) => {
        if (prev < 3) return prev + 0.05;
        if (prev < 5) return prev + 0.03;
        if (prev < 8) return prev + 0.02;
        return Math.min(prev + 0.01, 10);
      });
      
      if (useSuperRoll) {
        setIsSuperRoll(false);
        setRollsUntilSuper(10);
      } else {
        setRollsUntilSuper((prev) => {
          if (prev <= 1) {
            setIsSuperRoll(true);
            return 0;
          }
          return prev - 1;
        });
      }
      
      const luckPower = Math.pow(effectiveLuck, 4);
      const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
      if (number >= effectiveMax * 0.8 || useSuperRoll) {
        setIsRare(true);
      }
      
      if (number > highestRoll) {
        setHighestRoll(number);
        setCurrency(number);
        playHighScoreSound();
        
        // Check for new achievements
        ACHIEVEMENTS.forEach((achievement) => {
          if (number >= achievement.threshold && !unlockedAchievements[achievement.id]) {
            setUnlockedAchievements((prev) => ({
              ...prev,
              [achievement.id]: true,
            }));
            playAchievementSound();
            toast({
              title: `Achievement Unlocked!`,
              description: `${achievement.name} - +${achievement.luckReward}x luck!`,
            });
          }
        });
      }
      
      setIsRolling(false);
    }, 150);
  }, [generateNumber, highestRoll, isRolling, isSuperRoll, effectiveLuck, unlockedAchievements, playRollSound, playSuperRollSound, playHighScoreSound, playAchievementSound]);

  // Auto-roll logic
  useEffect(() => {
    if (isAutoRolling) {
      autoRollRef.current = setInterval(() => {
        handleRoll();
      }, autoRollSpeed);
    } else {
      if (autoRollRef.current) {
        clearInterval(autoRollRef.current);
        autoRollRef.current = null;
      }
    }
    
    return () => {
      if (autoRollRef.current) {
        clearInterval(autoRollRef.current);
      }
    };
  }, [isAutoRolling, handleRoll, autoRollSpeed]);

  // Potion timer logic
  useEffect(() => {
    if (potionTimeLeft > 0) {
      potionTimerRef.current = setTimeout(() => {
        setPotionTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (potionCount > 0 && potionTimeLeft === 0) {
      setPotionCount(0);
    }
    
    return () => {
      if (potionTimerRef.current) {
        clearTimeout(potionTimerRef.current);
      }
    };
  }, [potionTimeLeft, potionCount]);

  const handleActivatePotion = () => {
    if (potionCount < maxPotionStacks) {
      setPotionCount((prev) => Math.min(prev + 1, maxPotionStacks));
      setPotionTimeLeft(potionDuration);
    }
  };

  const toggleAutoRoll = () => {
    setIsAutoRolling((prev) => !prev);
  };

  const handlePurchase = (itemId: string, cost: number) => {
    if (currency >= cost) {
      setCurrency((prev) => prev - cost);
      setUpgradeLevels((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      playPurchaseSound();
    }
  };

  const handlePrestige = () => {
    if (highestRoll >= PRESTIGE_THRESHOLD) {
      playPrestigeSound();
      setPrestigeCount((prev) => prev + 1);
      setVoidPoints((prev) => prev + 1);
      
      // Reset progress
      setCurrentNumber(null);
      setRollCount(0);
      setLuckMultiplier(1);
      setHighestRoll(0);
      setCurrency(0);
      setPotionCount(0);
      setPotionTimeLeft(0);
      setRollsUntilSuper(10);
      setIsSuperRoll(false);
      setIsAutoRolling(false);
      setUpgradeLevels({});
      
      toast({
        title: 'Prestige Complete!',
        description: 'You earned 1 Void Point. Progress reset.',
      });
    }
  };

  const handleVoidPurchase = (itemId: string, cost: number) => {
    if (voidPoints >= cost) {
      setVoidPoints((prev) => prev - cost);
      setVoidUpgrades((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      playPurchaseSound();
    }
  };

  const handleLogout = async () => {
    await signOut();
    // Reset local state
    setCurrentNumber(null);
    setRollCount(0);
    setLuckMultiplier(1);
    setHighestRoll(0);
    setCurrency(0);
    setUpgradeLevels({});
    setPrestigeCount(0);
    setVoidPoints(0);
    setVoidUpgrades({});
    setUnlockedAchievements({});
    setGameLoaded(false);
    toast({
      title: 'Logged Out',
      description: 'See you next time!',
    });
  };

  const canPrestige = highestRoll >= PRESTIGE_THRESHOLD;
  const currentMaxRange = Math.min(Math.floor(50 * Math.pow(effectiveLuck, 4)), MAX_NUMBER);
  const superRollMultiplier = 2 + voidSuperRollBoost;
  const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* User Header */}
      <UserHeader
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onLeaderboardClick={() => setIsLeaderboardOpen(true)}
      />

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        {potionCount > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        )}
        {prestigeCount > 0 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Logo Header */}
        <LogoHeader />

        {/* Prestige Section */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <PrestigeButton
            canPrestige={canPrestige}
            prestigeCount={prestigeCount}
            voidPoints={voidPoints}
            onClick={handlePrestige}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard
            label="Luck Multiplier"
            value={`${effectiveLuck.toFixed(2)}x`}
            icon={<Sparkles className="w-5 h-5" />}
            variant="luck"
          />
          <StatCard
            label="Total Rolls"
            value={rollCount}
            icon={<MousePointerClick className="w-5 h-5" />}
            variant="counter"
          />
        </div>

        {/* Shop & Potion Row */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <ShopButton onClick={() => setIsShopOpen(true)} currency={currency} />
          <VoidShopButton onClick={() => setIsVoidShopOpen(true)} voidPoints={voidPoints} />
          <LuckPotion
            potionCount={potionCount}
            potionTimeLeft={potionTimeLeft}
            onActivate={handleActivatePotion}
            maxStacks={maxPotionStacks}
          />
        </div>

        {/* Upgrade Indicators */}
        {(permanentLuckBonus > 0 || voidSuperRollBoost > 0 || achievementLuckBonus > 0) && (
          <div className="text-center mb-4 space-y-1">
            {permanentLuckBonus > 0 && (
              <span className="text-xs font-mono text-accent block">
                +{permanentLuckBonus.toFixed(2)} permanent luck from upgrades
              </span>
            )}
            {achievementLuckBonus > 0 && (
              <span className="text-xs font-mono text-primary block">
                +{achievementLuckBonus.toFixed(2)} permanent luck from achievements
              </span>
            )}
            {voidSuperRollBoost > 0 && (
              <span className="text-xs font-mono text-violet-400 block">
                Super Roll: {superRollMultiplier}x luck (void enhanced)
              </span>
            )}
          </div>
        )}

        {/* Main Game Area */}
        <motion.div
          className={`bg-card/30 backdrop-blur-md rounded-2xl border p-8 md:p-12 transition-all duration-300 ${
            isSuperRoll ? 'border-accent box-glow-accent' : 'border-border'
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-center mb-4">
            <SuperRollIndicator rollsUntilSuper={rollsUntilSuper} isSuperRoll={isSuperRoll} />
          </div>

          <NumberDisplay number={currentNumber} isRare={isRare} />

          <div className="flex justify-center items-center gap-4 mt-8">
            <AutoRollButton isAutoRolling={isAutoRolling} onClick={toggleAutoRoll} />
            <RollButton onClick={handleRoll} isRolling={isRolling} isSuperRoll={isSuperRoll} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono">
              Max range: ~{currentMaxRange.toLocaleString()}
              {isSuperRoll && <span className="text-accent ml-2">({superRollMultiplier}x for super roll!)</span>}
            </span>
          </div>
        </motion.div>

        <HighestRoll highest={highestRoll} />

        {/* Luck Progression Guide */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono mb-2">Luck Unlocks</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
            <span className={effectiveLuck >= 1 ? "text-muted-foreground" : "text-muted"}>1x: ~50</span>
            <span className={effectiveLuck >= 3 ? "text-primary" : "text-muted"}>3x: ~4K</span>
            <span className={effectiveLuck >= 5 ? "text-primary text-glow-primary" : "text-muted"}>5x: ~300K</span>
            <span className={effectiveLuck >= 7 ? "text-secondary" : "text-muted"}>7x: ~120M</span>
            <span className={effectiveLuck >= 9 ? "text-accent text-glow-accent" : "text-muted"}>9x: ~3B</span>
          </div>
        </div>

        {/* Login prompt for non-logged users */}
        {!user && !authLoading && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Login to save your progress and compete on the leaderboard!
            </p>
          </div>
        )}
      </motion.div>

      {/* Shop Modal */}
      <AnimatePresence>
        {isShopOpen && (
          <ShopModal
            isOpen={isShopOpen}
            onClose={() => setIsShopOpen(false)}
            currency={currency}
            upgradeLevels={upgradeLevels}
            onPurchase={handlePurchase}
          />
        )}
      </AnimatePresence>

      {/* Void Shop Modal */}
      <AnimatePresence>
        {isVoidShopOpen && (
          <VoidShopModal
            isOpen={isVoidShopOpen}
            onClose={() => setIsVoidShopOpen(false)}
            voidPoints={voidPoints}
            voidUpgrades={voidUpgrades}
            onPurchase={handleVoidPurchase}
          />
        )}
      </AnimatePresence>

      {/* Achievement Button */}
      <AchievementButton
        onClick={() => setIsAchievementOpen(true)}
        unlockedCount={unlockedCount}
        totalCount={ACHIEVEMENTS.length}
      />

      {/* Achievement Panel */}
      <AchievementPanel
        isOpen={isAchievementOpen}
        onClose={() => setIsAchievementOpen(false)}
        unlockedAchievements={unlockedAchievements}
        highestRoll={highestRoll}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};

export default Index;
