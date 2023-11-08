import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useInterval, useWindowSize } from 'usehooks-ts';
import useMousePosition from '../hooks/use-mouse';

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
  const [wind, setWind] = useState<number>(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext('2d');
  // const particles: SnowParticle[] = []
  const particles = useState<SnowParticle[]>([])[0];
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
    particles.forEach((particle, index) => {
      if (particle.y > window.innerHeight) {
        return particles.splice(index, 1);
      }
      if (particle.x > window.innerWidth + 5) {
        particle.x = -4;
      }
      if (particle.x < -5) {
        particle.x = window.innerWidth + 4;
      }
      particle.radius -= 0.001 * particle.speed;
      if (particle.radius < 0) {
        return particles.splice(index, 1);
      }
      particle.y += particle.speed;
      // the x should be based on the radius and the speed and the wind

      // the bigger the radius the less the wind should affect it
      // the bigger the speed the more the wind should affect it
      const change = wind * (particle.radius / 5) * particle.speed;
      particle.x += change;
    });
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
      ctx.canvas.width = windowSize.width;
      ctx.canvas.height = windowSize.height;
    }
  }, [windowSize, ctx]);
  const addParticle = useCallback(() => {
    if (particles.length > 100) return;
    const random = Math.random();
    const x = random * windowSize.width;
    const y = -5;
    const radius = Math.random() * 4 + 1.5;
    const speed = Math.random() * 0.05 + 0.5;
    const opacity = Math.random() * 0.5;
    particles.push(new SnowParticle(x, y, radius, speed, opacity));
  }, [particles, windowSize]);
  useInterval(() => {
    addParticle();
  }, 100);
  useInterval(draw, 1);
  useInterval(() => {
    // create random wind casts
    setWind((prev) => {
      // between -0.1 and 0.1
      const random = Math.random() * 0.2 - 0.1;
      const newWind = prev + random;
      // make sure it's not too windy
      if (newWind > 2) {
        return 2;
      }
      if (newWind < -2) {
        return -2;
      }
      return newWind;
    });
    console.log('wind', wind);
  }, 1000);
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};