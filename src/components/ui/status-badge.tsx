import React from "react";

// StatusBadge component
// Provides a minimalist LED-style status indicator with theme-adaptive capsule border and subtle glow.
// - status: string status name (case-insensitive)
// - className: optional additional classes for layout
// The component uses inline styles for the dot glow to allow precise rgba control per color.
interface StatusBadgeProps {
  status: string;
  className?: string;
}

const colorMap: Record<
  string,
  { color: string; glow: string; label: string }
> = {
  pending: { color: "#FACC15", glow: "rgba(250,204,21,0.28)", label: "Pending" }, // Neon yellow
  inprogress: { color: "#06B6D4", glow: "rgba(6,182,212,0.22)", label: "In Progress" }, // Neon cyan
  completed: { color: "#10B981", glow: "rgba(16,185,129,0.26)", label: "Completed" }, // Neon green
  delivered: { color: "#14B8A6", glow: "rgba(20,184,166,0.22)", label: "Delivered" }, // Teal
  cancelled: { color: "#EF4444", glow: "rgba(239,68,68,0.24)", label: "Cancelled" }, // Neon red
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "");
  const meta = colorMap[key] || { color: "#94A3B8", glow: "rgba(148,163,184,0.12)", label: status || "Unknown" };

  const dotStyle: React.CSSProperties = {
    backgroundColor: meta.color,
    boxShadow: `0 0 6px ${meta.glow}`,
  };

  const isPulsing = key === "inprogress";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-background/5 ${className} dark:bg-background/5 border-zinc-800/80 dark:border-slate-400/50`}
      // container uses theme-adaptive border via Tailwind classes above
    >
      <span
        className={`inline-block rounded-full w-3 h-3 ${isPulsing ? "animate-pulse" : ""}`}
        style={dotStyle}
        aria-hidden
      />
      <span className="text-foreground/90">{meta.label}</span>
    </div>
  );
}

