import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, MousePointerClick, Zap } from "lucide-react";
import RollButton from "@/components/RollButton";
import NumberDisplay from "@/components/NumberDisplay";
import StatCard from "@/components/StatCard";
import HighestRoll from "@/components/HighestRoll";
import AutoRollButton from "@/components/AutoRollButton";
import LuckPotion from "@/components/LuckPotion";
import SuperRollIndicator from "@/components/SuperRollIndicator";

const MAX_NUMBER = 2_500_000_000;
const POTION_DURATION = 300; // 5 minutes in seconds
const POTION_BONUS = 0.5; // Each potion adds 0.5x to luck

const Index = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [luckMultiplier, setLuckMultiplier] = useState(1);
  const [highestRoll, setHighestRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isRare, setIsRare] = useState(false);
  
  // New features
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [potionCount, setPotionCount] = useState(0);
  const [potionTimeLeft, setPotionTimeLeft] = useState(0);
  const [rollsUntilSuper, setRollsUntilSuper] = useState(10);
  const [isSuperRoll, setIsSuperRoll] = useState(false);
  
  const autoRollRef = useRef<NodeJS.Timeout | null>(null);
  const potionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate effective luck (base + potion bonus)
  const effectiveLuck = luckMultiplier + (potionCount * POTION_BONUS);

  const generateNumber = useCallback((useSuperRoll: boolean) => {
    // For super roll, double the effective luck
    const currentLuck = useSuperRoll ? effectiveLuck * 2 : effectiveLuck;
    
    // Calculate the effective max based on luck (exponential scaling)
    const luckPower = Math.pow(currentLuck, 4);
    const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
    
    // Within the effective range, lower numbers are still more common
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
      
      // Increase luck multiplier with each roll
      setLuckMultiplier((prev) => {
        if (prev < 3) return prev + 0.05;
        if (prev < 5) return prev + 0.03;
        if (prev < 8) return prev + 0.02;
        return Math.min(prev + 0.01, 10);
      });
      
      // Update super roll counter
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
      
      // Check if it's a rare roll
      const luckPower = Math.pow(effectiveLuck, 4);
      const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
      if (number >= effectiveMax * 0.8 || useSuperRoll) {
        setIsRare(true);
      }
      
      if (number > highestRoll) {
        setHighestRoll(number);
      }
      
      setIsRolling(false);
    }, 150);
  }, [generateNumber, highestRoll, isRolling, isSuperRoll, effectiveLuck]);

  // Auto-roll logic
  useEffect(() => {
    if (isAutoRolling) {
      autoRollRef.current = setInterval(() => {
        handleRoll();
      }, 200);
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
  }, [isAutoRolling, handleRoll]);

  // Potion timer logic
  useEffect(() => {
    if (potionTimeLeft > 0) {
      potionTimerRef.current = setTimeout(() => {
        setPotionTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (potionCount > 0 && potionTimeLeft === 0) {
      // Timer ran out, remove all potions
      setPotionCount(0);
    }
    
    return () => {
      if (potionTimerRef.current) {
        clearTimeout(potionTimerRef.current);
      }
    };
  }, [potionTimeLeft, potionCount]);

  const handleActivatePotion = () => {
    setPotionCount((prev) => prev + 1);
    setPotionTimeLeft(POTION_DURATION); // Reset/set timer to 5 minutes
  };

  const toggleAutoRoll = () => {
    setIsAutoRolling((prev) => !prev);
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
        <div className="grid grid-cols-2 gap-4 mb-8">
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

        {/* Luck Potion */}
        <div className="flex justify-center mb-6">
          <LuckPotion
            potionCount={potionCount}
            potionTimeLeft={potionTimeLeft}
            onActivate={handleActivatePotion}
          />
        </div>

        {/* Main Game Area */}
        <motion.div
          className={`bg-card/30 backdrop-blur-md rounded-2xl border p-8 md:p-12 transition-all duration-300 ${
            isSuperRoll ? 'border-accent box-glow-accent' : 'border-border'
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          {/* Super Roll Indicator */}
          <div className="flex justify-center mb-4">
            <SuperRollIndicator rollsUntilSuper={rollsUntilSuper} isSuperRoll={isSuperRoll} />
          </div>

          {/* Number Display */}
          <NumberDisplay number={currentNumber} isRare={isRare} />

          {/* Roll Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <AutoRollButton isAutoRolling={isAutoRolling} onClick={toggleAutoRoll} />
            <RollButton onClick={handleRoll} isRolling={isRolling} isSuperRoll={isSuperRoll} />
          </div>

          {/* Luck Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono">
              Max range: ~{currentMaxRange.toLocaleString()}
              {isSuperRoll && <span className="text-accent ml-2">(2x for super roll!)</span>}
            </span>
          </div>
        </motion.div>

        {/* Highest Roll */}
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
    </div>
  );
};

export default Index;
