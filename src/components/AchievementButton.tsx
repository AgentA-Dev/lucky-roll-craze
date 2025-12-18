import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface AchievementButtonProps {
  onClick: () => void;
  unlockedCount: number;
  totalCount: number;
}

const AchievementButton = ({ onClick, unlockedCount, totalCount }: AchievementButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-accent/30 hover:border-accent/60 transition-all group"
    >
      <Trophy className="w-6 h-6 text-accent group-hover:text-accent" />
      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-mono font-bold">
        {unlockedCount}/{totalCount}
      </div>
    </motion.button>
  );
};

export default AchievementButton;
