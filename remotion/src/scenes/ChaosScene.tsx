import {
  AlertTriangle,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Route,
  Wrench,
} from 'lucide-react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';

const ease = Easing.bezier(.16, 1, .3, 1);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

type NoiseKind = 'voice' | 'leak' | 'client' | 'budget' | 'route' | 'approval';

const cards: Array<{kind: NoiseKind; x: number; y: number; r: number; delay: number; tint: string}> = [
  {kind: 'voice', x: 122, y: 132, r: -7, delay: 7, tint: '#2ed56f'},
  {kind: 'leak', x: 1428, y: 145, r: 6, delay: 14, tint: '#ff9256'},
  {kind: 'client', x: 113, y: 736, r: 5, delay: 23, tint: '#ffcf5a'},
  {kind: 'budget', x: 1395, y: 725, r: -5, delay: 31, tint: '#81dd9c'},
  {kind: 'route', x: 1344, y: 440, r: 4, delay: 42, tint: '#71a8ff'},
  {kind: 'approval', x: 170, y: 430, r: -4, delay: 52, tint: '#e98fff'},
];

const WhatsAppMark: React.FC = () => (
  <span style={{width: 26, height: 26, borderRadius: 999, background: '#24d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(36,211,102,.24)'}}>
    <Phone size={13} color="#fff" fill="#fff" strokeWidth={2.2} />
  </span>
);

const LeakThumbnail: React.FC = () => (
  <div style={{width: 86, height: 76, borderRadius: 14, overflow: 'hidden', position: 'relative', flexShrink: 0, background: 'linear-gradient(145deg,#8a745d,#332c27 46%,#101517)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.16),0 10px 22px rgba(0,0,0,.25)'}}>
    <div style={{position: 'absolute', left: 12, right: 12, top: 9, height: 15, borderRadius: 8, background: 'linear-gradient(180deg,#c7d0d2,#5f6b6f)', boxShadow: '0 5px 10px rgba(0,0,0,.28)'}} />
    <div style={{position: 'absolute', left: 39, top: 20, width: 10, height: 35, borderRadius: '0 0 8px 8px', background: 'linear-gradient(90deg,#3d4b50,#bdc7c8,#46545a)'}} />
    <div style={{position: 'absolute', left: 34, top: 47, width: 20, height: 7, borderRadius: 9, background: '#6a777a'}} />
    <div style={{position: 'absolute', left: 41, top: 56, width: 9, height: 13, borderRadius: '70% 30% 65% 35%', rotate: '45deg', background: 'linear-gradient(145deg,#dffaff,#4ad3ec)', boxShadow: '0 0 13px rgba(79,211,235,.7)'}} />
    <div style={{position: 'absolute', left: 7, right: 7, bottom: 3, height: 11, borderRadius: '50%', background: 'rgba(61,175,197,.42)', filter: 'blur(3px)'}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(255,255,255,.13),transparent 35%,rgba(0,0,0,.2))'}} />
  </div>
);

const VoiceCard: React.FC<{frame: number}> = ({frame}) => (
  <>
    <div style={{width: 46, height: 46, borderRadius: 999, background: '#24d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 7px rgba(36,211,102,.08)'}}><Play size={20} color="#fff" fill="#fff" /></div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 24}}>
        {Array.from({length: 25}).map((_, index) => (
          <span key={index} style={{width: 3, height: 5 + ((index * 11) % 17) + Math.sin((frame + index * 3) * .16) * 3, maxHeight: 23, borderRadius: 6, background: index < 8 ? '#35d878' : 'rgba(221,238,230,.34)'}} />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, fontSize: 11, color: 'rgba(232,240,243,.57)'}}><span>0:47</span><span style={{display: 'flex', alignItems: 'center', gap: 6}}><WhatsAppMark /> mensagem de voz</span></div>
    </div>
  </>
);

const NoiseCardContent: React.FC<{kind: NoiseKind; frame: number}> = ({kind, frame}) => {
  if (kind === 'voice') return <VoiceCard frame={frame} />;
  if (kind === 'leak') return <><LeakThumbnail /><div><div style={{fontWeight: 780, fontSize: 16}}>Foto do vazamento</div><div style={{fontSize: 12, color: 'rgba(232,240,243,.55)', marginTop: 7}}>agora · IMG_4821.jpg</div><div style={{marginTop: 7, display: 'flex', alignItems: 'center', gap: 7, color: '#35d878', fontSize: 10, fontWeight: 800}}><WhatsAppMark /> RECEBIDA</div></div></>;
  if (kind === 'client') return <><div style={{width: 50, height: 50, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#f5b59a,#ad5a48)', color: '#fff', fontWeight: 850, fontSize: 17, position: 'relative'}}>MR<span style={{position: 'absolute', right: -4, top: -5, width: 20, height: 20, borderRadius: 99, background: '#ef5e4c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12}}>!</span></div><div><div style={{fontWeight: 790, fontSize: 16}}>“Preciso de retorno agora!”</div><div style={{fontSize: 12, color: '#ffc578', marginTop: 7, display: 'flex', alignItems: 'center', gap: 7}}><AlertTriangle size={14} /> cliente aguardando · 3 mensagens</div></div></>;
  if (kind === 'budget') return <><div style={{width: 58, height: 72, borderRadius: 11, background: '#eefbf2', color: '#196d3d', padding: '10px 9px', flexShrink: 0, boxShadow: '0 8px 18px rgba(0,0,0,.2)'}}><div style={{height: 5, width: 32, borderRadius: 4, background: '#2aa761'}}/><div style={{height: 3, width: 38, borderRadius: 4, background: '#a8dabc', marginTop: 8}}/><div style={{height: 3, width: 30, borderRadius: 4, background: '#a8dabc', marginTop: 5}}/><div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 8}}><Check size={16} strokeWidth={3}/></div></div><div><div style={{fontWeight: 780, fontSize: 16}}>Orçamento revisado</div><div style={{fontSize: 12, color: 'rgba(232,240,243,.55)', marginTop: 7}}>serviço · material · prazo</div><div style={{fontSize: 10, color: '#81dd9c', fontWeight: 850, marginTop: 7}}>DOCUMENTO VALIDADO</div></div></>;
  if (kind === 'route') return <><div style={{width: 58, height: 58, borderRadius: 17, position: 'relative', flexShrink: 0, background: 'linear-gradient(145deg,#d9e8ff,#6e9de0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#173f7a'}}><Wrench size={25}/><span style={{position: 'absolute', right: -7, bottom: -6, width: 25, height: 25, borderRadius: 99, background: '#45cf8a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><MapPin size={13} fill="#fff"/></span></div><div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}><strong style={{fontSize: 16}}>Prestador em rota</strong><span style={{fontSize: 11, fontWeight: 850, color: '#9ec2ff'}}>12 MIN</span></div><div style={{height: 3, borderRadius: 8, background: 'rgba(255,255,255,.12)', marginTop: 12, overflow: 'hidden'}}><div style={{height: '100%', width: `${interpolate(frame, [42, 102], [18, 82], clamp)}%`, background: 'linear-gradient(90deg,#71a8ff,#55d48c)'}}/></div><div style={{fontSize: 11, color: 'rgba(232,240,243,.55)', marginTop: 8, display: 'flex', gap: 7, alignItems: 'center'}}><Route size={13}/>Rua das Flores · atualizado 10:42</div></div></>;
  return <><div style={{width: 54, height: 54, borderRadius: 17, background: 'rgba(233,143,255,.13)', color: '#e98fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><MessageCircle size={27}/></div><div><div style={{fontWeight: 780, fontSize: 16}}>Quem aprovou?</div><div style={{fontSize: 12, color: 'rgba(232,240,243,.55)', marginTop: 7}}>mensagem perdida no grupo</div><div style={{display: 'flex', gap: 5, marginTop: 8}}>{[0,1,2].map((i)=><span key={i} style={{width: 7, height: 7, borderRadius: 99, background: i === 2 ? '#e98fff' : 'rgba(255,255,255,.28)'}}/>)}</div></div></>;
};

const NoiseCard: React.FC<{card: (typeof cards)[number]; index: number; frame: number; convergence?: number}> = ({card, index, frame, convergence = 0}) => {
  const centerX = 960 - card.x - 178;
  const centerY = 520 - card.y - 60;
  return (
    <Interactive.Div
      name={`Informação espalhada ${index + 1}`}
      style={{
        position: 'absolute', left: card.x, top: card.y, width: 355, height: 116, padding: '18px 19px', borderRadius: 22,
        background: 'linear-gradient(145deg,rgba(31,45,56,.96),rgba(17,29,39,.97))', border: '1px solid rgba(255,255,255,.11)',
        boxShadow: '0 30px 80px rgba(0,0,0,.38)', color: '#fff', display: 'flex', alignItems: 'center', gap: 15,
        opacity: (1 - convergence) * interpolate(frame, [card.delay, card.delay + 8], [0, 1], clamp),
        scale: interpolate(frame, [card.delay, card.delay + 12, 154, 178], [.68, 1, 1, .92], {...clamp, easing: Easing.spring({damping: 14, stiffness: 110}), output: 'perceptual-scale'}),
        rotate: interpolate(frame, [card.delay, card.delay + 14, 178], [`${card.r * 1.8}deg`, `${card.r}deg`, `${card.r * .4}deg`], {...clamp, easing: ease}),
        translate: `${interpolate(convergence, [0, 1], [0, centerX], {...clamp, easing: ease})}px ${interpolate(convergence, [0, 1], [0, centerY], {...clamp, easing: ease})}px`,
        filter: convergence > 0 ? `blur(${convergence * 2.2}px)` : 'none',
      }}
    >
      <NoiseCardContent kind={card.kind} frame={frame} />
      <div style={{position: 'absolute', right: -9, top: -9, minWidth: 28, height: 28, padding: '0 7px', borderRadius: 99, background: card.kind === 'route' ? '#45cf8a' : '#ef5e4c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 850, boxShadow: '0 8px 20px rgba(239,94,76,.32)'}}>{index % 3 + 1}</div>
    </Interactive.Div>
  );
};

const OpeningBackground: React.FC<{frame: number}> = ({frame}) => <>
  <Interactive.Div name="Glow de fundo" style={{position: 'absolute', inset: -300, background: 'radial-gradient(circle at 50% 42%,rgba(34,132,151,.31),transparent 39%),radial-gradient(circle at 72% 18%,rgba(240,106,50,.14),transparent 27%)', scale: interpolate(frame, [0, 180], [1, 1.1], {...clamp, easing: ease, output: 'perceptual-scale'})}} />
  <Interactive.Div name="Grade técnica" style={{position: 'absolute', inset: 0, opacity: .2, backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)', backgroundSize: '64px 64px', translate: interpolate(frame, [0, 180], ['0px 0px','-28px -14px'], clamp)}} />
</>;

export const ChaosScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#09131b', overflow: 'hidden'}}>
      <OpeningBackground frame={frame} />
      {cards.map((card, index) => <NoiseCard key={card.kind} card={card} index={index} frame={frame} />)}
      <Interactive.Div name="Hook V8 — três linhas legíveis" style={{position: 'absolute', left: 330, right: 330, top: 286, textAlign: 'center', color: '#f7fbfc', opacity: interpolate(frame, [0,12,192,203],[0,1,1,0], {...clamp,easing:ease}), translate: interpolate(frame,[0,18,192,203],['0px 28px','0px 0px','0px 0px','0px -16px'],{...clamp,easing:ease})}}>
        <Interactive.Div name="Pergunta principal" style={{fontFamily: 'Plus Jakarta Sans', fontSize: 72, lineHeight: 1.03, fontWeight: 800, letterSpacing: -3}}>
          <span style={{display: 'block'}}>Quanto tempo sua imobiliária perde</span>
          <span style={{display: 'block', color: '#54dcca', marginTop: 10}}>acompanhando manutenção</span>
          <span style={{display: 'block', color: '#54dcca', marginTop: 7}}>pelo WhatsApp?</span>
        </Interactive.Div>
        <Interactive.Div name="Marcador do caos" style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 30, padding: '12px 19px', border: '1px solid rgba(255,255,255,.12)', borderRadius: 999, background: 'rgba(5,19,27,.82)', color: 'rgba(238,248,250,.76)', fontSize: 15}}>
          <span style={{width: 8, height: 8, borderRadius: 99, background: '#ef604c', boxShadow: '0 0 0 6px rgba(239,96,76,.12)'}} />
          Informação espalhada. Cobrança repetida. Zero visão do processo.
        </Interactive.Div>
      </Interactive.Div>
      <div style={{position: 'absolute', right: 78, bottom: 52, color: 'rgba(255,255,255,.27)', fontSize: 12, letterSpacing: 2.5}}>VITA / CENA 01</div>
    </AbsoluteFill>
  );
};

export const ConvergenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const converge = interpolate(frame, [4, 43], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{background: '#09131b', overflow: 'hidden'}}>
      <OpeningBackground frame={frame + 110} />
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        {cards.map((card, index) => {
          const sx = card.x + 178;
          const sy = card.y + 58;
          const length = Math.hypot(960 - sx, 520 - sy);
          return <line key={card.kind} x1={sx} y1={sy} x2={960} y2={520} stroke={index === 1 ? '#ef8a4c' : 'rgba(72,207,211,.48)'} strokeWidth={index === 1 ? 2.5 : 1.7} strokeDasharray={length} strokeDashoffset={interpolate(frame,[8 + index * 2,42],[length,0],{...clamp,easing:ease})} />;
        })}
      </svg>
      {cards.map((card, index) => <NoiseCard key={card.kind} card={card} index={index} frame={125} convergence={converge} />)}
      {[0,1,2].map((index)=><Interactive.Div key={index} name={`Pulso de convergência ${index+1}`} style={{position:'absolute',left:960,top:520,width:240 + index*100,height:240 + index*100,borderRadius:999,translate:'-50% -50%',border:'1px solid rgba(72,207,211,.28)',opacity:interpolate(frame,[28+index*3,40+index*3,65],[0,.75,0],clamp),scale:interpolate(frame,[28+index*3,65],[.35,1.25],{...clamp,easing:ease,output:'perceptual-scale'})}}/>)}
      <Interactive.Div name="OS nascida da convergência" style={{position:'absolute',left:960,top:520,translate:'-50% -50%',width:430,height:206,borderRadius:28,background:'linear-gradient(145deg,#f9ffff,#d9f2f3)',border:'1px solid #fff',boxShadow:'0 35px 110px rgba(0,0,0,.48),0 0 85px rgba(72,207,211,.3)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#15313b',opacity:interpolate(frame,[34,45,68,71],[0,1,1,0],clamp),scale:interpolate(frame,[32,49,69],[.42,1,1.06],{...clamp,easing:Easing.spring({damping:17,stiffness:125}),output:'perceptual-scale'})}}>
        <div style={{fontSize:11,fontWeight:850,letterSpacing:2.8,color:'#57747c'}}>TUDO PERTENCE AO MESMO REGISTRO</div>
        <div style={{fontFamily:'Plus Jakarta Sans',fontSize:43,fontWeight:850,letterSpacing:-1.8,marginTop:13}}><span style={{color:'#ef742f'}}>OS</span>-2026-0412</div>
        <div style={{fontSize:13,color:'#56717a',marginTop:9}}>um chamado · um fluxo · um histórico</div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
