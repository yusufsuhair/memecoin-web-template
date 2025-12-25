"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Coins, Zap, Trophy } from "lucide-react";

interface Coin {
  x: number;
  y: number;
  id: number;
  collected: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  id: number;
  width: number;
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const playerRef = useRef({ x: 400, y: 500, width: 60, height: 60, speed: 5 });
  const coinsRef = useRef<Coin[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const gameSpeedRef = useRef(2);
  const coinSpawnTimerRef = useRef(0);
  const obstacleSpawnTimerRef = useRef(0);

  const initGame = useCallback(() => {
    playerRef.current = { x: 400, y: 500, width: 60, height: 60, speed: 5 };
    coinsRef.current = [];
    obstaclesRef.current = [];
    gameSpeedRef.current = 2;
    coinSpawnTimerRef.current = 0;
    obstacleSpawnTimerRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  const checkCollision = (rect1: { x: number; y: number; width: number; height: number }, 
                          rect2: { x: number; y: number; width: number; height: number }) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || gameOver) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const player = playerRef.current;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#001122");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 53 + Date.now() * 0.1) % canvas.height;
      ctx.fillRect(x, y, 2, 2);
    }

    // Handle player movement
    if (keysRef.current.left && player.x > 0) {
      player.x -= player.speed;
    }
    if (keysRef.current.right && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }

    // Spawn coins
    coinSpawnTimerRef.current++;
    if (coinSpawnTimerRef.current > 60 - gameSpeedRef.current * 5) {
      coinsRef.current.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        id: Date.now(),
        collected: false,
      });
      coinSpawnTimerRef.current = 0;
    }

    // Spawn obstacles
    obstacleSpawnTimerRef.current++;
    if (obstacleSpawnTimerRef.current > 120 - gameSpeedRef.current * 10) {
      obstaclesRef.current.push({
        x: Math.random() * (canvas.width - 60),
        y: -60,
        id: Date.now(),
        width: 40 + Math.random() * 40,
      });
      obstacleSpawnTimerRef.current = 0;
    }

    // Update and draw coins
    coinsRef.current = coinsRef.current.filter((coin) => {
      coin.y += gameSpeedRef.current + 1;
      
      if (coin.y > canvas.height) return false;
      if (coin.collected) return false;

      // Check collision with player
      if (checkCollision(player, { x: coin.x, y: coin.y, width: 40, height: 40 })) {
        coin.collected = true;
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        return false;
      }

      // Draw coin
      ctx.save();
      ctx.translate(coin.x + 20, coin.y + 20);
      ctx.rotate(Date.now() * 0.005);
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0);
      ctx.restore();

      return true;
    });

    // Update and draw obstacles
    obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
      obstacle.y += gameSpeedRef.current + 2;

      if (obstacle.y > canvas.height) return false;

      // Check collision with player
      if (checkCollision(player, { x: obstacle.x, y: obstacle.y, width: obstacle.width, height: 40 })) {
        setGameOver(true);
        setIsPlaying(false);
        return false;
      }

      // Draw obstacle
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 40);
      ctx.fillStyle = "#8b0000";
      ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, 30);

      return true;
    });

    // Draw player (rocket)
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // Rocket body
    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(-player.width / 4, player.height / 2);
    ctx.lineTo(player.width / 4, player.height / 2);
    ctx.closePath();
    ctx.fill();

    // Rocket window
    ctx.fillStyle = "#00d4ff";
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Rocket flame
    ctx.fillStyle = "#ff6b00";
    ctx.beginPath();
    ctx.moveTo(-player.width / 6, player.height / 2);
    ctx.lineTo(0, player.height / 2 + 15);
    ctx.lineTo(player.width / 6, player.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Increase game speed
    if (score > 0 && score % 50 === 0) {
      gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.1, 5);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, gameOver, highScore, score]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <section id="game" className="relative w-full min-h-screen bg-black flex items-center justify-center py-20">
      <div className="max-w-4xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-display mb-4 bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">
            Collect The Coins!
          </h2>
          <p className="text-white/70 text-lg mb-6">
            Use Arrow Keys or A/D to move. Collect coins and avoid obstacles!
          </p>
        </motion.div>

        <div className="relative bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-lg p-6">
          {/* Score Display */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#00ff88]">
              <Coins className="w-5 h-5" />
              <span className="text-xl font-bold">Score: {score}</span>
            </div>
            {highScore > 0 && (
              <div className="flex items-center gap-2 text-[#00d4ff]">
                <Trophy className="w-5 h-5" />
                <span className="text-lg">High: {highScore}</span>
              </div>
            )}
          </div>

          {/* Game Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-auto border-2 border-[#00ff88]/50 rounded-lg bg-black"
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {/* Start Screen */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <Zap className="w-16 h-16 text-[#00ff88] mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Play?</h3>
                  <button
                    onClick={initGame}
                    className="px-8 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Start Game
                  </button>
                </motion.div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <h3 className="text-4xl font-bold text-red-500 mb-2">Game Over!</h3>
                  <p className="text-2xl text-white mb-4">Final Score: {score}</p>
                  {score === highScore && score > 0 && (
                    <p className="text-[#00ff88] mb-4">🎉 New High Score! 🎉</p>
                  )}
                  <button
                    onClick={initGame}
                    className="px-8 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-white/60 text-sm">
            <p>← → Arrow Keys or A/D to move</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;

