// Central chart theme — every chart on every screen draws from this.
// Palette is the validated dark-surface categorical set; do not invent colors.

export const VIZ = {
  series: [
    "var(--viz-1)",
    "var(--viz-2)",
    "var(--viz-3)",
    "var(--viz-4)",
    "var(--viz-5)",
    "var(--viz-6)",
    "var(--viz-7)",
    "var(--viz-8)",
  ],
  seq: [
    "var(--viz-seq-1)",
    "var(--viz-seq-2)",
    "var(--viz-seq-3)",
    "var(--viz-seq-4)",
    "var(--viz-seq-5)",
  ],
  grid: "var(--viz-grid)",
  axis: "var(--viz-axis)",
  label: "var(--viz-label)",
  ink: "var(--viz-ink)",
  inkSecondary: "var(--viz-ink-secondary)",
} as const;

// Shared Recharts props — keeps grid/axes recessive and consistent.
export const gridProps = {
  stroke: VIZ.grid,
  strokeDasharray: "0",
  vertical: false,
} as const;

export const axisProps = {
  stroke: "transparent",
  tickLine: false,
  axisLine: { stroke: VIZ.axis },
  tick: { fill: VIZ.label, fontSize: 11 },
} as const;

export const tooltipCursor = { stroke: VIZ.axis, strokeWidth: 1 } as const;

// Style object for Recharts <Tooltip contentStyle=…>
export const tooltipContentStyle: React.CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

export const tooltipLabelStyle: React.CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 11,
  marginBottom: 4,
};
