
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20,10 C20,10 50,70 90,80 C70,90 50,60 45,50 C40,40 20,80 20,80"
        stroke="currentColor"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(50 42) rotate(-45)">
        <rect x="-20" y="-8" width="40" height="16" rx="4" />
        <text
          x="0"
          y="4"
          fill="hsl(var(--background))"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          LESS
        </text>
      </g>
    </svg>
  );
}
