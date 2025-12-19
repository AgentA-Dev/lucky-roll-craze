import { motion } from 'framer-motion';
import { LogIn, LogOut, Trophy, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserHeaderProps {
  user: SupabaseUser | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onLeaderboardClick: () => void;
}

const UserHeader = ({ user, onLoginClick, onLogoutClick, onLeaderboardClick }: UserHeaderProps) => {
  const username = user?.user_metadata?.username || 'Player';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-40 flex items-center gap-2"
    >
      <button
        onClick={onLeaderboardClick}
        className="flex items-center gap-2 px-3 py-2 bg-accent/20 border border-accent/30 
                   rounded-lg hover:bg-accent/30 transition-colors"
      >
        <Trophy className="w-4 h-4 text-accent" />
        <span className="text-sm font-mono text-accent hidden sm:inline">Leaderboard</span>
      </button>

      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/20 border border-primary/30 rounded-lg">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">{username}</span>
          </div>
          <button
            onClick={onLogoutClick}
            className="p-2 bg-muted/50 border border-border rounded-lg 
                       hover:bg-destructive/20 hover:border-destructive/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground 
                     font-display font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <LogIn className="w-4 h-4" />
          <span className="text-sm">Login</span>
        </button>
      )}
    </motion.div>
  );
};

export default UserHeader;
