import { motion } from "framer-motion";
import { X, Zap, Sparkles } from "lucide-react";
import { VOID_SHOP_ITEMS, VoidShopItem } from "@/lib/shopData";
import { forwardRef } from "react";

interface VoidShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  voidPoints: number;
  voidUpgrades: Record<string, number>;
  onPurchase: (itemId: string, cost: number) => void;
}

const VoidShopModal = forwardRef<HTMLDivElement, VoidShopModalProps>(({ isOpen, onClose, voidPoints, voidUpgrades, onPurchase }, ref) => {
  if (!isOpen) return null;

  const getCost = (item: VoidShopItem, level: number) => {
    return item.baseCost + (level * item.costPerLevel);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        className="relative bg-gradient-to-b from-violet-950/90 to-purple-950/90 border border-violet-500/30 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <h2 className="font-display text-2xl font-bold text-violet-300">Void Shop</h2>
          </div>
          <p className="text-sm text-violet-400/70 font-mono">
            Void Points: <span className="text-purple-300 font-bold">{voidPoints}</span>
          </p>
        </div>

        <div className="space-y-3">
          {VOID_SHOP_ITEMS.map((item) => {
            const currentLevel = voidUpgrades[item.id] || 0;
            const cost = getCost(item, currentLevel);
            const canAfford = voidPoints >= cost;
            const isMaxed = currentLevel >= item.maxLevel;

            return (
              <motion.div
                key={item.id}
                className={`
                  p-4 rounded-xl border transition-all
                  ${item.category === 'super_roll' 
                    ? 'bg-violet-900/30 border-violet-500/30' 
                    : 'bg-purple-900/30 border-purple-500/30'
                  }
                `}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-violet-200 flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${item.category === 'super_roll' ? 'text-violet-400' : 'text-purple-400'}`} />
                      {item.name}
                    </h3>
                    <p className="text-xs text-violet-400/70">{item.description}</p>
                  </div>
                  <span className="text-xs font-mono text-violet-300 bg-violet-800/50 px-2 py-1 rounded">
                    Lv.{currentLevel}/{item.maxLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-mono text-purple-300">
                    {isMaxed ? 'MAXED' : `${cost} VP`}
                  </span>
                  <button
                    onClick={() => onPurchase(item.id, cost)}
                    disabled={!canAfford || isMaxed}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-bold transition-all
                      ${canAfford && !isMaxed
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    {isMaxed ? 'Maxed' : 'Buy'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
});

VoidShopModal.displayName = 'VoidShopModal';

export default VoidShopModal;
