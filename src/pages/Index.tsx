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
    // Higher luck multiplier = better chance at higher numbers
    // Using exponential distribution modified by luck
    const random = Math.random();
    
    // The luck multiplier reduces the exponent, making higher numbers more likely
    const exponent = 4 / luckMultiplier; // Base exponent of 4, reduced by luck
    const biasedRandom = Math.pow(random, exponent);
    
    // Map to our range (1 to 2.5 billion)
    const number = Math.floor(biasedRandom * MAX_NUMBER) + 1;
    
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
      
      // Increase luck multiplier slightly with each roll
      setLuckMultiplier((prev) => Math.min(prev + 0.01, 10));
      
      // Check if it's a rare roll (top 1%)
      if (number >= MAX_NUMBER * 0.4) {
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
              Luck increases with each roll
            </span>
          </div>
        </motion.div>

        {/* Highest Roll */}
        <HighestRoll highest={highestRoll} />

        {/* Rarity Guide */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono mb-2">Rarity Guide</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
            <span className="text-muted-foreground">Common</span>
            <span className="text-primary">100M+</span>
            <span className="text-secondary">1B+</span>
            <span className="text-accent text-glow-accent">2B+</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
