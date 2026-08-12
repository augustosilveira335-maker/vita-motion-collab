import {useCallback, useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from 'remotion';

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const CaptionCard: React.FC<{caption: Caption; durationInFrames: number}> = ({caption, durationInFrames}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exit = interpolate(frame, [Math.max(0, durationInFrames - 8), durationInFrames], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const emphasis = /(OS|rastreável|profissional certo|imobiliária aprova|evidências|relatório|memória permanente|único fluxo)/gi;
  const parts = caption.text.split(emphasis);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1360,
          minHeight: 70,
          boxSizing: 'border-box',
          padding: '16px 29px 17px',
          borderRadius: 18,
          color: '#F7FFFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: 35,
          lineHeight: 1.16,
          letterSpacing: -0.85,
          fontWeight: 700,
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(5,21,27,.9), rgba(5,18,24,.96))',
          border: '1px solid rgba(111,224,211,.28)',
          boxShadow: '0 18px 54px rgba(0,0,0,.38)',
          opacity: enter * exit,
          translate: `0 ${interpolate(frame, [0, 9], [14, 0], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
        }}
      >
        {parts.map((part, index) => (
          <span key={`${part}-${index}`} style={{color: index % 2 === 1 ? '#61E3D2' : '#F7FFFF'}}>{part}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionsV8: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Carregando legendas V8'));
  const {fps} = useVideoConfig();

  const loadCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile('captions-v8.json'));
      if (!response.ok) throw new Error(`Falha ao carregar legendas: ${response.status}`);
      setCaptions((await response.json()) as Caption[]);
      continueRender(handle);
    } catch (error) {
      cancelRender(error);
    }
  }, [cancelRender, continueRender, handle]);

  useEffect(() => {
    loadCaptions();
  }, [loadCaptions]);

  if (!captions) return null;

  return (
    <AbsoluteFill>
      {captions.map((caption, index) => {
        const from = Math.round((caption.startMs / 1000) * fps);
        const durationInFrames = Math.max(1, Math.round(((caption.endMs - caption.startMs) / 1000) * fps));
        return (
          <Sequence key={`${caption.startMs}-${index}`} from={from} durationInFrames={durationInFrames} premountFor={fps}>
            <CaptionCard caption={caption} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
