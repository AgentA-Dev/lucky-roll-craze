import { motion } from "framer-motion";
import { Trophy, X, Sparkles } from "lucide-react";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievementData";

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAchievements: Record<string, boolean>;
  highestRoll: number;
}

const AchievementPanel = ({ isOpen, onClose, unlockedAchievements, highestRoll }: AchievementPanelProps) => {
  const totalLuckBonus = ACHIEVEMENTS.reduce((total, achievement) => {
    return total + (unlockedAchievements[achievement.id] ? achievement.luckReward : 0);
  }, 0);

  const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-background/80 backdrop-blur-md border-l border-border/50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-accent" />
            <h2 className="font-display text-2xl font-bold">Achievements</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground font-mono">Progress</span>
            <span className="font-mono text-accent">{unlockedCount}/{ACHIEVEMENTS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-foreground">
              Total Luck Bonus: <span className="text-accent font-bold">+{totalLuckBonus.toFixed(2)}x</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Achievement bonuses are permanent and never reset!
          </p>
        </div>

        {/* Achievement List */}
        <div className="space-y-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements[achievement.id];
            const progress = Math.min((highestRoll / achievement.threshold) * 100, 100);

            return (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked 
                    ? 'border-accent/50 bg-accent/10' 
                    : 'border-border/30 bg-card/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-display font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h3>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        isUnlocked 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        +{achievement.luckReward}x
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${isUnlocked ? 'bg-accent' : 'bg-primary/50'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {highestRoll.toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {achievement.threshold.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementPanel;
