import React, { useEffect, useRef, useCallback } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { ShaderProgram } from '../lib/shaderprogram.js';
import { snowflakeBase64 } from '../assets/snowflake.js';

export const Snow: React.FC = () => {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = React.useState(355);
  const [shaderProgram, setShaderProgram] = React.useState<ShaderProgram>();

  const onUpdate = useCallback(
    (delta: number) => {
      const wind = {
        current: 0.1,
        force: 0.1,
        target: 100,
        min: 0.1,
        max: 0.1,
        easing: 0.051,
      };
      wind.force += (wind.target - wind.force) * wind.easing;
      wind.current += wind.force * (delta * 0.2);
      shaderProgram?.uniforms.wind.set(wind.current);

      if (Math.random() > 0.995) {
        wind.target =
          (wind.min + Math.random() * (wind.max - wind.min)) *
          (Math.random() > 0.5 ? -1 : 1);
      }
    },
    [shaderProgram],
  );

  useEffect(() => {
    const holder = holderRef.current;

    if (!holder) return;

    const wind = {
      current: 0,
      force: 0.1,
      target: 0.1,
      min: 0.1,
      max: 0.1,
      easing: 0.005,
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
        wind.force += (wind.target - wind.force) * wind.easing;
        wind.current += wind.force * (delta * 0.2);
        this.uniforms.wind = wind.current;

        if (Math.random() > 0.995) {
          wind.target =
            (wind.min + Math.random() * (wind.max - wind.min)) *
            (Math.random() > 0.5 ? -1 : 1);
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
    <div
      ref={holderRef}
      id="snow"
      className="fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none  "
    ></div>
  );
};

export default Snow;
