import { useMemo } from "react";

export type StrengthLevel = "very-weak" | "weak" | "medium" | "strong" | "very-strong";

export const usePasswordStrength = (
  password: string
): {
  level: StrengthLevel;
  score: number;
  label: string;
  color: string;
} => {
  return useMemo(() => {
    if (!password) {
      return { level: "very-weak", score: 0, label: "", color: "" };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const levelMap: StrengthLevel[] = [
      "very-weak",   
      "weak",        
      "medium",      
      "strong",      
      "very-strong", 
    ];

    const clampedScore = Math.min(Math.max(score, 1), 5);
    const level = levelMap[clampedScore - 1];

    const config = {
      "very-weak": { label: "Very Weak", color: "bg-red-500 text-red-500" },
      weak: { label: "Weak", color: "bg-orange-500 text-orange-500" },
      medium: { label: "Medium", color: "bg-yellow-500 text-yellow-500" },
      strong: { label: "Strong", color: "bg-green-500 text-green-500" },
      "very-strong": { label: "Very Strong", color: "bg-lime-500 text-lime-500" },
    };

    return {
      level,
      score,
      label: config[level].label,
      color: config[level].color,
    };
  }, [password]);
};