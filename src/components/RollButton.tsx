import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RollButtonProps {
  onClick: () => void;
  isRolling: boolean;
  isSuperRoll?: boolean;
  cooldown?: number; // cooldown in seconds
}

const RollButton = ({ onClick, isRolling, isSuperRoll = false, cooldown = 4 }: RollButtonProps) => {
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    if (cooldownLeft > 0) {
      const timer = setTimeout(() => {
        setCooldownLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cooldownLeft]);

  const handleClick = () => {
    if (cooldownLeft > 0 || isRolling) return;
    
    onClick();
    setCooldownLeft(cooldown);
    setLastClickTime(Date.now());
  };

  const isOnCooldown = cooldownLeft > 0;
  const cooldownProgress = cooldown > 0 ? (cooldown - cooldownLeft) / cooldown : 1;

  return (
    <motion.button
      onClick={handleClick}
      disabled={isRolling || isOnCooldown}
      whileHover={!isOnCooldown ? { scale: 1.05 } : {}}
      whileTap={!isOnCooldown ? { scale: 0.95 } : {}}
      className={`relative px-16 py-6 font-display text-2xl font-bold uppercase tracking-wider
                 rounded-xl transition-all duration-200 overflow-hidden
                 disabled:cursor-not-allowed
                 border-2 ${
                   isSuperRoll
                     ? 'bg-accent text-accent-foreground border-accent/50 hover:border-accent box-glow-accent'
                     : 'bg-primary text-primary-foreground border-primary/50 hover:border-primary box-glow-primary'
                 } ${isOnCooldown ? 'opacity-70' : 'animate-pulse-glow'}`}
    >
      {/* Cooldown overlay */}
      {isOnCooldown && (
        <motion.div
          className="absolute inset-0 bg-background/50"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 1 - cooldownProgress }}
          style={{ transformOrigin: 'left' }}
        />
      )}
      
      <span className="relative z-10">
        {isRolling ? "Rolling..." : isOnCooldown ? cooldownLeft.toFixed(1) + "s" : isSuperRoll ? "SUPER!" : "Roll"}
      </span>
      <div className={`absolute inset-0 rounded-xl blur-xl -z-10 ${
        isSuperRoll ? 'bg-accent/20' : 'bg-primary/20'
      }`} />
    </motion.button>
  );
};

export default RollButton;
