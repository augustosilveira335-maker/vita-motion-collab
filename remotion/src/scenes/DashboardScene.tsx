import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {ScreenCursor, SpotlightMask} from '../components/FocusSystem';
import {SceneCamera} from '../components/CameraRig';
import {DashboardMock} from '../components/VitaInterface';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=Easing.bezier(.16,1,.3,1);
const labels=[
  ['VISÃO TOTAL.','Toda manutenção, organizada.'],
  ['ACOMPANHAMENTO.','Cada ordem no lugar certo.'],
  ['ABERTURA.','O problema já nasce como registro.'],
  ['DECISÃO.','Aprovações sem conversa perdida.'],
  ['MEMÓRIA.','O imóvel preserva seu histórico.'],
];

export const DashboardScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const active=Math.max(0,Math.min(4,Math.floor((frame-27)/14)));
  const pulse=interpolate(frame,[118,132],[0,1],clamp);
  const navFocus=interpolate(frame,[20,30,102,112],[0,1,1,0],clamp);
  const buttonFocus=interpolate(frame,[107,117,130,134],[0,1,1,0],clamp);
  return <AbsoluteFill style={{background:'#09151e',overflow:'hidden',perspective:1800}}>
    <Interactive.Div name="Fundo do produto" style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 40%,rgba(35,142,160,.24),transparent 43%),linear-gradient(180deg,#0a1821,#09131a)',opacity:interpolate(frame,[0,12],[0,1],clamp)}}/>
    <Interactive.Div name="Luz diagonal" style={{position:'absolute',left:-300,top:-250,width:950,height:1500,background:'linear-gradient(90deg,transparent,rgba(77,213,216,.1),transparent)',rotate:'-29deg',filter:'blur(16px)',translate:interpolate(frame,[0,135],['0px 0px','820px 0px'],clamp)}}/>
    <SceneCamera boundary={5} motionDurationInFrames={125} hold={[104, 0.95, -20, -8]} name="Câmera contínua do Dashboard">
      <DashboardMock buttonPulse={pulse}/>
      <SpotlightMask x={12} y={188+active*50} width={236} height={47} progress={navFocus} radius={11} color="#48cfd3"/>
      <SpotlightMask x={1295} y={42} width={253} height={75} progress={buttonFocus} radius={14} color="#ffffff"/>
      <ScreenCursor points={[[15,1180,720],[31,185,211],[45,185,261],[59,185,311],[73,185,361],[87,185,411],[111,1415,78],[126,1415,78],[134,1460,110]]} clicks={[126]} showFrom={12} hideAt={135}/>
    </SceneCamera>
    <Interactive.Div name="Legenda dinâmica do Dashboard" style={{position:'absolute',left:88,bottom:145,width:560,color:'#f2f8f9',opacity:interpolate(frame,[20,32,105,116],[0,1,1,0],clamp),translate:interpolate(frame,[20,36],['0px 22px','0px 0px'],{...clamp,easing:ease})}}>
      <div style={{fontSize:13,letterSpacing:2.8,color:'#47cfd3',fontWeight:850}}>{labels[active][0]}</div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontSize:42,fontWeight:800,letterSpacing:-1.5,marginTop:10}}>{labels[active][1]}</div>
    </Interactive.Div>
  </AbsoluteFill>;
};
