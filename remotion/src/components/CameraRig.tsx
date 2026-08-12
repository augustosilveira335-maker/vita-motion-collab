import type {ReactNode} from 'react';
import {Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const glide = Easing.bezier(0.65, 0, 0.35, 1);
const settle = Easing.bezier(0.16, 1, 0.3, 1);

export type CamPose = {
  x: number;
  y: number;
  scale: number;
  rot: number;
};

const pose = (x: number, y: number, scale: number, rot = 0): CamPose => ({x, y, scale, rot});

// One shared pose per scene boundary. The outgoing pose of scene N is the
// incoming pose of scene N + 1, so the visual motion does not reset at cuts.
export const BOUNDARY_POSES: CamPose[] = [
  pose(0, 0, 1, 0),
  pose(0, -14, 1.04, -0.4),
  pose(-18, -20, 1.06, -0.6),
  pose(10, -10, 1.02, 0.5),
  pose(0, 0, 0.98, 0),
  pose(0, 0, 0.91, 0),
  pose(-28, -10, 0.95, 0),
  pose(-20, 0, 0.92, -0.5),
  pose(14, 0, 1, 0.4),
  pose(0, 8, 1.03, 0),
  pose(-16, 0, 1.05, -0.5),
  pose(0, -8, 1.02, 0),
  pose(8, -14, 1.04, 0.4),
  pose(0, 0, 1, 0),
  pose(-10, 6, 0.97, -0.3),
  pose(0, 20, 0.92, 0),
];

export const SceneCamera: React.FC<{
  boundary: number;
  /** Last animated frame. In held scenes this must match the scene freezeAt. */
  motionDurationInFrames: number;
  hold?: [frame: number, scale: number, x: number, y: number];
  children: ReactNode;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  name?: string;
}> = ({
  boundary,
  motionDurationInFrames,
  hold,
  children,
  left = 160,
  top = 90,
  width = 1600,
  height = 900,
  name = 'Câmera contínua',
}) => {
  const frame = useCurrentFrame();
  const from = BOUNDARY_POSES[boundary] ?? BOUNDARY_POSES[0];
  const to = BOUNDARY_POSES[boundary + 1] ?? from;
  const stops = hold ? [0, hold[0], motionDurationInFrames] : [0, motionDurationInFrames];

  return (
    <Interactive.Div
      name={name}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        transformOrigin: '50% 50%',
        translate: `${interpolate(frame, stops, hold ? [from.x, hold[2], to.x] : [from.x, to.x], {...clamp, easing: settle})}px ${interpolate(frame, stops, hold ? [from.y, hold[3], to.y] : [from.y, to.y], {...clamp, easing: settle})}px`,
        scale: interpolate(frame, stops, hold ? [from.scale, hold[1], to.scale] : [from.scale, to.scale], {
          ...clamp,
          easing: glide,
          output: 'perceptual-scale',
        }),
        rotate: `${interpolate(frame, [0, motionDurationInFrames], [from.rot, to.rot], {...clamp, easing: glide})}deg`,
      }}
    >
      {children}
    </Interactive.Div>
  );
};
