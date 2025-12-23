"use client";

import { SmurfClassification } from "@/lib/api";

interface SmurfIndicatorProps {
  score: number;
  classification: SmurfClassification;
  size?: "sm" | "md" | "lg";
}

const classificationColors: Record<SmurfClassification, string> = {
  LIKELY_SMURF: "bg-red-500",
  POSSIBLE_SMURF: "bg-orange-500",
  UNLIKELY: "bg-green-500",
  UNKNOWN: "bg-gray-500",
};

const classificationLabels: Record<SmurfClassification, string> = {
  LIKELY_SMURF: "Likely Smurf",
  POSSIBLE_SMURF: "Possible Smurf",
  UNLIKELY: "Unlikely",
  UNKNOWN: "Unknown",
};

const sizeClasses = {
  sm: "w-12 h-12 text-sm",
  md: "w-16 h-16 text-base",
  lg: "w-20 h-20 text-lg",
};

export function SmurfIndicator({
  score,
  classification,
  size = "md",
}: SmurfIndicatorProps) {
  const bgColor = classificationColors[classification];
  const label = classificationLabels[classification];
  const sizeClass = sizeClasses[size];

  // Get ring color based on score
  const getRingColor = () => {
    if (score >= 70) return "ring-red-500";
    if (score >= 50) return "ring-orange-500";
    if (score >= 30) return "ring-yellow-500";
    return "ring-green-500";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClass} ${bgColor} rounded-full flex items-center justify-center ring-4 ${getRingColor()} ring-offset-2 ring-offset-gray-900`}
        title={`${label}: ${score.toFixed(0)}%`}
      >
        <span className="font-bold text-white">{Math.round(score)}</span>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number | null;
  maxScore?: number;
}

export function ScoreBar({ label, score, maxScore = 100 }: ScoreBarProps) {
  if (score === null) return null;

  const percentage = (score / maxScore) * 100;

  const getBarColor = () => {
    if (percentage >= 70) return "bg-red-500";
    if (percentage >= 50) return "bg-orange-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">{score.toFixed(0)}</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
