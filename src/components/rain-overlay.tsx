import React, { useEffect, useRef, useCallback } from 'react';
import { ShaderProgram } from '../lib/shaderprogram.js'; // Assuming the same ShaderProgram
import { raindropBase64 } from '../assets/snowflake.js'; // Will assume a simple white dot texture or create one.
// We might not need this if we don't map intensity to flake count, but to raindrop count.
// import { mapSnowfallToFlakeCount } from '../lib/snow-mapping';

// Assuming you'd create a base64 encoded simple white dot/circle for a raindrop texture,
// or we can remove the texture entirely and just render points if ShaderProgram allows.
// For now, let's assume a simple white dot is provided or we can generate one.
const createWhiteDotBase64 = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.arc(8, 8, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  return canvas.toDataURL('image/png');
};

const RAINDROP_TEXTURE = createWhiteDotBase64(); // A simple white dot texture

type RainProps = {
  windSpeed?: number;
  onWindSpeedChange?: (value: number) => void;
  dropCount?: number; // Renamed from flakeCount
  onDropCountChange?: (value: number) => void;
  showSpeedControl?: boolean;
  intensityMmPerHour?: number; // rainfall in mm/hr
};

export const Rain: React.FC<RainProps> = ({
  windSpeed,
  onWindSpeedChange,
  dropCount,
  onDropCountChange,
  showSpeedControl,
  intensityMmPerHour,
}) => {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = React.useState(() => dropCount ?? 2000); // More raindrops than snowflakes
  const [shaderProgram, setShaderProgram] = React.useState<ShaderProgram>();
  const [windSpeedKmh, setWindSpeedKmh] = React.useState(() => windSpeed ?? 5); // Slightly less wind by default for rain
  const windTargetRef = useRef(0);
  const [showMps, setShowMps] = React.useState(false);

  // Adjusted conversion for rain - rain feels less impacted by wind visually at the same speed
  const kmhToShaderWind = useCallback((kmh: number) => {
    const ms = kmh / 3.6;
    // Scale down even more, or adjust based on desired visual effect.
    // Rain is heavier, so it drifts less for the same wind force.
    return ms * 0.015; // Further reduced from snow's 0.03
  }, []);

  const handleWindSpeedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);
      if (Number.isNaN(nextValue)) return;
      setWindSpeedKmh(nextValue);
      windTargetRef.current = kmhToShaderWind(nextValue);
      onWindSpeedChange?.(nextValue);
    },
    [kmhToShaderWind, onWindSpeedChange],
  );

  // sync external dropCount prop -> internal state
  useEffect(() => {
    if (typeof dropCount === 'number' && dropCount !== count) {
      setCount(dropCount);
    }
  }, [dropCount, count]);

  // map real rainfall intensity to visual drop count
  useEffect(() => {
    if (typeof intensityMmPerHour === 'number') {
      // You'd need a new mapping function here for rain intensity to drop count
      // For now, a simple linear mapping example.
      const next = Math.floor(intensityMmPerHour * 200); // Example: 1mm/hr = 200 drops, adjust as needed
      if (next !== count) {
        setCount(next);
        onDropCountChange?.(next);
      }
    }
  }, [intensityMmPerHour, onDropCountChange, count]);

  useEffect(() => {
    if (typeof windSpeed === 'number' && windSpeed !== windSpeedKmh) {
      setWindSpeedKmh(windSpeed);
      windTargetRef.current = kmhToShaderWind(windSpeed);
    }
  }, [kmhToShaderWind, windSpeed, windSpeedKmh]);

  useEffect(() => {
    windTargetRef.current = kmhToShaderWind(windSpeedKmh);
    if (shaderProgram) {
      shaderProgram.uniforms.wind = windTargetRef.current;
    }
  }, [kmhToShaderWind, shaderProgram, windSpeedKmh]);

  useEffect(() => {
    const holder = holderRef.current;

    if (!holder) return;

    const wind = {
      current: 0,
      force: windTargetRef.current * 0.5,
      target: windTargetRef.current,
      min: -Math.abs(windTargetRef.current * 0.8),
      max: Math.abs(windTargetRef.current * 0.8),
      easing: 0.01,
    };

    const rain = new ShaderProgram(holder, {
      depthTest: false,
      texture: RAINDROP_TEXTURE, // Use the simple white dot
      uniforms: {
        worldSize: { type: 'vec3', value: [0, 0, 0] },
        gravity: { type: 'float', value: 300 }, // Increased gravity for faster fall
        wind: { type: 'float', value: 0 },
      },
      buffers: {
        size: { size: 1, data: [] },
        // Removed rotation as raindrops are typically not rotated like snowflakes
        speed: { size: 3, data: [] },
      },
      vertex: `
        precision highp float;

        attribute vec4 a_position;
        attribute vec4 a_color;
        // attribute vec3 a_rotation; // Removed rotation
        attribute vec3 a_speed;
        attribute float a_size;

        uniform float u_time;
        uniform vec2 u_mousemove;
        uniform vec2 u_resolution;
        uniform mat4 u_projection;
        uniform vec3 u_worldSize;
        uniform float u_gravity;
        uniform float u_wind;

        varying vec4 v_color;
        // varying float v_rotation; // Removed rotation

        void main() {
          v_color = a_color;
          // v_rotation = a_rotation.x + u_time * a_rotation.y; // Removed rotation

          vec3 pos = a_position.xyz;

          // Horizontal movement from wind
          pos.x = mod(pos.x + u_time * u_wind * a_speed.x, u_worldSize.x * 2.0) - u_worldSize.x;

          // Vertical fall with wrapping
          float newY = mod(pos.y - u_time * a_speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;
          if (newY > -u_worldSize.y) {
              pos.y = newY;
          } else {
              pos.y = u_worldSize.y; // Reset to top
              // Optional: reset x position slightly to avoid 'clumping'
              pos.x = -u_worldSize.x + fract(pos.x / (u_worldSize.x * 2.0) + 0.5) * u_worldSize.x * 2.0 + (u_wind * 0.5);
          }

          // Small sinusoidal variations for rain "wobble"
          pos.x += sin(u_time * a_speed.z * 0.5) * 0.5; // Reduced amplitude for less wobble than snow
          pos.z += cos(u_time * a_speed.z * 0.5) * 0.5; // Reduced amplitude

          gl_Position = u_projection * vec4(pos.xyz, a_position.w);
          gl_PointSize = (a_size / gl_Position.w) * 100.0; // Keep point size scaling
        }`,
      fragment: `
        precision highp float;

        uniform sampler2D u_texture;

        varying vec4 v_color;
        // varying float v_rotation; // Removed rotation

        void main() {
          // No rotation for raindrops, just sample the center of the texture or use a solid color
          // vec2 rotated = vec2(
          //   cos(v_rotation) * (gl_PointCoord.x - 0.5) + sin(v_rotation) * (gl_PointCoord.y - 0.5) + 0.5,
          //   cos(v_rotation) * (gl_PointCoord.y - 0.5) - sin(v_rotation) * (gl_PointCoord.x - 0.5) + 0.5
          // );
          // For simple dots, just use gl_PointCoord directly
          vec4 raindrop = texture2D(u_texture, gl_PointCoord); // Use gl_PointCoord directly

          gl_FragColor = vec4(raindrop.rgb, raindrop.a * v_color.a); // Keep transparency
        }`,
      onResize(w: number, h: number, dpi: number) {
        const position: number[] = [];
        const color: number[] = [];
        const size: number[] = [];
        // const rotation: number[] = []; // Removed rotation
        const speed: number[] = [];

        const height = 110;
        const width = (w / h) * height;
        const depth = 22; // Keep depth for perspective

        // Adjust loop for rain count
        Array.from({ length: count }, () => {
          position.push(
            -width + Math.random() * width * 2,
            -height + Math.random() * height * 2,
            Math.random() * depth * 2,
          );

          speed.push(
            1 + Math.random() * 0.5, // Less variation in horizontal speed for rain
            5 + Math.random() * 5, // Much higher vertical speed for rain
            Math.random() * 5, // Slower sinusoidal wobble
          );

          // Removed rotation push

          color.push(1, 1, 1, 0.8 + Math.random() * 0.2); // Slightly more transparent than snow

          size.push(1.5 * Math.random() * 2 * ((h * dpi) / 1000)); // Smaller drops, less size variation
        });

        this.uniforms.worldSize = [width, height, depth];

        this.buffers.position = position;
        this.buffers.color = color;
        // this.buffers.rotation = rotation; // Removed rotation
        this.buffers.size = size;
        this.buffers.speed = speed;
      },
      onUpdate(delta: number) {
        wind.target = windTargetRef.current;
        wind.min = -Math.abs(windTargetRef.current * 0.8);
        wind.max = Math.abs(windTargetRef.current * 0.8);
        wind.force += (wind.target - wind.force) * wind.easing;
        wind.current += wind.force * (delta * 0.08);
        this.uniforms.wind = wind.current;

        // Rarer & smaller gusts, rain is less susceptible to sudden strong gusts
        if (Math.random() > 0.998) {
          // Even rarer gusts
          const gust =
            (Math.random() - 0.5) * Math.abs(windTargetRef.current) * 0.1; // Smaller gust amplitude
          wind.target = windTargetRef.current + gust;
          wind.target = Math.min(Math.max(wind.target, wind.min), wind.max);
        }
      },
    });
    setShaderProgram(rain);

    return () => {
      rain.destroy();
    };
  }, [count]); // Re-run effect if count changes

  return (
    <>
      <div
        ref={holderRef}
        id="rain" // Changed ID
        className="fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none"
      ></div>
      {showSpeedControl && (
        <div className="fixed top-4 right-4 z-[60] pointer-events-none text-sm">
          <label className="pointer-events-auto flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 text-gray-900 shadow-lg backdrop-blur">
            <span className="font-semibold">Wind</span>
            {!showMps ? (
              <input
                type="number"
                min={0}
                step={1}
                value={windSpeedKmh}
                onChange={handleWindSpeedChange}
                className="w-20 rounded border border-gray-300 bg-white/90 px-2 py-1 text-right text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Wind speed in kilometres per hour"
              />
            ) : (
              <input
                type="number"
                min={0}
                step={0.1}
                value={windSpeedKmh / 3.6}
                onChange={(e) => {
                  const nextValue = Number(e.target.value);
                  if (Number.isNaN(nextValue)) return;
                  const kmhValue = nextValue * 3.6;
                  setWindSpeedKmh(kmhValue);
                  onWindSpeedChange?.(kmhValue);
                }}
                className="w-20 rounded border border-gray-300 bg-white/90 px-2 py-1 text-right text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Wind speed in metres per second"
              />
            )}

            <button
              type="button"
              onClick={() => setShowMps((prev) => !prev)}
              className={
                'text-xs text-gray-600' + (!showMps ? ' font-bold' : '')
              }
            >
              km/h
            </button>
            <button
              type="button"
              onClick={() => setShowMps((prev) => !prev)}
              className={
                'text-xs text-gray-600' + (showMps ? ' font-bold' : '')
              }
            >
              m/s
            </button>
            <div className="ml-3 flex items-center gap-2">
              <label className="text-xs text-gray-600">Drops</label>{' '}
              {/* Changed label */}
              <input
                type="number"
                min={0}
                step={1}
                value={count}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  setCount(v);
                  onDropCountChange?.(v);
                }}
                className="w-20 rounded border border-gray-300 bg-white/90 px-2 py-1 text-right text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Number of raindrops" // Changed aria-label
              />
            </div>
          </label>
        </div>
      )}
    </>
  );
};

export default Rain;
