"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Coins, Zap, Trophy, Volume2, VolumeX } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import Leaderboard from "./Leaderboard";

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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const Game = () => {
  const { publicKey, connected } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const screenShakeRef = useRef(0);
  
  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playerRef = useRef({ x: 400, y: 500, width: 60, height: 60, speed: 5 });
  const coinsRef = useRef<Coin[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const mouseXRef = useRef<number | null>(null);
  const gameSpeedRef = useRef(2);
  const coinSpawnTimerRef = useRef(0);
  const obstacleSpawnTimerRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);
  
  // Resume audio context on user interaction (required by browsers)  
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.warn("Could not resume audio context:", e);
      }
    }
  }, []);
  
  const playCoinSound = useCallback(() => {
    if (muted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [muted]);
  
  const playGameOverSound = useCallback(() => {
    if (muted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    // Low rumble sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [muted]);
  
  const stopBackgroundMusic = useCallback(() => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }
  }, []);
  
  const playBackgroundMusic = useCallback(async () => {
    if (muted || !audioContextRef.current) return;
    
    // Resume audio context if suspended (required by browsers)
    await resumeAudioContext();
    
    if (!audioContextRef.current || muted) return;
    
    // Stop any existing music
    stopBackgroundMusic();
    
    const ctx = audioContextRef.current;
    let noteIndex = 0;
    
    // Upbeat game music melody - C major scale pattern
    const melody = [
      { freq: 261.63, duration: 250 }, // C
      { freq: 293.66, duration: 250 }, // D
      { freq: 329.63, duration: 250 }, // E
      { freq: 392.00, duration: 300 }, // G
      { freq: 349.23, duration: 250 }, // F
      { freq: 329.63, duration: 250 }, // E
      { freq: 293.66, duration: 300 }, // D
      { freq: 261.63, duration: 400 }, // C
    ];
    
    const playNote = () => {
      if (muted || !isPlaying || gameOver || !audioContextRef.current) {
        stopBackgroundMusic();
        return;
      }
      
      const ctx = audioContextRef.current;
      const note = melody[noteIndex];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + note.duration / 1000 * 0.7);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + note.duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + note.duration / 1000);
      
      noteIndex = (noteIndex + 1) % melody.length;
    };
    
    // Play first note immediately
    playNote();
    
    // Calculate total duration for looping
    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
    
    // Loop the melody
    musicIntervalRef.current = setInterval(() => {
      if (isPlaying && !gameOver && !muted && audioContextRef.current) {
        playNote();
      } else {
        stopBackgroundMusic();
      }
    }, totalDuration);
  }, [muted, isPlaying, gameOver, resumeAudioContext, stopBackgroundMusic]);

  const submitScoreToLeaderboard = useCallback(async (finalScore: number) => {
    if (!connected || !publicKey || scoreSubmitted) return;

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: publicKey.toBase58(),
          score: finalScore,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setScoreSubmitted(true);
        toast.success("Score submitted to leaderboard! 🎉");
      } else {
        if (result.message?.includes("not higher")) {
          toast.info("Your score wasn't higher than your previous best.");
        } else {
          toast.error("Failed to submit score. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to submit score. Please try again.");
    }
  }, [connected, publicKey, scoreSubmitted]);

  const initGame = useCallback(async () => {
    playerRef.current = { x: 400, y: 500, width: 60, height: 60, speed: 5 };
    coinsRef.current = [];
    obstaclesRef.current = [];
    particlesRef.current = [];
    gameSpeedRef.current = 2;
    coinSpawnTimerRef.current = 0;
    obstacleSpawnTimerRef.current = 0;
    screenShakeRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    
    // Resume audio context and start background music
    await resumeAudioContext();
    setTimeout(() => {
      playBackgroundMusic();
    }, 200); // Small delay to ensure state is set
  }, [muted, playBackgroundMusic, resumeAudioContext]);
  
  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        maxLife: 1,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  };

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
    
    // Apply screen shake
    let shakeX = 0;
    let shakeY = 0;
    let shouldRestore = false;
    if (screenShakeRef.current > 0) {
      shakeX = (Math.random() - 0.5) * screenShakeRef.current;
      shakeY = (Math.random() - 0.5) * screenShakeRef.current;
      screenShakeRef.current *= 0.9;
      ctx.save();
      ctx.translate(shakeX, shakeY);
      shouldRestore = true;
    }

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#001122");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw animated stars with twinkling
    const time = Date.now() * 0.001;
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 53 + time * 50) % canvas.height;
      const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
      const size = 1 + twinkle;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some colorful stars
      if (i % 10 === 0) {
        ctx.fillStyle = `rgba(0, 255, 136, ${twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Handle player movement - follow mouse/touch position
    if (mouseXRef.current !== null) {
      const targetX = mouseXRef.current;
      const currentX = player.x + player.width / 2;
      const diff = targetX - currentX;
      
      // Smooth movement with easing
      if (Math.abs(diff) > 2) {
        player.x += diff * 0.15; // Smooth interpolation
        // Clamp to canvas bounds
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
      } else {
        player.x = targetX - player.width / 2;
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
      }
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
        
        // Play coin sound
        playCoinSound();
        
        // Create particles
        createParticles(coin.x + 20, coin.y + 20, "#FFD700", 8);
        
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        return false;
      }

      // Draw coin with animation
      ctx.save();
      ctx.translate(coin.x + 20, coin.y + 20);
      const rotation = Date.now() * 0.005;
      ctx.rotate(rotation);
      
      // Glow effect
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      glowGradient.addColorStop(0, "rgba(255, 215, 0, 0.5)");
      glowGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Coin body
      const coinGradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 15);
      coinGradient.addColorStop(0, "#FFD700");
      coinGradient.addColorStop(1, "#FFA500");
      ctx.fillStyle = coinGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Coin shine
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(-5, -5, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Dollar sign
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 18px Arial";
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
        // Play game over sound
        playGameOverSound();
        
        // Stop background music
        stopBackgroundMusic();
        
        // Create explosion particles
        createParticles(
          player.x + player.width / 2,
          player.y + player.height / 2,
          "#ff0000",
          30
        );
        
        // Screen shake
        screenShakeRef.current = 20;
        
        const currentScore = score;
        setGameOver(true);
        setIsPlaying(false);
        
        // Submit score if wallet is connected
        setTimeout(() => {
          submitScoreToLeaderboard(currentScore);
        }, 0);
        
        return false;
      }

      // Draw obstacle with gradient
      const obstacleGradient = ctx.createLinearGradient(
        obstacle.x,
        obstacle.y,
        obstacle.x,
        obstacle.y + 40
      );
      obstacleGradient.addColorStop(0, "#ff4444");
      obstacleGradient.addColorStop(1, "#8b0000");
      ctx.fillStyle = obstacleGradient;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 40);
      
      // Obstacle border
      ctx.strokeStyle = "#660000";
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, 40);
      
      // Warning pattern
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, 8);
      ctx.fillRect(obstacle.x + 5, obstacle.y + 27, obstacle.width - 10, 8);

      return true;
    });

    // Draw player (rocket) with enhanced graphics
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // Rocket glow
    const rocketGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, player.width);
    rocketGlow.addColorStop(0, "rgba(0, 255, 136, 0.3)");
    rocketGlow.addColorStop(1, "rgba(0, 255, 136, 0)");
    ctx.fillStyle = rocketGlow;
    ctx.beginPath();
    ctx.arc(0, 0, player.width, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket body with gradient
    const rocketGradient = ctx.createLinearGradient(0, -player.height / 2, 0, player.height / 2);
    rocketGradient.addColorStop(0, "#00ff88");
    rocketGradient.addColorStop(1, "#00cc6a");
    ctx.fillStyle = rocketGradient;
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(-player.width / 4, player.height / 2);
    ctx.lineTo(player.width / 4, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Rocket border
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rocket window with shine
    const windowGradient = ctx.createRadialGradient(-3, -13, 0, 0, -10, 8);
    windowGradient.addColorStop(0, "#00d4ff");
    windowGradient.addColorStop(1, "#0088cc");
    ctx.fillStyle = windowGradient;
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Window highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(-3, -13, 4, 0, Math.PI * 2);
    ctx.fill();

    // Rocket flame with animation
    const flameSize = 15 + Math.sin(Date.now() * 0.01) * 3;
    const flameGradient = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + flameSize);
    flameGradient.addColorStop(0, "#ff6b00");
    flameGradient.addColorStop(0.5, "#ffaa00");
    flameGradient.addColorStop(1, "#ffff00");
    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.moveTo(-player.width / 6, player.height / 2);
    ctx.lineTo(0, player.height / 2 + flameSize);
    ctx.lineTo(player.width / 6, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Inner flame
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    ctx.moveTo(-player.width / 8, player.height / 2);
    ctx.lineTo(0, player.height / 2 + flameSize * 0.7);
    ctx.lineTo(player.width / 8, player.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Update particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      particle.vy += 0.2; // Gravity
      
      if (particle.life <= 0) return false;
      
      // Draw particle
      const alpha = particle.life;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      return true;
    });

    // Increase game speed
    if (score > 0 && score % 50 === 0) {
      gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.1, 5);
    }
    
    // Reset screen shake translation
    if (shouldRestore) {
      ctx.restore();
    }
    if (screenShakeRef.current > 0) {
      ctx.restore();
    }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }, [isPlaying, gameOver, highScore, score, muted, playCoinSound, playGameOverSound, stopBackgroundMusic, submitScoreToLeaderboard]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      stopBackgroundMusic();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopBackgroundMusic();
    };
  }, [isPlaying, gameOver, gameLoop, stopBackgroundMusic]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const getMouseX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      return (clientX - rect.left) * scaleX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPlaying && !gameOver) {
        mouseXRef.current = getMouseX(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPlaying && !gameOver && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling
        mouseXRef.current = getMouseX(e.touches[0].clientX);
      }
    };

    const handleMouseLeave = () => {
      // Keep last position when mouse leaves (don't reset)
    };

    const handleTouchEnd = () => {
      // Keep last position when touch ends (don't reset)
    };

    // Add event listeners to canvas container
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isPlaying, gameOver]);

  return (
    <section id="game" className="relative w-full min-h-screen bg-black flex items-center justify-center py-20">
      <div className="max-w-7xl w-full px-4">
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
            Move your mouse or drag your finger to control the rocket. Collect coins and avoid obstacles!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Container */}
          <div className="flex-1 relative bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-lg p-6">
          {/* Score Display */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-[#00ff88]">
              <Coins className="w-5 h-5" />
              <span className="text-xl font-bold">Score: {score}</span>
            </div>
            <div className="flex items-center gap-4">
              {highScore > 0 && (
                <div className="flex items-center gap-2 text-[#00d4ff]">
                  <Trophy className="w-5 h-5" />
                  <span className="text-lg">High: {highScore}</span>
                </div>
              )}
              <button
                onClick={() => {
                  const newMuted = !muted;
                  setMuted(newMuted);
                  if (newMuted) {
                    stopBackgroundMusic();
                  } else if (isPlaying && !gameOver) {
                    playBackgroundMusic();
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? (
                  <VolumeX className="w-5 h-5 text-white/70" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#00ff88]" />
                )}
              </button>
            </div>
          </div>

          {/* Game Canvas */}
          <div 
            ref={canvasContainerRef}
            className="relative cursor-pointer touch-none"
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-auto border-2 border-[#00ff88]/50 rounded-lg bg-black"
              style={{ maxWidth: "100%", height: "auto", touchAction: "none" }}
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
                  {!connected && (
                    <p className="text-yellow-400 mb-4 text-sm">
                      Connect your wallet to submit your score to the leaderboard!
                    </p>
                  )}
                  {connected && scoreSubmitted && (
                    <p className="text-[#00ff88] mb-4 text-sm">✅ Score submitted!</p>
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
            <p>Move mouse or drag finger over the game area to control</p>
          </div>
        </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:w-80 w-full">
            <Leaderboard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;

