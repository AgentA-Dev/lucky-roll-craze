import { motion } from "framer-motion";
import { ShoppingBag, X, Sparkles, Zap, Beaker, Lock, Check } from "lucide-react";
import { SHOP_ITEMS, ShopItem, calculateCost } from "@/lib/shopData";
import { forwardRef } from "react";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: number;
  upgradeLevels: Record<string, number>;
  onPurchase: (itemId: string, cost: number) => void;
}

const ShopModal = forwardRef<HTMLDivElement, ShopModalProps>(({ isOpen, onClose, currency, upgradeLevels, onPurchase }, ref) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: ShopItem['category']) => {
    switch (category) {
      case 'luck': return <Sparkles className="w-5 h-5" />;
      case 'speed': return <Zap className="w-5 h-5" />;
      case 'potion': return <Beaker className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: ShopItem['category']) => {
    switch (category) {
      case 'luck': return 'text-accent border-accent/30 bg-accent/10';
      case 'speed': return 'text-primary border-primary/30 bg-primary/10';
      case 'potion': return 'text-secondary border-secondary/30 bg-secondary/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card border border-border rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold">Luck Shop</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Display */}
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
          <p className="text-sm text-muted-foreground font-mono mb-1">Your Currency (Highest Roll)</p>
          <p className="text-3xl font-display font-bold text-accent text-glow-accent">
            {currency.toLocaleString()}
          </p>
        </div>

        {/* Shop Items */}
        <div className="space-y-3">
          {SHOP_ITEMS.map((item) => {
            const currentLevel = upgradeLevels[item.id] || 0;
            const cost = calculateCost(item, currentLevel);
            const canAfford = currency >= cost;
            const isMaxed = currentLevel >= item.maxLevel;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border transition-all ${getCategoryColor(item.category)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getCategoryIcon(item.category)}</div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {isMaxed ? 'MAX LEVEL' : `Level ${currentLevel}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {isMaxed ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold bg-green-500/20 text-green-400">
                        <Check className="w-4 h-4" />
                        Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => canAfford && onPurchase(item.id, cost)}
                        disabled={!canAfford}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                          canAfford
                            ? 'bg-accent text-accent-foreground hover:scale-105'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {!canAfford && <Lock className="w-3 h-3" />}
                        {cost.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Close hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Click outside or press X to close
        </p>
      </motion.div>
    </motion.div>
  );
});

ShopModal.displayName = 'ShopModal';

export default ShopModal;
