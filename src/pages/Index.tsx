import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, MousePointerClick, Zap } from "lucide-react";
import RollButton from "@/components/RollButton";
import NumberDisplay from "@/components/NumberDisplay";
import StatCard from "@/components/StatCard";
import HighestRoll from "@/components/HighestRoll";

const MAX_NUMBER = 2_500_000_000;

const Index = () => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [luckMultiplier, setLuckMultiplier] = useState(1);
  const [highestRoll, setHighestRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isRare, setIsRare] = useState(false);

  const generateNumber = useCallback(() => {
    // Luck determines the maximum range you can realistically hit
    // At 1x luck: max ~50
    // At 2x luck: max ~500
    // At 3x luck: max ~5,000
    // At 5x luck: max ~500,000
    // At 7x luck: max ~50,000,000
    // At 10x luck: max ~2.5 billion
    
    // Calculate the effective max based on luck (exponential scaling)
    const luckPower = Math.pow(luckMultiplier, 4); // Luck has exponential effect
    const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
    
    // Within the effective range, lower numbers are still more common
    const random = Math.random();
    const biasedRandom = Math.pow(random, 2); // Square to bias toward lower numbers
    
    // Generate number within the luck-based range
    const number = Math.floor(biasedRandom * effectiveMax) + 1;
    
    return number;
  }, [luckMultiplier]);

  const handleRoll = useCallback(() => {
    setIsRolling(true);
    setIsRare(false);

    // Simulate rolling animation
    setTimeout(() => {
      const number = generateNumber();
      setCurrentNumber(number);
      setRollCount((prev) => prev + 1);
      
      // Increase luck multiplier with each roll (faster early, slower later)
      setLuckMultiplier((prev) => {
        if (prev < 3) return prev + 0.05;
        if (prev < 5) return prev + 0.03;
        if (prev < 8) return prev + 0.02;
        return Math.min(prev + 0.01, 10);
      });
      
      // Check if it's a rare roll based on current luck range
      const luckPower = Math.pow(luckMultiplier, 4);
      const effectiveMax = Math.min(Math.floor(50 * luckPower), MAX_NUMBER);
      if (number >= effectiveMax * 0.8) {
        setIsRare(true);
      }
      
      // Update highest roll
      if (number > highestRoll) {
        setHighestRoll(number);
      }
      
      setIsRolling(false);
    }, 300);
  }, [generateNumber, highestRoll]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
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
            value={`${luckMultiplier.toFixed(2)}x`}
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

        {/* Main Game Area */}
        <motion.div
          className="bg-card/30 backdrop-blur-md rounded-2xl border border-border p-8 md:p-12"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          {/* Number Display */}
          <NumberDisplay number={currentNumber} isRare={isRare} />

          {/* Roll Button */}
          <div className="flex justify-center mt-8">
            <RollButton onClick={handleRoll} isRolling={isRolling} />
          </div>

          {/* Luck Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
          <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono">
              Max range: ~{Math.min(Math.floor(50 * Math.pow(luckMultiplier, 4)), MAX_NUMBER).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Highest Roll */}
        <HighestRoll highest={highestRoll} />

        {/* Luck Progression Guide */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono mb-2">Luck Unlocks</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
            <span className={luckMultiplier >= 1 ? "text-muted-foreground" : "text-muted"}>1x: ~50</span>
            <span className={luckMultiplier >= 3 ? "text-primary" : "text-muted"}>3x: ~4K</span>
            <span className={luckMultiplier >= 5 ? "text-primary text-glow-primary" : "text-muted"}>5x: ~300K</span>
            <span className={luckMultiplier >= 7 ? "text-secondary" : "text-muted"}>7x: ~120M</span>
            <span className={luckMultiplier >= 9 ? "text-accent text-glow-accent" : "text-muted"}>9x: ~3B</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
