"use client";

import { SmurfClassification } from "@/lib/api";

interface SmurfIndicatorProps {
  score: number;
  classification: SmurfClassification;
  size?: "sm" | "md" | "lg";
}

const classificationConfig: Record<
  SmurfClassification,
  { label: string; color: string; bgColor: string; glowClass: string }
> = {
  LIKELY_SMURF: {
    label: "LIKELY",
    color: "var(--neon-red)",
    bgColor: "rgba(255, 42, 109, 0.15)",
    glowClass: "box-glow-red",
  },
  POSSIBLE_SMURF: {
    label: "POSSIBLE",
    color: "var(--neon-orange)",
    bgColor: "rgba(255, 107, 53, 0.15)",
    glowClass: "box-glow-orange",
  },
  UNLIKELY: {
    label: "CLEAN",
    color: "var(--neon-green)",
    bgColor: "rgba(57, 255, 20, 0.15)",
    glowClass: "box-glow-green",
  },
  UNKNOWN: {
    label: "UNKNOWN",
    color: "var(--text-muted)",
    bgColor: "rgba(85, 85, 102, 0.15)",
    glowClass: "",
  },
};

const sizeConfig = {
  sm: { container: "w-14 h-14", text: "text-lg", label: "text-[9px]" },
  md: { container: "w-18 h-18", text: "text-xl", label: "text-[10px]" },
  lg: { container: "w-24 h-24", text: "text-2xl", label: "text-xs" },
};

export function SmurfIndicator({
  score,
  classification,
  size = "md",
}: SmurfIndicatorProps) {
  const config = classificationConfig[classification];
  const sizes = sizeConfig[size];

  // Calculate the circumference and offset for the ring
  const radius = size === "sm" ? 24 : size === "md" ? 32 : 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Circular score display */}
      <div className={`relative ${sizes.container} flex items-center justify-center`}>
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="var(--border-dim)"
            strokeWidth="3"
          />
          {/* Score ring */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 6px ${config.color})`,
              transition: "stroke-dashoffset 0.5s ease-out",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="relative flex flex-col items-center justify-center rounded-full"
          style={{
            width: radius * 1.5,
            height: radius * 1.5,
            backgroundColor: config.bgColor,
          }}
        >
          <span
            className={`font-display font-bold ${sizes.text}`}
            style={{ color: config.color }}
          >
            {Math.round(score)}
          </span>
        </div>
      </div>

      {/* Classification label */}
      <span
        className={`font-display ${sizes.label} tracking-wider px-2 py-0.5 rounded`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
        }}
      >
        {config.label}
      </span>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number | null;
  maxScore?: number;
  tooltip?: string;
}

export function ScoreBar({ label, score, maxScore = 100, tooltip }: ScoreBarProps) {
  if (score === null) return null;

  const percentage = (score / maxScore) * 100;

  const getBarConfig = () => {
    if (percentage >= 70)
      return { color: "var(--neon-red)", glow: "rgba(255, 42, 109, 0.5)" };
    if (percentage >= 50)
      return { color: "var(--neon-orange)", glow: "rgba(255, 107, 53, 0.5)" };
    if (percentage >= 30)
      return { color: "var(--neon-yellow)", glow: "rgba(245, 255, 0, 0.5)" };
    return { color: "var(--neon-green)", glow: "rgba(57, 255, 20, 0.5)" };
  };

  const barConfig = getBarConfig();

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        {tooltip ? (
          <span className="tooltip-container">
            <span className="tooltip">
              <span className="tooltip-content">{tooltip}</span>
            </span>
            <span className="data-label cursor-help border-b border-dotted border-[var(--text-muted)]">{label}</span>
          </span>
        ) : (
          <span className="data-label">{label}</span>
        )}
        <span
          className="font-mono text-sm font-medium"
          style={{ color: barConfig.color }}
        >
          {score.toFixed(0)}
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden relative">
        {/* Glow layer */}
        <div
          className="absolute inset-y-0 left-0 rounded-full blur-sm"
          style={{
            width: `${percentage}%`,
            backgroundColor: barConfig.glow,
          }}
        />
        {/* Main bar */}
        <div
          className="relative h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: barConfig.color,
            boxShadow: `0 0 10px ${barConfig.glow}`,
          }}
        />
      </div>
    </div>
  );
}
