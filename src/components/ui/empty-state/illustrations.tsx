import * as React from "react"

/**
 * Spec-fixed illustrations from the Paper board (frames 5X4-1 / 5XZ-1).
 *
 * The `var(--color-*)` fills and strokes follow the app tokens so the art
 * re-tints under `.dark`; `#265346`, `#C08552` and `#9C6B44` are fixed
 * accents. Do not edit the geometry — the boards are the source of truth.
 */

/** "No results" — papers + person with a magnifying glass (search state). */
function SearchIllustration({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="illustration"
      data-illustration="search"
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="95" cy="70" r="55" fill="var(--color-accent-soft)" />
      <circle cx="154" cy="40" r="22" stroke="var(--color-copper)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 6" opacity="0.7" />
      <ellipse cx="100" cy="137" rx="62" ry="6" fill="var(--color-accent-soft)" />
      <g transform="rotate(-8 71 106)">
        <rect x="50" y="90" width="42" height="32" rx="3" fill="var(--color-surface)" stroke="var(--color-line)" />
        <path d="M56 100 H82" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
        <path d="M56 106 H82" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
        <path d="M56 112 H74" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="rotate(5 100 112)">
        <rect x="80" y="96" width="44" height="32" rx="3" fill="var(--color-surface)" stroke="var(--color-line)" />
        <path d="M86 106 H112" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 112 H104" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <rect x="150" y="58" width="8" height="26" rx="4" transform="rotate(-8 154 60)" fill="#265346" />
        <circle cx="157" cy="86" r="4" fill="#C08552" />
        <rect x="140" y="90" width="9" height="36" rx="4" fill="var(--color-ink)" />
        <rect x="151" y="90" width="9" height="36" rx="4" fill="var(--color-ink)" />
        <rect x="136" y="124" width="14" height="6" rx="3" fill="var(--color-copper)" />
        <rect x="149" y="124" width="14" height="6" rx="3" fill="var(--color-copper)" />
        <rect x="133" y="56" width="24" height="38" rx="10" transform="rotate(-8 145 75)" fill="var(--color-accent)" />
        <rect x="137" y="52" width="7" height="7" transform="rotate(-8 140 55)" fill="#C08552" />
        <circle cx="137" cy="44" r="11" fill="#C08552" />
        <path d="M 126 44 a 11 11 0 0 1 22 0 h -4 a 7 7 0 0 0 -14 0 z" fill="var(--color-ink)" />
        <circle cx="149" cy="37" r="4.5" fill="var(--color-ink)" />
        <rect x="133" y="58" width="8" height="30" rx="4" transform="rotate(40 137 60)" fill="var(--color-accent)" />
        <circle cx="117" cy="83" r="4.5" fill="#C08552" />
        <path d="M117 83 L109 75" stroke="var(--color-copper)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="66" r="13" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="2.5" />
      </g>
      <circle cx="48" cy="56" r="2.5" fill="var(--color-accent)" opacity="0.8" />
      <circle cx="170" cy="90" r="3" fill="var(--color-copper)" opacity="0.8" />
      <circle cx="176" cy="42" r="2.5" fill="var(--color-copper)" opacity="0.5" />
    </svg>
  )
}

/** "First run" — person holding an open folder with a plus badge, sprout at right. */
function FirstRunIllustration({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="illustration"
      data-illustration="first-run"
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="100" cy="74" r="56" fill="var(--color-accent-soft)" />
      <circle cx="48" cy="52" r="18" stroke="var(--color-copper)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 6" opacity="0.7" />
      <ellipse cx="100" cy="137" rx="56" ry="6" fill="var(--color-accent-soft)" />
      <g>
        <path d="M154 130 V112" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
        <path d="M154 118 Q146 114 145 105 Q153 108 154 118 Z" fill="var(--color-accent)" />
        <path d="M154 112 Q160 104 163 98 Q155 102 154 112 Z" fill="var(--color-accent)" opacity="0.85" />
      </g>
      <g>
        <rect x="90" y="88" width="9" height="40" rx="4" fill="var(--color-ink)" />
        <rect x="101" y="88" width="9" height="40" rx="4" fill="var(--color-ink)" />
        <rect x="87" y="126" width="14" height="6" rx="3" fill="var(--color-copper)" />
        <rect x="100" y="126" width="14" height="6" rx="3" fill="var(--color-copper)" />
        <rect x="86" y="46" width="28" height="44" rx="12" fill="var(--color-copper)" />
        <rect x="97" y="40" width="6" height="8" fill="#9C6B44" />
        <circle cx="100" cy="31" r="11" fill="#9C6B44" />
        <path d="M 89 31 a 11 11 0 0 1 22 0 h -4 a 7 7 0 0 0 -14 0 z" fill="var(--color-ink)" />
        <rect x="88" y="52" width="8" height="36" rx="4" transform="rotate(29.5 92 54)" fill="var(--color-copper)" />
        <rect x="104" y="52" width="8" height="36" rx="4" transform="rotate(-29.5 108 54)" fill="var(--color-copper)" />
        <g>
          <rect x="80" y="54" width="40" height="34" rx="3" fill="#265346" />
          <rect x="84" y="58" width="32" height="26" rx="2" fill="var(--color-surface)" />
          <rect x="87" y="56" width="32" height="26" rx="2" fill="var(--color-surface)" stroke="var(--color-line)" />
          <rect x="76" y="64" width="48" height="34" rx="3" transform="rotate(-6 100 81)" fill="var(--color-accent)" />
          <circle cx="124" cy="60" r="9" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
          <path d="M124 55.5 V64.5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
          <path d="M119.5 60 H128.5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="75" cy="84" r="4.5" fill="#9C6B44" />
        <circle cx="125" cy="84" r="4.5" fill="#9C6B44" />
      </g>
      <circle cx="160" cy="52" r="3" fill="var(--color-copper)" opacity="0.8" />
      <circle cx="44" cy="100" r="2.5" fill="var(--color-accent)" opacity="0.8" />
    </svg>
  )
}

export { SearchIllustration, FirstRunIllustration }
