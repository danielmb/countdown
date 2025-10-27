import React, { useEffect, useRef, useCallback } from 'react';
import { ShaderProgram } from '../lib/shaderprogram.js';
import { snowflakeBase64 } from '../assets/snowflake.js';
import { mapSnowfallToFlakeCount } from '../lib/snow-mapping';

type SnowProps = {
  windSpeed?: number;
  onWindSpeedChange?: (value: number) => void;
  flakeCount?: number;
  onFlakeCountChange?: (value: number) => void;
  showSpeedControl?: boolean;
  intensityMmPerHour?: number; // snowfall in mm/hr
};

export const Snow: React.FC<SnowProps> = ({
  windSpeed,
  onWindSpeedChange,
  flakeCount,
  onFlakeCountChange,
  showSpeedControl,
  intensityMmPerHour,
}) => {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = React.useState(() => flakeCount ?? 355);
  const [shaderProgram, setShaderProgram] = React.useState<ShaderProgram>();
  const [windSpeedKmh, setWindSpeedKmh] = React.useState(() => windSpeed ?? 10);
  const windTargetRef = useRef(0);
  const [showMps, setShowMps] = React.useState(false);
  const kmhToShaderWind = useCallback((kmh: number) => {
    const ms = kmh / 3.6;
    // scale down to make wind feel gentler in the shader
    return ms * 0.03;
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

  // sync external flakeCount prop -> internal state
  useEffect(() => {
    if (typeof flakeCount === 'number' && flakeCount !== count) {
      setCount(flakeCount);
    }
  }, [flakeCount, count]);

  // map real snowfall intensity to visual flake count
  useEffect(() => {
    if (typeof intensityMmPerHour === 'number') {
      const next = mapSnowfallToFlakeCount(intensityMmPerHour);
      if (next !== count) {
        setCount(next);
        onFlakeCountChange?.(next);
      }
    }
  }, [intensityMmPerHour, onFlakeCountChange, count]);

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
      // start with a softer force so changes are less abrupt
      force: windTargetRef.current * 0.5,
      target: windTargetRef.current,
      // reduce spread so gusts stay closer to the target
      min: -Math.abs(windTargetRef.current * 0.8),
      max: Math.abs(windTargetRef.current * 0.8),
      // slower easing for smoother transitions
      easing: 0.01,
    };

    // Replace ShaderProgram with the actual implementation
    const snow = new ShaderProgram(holder, {
      depthTest: false,
      texture: snowflakeBase64,
      uniforms: {
        worldSize: { type: 'vec3', value: [0, 0, 0] },
        gravity: { type: 'float', value: 100 },
        wind: { type: 'float', value: 0 },
      },
      buffers: {
        size: { size: 1, data: [] },
        rotation: { size: 1, data: [] },
        speed: { size: 3, data: [] },
      },
      vertex: `
    precision highp float;

    attribute vec4 a_position;
    attribute vec4 a_color;
    attribute vec3 a_rotation;
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
    varying float v_rotation;

    void main() {

      v_color = a_color;
      v_rotation = a_rotation.x + u_time * a_rotation.y;

      vec3 pos = a_position.xyz;

      pos.x = mod(pos.x + u_time + u_wind * a_speed.x, u_worldSize.x * 2.0) - u_worldSize.x;

      float newY = mod(pos.y - u_time * a_speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;
      if (newY > -u_worldSize.y) {
          pos.y = newY;
        
      } else {
        pos.y = u_worldSize.y;
      }


      pos.x += sin(u_time * a_speed.z) * a_rotation.z;
      pos.z += cos(u_time * a_speed.z) * a_rotation.z;

      gl_Position = u_projection * vec4(pos.xyz, a_position.w);
      gl_PointSize = (a_size / gl_Position.w) * 100.0;


    }`,
      fragment: `
    precision highp float;

    uniform sampler2D u_texture;

    varying vec4 v_color;
    varying float v_rotation;

    void main() {

      vec2 rotated = vec2(
        cos(v_rotation) * (gl_PointCoord.x - 0.5) + sin(v_rotation) * (gl_PointCoord.y - 0.5) + 0.5,
        cos(v_rotation) * (gl_PointCoord.y - 0.5) - sin(v_rotation) * (gl_PointCoord.x - 0.5) + 0.5
      );

      vec4 snowflake = texture2D(u_texture, rotated);

      gl_FragColor = vec4(snowflake.rgb, snowflake.a * v_color.a);

    }`,
      onResize(w: number, h: number, dpi: number) {
        //  const position = [],
        //    color = [],
        //    size = [],
        //    rotation = [],
        //    speed = [];
        const position: number[] = [];
        const color: number[] = [];
        const size: number[] = [];
        const rotation: number[] = [];
        const speed: number[] = [];

        // z in range from -80 to 80, camera distance is 100
        // max height at z of -80 is 110
        const height = 110;
        const width = (w / h) * height;
        const depth = 22;

        Array.from({ length: (w / h) * count }, (snowflake) => {
          position.push(
            -width + Math.random() * width * 2,
            -height + Math.random() * height * 2,
            Math.random() * depth * 2,
          );

          speed.push(
            // 0, 0, 0 )
            1 + Math.random(),
            1 + Math.random(),
            Math.random() * 10,
          ); // x, y, sinusoid

          rotation.push(
            Math.random() * 2 * Math.PI,
            Math.random() * 20,
            Math.random() * 10,
          ); // angle, speed, sinusoid

          color.push(1, 1, 1, 1 + Math.random() * 0.2);

          size.push(5 * Math.random() * 4 * ((h * dpi) / 1000));
        });

        this.uniforms.worldSize = [width, height, depth];

        this.buffers.position = position;
        this.buffers.color = color;
        this.buffers.rotation = rotation;
        this.buffers.size = size;
        this.buffers.speed = speed;
      },
      onUpdate(delta: number) {
        wind.target = windTargetRef.current;
        wind.min = -Math.abs(windTargetRef.current * 0.8);
        wind.max = Math.abs(windTargetRef.current * 0.8);
        wind.force += (wind.target - wind.force) * wind.easing;
        // reduce delta influence so per-frame changes are smaller
        wind.current += wind.force * (delta * 0.08);
        this.uniforms.wind = wind.current;

        // rarer & smaller gusts
        if (Math.random() > 0.997) {
          const gust =
            (Math.random() - 0.5) * Math.abs(windTargetRef.current) * 0.25;
          wind.target = windTargetRef.current + gust;
          wind.target = Math.min(Math.max(wind.target, wind.min), wind.max);
        }
      },
    });
    setShaderProgram(snow);
    // Cleanup function
    return () => {
      snow.destroy();
      // Perform any cleanup if necessary
    };
  }, [count]);

  return (
    <>
      <div
        ref={holderRef}
        id="snow"
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
              <label className="text-xs text-gray-600">Flakes</label>
              <input
                type="number"
                min={0}
                step={1}
                value={count}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0;
                  setCount(v);
                  onFlakeCountChange?.(v);
                }}
                className="w-20 rounded border border-gray-300 bg-white/90 px-2 py-1 text-right text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Number of snowflakes"
              />
            </div>
          </label>
        </div>
      )}
    </>
  );
};

export default Snow;
