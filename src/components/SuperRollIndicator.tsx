import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface SuperRollIndicatorProps {
  rollsUntilSuper: number;
  isSuperRoll: boolean;
}

const SuperRollIndicator = ({ rollsUntilSuper, isSuperRoll }: SuperRollIndicatorProps) => {
  if (isSuperRoll) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full 
                   bg-accent/20 border border-accent text-accent
                   animate-pulse font-display text-sm font-bold"
      >
        <Zap className="w-4 h-4" />
        SUPER ROLL READY!
        <Zap className="w-4 h-4" />
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i < (10 - rollsUntilSuper) 
                ? 'bg-accent' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span>Super in {rollsUntilSuper}</span>
    </div>
  );
};

export default SuperRollIndicator;
