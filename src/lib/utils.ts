import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateChatId(userId1: string, userId2: string): string {
  // Sort IDs to ensure consistent chat ID regardless of who initiates
  return [userId1, userId2].sort().join('-')
}
