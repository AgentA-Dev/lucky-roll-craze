import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ShopButtonProps {
  onClick: () => void;
  currency: number;
}

const ShopButton = ({ onClick, currency }: ShopButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 px-5 py-3 rounded-xl
                 bg-card/50 border border-accent/30
                 hover:border-accent hover:bg-accent/10
                 transition-all duration-200"
    >
      <ShoppingBag className="w-5 h-5 text-accent" />
      <div className="text-left">
        <p className="text-xs text-muted-foreground font-mono">Shop</p>
        <p className="text-sm font-display font-bold text-accent">
          {currency.toLocaleString()}
        </p>
      </div>
    </motion.button>
  );
};

export default ShopButton;
