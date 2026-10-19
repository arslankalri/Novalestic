import React from "react";

interface NovalesticLogoProps {
  variant?: "horizontal" | "crest" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  inverted?: boolean;
}

// Faceted Round Emerald Gemstone SVG Component
export const EmeraldGem: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <defs>
      <radialGradient id="emeraldGlow" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="35%" stopColor="#059669" />
        <stop offset="70%" stopColor="#047857" />
        <stop offset="100%" stopColor="#022c22" />
      </radialGradient>
      <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="facetDark" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#065f46" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
    </defs>

    {/* Outer Girdle Rim */}
    <circle cx="50" cy="50" r="48" fill="#022c22" stroke="#047857" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="46" fill="url(#emeraldGlow)" />

    {/* Geometric Brilliant Cut Facets */}
    {/* Outer Kite & Triangle Facets */}
    <polygon points="50,4 68,18 50,28" fill="#10b981" opacity="0.9" />
    <polygon points="50,4 32,18 50,28" fill="#059669" opacity="0.85" />
    <polygon points="68,18 96,50 72,50" fill="url(#facetHighlight)" opacity="0.95" />
    <polygon points="96,50 68,82 72,50" fill="#047857" opacity="0.9" />
    <polygon points="68,82 50,96 50,72" fill="#022c22" opacity="0.95" />
    <polygon points="50,96 32,82 50,72" fill="#064e3b" opacity="0.9" />
    <polygon points="32,82 4,50 28,50" fill="url(#facetDark)" opacity="0.9" />
    <polygon points="4,50 32,18 28,50" fill="#059669" opacity="0.95" />

    {/* Star Facets radiating around Table */}
    <polygon points="50,28 66,34 50,40" fill="#34d399" opacity="0.85" />
    <polygon points="66,34 72,50 58,50" fill="#059669" opacity="0.8" />
    <polygon points="72,50 66,66 58,50" fill="#047857" opacity="0.9" />
    <polygon points="66,66 50,72 50,60" fill="#022c22" opacity="0.95" />
    <polygon points="50,72 34,66 50,60" fill="#065f46" opacity="0.85" />
    <polygon points="34,66 28,50 42,50" fill="#047857" opacity="0.8" />
    <polygon points="28,50 34,34 42,50" fill="#10b981" opacity="0.9" />
    <polygon points="34,34 50,28 50,40" fill="#6ee7b7" opacity="0.75" />

    {/* Central Octagonal Table Facet */}
    <polygon
      points="42,34 58,34 66,42 66,58 58,66 42,66 34,58 34,42"
      fill="url(#facetHighlight)"
      stroke="#a7f3d0"
      strokeWidth="0.75"
    />

    {/* Inner Star Highlight Point */}
    <polygon points="50,40 56,50 50,60 44,50" fill="#ffffff" opacity="0.35" />
    <circle cx="43" cy="42" r="3" fill="#ffffff" opacity="0.7" />
  </svg>
);

export const NovalesticLogo: React.FC<NovalesticLogoProps> = ({
  variant = "horizontal",
  className = "",
  size = "md",
  inverted = false,
}) => {
  const textColor = inverted ? "text-white" : "text-[#1b1c19]";
  const subColor = inverted ? "text-[#DFC27F]" : "text-[#765a18]";

  // Variant 1: Horizontal Wordmark with Emerald as 'O' (as in Image 1: NOVALESTIC JEWELLERS)
  if (variant === "horizontal") {
    const gemSize = size === "sm" ? 20 : size === "lg" ? 36 : size === "xl" ? 44 : 26;
    const textSize =
      size === "sm"
        ? "text-lg tracking-[0.14em]"
        : size === "lg"
          ? "text-3xl sm:text-4xl tracking-[0.16em]"
          : size === "xl"
            ? "text-4xl sm:text-5xl tracking-[0.18em]"
            : "text-2xl tracking-[0.15em]";

    const subTextSize =
      size === "sm"
        ? "text-[8px] tracking-[0.38em]"
        : size === "lg"
          ? "text-[11px] tracking-[0.45em]"
          : size === "xl"
            ? "text-[13px] tracking-[0.48em]"
            : "text-[9.5px] tracking-[0.42em]";

    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {/* Main Brand Title: N + [Gemstone O] + VALESTIC */}
        <div
          className={`font-serif-luxury ${textSize} font-medium leading-none flex items-center ${textColor}`}
        >
          <span className="font-serif">N</span>
          <span className="inline-flex items-center justify-center mx-[1px]">
            <EmeraldGem size={gemSize} />
          </span>
          <span className="font-serif">VALESTIC</span>
        </div>

        {/* Subtitle: JEWELLERS */}
        <div className={`font-sans font-medium uppercase ${subTextSize} ${subColor} mt-1.5`}>
          JEWELLERS
        </div>
      </div>
    );
  }

  // Variant 2: Circular Crest / Seal Emblem (as in Image 2: Gold Ring, Top Star, Stylized N with Emerald in swoop)
  if (variant === "crest" || variant === "icon") {
    const crestDiameter = size === "sm" ? 60 : size === "lg" ? 120 : size === "xl" ? 160 : 80;

    return (
      <div className={`flex flex-col items-center select-none text-center ${className}`}>
        <svg
          width={crestDiameter}
          height={crestDiameter}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFC27F" />
              <stop offset="35%" stopColor="#C6A45B" />
              <stop offset="70%" stopColor="#9E7B32" />
              <stop offset="100%" stopColor="#EAD39C" />
            </linearGradient>
            <linearGradient id="bezelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFC27F" />
              <stop offset="100%" stopColor="#9E7B32" />
            </linearGradient>
          </defs>

          {/* Top 4-point Diamond Star */}
          <path d="M 100 4 L 102 18 L 100 32 L 98 18 Z" fill="url(#goldGradient)" />
          <path d="M 86 18 L 100 16 L 114 18 L 100 20 Z" fill="url(#goldGradient)" />

          {/* Outer Gold Circular Ring */}
          <circle
            cx="100"
            cy="104"
            r="88"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Inner hairline border */}
          <circle
            cx="100"
            cy="104"
            r="84"
            stroke="url(#goldGradient)"
            strokeWidth="0.75"
            strokeOpacity="0.5"
            fill="none"
          />

          {/* The Regal Serif 'N' */}
          {/* Left Vertical Stem of N */}
          <path
            d="M 70 64 L 70 144 M 64 64 L 78 64 M 64 144 L 84 144"
            stroke={inverted ? "#ffffff" : "#1b1c19"}
            strokeWidth="4"
            strokeLinecap="square"
          />

          {/* Right Vertical Stem of N with Serif Terminal */}
          <path
            d="M 124 64 L 124 136 M 116 64 L 132 64"
            stroke={inverted ? "#ffffff" : "#1b1c19"}
            strokeWidth="3.5"
            strokeLinecap="square"
          />

          {/* Diagonal Stroke of N with graceful bezier curve swooping around the emerald bezel */}
          <path
            d="M 70 68 C 88 100, 110 134, 112 144 C 114 154, 98 156, 94 140 C 90 126, 108 116, 114 122"
            fill="none"
            stroke={inverted ? "#ffffff" : "#1b1c19"}
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Gold Bezel Cup holding the Emerald in the 'N' Swoop */}
          <circle
            cx="110"
            cy="132"
            r="23"
            fill="#F2EDE3"
            stroke="url(#bezelGradient)"
            strokeWidth="3"
          />

          {/* Embedded Faceted Emerald */}
          <g transform="translate(90, 112)">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="#022c22" stroke="#047857" strokeWidth="2" />
              <polygon points="50,4 68,18 50,28" fill="#10b981" />
              <polygon points="50,4 32,18 50,28" fill="#059669" />
              <polygon points="68,18 96,50 72,50" fill="#34d399" />
              <polygon points="96,50 68,82 72,50" fill="#047857" />
              <polygon points="68,82 50,96 50,72" fill="#022c22" />
              <polygon points="50,96 32,82 50,72" fill="#064e3b" />
              <polygon points="32,82 4,50 28,50" fill="#065f46" />
              <polygon points="4,50 32,18 28,50" fill="#059669" />
              <polygon
                points="42,34 58,34 66,42 66,58 58,66 42,66 34,58 34,42"
                fill="#10b981"
                stroke="#a7f3d0"
                strokeWidth="1.5"
              />
              <circle cx="43" cy="42" r="4" fill="#ffffff" opacity="0.8" />
            </svg>
          </g>
        </svg>

        {variant === "crest" && (
          <div className="mt-2 flex flex-col items-center">
            <span
              className={`font-serif-luxury text-sm tracking-[0.24em] font-semibold uppercase ${textColor}`}
            >
              NOVALESTIC
            </span>
            <div className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.3em] text-[#765a18] mt-0.5">
              <span>✦</span>
              <span>JEWELLERS</span>
              <span>✦</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
