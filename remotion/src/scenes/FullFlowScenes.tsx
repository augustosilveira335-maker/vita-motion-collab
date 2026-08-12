import {MousePointer2} from 'lucide-react';
import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {
  ApprovalMock,
  BudgetPhoneMock,
  ExecutionPhoneMock,
  FlowColors,
  HistoryMock,
  OrdersMock,
  ProfileLoginMock,
  RealtyApprovalMock,
  ReportMock,
} from '../components/FlowInterfaces';
import {VitaBrand} from '../components/VitaBrand';
import {ScreenCursor, SpotlightMask} from '../components/FocusSystem';

const ease = Easing.bezier(.16, 1, .3, 1);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const ProductBackdrop: React.FC<{children: ReactNode; label: string; chapter: string; accent?: string}> = ({children, label, chapter, accent = '#48cfd3'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#07121a', overflow: 'hidden', perspective: 1900}}>
      <Interactive.Div name="Ambiente cinematográfico" style={{position: 'absolute', inset: -220, background: `radial-gradient(circle at 52% 38%,${accent}2b,transparent 38%),radial-gradient(circle at 84% 12%,rgba(239,115,55,.12),transparent 24%),linear-gradient(180deg,#0b1b25,#07121a)`, scale: interpolate(frame, [0, 180], [1, 1.08], {...clamp, easing: ease, output: 'perceptual-scale'})}} />
      <Interactive.Div name="Grade de profundidade" style={{position: 'absolute', inset: 0, opacity: .14, backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)', backgroundSize: '70px 70px', translate: interpolate(frame, [0, 180], ['0px 0px', '-32px -18px'], clamp)}} />
      <Interactive.Div name="Luz móvel" style={{position: 'absolute', left: -520, top: -300, width: 760, height: 1600, rotate: '-24deg', background: `linear-gradient(90deg,transparent,${accent}1f,transparent)`, filter: 'blur(20px)', translate: interpolate(frame, [0, 180], ['0px 0px', '2650px 0px'], {...clamp, easing: Easing.bezier(.4, 0, .2, 1)})}} />
      <Interactive.Div name="Vinheta cinematográfica" style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 46%,transparent 45%,rgba(1,8,13,.48) 100%)', opacity: .72}} />
      {children}
      <Interactive.Div name="Identificador de etapa" style={{position: 'absolute', left: 68, bottom: 42, display: 'flex', alignItems: 'center', gap: 14, color: '#edf7f8', opacity: interpolate(frame, [10, 22, 145, 174], [0, 1, 1, 0], {...clamp, easing: ease}), translate: interpolate(frame, [10, 25], ['0px 18px', '0px 0px'], {...clamp, easing: ease}), padding: '10px 16px 10px 12px', borderRadius: 999, background: 'rgba(5,18,26,.62)', border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 16px 40px rgba(0,0,0,.18)', backdropFilter: 'blur(12px)'}}>
        <span style={{fontSize: 12, fontWeight: 850, letterSpacing: 2.8, color: accent}}>{chapter}</span><span style={{width: 42, height: 1, background: 'rgba(255,255,255,.2)'}} /><span style={{fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 750}}>{label}</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{points: Array<[number, number, number]>; clicks?: number[]; end?: number}> = ({points, clicks = [], end = 180}) => {
  const frame = useCurrentFrame();
  const frames = points.map((point) => point[0]);
  const xs = points.map((point) => point[1]);
  const ys = points.map((point) => point[2]);
  const click = clicks.find((at) => frame >= at && frame <= at + 8);
  const ripple = click === undefined ? 0 : interpolate(frame, [click, click + 8], [0, 1], clamp);
  return (
    <Interactive.Div name="Cursor guiado" style={{position: 'absolute', left: 0, top: 0, zIndex: 20, color: '#fff', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.45))', translate: `${interpolate(frame, frames, xs, {...clamp, easing: ease})}px ${interpolate(frame, frames, ys, {...clamp, easing: ease})}px`, scale: click === undefined ? 1 : interpolate(frame, [click, click + 2, click + 7], [1, .78, 1], {...clamp, easing: ease, output: 'perceptual-scale'}), opacity: interpolate(frame, [3, 12, end - 12, end], [0, 1, 1, 0], clamp)}}>
      {click === undefined ? null : <span style={{position: 'absolute', left: -21 - ripple * 24, top: -21 - ripple * 24, width: 50 + ripple * 48, height: 50 + ripple * 48, borderRadius: 99, border: `3px solid rgba(72,207,211,${.8 * (1 - ripple)})`}} />}
      <MousePointer2 size={33} fill="#fff" color="#12222d" strokeWidth={1.5} />
    </Interactive.Div>
  );
};

export const ProfilesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const selected = frame < 53 ? -1 : 2;
  const focus = interpolate(frame, [31, 43, 72, 82], [0, 1, 1, 0], clamp);
  return (
    <ProductBackdrop chapter="02" label="A entrada feita para a imobiliária">
      <Interactive.Div name="Câmera de perfis" style={{position: 'absolute', left: 160, top: 90, width: 1600, height: 900, opacity: interpolate(frame, [0, 12], [0, 1], {...clamp, easing: ease}), translate: interpolate(frame, [0, 26, 54, 84], ['0px 80px', '0px 0px', '24px -26px', '0px 0px'], {...clamp, easing: ease}), scale: interpolate(frame, [0, 28, 54, 84], [.8, .91, .98, .94], {...clamp, easing: ease, output: 'perceptual-scale'}), rotate: interpolate(frame, [0, 28], ['-2deg', '0deg'], {...clamp, easing: ease})}}>
        <ProfileLoginMock selected={selected} />
        <SpotlightMask x={426} y={496} width={382} height={162} progress={focus} radius={21} color="#55d48c" />
        <ScreenCursor points={[[13,1260,735],[45,612,575],[67,612,575],[82,740,620]]} clicks={[54]} showFrom={10} hideAt={84} />
      </Interactive.Div>
    </ProductBackdrop>
  );
};

export const OrdersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [24, 69], [.3, 1.2], clamp);
  return (
    <ProductBackdrop chapter="04" label="A OS nasce organizada">
      <Interactive.Div name="Câmera das ordens" style={{position: 'absolute', left: 160, top: 90, width: 1600, height: 900, opacity: interpolate(frame, [0, 10], [0, 1], clamp), translate: interpolate(frame, [0, 25, 72, 104], ['70px 70px', '0px 0px', '0px 0px', '-115px -70px'], {...clamp, easing: ease}), scale: interpolate(frame, [0, 25, 72, 104], [.82, .92, .92, 1.08], {...clamp, easing: ease, output: 'perceptual-scale'})}}><OrdersMock progress={progress} /></Interactive.Div>
      <Interactive.Div name="Chip compartilhado OS" style={{position:'absolute',left:0,top:0,translate:interpolate(frame,[57,88,104],['1408px 318px','1010px 480px','605px 356px'],{...clamp,easing:ease}),scale:interpolate(frame,[57,82,104],[.78,1.5,.95],{...clamp,easing:ease,output:'perceptual-scale'}),opacity:interpolate(frame,[52,60,96,104],[0,1,1,0],clamp),padding:'9px 14px',borderRadius:10,background:'#fff',border:'1px solid rgba(33,134,156,.22)',boxShadow:'0 22px 52px rgba(0,0,0,.3)',fontFamily:'Plus Jakarta Sans',fontWeight:850,color:FlowColors.teal}}><span style={{color:'#ef742f'}}>OS</span>-2026-0412</Interactive.Div>
      <Cursor points={[[8,1410,720],[46,1478,374],[76,1478,374],[104,1310,430]]} clicks={[50]} end={105} />
    </ProductBackdrop>
  );
};

export const BudgetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [18, 124], [0, 1], clamp);
  const sent = frame >= 142;
  return (
    <ProductBackdrop chapter="05" label="O orçamento entra no fluxo" accent="#55a0ff">
      <Interactive.Div name="Celular do orçamento" style={{position:'absolute',left:740,top:115,width:440,height:820,opacity:interpolate(frame,[0,12,171,179],[0,1,1,0],clamp),translate:interpolate(frame,[0,28,110,179],['0px 610px','0px 0px','0px 0px','-290px -30px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,28,85,112,179],[.72,1,1,1.12,.92],{...clamp,easing:ease,output:'perceptual-scale'}),rotate:interpolate(frame,[0,28,179],['7deg','0deg','-4deg'],{...clamp,easing:ease})}}><BudgetPhoneMock fill={fill} sent={sent} /></Interactive.Div>
      <Interactive.Div name="Mensagem editorial do orçamento" style={{position:'absolute',left:1195,top:392,width:520,color:'#f5fbfc',opacity:interpolate(frame,[50,68,137,154],[0,1,1,0],{...clamp,easing:ease}),translate:interpolate(frame,[50,72],['42px 0px','0px 0px'],{...clamp,easing:ease})}}><div style={{fontSize:12,fontWeight:850,letterSpacing:2.5,color:'#75b4ff'}}>NA MÃO DE QUEM EXECUTA.</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:48,lineHeight:1.07,fontWeight:820,letterSpacing:-1.8,marginTop:12}}>Monta, envia e acompanha pelo celular.</div><div style={{fontSize:14,color:'rgba(235,244,246,.58)',lineHeight:1.6,marginTop:17}}>O orçamento deixa de ser conversa solta e passa a fazer parte da OS.</div></Interactive.Div>
      <Cursor points={[[8,1110,680],[32,965,436],[70,965,491],[116,960,790],[148,960,790],[178,1090,720]]} clicks={[34,72,143]} end={180}/>
    </ProductBackdrop>
  );
};

export const ApprovalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const revised = interpolate(frame, [48, 105], [0, 1], clamp);
  const approved = frame >= 143;
  const focus = interpolate(frame, [18, 31, 151, 163], [0, 1, 1, 0], clamp);
  return (
    <ProductBackdrop chapter="06" label="Decisões centralizadas" accent="#ef8a4c">
      <Interactive.Div name="Câmera de aprovação" style={{position:'absolute',left:160,top:90,width:1600,height:900,opacity:interpolate(frame,[0,11,158,165],[0,1,1,0],clamp),translate:interpolate(frame,[0,30,74,128,165],['-55px 55px','0px 0px','-52px -8px','-76px -18px','0px 0px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,30,74,128,165],[.82,.91,.96,1.01,.93],{...clamp,easing:ease,output:'perceptual-scale'})}}>
        <ApprovalMock revised={revised} approved={approved}/>
        <SpotlightMask
          x={interpolate(frame,[24,88,118,146],[286,286,1205,1205],{...clamp,easing:ease})}
          y={interpolate(frame,[24,88,118,146],[190,190,505,505],{...clamp,easing:ease})}
          width={interpolate(frame,[24,88,118,146],[1240,1240,320,320],{...clamp,easing:ease})}
          height={interpolate(frame,[24,88,118,146],[168,168,74,74],{...clamp,easing:ease})}
          progress={focus}
          radius={16}
          color="#ef8a4c"
        />
        <ScreenCursor points={[[10,1380,760],[54,1442,505],[99,1442,505],[132,1372,530],[156,1372,530]]} clicks={[61,143]} showFrom={8} hideAt={164}/>
      </Interactive.Div>
      <Interactive.Div name="Headline decisão" style={{position:'absolute',left:84,top:360,width:420,color:'#f6fbfc',opacity:interpolate(frame,[31,48,118,137],[0,1,1,0],clamp),translate:interpolate(frame,[31,52],['-36px 0px','0px 0px'],{...clamp,easing:ease})}}><div style={{fontSize:11,fontWeight:850,letterSpacing:2.6,color:'#ef9c61'}}>DECISÕES CENTRALIZADAS.</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:45,fontWeight:820,lineHeight:1.08,letterSpacing:-1.7,marginTop:12}}>Orçamento, revisão e aprovação.</div><div style={{fontSize:14,color:'rgba(235,244,246,.58)',lineHeight:1.6,marginTop:16}}>A decisão acontece no mesmo registro — sem conversa ou planilha paralela.</div></Interactive.Div>
      <Interactive.Div name="Envio à imobiliária" style={{position:'absolute',right:84,bottom:66,padding:'14px 18px',borderRadius:13,background:'rgba(12,31,40,.9)',border:'1px solid rgba(72,207,211,.28)',boxShadow:'0 24px 58px rgba(0,0,0,.32)',color:'#fff',display:'flex',alignItems:'center',gap:11,opacity:interpolate(frame,[143,151,170,179],[0,1,1,0],clamp),translate:interpolate(frame,[143,155],['36px 0px','0px 0px'],{...clamp,easing:ease})}}><span style={{width:10,height:10,borderRadius:99,background:'#48cfd3',boxShadow:'0 0 0 7px rgba(72,207,211,.12)'}}/><span style={{fontSize:13,fontWeight:750}}>Enviado para aprovação da imobiliária</span></Interactive.Div>
    </ProductBackdrop>
  );
};

export const RealtyApprovalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const approved = frame >= 111;
  const focus = interpolate(frame, [20, 33, 122, 133], [0, 1, 1, 0], clamp);
  return (
    <ProductBackdrop chapter="07" label="A imobiliária autoriza a execução" accent="#55d48c">
      <Interactive.Div name="Câmera da aprovação da imobiliária" style={{position:'absolute',left:160,top:90,width:1600,height:900,opacity:interpolate(frame,[0,11,128,135],[0,1,1,0],clamp),translate:interpolate(frame,[0,27,72,118,135],['95px 55px','0px 0px','0px 0px','-68px -22px','-35px -8px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,27,72,118,135],[.82,.91,.91,1.01,.95],{...clamp,easing:ease,output:'perceptual-scale'}),rotate:interpolate(frame,[0,27],['1.8deg','0deg'],{...clamp,easing:ease})}}>
        <RealtyApprovalMock approved={approved}/>
        <SpotlightMask x={interpolate(frame,[26,72,96,116],[286,286,1200,1200],{...clamp,easing:ease})} y={interpolate(frame,[26,72,96,116],[175,175,500,500],{...clamp,easing:ease})} width={interpolate(frame,[26,72,96,116],[1235,1235,330,330],{...clamp,easing:ease})} height={interpolate(frame,[26,72,96,116],[430,430,76,76],{...clamp,easing:ease})} progress={focus} radius={16} color="#55d48c"/>
        <ScreenCursor points={[[8,1370,745],[52,1360,510],[91,1360,510],[106,1376,535],[126,1376,535]]} clicks={[112]} showFrom={7} hideAt={134}/>
      </Interactive.Div>
      <Interactive.Div name="Autorização confirmada" style={{position:'absolute',right:86,bottom:64,padding:'15px 19px',borderRadius:14,background:'rgba(9,31,29,.9)',border:'1px solid rgba(85,212,140,.32)',boxShadow:'0 24px 60px rgba(0,0,0,.32)',color:'#fff',display:'flex',alignItems:'center',gap:12,opacity:interpolate(frame,[111,120,140,149],[0,1,1,0],clamp),translate:interpolate(frame,[111,123],['38px 0px','0px 0px'],{...clamp,easing:ease})}}><span style={{width:11,height:11,borderRadius:99,background:'#55d48c',boxShadow:'0 0 0 8px rgba(85,212,140,.13)'}}/><div><div style={{fontSize:12,fontWeight:850}}>Execução autorizada</div><div style={{fontSize:10,color:'rgba(235,244,246,.58)',marginTop:3}}>aprovação registrada na OS</div></div></Interactive.Div>
    </ProductBackdrop>
  );
};

export const ExecutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [45, 136], [0, 1], clamp);
  const done = frame >= 146;
  return (
    <ProductBackdrop chapter="08" label="Execução com checklist e evidências" accent="#6aa6ff">
      {['ANTES','DEPOIS','CHECK'].map((label,index)=><Interactive.Div key={label} name={`Interstitial ${label}`} style={{position:'absolute',left:550+index*310,top:380,width:270,height:190,borderRadius:25,background:index===2?'linear-gradient(145deg,#e9fff3,#a5e2be)':'linear-gradient(145deg,rgba(39,61,76,.96),rgba(17,35,46,.98))',border:index===2?'1px solid #dffff0':'1px solid rgba(106,166,255,.35)',boxShadow:index===2?'0 28px 74px rgba(0,0,0,.32),0 0 46px rgba(85,212,140,.22)':'0 28px 74px rgba(0,0,0,.32)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Plus Jakarta Sans',fontSize:22,fontWeight:850,letterSpacing:1.7,color:index===2?'#17663b':'#eaf3ff',opacity:interpolate(frame,[index*4,10+index*4,34,46],[0,1,1,0],clamp),translate:interpolate(frame,[18,46],['0px 0px',`${210-index*310}px 220px`],{...clamp,easing:ease}),scale:interpolate(frame,[18,46],[1,.42],{...clamp,easing:ease,output:'perceptual-scale'})}}>{index===2?'✓ ':''}{label}</Interactive.Div>)}
      <Interactive.Div name="Celular da execução" style={{position:'absolute',left:740,top:115,width:440,height:820,opacity:interpolate(frame,[30,43,158,165],[0,1,1,0],clamp),translate:interpolate(frame,[28,50,165],['0px 620px','0px 0px','0px -35px'],{...clamp,easing:ease}),scale:interpolate(frame,[28,50,105,145,165],[.7,1,1.08,1.12,.98],{...clamp,easing:ease,output:'perceptual-scale'}),rotate:interpolate(frame,[28,50,165],['-7deg','0deg','3deg'],{...clamp,easing:ease})}}><ExecutionPhoneMock progress={progress} done={done}/></Interactive.Div>
      <Interactive.Div name="Evidência visual" style={{position:'absolute',left:180,top:335,width:430,color:'#f4f9fa',opacity:interpolate(frame,[61,79,142,162],[0,1,1,0],clamp),translate:interpolate(frame,[61,82],['-45px 0px','0px 0px'],{...clamp,easing:ease})}}><div style={{fontSize:12,fontWeight:850,letterSpacing:2.7,color:'#6aa6ff'}}>EVIDÊNCIA, NÃO PROMESSA</div><div style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:48,lineHeight:1.07,letterSpacing:-2,marginTop:12}}>Antes. Depois.<br/>Tudo registrado.</div><div style={{fontSize:14,color:'rgba(235,244,246,.58)',lineHeight:1.6,marginTop:17}}>Checklist, fotos e conclusão atualizam a mesma OS.</div></Interactive.Div>
      <Cursor points={[[36,1110,710],[53,945,399],[76,945,450],[99,945,502],[121,930,680],[143,960,829],[159,960,829],[165,1090,740]]} clicks={[55,78,101,123,147]} end={165}/>
    </ProductBackdrop>
  );
};

export const ReportScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [15, 113], [0, 1], clamp);
  return (
    <ProductBackdrop chapter="09" label="O registro permanece" accent="#55d48c">
      <Interactive.Div name="Folha do relatório" style={{position:'absolute',left:370,top:120,width:1180,height:820,opacity:interpolate(frame,[0,14,158,165],[0,1,1,0],clamp),translate:interpolate(frame,[0,28,118,165],['0px 760px','0px 0px','-25px -28px','-45px -64px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,28,105,165],[.76,.97,1.045,.95],{...clamp,easing:ease,output:'perceptual-scale'}),rotate:interpolate(frame,[0,28,165],['3deg','0deg','-1deg'],{...clamp,easing:ease})}}><ReportMock reveal={reveal}/></Interactive.Div>
      <Interactive.Div name="Narrativa do registro permanente" style={{position:'absolute',left:70,top:305,width:300,padding:'22px 22px 24px',borderRadius:18,background:'rgba(7,19,27,.93)',border:'1px solid rgba(85,212,140,.18)',boxShadow:'0 24px 64px rgba(0,0,0,.3)',color:'#f4fbf7',opacity:interpolate(frame,[36,52,145,160],[0,1,1,0],clamp),translate:interpolate(frame,[36,56],['-38px 0px','0px 0px'],{...clamp,easing:ease})}}><div style={{fontSize:11,fontWeight:850,letterSpacing:2.5,color:'#55d48c'}}>{frame<92?'O SERVIÇO TERMINA.':'O REGISTRO PERMANECE.'}</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:42,fontWeight:850,letterSpacing:-1.7,lineHeight:1.08,marginTop:12}}>{frame<92?'A execução vira prova.':'Cada detalhe fica ligado à OS.'}</div><div style={{fontSize:14,lineHeight:1.6,color:'rgba(235,244,246,.58)',marginTop:16}}>Escopo, evidências, garantia e conclusão preservados para consulta.</div></Interactive.Div>
      <Interactive.Div name="Selo permanente" style={{position:'absolute',right:86,bottom:70,padding:'14px 18px',borderRadius:13,background:'rgba(12,31,40,.9)',border:'1px solid rgba(85,212,140,.3)',color:'#fff',display:'flex',alignItems:'center',gap:11,opacity:interpolate(frame,[112,128,156,164],[0,1,1,0],clamp),translate:interpolate(frame,[112,132],['35px 0px','0px 0px'],{...clamp,easing:ease})}}><span style={{width:10,height:10,borderRadius:99,background:'#55d48c',boxShadow:'0 0 0 7px rgba(85,212,140,.12)'}}/><span style={{fontSize:13,fontWeight:750}}>Registro permanente vinculado ao imóvel</span></Interactive.Div>
    </ProductBackdrop>
  );
};

export const HistoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [34, 89], [0, 1], clamp);
  return (
    <ProductBackdrop chapter="10" label="A memória de cada imóvel">
      <Interactive.Div name="Câmera do histórico" style={{position:'absolute',left:160,top:90,width:1600,height:900,opacity:interpolate(frame,[12,26,108,114],[0,1,1,0],clamp),translate:interpolate(frame,[0,26,82,114],['70px 60px','0px 0px','-52px -28px','-85px -45px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,26,82,114],[.82,.91,1.0,1.05],{...clamp,easing:ease,output:'perceptual-scale'})}}><HistoryMock focus={focus}/></Interactive.Div>
      <Interactive.Div name="Relatório vira registro do imóvel" style={{position:'absolute',left:720,top:165,width:480,height:350,borderRadius:18,background:'linear-gradient(180deg,#fff,#edf6f6)',border:'1px solid #fff',boxShadow:'0 28px 80px rgba(0,0,0,.38)',padding:'28px 30px',color:'#1b3039',opacity:interpolate(frame,[0,4,34,43],[0,1,1,0],clamp),translate:interpolate(frame,[14,43],['0px 0px','-180px 210px'],{...clamp,easing:ease}),scale:interpolate(frame,[0,18,43],[1,1,.34],{...clamp,easing:ease,output:'perceptual-scale'}),rotate:interpolate(frame,[0,43],['-1deg','0deg'],{...clamp,easing:ease})}}><div style={{fontSize:11,fontWeight:850,letterSpacing:2,color:'#21869c'}}>RELATÓRIO FINAL</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:28,fontWeight:850,marginTop:12}}><span style={{color:'#ef742f'}}>OS</span>-2026-0412</div><div style={{height:1,background:'#dce7e9',marginTop:22}}/><div style={{fontSize:14,fontWeight:750,marginTop:20}}>Vazamento sob a pia da cozinha</div><div style={{fontSize:12,color:'#708088',lineHeight:1.6,marginTop:11}}>Execução concluída, evidências anexadas e garantia registrada.</div></Interactive.Div>
      <Interactive.Div name="Headline histórico" style={{position:'absolute',left:68,top:320,width:300,padding:'22px 22px 24px',borderRadius:18,background:'rgba(7,19,27,.93)',border:'1px solid rgba(72,207,211,.18)',boxShadow:'0 24px 64px rgba(0,0,0,.3)',color:'#f5fbfc',opacity:interpolate(frame,[28,43,99,111],[0,1,1,0],clamp),translate:interpolate(frame,[28,47],['-36px 0px','0px 0px'],{...clamp,easing:ease})}}><div style={{fontSize:11,fontWeight:850,letterSpacing:2.5,color:'#48cfd3'}}>CADA CHAMADO TERMINA.</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:42,fontWeight:830,lineHeight:1.08,letterSpacing:-1.7,marginTop:12}}>O histórico permanece.</div><div style={{fontSize:14,color:'rgba(235,244,246,.58)',lineHeight:1.6,marginTop:16}}>A memória de manutenção acompanha cada imóvel.</div></Interactive.Div>
      <Cursor points={[[25,1390,720],[43,775,375],[78,1290,580],[101,1290,580],[114,1170,650]]} clicks={[46,82]} end={114}/>
    </ProductBackdrop>
  );
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const labels = ['CHAMADO', 'ORÇAMENTO', 'APROVAÇÃO', 'EXECUÇÃO', 'RELATÓRIO'];
  return (
    <AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,#17414c 0%,#10232e 40%,#07131b 100%)',overflow:'hidden',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',left:190,right:190,top:260,height:155,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{position:'absolute',left:80,right:80,top:76,height:2,background:'rgba(255,255,255,.1)'}}><div style={{height:'100%',width:`${interpolate(frame,[10,51],[0,100],{...clamp,easing:ease})}%`,background:'linear-gradient(90deg,#48cfd3,#55d48c)',boxShadow:'0 0 22px rgba(72,207,211,.38)'}}/></div>
        {labels.map((label,index)=>{const start=6+index*8;return <Interactive.Div key={label} name={`Checklist final ${label}`} style={{position:'relative',zIndex:2,width:255,height:110,borderRadius:20,background:'linear-gradient(145deg,rgba(30,53,64,.96),rgba(15,33,42,.98))',border:'1px solid rgba(72,207,211,.22)',boxShadow:'0 20px 52px rgba(0,0,0,.25)',display:'flex',alignItems:'center',justifyContent:'center',gap:12,color:'#eaf6f7',fontSize:11,fontWeight:850,letterSpacing:1.5,opacity:interpolate(frame,[start,start+9,60,71],[0,1,1,0],clamp),translate:interpolate(frame,[start,start+12],['0px 24px','0px 0px'],{...clamp,easing:ease})}}><span style={{width:28,height:28,borderRadius:99,background:'#55d48c',color:'#0e442c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900}}>✓</span>{label}</Interactive.Div>;})}
      </div>
      <Interactive.Div name="Pulso final" style={{position:'absolute',left:270,top:327,width:16,height:16,borderRadius:99,background:'#f4ffff',boxShadow:'0 0 0 8px rgba(72,207,211,.1),0 0 28px rgba(72,207,211,.8)',translate:`${interpolate(frame,[8,53],[0,1360],{...clamp,easing:ease})}px 0px`,opacity:interpolate(frame,[6,11,52,58],[0,1,1,0],clamp)}}/>
      {[420,620,850].map((size,index)=><Interactive.Div key={size} name={`Anel final ${index}`} style={{position:'absolute',width:size,height:size,borderRadius:999,border:'1px solid rgba(72,207,211,.15)',scale:interpolate(frame,[45+index*3,100],[.25,1.12],{...clamp,easing:ease,output:'perceptual-scale'}),opacity:interpolate(frame,[45+index*3,60,101,113],[0,.8,.22,0],clamp)}}/>) }
      <Interactive.Div name="Marca final" style={{display:'flex',flexDirection:'column',alignItems:'center',opacity:interpolate(frame,[54,68,106,114],[0,1,1,0],clamp),scale:interpolate(frame,[50,75],[.7,1],{...clamp,easing:Easing.spring({damping:16,stiffness:110}),output:'perceptual-scale'}),translate:interpolate(frame,[50,75],['0px 28px','0px 0px'],{...clamp,easing:ease})}}><VitaBrand/><div style={{fontFamily:'Plus Jakarta Sans',fontSize:56,fontWeight:800,color:'#f5fbfc',letterSpacing:-2.1,marginTop:43,textAlign:'center'}}>Do chamado ao relatório.</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:48,fontWeight:800,color:'#48cfd3',letterSpacing:-1.8,marginTop:10,textAlign:'center'}}>Tudo em um único fluxo.</div></Interactive.Div>
    </AbsoluteFill>
  );
};
