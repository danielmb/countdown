import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useInterval, useWindowSize } from '@uidotdev/usehooks';
import useMousePosition from '../hooks/use-mouse';
/*
const holder = document.querySelector( '#snow' )
const count = 7000

let wind = {
  current: 0,
  force: 0.1,
  target: 0.1,
  min: 0.1,
  max: 0.25,
  easing: 0.005
}

const snow = new ShaderProgram( holder, {
  depthTest: false,
  texture: snowflake,
  uniforms: {
    worldSize: { type: 'vec3', value: [ 0, 0, 0 ] },
    gravity: { type: 'float', value: 100 },
    wind:{ type: 'float', value: 0 },
  },
  buffers: {
    size: { size: 1, data: [] },
    rotation: { size: 3, data: [] },
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
      pos.y = mod(pos.y - u_time * a_speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;

      pos.x += sin(u_time * a_speed.z) * a_rotation.z;
      pos.z += cos(u_time * a_speed.z) * a_rotation.z;

      gl_Position = u_projection * vec4( pos.xyz, a_position.w );
      gl_PointSize = ( a_size / gl_Position.w ) * 100.0;

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
  onResize( w, h, dpi ) {
    const position = [], color = [], size = [], rotation = [], speed = []

    // z in range from -80 to 80, camera distance is 100
    // max height at z of -80 is 110
    const height = 110
    const width = w / h * height
    const depth = 80

    Array.from( { length: w / h * count }, snowflake =>  {

      position.push(
        -width + Math.random() * width * 2,
        -height + Math.random() * height * 2,
        Math.random() * depth * 2
      )

      speed.push(// 0, 0, 0 )
        1 + Math.random(),
        1 + Math.random(),
        Math.random() * 10
      ) // x, y, sinusoid

      rotation.push(
        Math.random() * 2 * Math.PI,
        Math.random() * 20,
        Math.random() * 10
      ) // angle, speed, sinusoid

      color.push(
        1,
        1,
        1,
        0.1 + Math.random() * 0.2
      )

      size.push(
        5 * Math.random() * 5 * ( h * dpi / 1000 )
      )

    } )

    this.uniforms.worldSize = [ width, height, depth ]

    this.buffers.position = position
    this.buffers.color = color
    this.buffers.rotation = rotation
    this.buffers.size = size
    this.buffers.speed = speed
  },
  onUpdate( delta ) {
    wind.force += ( wind.target - wind.force ) * wind.easing
    wind.current += wind.force * ( delta * 0.2 )
    this.uniforms.wind = wind.current

    if ( Math.random() > 0.995 ) {
      wind.target = ( wind.min + Math.random() * ( wind.max - wind.min ) ) * ( Math.random() > 0.5 ? -1 : 1 )
    }

    // stats.update()
  },
} )
*/
class SnowParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    opacity: number,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.opacity = opacity;
  }
}
export const SnowOverlay = () => {
  const [wind, setWind] = useState({
    current: 0,
    force: 0.1,
    target: 0.1,
    min: 0.1,
    max: 0.25,
    easing: 0.005,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState<number>(1);
  const ctx = canvasRef.current?.getContext('2d');
  // const particles: SnowParticle[] = []
  const [particles, setParticles] = useState<SnowParticle[]>([]);
  // fill the entire screen
  // const update = () => {
  //   particles.forEach((particle, index) => {
  //     if (particle.y > window.innerHeight) {
  //       particles.splice(index, 1);
  //     } else {
  //       particle.y += 0.001;
  //     }
  //   });
  // };
  const update = useCallback(() => {
    const newParticles = particles.filter((particle) => {
      const inBounds = particle.y < window.innerHeight;
      if (!inBounds) return false;
      if (particle.x > window.innerWidth + 5) {
        particle.x = -4;
      }
      if (particle.x < -5) {
        particle.x = window.innerWidth + 4;
      }
    });
    setParticles(newParticles);
  }, [particles, wind]);

  const draw = useCallback(() => {
    if (ctx) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      particles.forEach((particle) => {
        ctx.moveTo(particle.x, particle.y);
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, true);
      });
      ctx.fill();
      update();
    }
  }, [ctx, particles, update]);
  // const draw = () => {
  //   if (ctx) {
  //     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  //     ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  //     ctx.beginPath();
  //     particles.forEach((particle) => {
  //       ctx.moveTo(particle.x, particle.y);
  //       ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, true);
  //     });
  //     ctx.fill();
  //     update();
  //   }
  // };
  const windowSize = useWindowSize();
  useEffect(() => {
    if (ctx) {
      ctx.canvas.width = windowSize.width ?? 0;
      ctx.canvas.height = windowSize.height ?? 0;
    }
  }, [windowSize, ctx]);
  const addParticle = useCallback(() => {
    if (particles.length > (windowSize.width ?? 0 / 4) * (density * 1.2))
      return;
    const random = Math.random();
    const x = random * (windowSize.width ?? 0);
    const y = -5;
    const radius = Math.random() * 4 + 1.5;
    const speed = Math.random() * 0.05 + 0.5;
    const opacity = Math.random() * 0.5;
    particles.push(new SnowParticle(x, y, radius, speed, opacity));
  }, [particles, windowSize, density]);
  useInterval(() => {
    addParticle();
  }, 20 / density);
  useInterval(draw, 5);

  useInterval(() => {
    setDensity((prev) => {
      console.log(prev);
      const random = Math.random() * 0.2 - 0.1;
      setDensity((prev) => {
        const newDensity = prev + random;
        return Math.max(0, Math.min(2, newDensity));
      });
      return prev;
    });
  }, 60000);
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};
