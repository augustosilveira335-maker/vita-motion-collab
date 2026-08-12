import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const HookHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 9, 108, 126], [0, 1, 1, 0], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        position: 'absolute',
        left: 270,
        top: 300,
        width: 1380,
        height: 390,
        display: 'grid',
        placeItems: 'center',
        opacity,
        background: 'linear-gradient(90deg, rgba(6,20,27,0) 0%, rgba(6,20,27,.98) 17%, rgba(6,20,27,.98) 83%, rgba(6,20,27,0) 100%)',
      }}
    >
      <div style={{textAlign: 'center', fontSize: 59, lineHeight: 1.02, letterSpacing: -2.8, fontWeight: 800, color: '#F7FFFF'}}>
        <div style={{whiteSpace: 'nowrap'}}>Quanto tempo sua imobiliária perde</div>
        <div style={{color: '#54DCCA', whiteSpace: 'nowrap'}}>acompanhando manutenção</div>
        <div style={{color: '#54DCCA', whiteSpace: 'nowrap', textShadow: '0 0 34px rgba(84,220,202,0.16)'}}>pelo WhatsApp?</div>
      </div>
    </div>
  );
};

export const TimeOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: easeOut});
  const collapse = interpolate(frame, [45, 74], [0, 1], {...clamp, easing: easeInOut});
  const ringScale = interpolate(frame, [0, 18, 45, 74], [0.72, 1, 1, 0.38], {...clamp, easing: easeOut, output: 'perceptual-scale'});
  const items = [
    {label: 'ÁUDIO', angle: -148, radius: 250},
    {label: 'FOTO', angle: -48, radius: 220},
    {label: 'ORÇAMENTO', angle: 32, radius: 260},
    {label: 'REVISÃO', angle: 138, radius: 230},
  ];
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, sans-serif', overflow: 'hidden', background: 'radial-gradient(circle at 50% 43%, #0B3942 0%, #071C24 34%, #051219 72%)'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.22, backgroundImage: 'radial-gradient(rgba(110,224,210,.35) .8px, transparent .8px)', backgroundSize: '28px 28px'}} />
      <div style={{position: 'absolute', left: 960, top: 465, width: 660, height: 660, translate: '-50% -50%', scale: ringScale, opacity: enter * (1 - collapse * 0.35)}}>
        {[0, 1, 2].map((ring) => (
          <div key={ring} style={{position: 'absolute', inset: 54 + ring * 72, borderRadius: 999, border: '1px solid rgba(91,225,209,.25)', boxShadow: ring === 0 ? '0 0 45px rgba(40,200,185,.10)' : 'none'}} />
        ))}
        {Array.from({length: 24}).map((_, tick) => {
          const angle = tick * 15;
          return <div key={tick} style={{position: 'absolute', left: '50%', top: '50%', width: tick % 3 === 0 ? 18 : 10, height: 2, background: tick % 3 === 0 ? '#58DCCA' : 'rgba(96,205,197,.45)', rotate: `${angle}deg`, translate: `${245 - collapse * 185}px -1px`, transformOrigin: `${-245 + collapse * 185}px 1px`, opacity: enter}} />;
        })}
        {items.map((item, index) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = Math.cos(rad) * item.radius * (1 - collapse);
          const y = Math.sin(rad) * item.radius * (1 - collapse);
          return <div key={item.label} style={{position: 'absolute', left: '50%', top: '50%', translate: `${x - 60}px ${y - 20}px`, width: 120, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', color: '#DFFFFB', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, background: 'rgba(7,29,36,.88)', border: '1px solid rgba(90,225,209,.32)', boxShadow: '0 10px 35px rgba(0,0,0,.3)', opacity: interpolate(frame, [8 + index * 4, 20 + index * 4], [0, 1], {...clamp, easing: easeOut})}}>{item.label}</div>;
        })}
        <div style={{position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', width: 126, height: 126, borderRadius: 999, display: 'grid', placeItems: 'center', color: '#EFFFFD', background: 'rgba(8,39,47,.94)', border: '1px solid rgba(91,225,209,.55)', boxShadow: '0 0 55px rgba(48,205,191,.2)'}}>
          <div style={{fontSize: 33, fontWeight: 800, letterSpacing: -1}}>{collapse < 0.65 ? '12:48' : 'OS'}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 124, textAlign: 'center', opacity: interpolate(frame, [12, 25, 58, 76], [0, 1, 1, 0], {...clamp, easing: easeOut})}}>
        <div style={{fontSize: 13, color: '#54DCCA', letterSpacing: 3.4, fontWeight: 800, marginBottom: 18}}>TEMPO SOB CONTROLE</div>
        <div style={{fontSize: 48, color: '#F5FFFF', fontWeight: 800, letterSpacing: -2.2}}>Horas espalhadas viram um <span style={{color: '#54DCCA'}}>fluxo.</span></div>
      </div>
    </AbsoluteFill>
  );
};

const FlowNode: React.FC<{label: string; detail: string; x: number; y: number; from: number; accent?: boolean}> = ({label, detail, x, y, from, accent = false}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + 13], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 245, height: 88, borderRadius: 18, padding: '17px 20px', boxSizing: 'border-box', opacity: progress, translate: `${interpolate(frame, [from, from + 13], [accent ? 0 : -18, 0], {...clamp, easing: easeOut})}px 0`, background: accent ? 'linear-gradient(135deg, #F8FFFF, #EAF9F7)' : 'rgba(8,31,39,.88)', border: accent ? '1px solid rgba(255,255,255,.9)' : '1px solid rgba(83,218,201,.26)', boxShadow: accent ? '0 24px 70px rgba(28,199,182,.2)' : '0 18px 55px rgba(0,0,0,.25)'}}>
      <div style={{fontSize: 12, letterSpacing: 1.5, fontWeight: 800, color: accent ? '#E07A27' : '#54DCCA'}}>{label}</div>
      <div style={{fontSize: 17, marginTop: 7, fontWeight: 700, color: accent ? '#15323A' : '#ECFFFF'}}>{detail}</div>
    </div>
  );
};

export const OSFlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [68, 83], [0, 1], {...clamp, easing: easeInOut});
  const line = (from: number) => interpolate(frame, [from, from + 18], [0, 1], {...clamp, easing: easeInOut});
  const core = interpolate(frame, [7, 23], [0, 1], {...clamp, easing: easeOut});
  const paths = [
    {x1: 470, y1: 300, x2: 810, y2: 470, from: 17, color: '#247B87'},
    {x1: 470, y1: 496, x2: 810, y2: 496, from: 22, color: '#45CDBC'},
    {x1: 470, y1: 692, x2: 810, y2: 522, from: 27, color: '#E58B43'},
    {x1: 1110, y1: 470, x2: 1448, y2: 300, from: 38, color: '#45CDBC'},
    {x1: 1110, y1: 496, x2: 1448, y2: 496, from: 43, color: '#247B87'},
    {x1: 1110, y1: 522, x2: 1448, y2: 692, from: 48, color: '#45CDBC'},
  ];
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, sans-serif', overflow: 'hidden', background: 'radial-gradient(circle at 50% 48%, #0B3540 0%, #071B23 38%, #051219 76%)', opacity: 1 - exit}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(rgba(84,220,202,.18) .8px, transparent .8px)', backgroundSize: '30px 30px', opacity: .22}} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {paths.map((p, index) => {
          const progress = line(p.from);
          const mx = (p.x1 + p.x2) / 2;
          return <path key={index} d={`M ${p.x1} ${p.y1} C ${mx} ${p.y1}, ${mx} ${p.y2}, ${p.x2} ${p.y2}`} fill="none" stroke={p.color} strokeWidth="2" opacity={0.72} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} />;
        })}
      </svg>

      <FlowNode label="WHATSAPP" detail="Solicitação recebida" x={225} y={256} from={10} />
      <FlowNode label="EVIDÊNCIA" detail="Foto do vazamento" x={225} y={452} from={15} />
      <FlowNode label="ORÇAMENTO" detail="Valor revisado" x={225} y={648} from={20} />
      <FlowNode label="EXECUÇÃO" detail="Prestador responsável" x={1448} y={256} from={36} />
      <FlowNode label="DECISÃO" detail="Aprovação registrada" x={1448} y={452} from={41} />
      <FlowNode label="MEMÓRIA" detail="Histórico do imóvel" x={1448} y={648} from={46} />

      <div style={{position: 'absolute', left: 810, top: 390, width: 300, height: 212, borderRadius: 28, display: 'grid', placeItems: 'center', textAlign: 'center', background: 'linear-gradient(145deg, #F9FFFF, #E8F7F5)', border: '1px solid rgba(255,255,255,.95)', boxShadow: `0 30px 100px rgba(0,0,0,.38), 0 0 ${42 + line(38) * 30}px rgba(53,211,194,.25)`, opacity: core, scale: interpolate(frame, [7, 23, 68, 83], [.72, 1, 1, .82], {...clamp, easing: easeOut, output: 'perceptual-scale'})}}>
        <div>
          <div style={{fontSize: 11, letterSpacing: 2.2, color: '#728F94', fontWeight: 800}}>TUDO NO MESMO REGISTRO</div>
          <div style={{fontSize: 38, color: '#16343C', fontWeight: 800, letterSpacing: -1.6, marginTop: 17}}><span style={{color: '#E37E2C'}}>OS</span>-2026-0412</div>
          <div style={{fontSize: 13, color: '#769096', marginTop: 11}}>um chamado · um fluxo · um histórico</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 72, textAlign: 'center', fontSize: 14, color: '#58DCCA', fontWeight: 800, letterSpacing: 3, opacity: interpolate(frame, [48, 60, 70, 80], [0, 1, 1, 0], {...clamp, easing: easeOut})}}>RASTREABILIDADE DE PONTA A PONTA</div>
    </AbsoluteFill>
  );
};

const stages = [
  {number: '01', title: 'SOLICITAÇÃO', detail: 'chamado aberto'},
  {number: '02', title: 'ADMINISTRAÇÃO', detail: 'organiza e encaminha'},
  {number: '03', title: 'PROFISSIONAL', detail: 'recebe e orça'},
  {number: '04', title: 'IMOBILIÁRIA', detail: 'acompanha e aprova'},
  {number: '05', title: 'EXECUÇÃO', detail: 'serviço e evidências'},
  {number: '06', title: 'RELATÓRIO', detail: 'histórico registrado'},
];

export const StageFlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stageIndex = interpolate(frame, [8, 24, 42, 60, 78, 96, 114], [0, 0, 1, 2, 3, 4, 5], {...clamp, easing: easeInOut});
  const finish = interpolate(frame, [112, 128], [0, 1], {...clamp, easing: easeInOut});
  const cardWidth = 238;
  const gap = 42;
  const step = cardWidth + gap;
  const trackX = 960 - cardWidth / 2 - stageIndex * step;
  const revealLine = interpolate(frame, [5, 105], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, sans-serif', overflow: 'hidden', background: 'radial-gradient(circle at 50% 56%, #0A3640 0%, #071B23 40%, #051219 78%)'}}>
      <div style={{position: 'absolute', inset: 0, opacity: .18, backgroundImage: 'radial-gradient(rgba(93,222,207,.28) .7px, transparent .7px)', backgroundSize: '28px 28px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 105, textAlign: 'center', opacity: interpolate(frame, [0, 12, 110, 126], [0, 1, 1, 0], {...clamp, easing: easeOut})}}>
        <div style={{fontSize: 24, fontWeight: 800, color: '#EFFFFD', letterSpacing: -0.8}}>Vita <span style={{color: '#54DCCA'}}>FAZ TUDO</span></div>
        <div style={{fontSize: 50, fontWeight: 800, color: '#F5FFFF', letterSpacing: -2.4, marginTop: 25}}>Uma solicitação. <span style={{color: '#54DCCA'}}>Um fluxo.</span> Todo mundo acompanha.</div>
      </div>

      <div style={{position: 'absolute', left: 240, right: 240, top: 595, height: 2, background: 'rgba(46,114,124,.28)'}}>
        <div style={{height: '100%', width: `${revealLine * 100}%`, background: 'linear-gradient(90deg, #2C7180, #5BE0CF, #E38742)', boxShadow: '0 0 18px rgba(80,220,204,.35)'}} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 430, height: 330, width: 1920, translate: `${trackX}px 0`, scale: interpolate(frame, [112, 128], [1, .72], {...clamp, easing: easeOut, output: 'perceptual-scale'}), opacity: 1 - finish}}>
        {stages.map((stage, index) => {
          const distance = Math.abs(stageIndex - index);
          const active = Math.max(0, 1 - distance);
          const appear = interpolate(frame, [5 + index * 8, 17 + index * 8], [0, 1], {...clamp, easing: easeOut});
          const y = (index % 2 === 0 ? -1 : 1) * (1 - active) * 16;
          return (
            <React.Fragment key={stage.number}>
              <div style={{position: 'absolute', left: index * step + cardWidth - 1, top: 165, width: gap + 2, height: 2, background: `linear-gradient(90deg, rgba(73,199,187,.45), ${index === 1 ? '#E38A42' : 'rgba(73,199,187,.45)'})`, opacity: appear}} />
              <div style={{position: 'absolute', left: index * step, top: 64 + y, width: cardWidth, height: 202, borderRadius: 24, display: 'grid', placeItems: 'center', textAlign: 'center', opacity: appear * interpolate(distance, [0, 2.4], [1, .28], clamp), scale: .78 + active * .28, background: active > .35 ? 'linear-gradient(145deg, #F8FFFF, #E7F8F5)' : 'rgba(8,30,38,.78)', border: active > .35 ? '1px solid rgba(255,255,255,.96)' : '1px solid rgba(75,203,190,.22)', boxShadow: active > .35 ? '0 28px 90px rgba(0,0,0,.4), 0 0 45px rgba(52,210,194,.18)' : '0 18px 45px rgba(0,0,0,.24)', translate: `0 ${-active * 22}px`, rotate: `${(index - stageIndex) * 1.1}deg`}}>
                <div>
                  <div style={{width: 48, height: 48, borderRadius: 99, margin: '0 auto 18px', display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 900, color: active > .35 ? '#07323A' : '#55D8C8', background: active > .35 ? 'linear-gradient(135deg, #41D5C2, #8CE9DC)' : 'rgba(55,204,187,.11)', border: '1px solid rgba(78,218,202,.42)'}}>{stage.number}</div>
                  <div style={{fontSize: 14, letterSpacing: 1.35, fontWeight: 900, color: active > .35 ? '#15343B' : '#C8E5E5'}}>{stage.title}</div>
                  <div style={{fontSize: 13, marginTop: 9, color: active > .35 ? '#6D8B90' : '#6E969A'}}>{stage.detail}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 960, top: 595, width: 18, height: 18, borderRadius: 99, translate: '-50% -50%', background: '#EFFFFD', boxShadow: '0 0 28px #54DCCA', opacity: interpolate(frame, [4, 14, 108, 120], [0, 1, 1, 0], clamp)}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 88, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#54DCCA', letterSpacing: 3.2, opacity: interpolate(frame, [20, 32, 106, 120], [0, 1, 1, 0], {...clamp, easing: easeOut})}}>DO CHAMADO AO HISTÓRICO</div>
    </AbsoluteFill>
  );
};


