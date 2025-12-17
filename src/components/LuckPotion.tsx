import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";

interface LuckPotionProps {
  potionCount: number;
  potionTimeLeft: number;
  onActivate: () => void;
}

const LuckPotion = ({ potionCount, potionTimeLeft, onActivate }: LuckPotionProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={onActivate}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-secondary/20 border border-secondary/50
                   hover:bg-secondary/30 hover:border-secondary
                   transition-all duration-200 text-secondary font-mono text-sm"
      >
        <Sparkles className="w-4 h-4" />
        <Plus className="w-3 h-3" />
        Luck Potion
      </motion.button>
      
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="text-muted-foreground">
          Stacked: <span className="text-secondary">{potionCount}x</span>
        </span>
        {potionTimeLeft > 0 && (
          <span className="text-secondary animate-pulse">
            {formatTime(potionTimeLeft)}
          </span>
        )}
      </div>
    </div>
  );
};

export default LuckPotion;
