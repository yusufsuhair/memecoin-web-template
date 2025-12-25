"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Coins } from "lucide-react";

interface LeaderboardEntry {
  id?: number;
  wallet_address: string;
  score: number;
  created_at?: string;
  updated_at?: string;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leaderboard");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch leaderboard");
      }

      setEntries(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (index === 1) return <Medal className="w-4 h-4 text-gray-300" />;
    if (index === 2) return <Medal className="w-4 h-4 text-amber-600" />;
    return <Award className="w-3 h-3 text-white/50" />;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "from-yellow-400/20 to-yellow-600/20 border-yellow-400/50";
    if (index === 1) return "from-gray-300/20 to-gray-500/20 border-gray-300/50";
    if (index === 2) return "from-amber-600/20 to-amber-800/20 border-amber-600/50";
    return "from-[#00ff88]/10 to-[#00d4ff]/10 border-[#00ff88]/30";
  };

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-full h-full">
      <div className="relative bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-lg p-4 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <h3 className="text-xl font-display mb-2 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">
            Leaderboard
          </h3>
        </motion.div>

        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#00ff88]"></div>
              <p className="text-white/70 mt-2 text-sm">Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-red-400 mb-2 text-sm">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="px-4 py-1 text-sm bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded hover:scale-105 transition-transform"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {entries.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-white/20 mx-auto mb-2" />
                  <p className="text-white/70 text-sm">
                    No scores yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[600px] pr-2">
                  {entries.slice(0, 20).map((entry, index) => (
                    <motion.div
                      key={entry.id || entry.wallet_address}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`
                        flex items-center justify-between p-2 rounded-lg border
                        bg-gradient-to-r ${getRankColor(index)}
                        hover:scale-[1.02] transition-transform
                      `}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {getRankIcon(index)}
                          <span className="text-sm font-bold text-white">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs text-white/90 truncate">
                            {formatAddress(entry.wallet_address)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Coins className="w-4 h-4 text-[#00ff88]" />
                        <span className="text-sm font-bold text-[#00ff88]">
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

