import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {ScreenCursor, SpotlightMask} from '../components/FocusSystem';
import {SceneCamera} from '../components/CameraRig';
import {NewTicketMock} from '../components/VitaInterface';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=Easing.bezier(.16,1,.3,1);

export const NewTicketScene: React.FC=()=>{
  const frame=useCurrentFrame();
  const urgencyOpen=frame>=42&&frame<73;
  const urgencySelected=frame>=73;
  const submitted=frame>=132;
  const focus=interpolate(frame,[20,31,153,164],[0,1,1,0],clamp);
  const spotX=interpolate(frame,[31,51,62,82,106,129,143],[970,970,970,970,1342,1342,1105],{...clamp,easing:ease});
  const spotY=interpolate(frame,[31,51,62,82,106,129,143],[348,348,468,468,520,520,24],{...clamp,easing:ease});
  const spotW=interpolate(frame,[31,51,62,82,106,129,143],[555,555,555,555,205,205,455],{...clamp,easing:ease});
  const spotH=interpolate(frame,[31,51,62,82,106,129,143],[74,74,47,47,72,72,75],{...clamp,easing:ease});
  return <AbsoluteFill style={{background:'#09151e',overflow:'hidden',perspective:1750}}>
    <Interactive.Div name="Fundo Novo Chamado" style={{position:'absolute',inset:0,background:'radial-gradient(circle at 58% 36%,rgba(41,159,175,.25),transparent 46%),linear-gradient(180deg,#0b1a23,#08131b)'}}/>
    <SceneCamera boundary={6} motionDurationInFrames={145} hold={[124, 0.94, -20, 0]} name="Câmera contínua do Novo Chamado">
      <NewTicketMock urgencyOpen={urgencyOpen} urgencySelected={urgencySelected} submitted={submitted}/>
      <SpotlightMask x={spotX} y={spotY} width={spotW} height={spotH} progress={focus} radius={13} color={frame>=128?'#55d48c':'#ffffff'}/>
      <ScreenCursor points={[[9,1190,760],[36,1428,385],[55,1428,385],[66,1420,489],[78,1420,489],[101,1450,676],[123,1450,676],[143,1285,62],[160,1285,62]]} clicks={[43,67,124]} showFrom={8} hideAt={164}/>
    </SceneCamera>
    <Interactive.Div name="Headline Novo Chamado" style={{position:'absolute',left:82,top:340,width:430,color:'#f3fafb',opacity:interpolate(frame,[24,39,118,136],[0,1,1,0],clamp),translate:interpolate(frame,[24,43],['-38px 0px','0px 0px'],{...clamp,easing:ease})}}>
      <div style={{fontSize:12,fontWeight:850,letterSpacing:2.7,color:'#48cfd3'}}>DO PROBLEMA À OS.</div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontSize:48,fontWeight:820,lineHeight:1.06,letterSpacing:-1.9,marginTop:12}}>Tudo começa organizado.</div>
      <div style={{fontSize:14,color:'rgba(235,244,246,.58)',lineHeight:1.6,marginTop:17}}>Urgência, imóvel, evidências e solicitante no mesmo registro desde o início.</div>
    </Interactive.Div>
  </AbsoluteFill>;
};
