// Mapping helpers to convert real snowfall (mm/hr) into visual parameters
// Keep mappings simple and clamp values to reasonable ranges.

export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * Map snowfall in mm/hr to flake count for the shader-based snow.
 * 0 mm/hr -> ~50 flakes (almost none), 10 mm/hr -> ~2000 flakes (heavy)
 */
export function mapSnowfallToFlakeCount(mmPerHour: number) {
  const mm = clamp(mmPerHour ?? 0, 0, 10);
  const min = 50;
  const max = 2000;
  const t = mm / 10; // 0..1
  return Math.round(min + (max - min) * t);
}

/**
 * Map snowfall in mm/hr to a density multiplier used by the canvas overlay.
 * Returns a value around 0..2 where 0 = none, 1 = moderate, 2 = very heavy.
 */
export function mapSnowfallToDensity(mmPerHour: number) {
  const mm = clamp(mmPerHour ?? 0, 0, 10);
  // gentle curve so small snowfall increases density modestly
  const t = Math.pow(mm / 10, 0.8);
  const min = 0.0;
  const max = 2.0;
  return min + (max - min) * t;
}
