import { PublicKey } from "@solana/web3.js";

// Input validation
export function validateWalletAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>\"']/g, "")
    .slice(0, 200); // Max length
}

export function validateScore(score: number): boolean {
  // Score must be positive integer within reasonable bounds
  return (
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 1000000 && // Max score limit
    !isNaN(score) &&
    isFinite(score)
  );
}

// Request size validation
export function validateRequestSize(body: any, maxSize: number = 10000): boolean {
  const size = JSON.stringify(body).length;
  return size <= maxSize;
}

// IP extraction (for future rate limiting)
export function getClientIP(request: Request): string {
  // Try various headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return "unknown";
}

