import {Easing, interpolate, spring} from 'remotion';

export const C = {
  navy: '#071A3D',
  navyDeep: '#040F26',
  navyLine: 'rgba(255,255,255,0.07)',
  blue: '#005CA1',
  blueLight: '#2C86CF',
  yellow: '#FFE14A',
  white: '#FFFFFF',
  soft: 'rgba(255,255,255,0.72)',
  teal: '#3CCFC0',
};

export const FONT =
  "'Inter', 'Inter Display', 'Helvetica Neue', Arial, sans-serif";

export const FPS = 30;

/** 0→1 eased entrance starting at `delay` frames */
export const enter = (frame: number, fps: number, delay = 0, damping = 18) =>
  spring({frame: frame - delay, fps, config: {damping, mass: 0.8}});

export const lin = (
  frame: number,
  from: number,
  to: number,
  a = 0,
  b = 1,
) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
