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
import { SHOP_ITEMS, calculateCost } from "@/lib/shopData";

const MAX_NUMBER = 2_500_000_000;
const BASE_POTION_DURATION = 300; // 5 minutes in seconds
const POTION_BONUS = 0.5; // Each potion adds 0.5x to luck
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
  
  const autoRollRef = useRef<NodeJS.Timeout | null>(null);
  const potionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate upgrade bonuses
  const permanentLuckBonus = (upgradeLevels['permanent_luck'] || 0) * 0.25 + 
                              (upgradeLevels['luck_power'] || 0) * 0.5;
  const autoRollSpeed = BASE_AUTO_ROLL_SPEED - (upgradeLevels['auto_speed'] || 0) * 50;
  const maxPotionStacks = 3 + (upgradeLevels['potion_slots'] || 0);
  const potionDuration = BASE_POTION_DURATION + (upgradeLevels['potion_duration'] || 0) * 120;

  // Calculate effective luck (base + permanent + potion bonus)
  const effectiveLuck = luckMultiplier + permanentLuckBonus + (potionCount * POTION_BONUS);

  const generateNumber = useCallback((useSuperRoll: boolean) => {
    const currentLuck = useSuperRoll ? effectiveLuck * 2 : effectiveLuck;
    const luckPower = Math.pow(currentLuck, 4);
    const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
    const random = Math.random();
    const biasedRandom = Math.pow(random, 2);
    const number = Math.floor(biasedRandom * effectiveMax) + 1;
    return number;
  }, [effectiveLuck]);

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    setIsRare(false);

    const useSuperRoll = isSuperRoll;
    
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
      
      // Update highest roll AND currency
      if (number > highestRoll) {
        setHighestRoll(number);
        setCurrency(number);
      }
      
      setIsRolling(false);
    }, 150);
  }, [generateNumber, highestRoll, isRolling, isSuperRoll, effectiveLuck]);

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
    }
  };

  const currentMaxRange = Math.min(Math.floor(50 * Math.pow(effectiveLuck, 4)), MAX_NUMBER);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        {potionCount > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            <span className="text-primary text-glow-primary">LUCK</span> ROLLER
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Roll for glory • 1 to 2.5 billion
          </p>
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
          <LuckPotion
            potionCount={potionCount}
            potionTimeLeft={potionTimeLeft}
            onActivate={handleActivatePotion}
            maxStacks={maxPotionStacks}
          />
        </div>

        {/* Upgrade Indicators */}
        {permanentLuckBonus > 0 && (
          <div className="text-center mb-4">
            <span className="text-xs font-mono text-accent">
              +{permanentLuckBonus.toFixed(2)} permanent luck from upgrades
            </span>
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
              {isSuperRoll && <span className="text-accent ml-2">(2x for super roll!)</span>}
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
    </div>
  );
};

export default Index;
