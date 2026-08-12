import {MousePointer2} from 'lucide-react';
import {Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const SpotlightMask: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number;
  radius?: number;
  color?: string;
}> = ({x, y, width, height, progress, radius = 14, color = '#ffffff'}) => {
  const dim = 0.48 * progress;
  const panel = 'rgba(5,12,17,.82)';
  return (
    <Interactive.Div name="Sistema de foco seletivo" style={{position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1600, height: Math.max(0, y), background: panel, opacity: dim}} />
      <div style={{position: 'absolute', left: 0, top: y, width: Math.max(0, x), height, background: panel, opacity: dim}} />
      <div style={{position: 'absolute', left: x + width, top: y, right: 0, height, background: panel, opacity: dim}} />
      <div style={{position: 'absolute', left: 0, top: y + height, width: 1600, bottom: 0, background: panel, opacity: dim}} />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          borderRadius: radius,
          border: `2px solid rgba(255,255,255,${.82 * progress})`,
          boxShadow: `0 0 0 6px rgba(255,255,255,${.06 * progress}),0 0 30px ${color}35,0 18px 42px rgba(0,0,0,${.18 * progress})`,
          opacity: progress,
        }}
      />
    </Interactive.Div>
  );
};

export const ScreenCursor: React.FC<{
  points: Array<[number, number, number]>;
  clicks?: number[];
  showFrom?: number;
  hideAt?: number;
  color?: string;
}> = ({points, clicks = [], showFrom = 0, hideAt = 180, color = '#ffffff'}) => {
  const frame = useCurrentFrame();
  const frames = points.map(([at]) => at);
  const xs = points.map(([, x]) => x);
  const ys = points.map(([, , y]) => y);
  const click = clicks.find((at) => frame >= at && frame <= at + 10);
  const ripple = click === undefined ? 0 : interpolate(frame, [click, click + 10], [0, 1], clamp);
  return (
    <Interactive.Div
      name="Cursor e ripple no espaço da interface"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 50,
        translate: `${interpolate(frame, frames, xs, {...clamp, easing: Easing.bezier(.16, 1, .3, 1)})}px ${interpolate(frame, frames, ys, {...clamp, easing: Easing.bezier(.16, 1, .3, 1)})}px`,
        opacity: interpolate(frame, [showFrom, showFrom + 7, hideAt - 7, hideAt], [0, 1, 1, 0], clamp),
        scale: click === undefined ? 1 : interpolate(frame, [click, click + 2, click + 7], [1, .78, 1], {...clamp, easing: Easing.spring({damping: 17}), output: 'perceptual-scale'}),
        filter: 'drop-shadow(0 7px 10px rgba(0,0,0,.46))',
        color,
      }}
    >
      {click === undefined ? null : (
        <span
          style={{
            position: 'absolute',
            left: 12 - (30 + ripple * 30),
            top: 12 - (30 + ripple * 30),
            width: 60 + ripple * 60,
            height: 60 + ripple * 60,
            borderRadius: 999,
            border: `3px solid rgba(255,255,255,${.82 * (1 - ripple)})`,
            boxShadow: `0 0 24px rgba(72,207,211,${.3 * (1 - ripple)})`,
          }}
        />
      )}
      <MousePointer2 size={34} fill="#ffffff" color="#12222d" strokeWidth={1.5} />
    </Interactive.Div>
  );
};
