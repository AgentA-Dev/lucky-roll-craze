import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface NumberDisplayProps {
  number: number | null;
  isRare: boolean;
  isRolling?: boolean;
}

const NumberDisplay = ({ number, isRare, isRolling = false }: NumberDisplayProps) => {
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const targetNumberRef = useRef<number | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getRarityColor = (num: number) => {
    if (num >= 1_000_000_000) return "text-accent text-glow-accent"; // Billion+
    if (num >= 100_000_000) return "text-secondary"; // 100M+
    if (num >= 1_000_000) return "text-primary text-glow-primary"; // 1M+
    if (num >= 10_000) return "text-primary"; // 10K+
    return "text-foreground";
  };

  // Get animation intensity based on number magnitude
  const getAnimationIntensity = (num: number) => {
    if (num >= 1_000_000_000) return { shakes: 25, glowIntensity: 'animate-rare-glow', scale: 1.2 };
    if (num >= 100_000_000) return { shakes: 20, glowIntensity: '', scale: 1.15 };
    if (num >= 1_000_000) return { shakes: 15, glowIntensity: '', scale: 1.1 };
    if (num >= 10_000) return { shakes: 10, glowIntensity: '', scale: 1.05 };
    return { shakes: 5, glowIntensity: '', scale: 1 };
  };

  useEffect(() => {
    if (number !== null && number !== targetNumberRef.current) {
      targetNumberRef.current = number;
      setIsAnimating(true);

      // Clear any existing animation
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      const intensity = getAnimationIntensity(number);
      const duration = 2000; // 2 seconds
      const intervalTime = 80; // Update every 80ms
      const totalSteps = duration / intervalTime;
      let currentStep = 0;

      // Generate random numbers that get progressively closer to target
      animationRef.current = setInterval(() => {
        currentStep++;
        
        if (currentStep >= totalSteps) {
          // Final reveal
          setDisplayNumber(number);
          setIsAnimating(false);
          if (animationRef.current) {
            clearInterval(animationRef.current);
          }
          return;
        }

        // Progress from 0 to 1
        const progress = currentStep / totalSteps;
        
        // Create escalating random numbers
        // Start with small numbers, gradually increase range to target
        const maxForStep = Math.floor(number * Math.pow(progress, 0.5));
        const minForStep = Math.floor(maxForStep * 0.3);
        
        // Add some randomness but trend upward
        const randomNum = Math.floor(Math.random() * (maxForStep - minForStep + 1)) + minForStep;
        setDisplayNumber(Math.max(1, randomNum));
      }, intervalTime);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [number]);

  const currentIntensity = displayNumber ? getAnimationIntensity(displayNumber) : null;

  return (
    <div className="min-h-[120px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {displayNumber !== null ? (
          <motion.div
            key={isAnimating ? 'rolling' : displayNumber}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: isAnimating ? [1, 1.02, 1] : currentIntensity?.scale || 1, 
              opacity: 1,
              x: isAnimating ? [0, -3, 3, -2, 2, 0] : 0,
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: isAnimating ? 20 : 15, 
              stiffness: isAnimating ? 400 : 300,
              x: { duration: 0.1, repeat: isAnimating ? Infinity : 0 }
            }}
            className={`font-display text-4xl md:text-6xl font-bold ${getRarityColor(displayNumber)} ${
              !isAnimating && isRare ? 'animate-rare-glow p-4 rounded-xl' : ''
            } ${isAnimating ? 'opacity-80' : ''}`}
          >
            {formatNumber(displayNumber)}
            {isAnimating && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="ml-2 text-muted-foreground"
              >
                ...
              </motion.span>
            )}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-xl font-mono"
          >
            Click roll to start
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NumberDisplay;
