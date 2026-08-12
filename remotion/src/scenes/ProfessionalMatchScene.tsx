import {Check, Droplets, Paintbrush, Zap} from 'lucide-react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {BudgetPhoneMock} from '../components/FlowInterfaces';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=Easing.bezier(.16,1,.3,1);
const pros=[
  {name:'Rafael Costa',skill:'HIDRÁULICA',Icon:Droplets,color:'#64dfb0',x:440},
  {name:'Lucas Prado',skill:'ELÉTRICA',Icon:Zap,color:'#ffd25f',x:790},
  {name:'Caio Martins',skill:'PINTURA',Icon:Paintbrush,color:'#e98fff',x:1140},
];

export const ProfessionalMatchScene: React.FC=()=>{
  const frame=useCurrentFrame();
  const select=interpolate(frame,[25,46],[0,1],{...clamp,easing:ease});
  const morph=interpolate(frame,[53,82],[0,1],{...clamp,easing:ease});
  return <AbsoluteFill style={{background:'#061017',overflow:'hidden',perspective:1900}}>
    <div style={{position:'absolute',inset:-220,background:'radial-gradient(circle at 50% 43%,rgba(70,196,155,.24),transparent 39%),linear-gradient(180deg,#0a1a22,#061017)'}}/>
    <Interactive.Div name="OS que procura o profissional" style={{position:'absolute',left:960,top:214,translate:`${interpolate(frame,[0,45,81],[-50,-50,-50],clamp)}% -50%`,padding:'16px 23px',borderRadius:17,background:'linear-gradient(145deg,#f7ffff,#d8f5f0)',border:'1px solid #fff',boxShadow:'0 24px 70px rgba(0,0,0,.4),0 0 56px rgba(100,223,176,.27)',fontFamily:'Plus Jakarta Sans',fontSize:25,fontWeight:850,color:'#17343c',opacity:interpolate(frame,[0,8,76,88],[0,1,1,0],clamp),scale:interpolate(frame,[0,18,47,81],[.65,1,1,.72],{...clamp,easing:ease,output:'perceptual-scale'})}}><span style={{color:'#ef742f'}}>OS</span>-2026-0412</Interactive.Div>
    {[0,1,2].map((index)=><Interactive.Div key={index} style={{position:'absolute',left:960,top:214,width:160+index*70,height:160+index*70,borderRadius:999,translate:'-50% -50%',border:'1px solid rgba(100,223,176,.25)',opacity:interpolate(frame,[12+index*3,24+index*3,48],[0,.75,0],clamp),scale:interpolate(frame,[12+index*3,48],[.35,1.35],{...clamp,easing:ease,output:'perceptual-scale'})}}/>)}
    <div style={{position:'absolute',left:315,right:315,top:355,height:330,display:'flex',justifyContent:'space-between'}}>
      {pros.map((pro,index)=>{const Icon=pro.Icon;const chosen=index===0;return <Interactive.Div key={pro.name} name={`Profissional possível ${pro.name}`} style={{width:300,height:245,borderRadius:26,background:chosen?`linear-gradient(145deg,rgba(30,68,61,.98),rgba(10,35,34,.98))`:'linear-gradient(145deg,rgba(31,47,58,.94),rgba(14,29,38,.96))',border:`${chosen?2:1}px solid ${pro.color}${chosen?'cc':'45'}`,boxShadow:chosen?`0 0 0 ${9*select}px rgba(100,223,176,.08),0 30px 80px rgba(0,0,0,.36),0 0 ${60*select}px rgba(100,223,176,.28)`:'0 24px 60px rgba(0,0,0,.28)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#f4faf9',opacity:interpolate(frame,[6+index*5,18+index*5,60,82],[0,chosen?1:1,chosen?1:1-select*.58,chosen?1-morph:1-select*.7],clamp),scale:chosen?interpolate(frame,[0,28,46,82],[.82,.94,1.08,.8],{...clamp,easing:Easing.spring({damping:16}),output:'perceptual-scale'}):interpolate(select,[0,1],[1,.88],{...clamp,output:'perceptual-scale'}),translate:chosen?`${interpolate(morph,[0,1],[0,300],{...clamp,easing:ease})}px ${interpolate(morph,[0,1],[0,10],{...clamp,easing:ease})}px`:'0px 0px'}}>
          {chosen&&select>.6?<span style={{position:'absolute',right:18,top:17,width:34,height:34,borderRadius:99,background:'#e9fff6',color:'#0d7355',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={20} strokeWidth={3}/></span>:null}
          <div style={{width:72,height:72,borderRadius:22,background:`${pro.color}20`,display:'flex',alignItems:'center',justifyContent:'center',color:pro.color}}><Icon size={34}/></div>
          <div style={{fontSize:11,fontWeight:850,letterSpacing:1.7,color:pro.color,marginTop:20}}>{pro.skill}</div>
          <div style={{fontFamily:'Plus Jakarta Sans',fontSize:23,fontWeight:800,marginTop:8}}>{pro.name}</div>
          <div style={{fontSize:11,color:'rgba(235,244,246,.55)',marginTop:8}}>{chosen?'disponível · 3,2 km':'em atendimento'}</div>
        </Interactive.Div>;})}
    </div>
    <Interactive.Div name="OS viaja até o profissional" style={{position:'absolute',left:960,top:214,width:14,height:14,borderRadius:99,background:'#f4ffff',boxShadow:'0 0 0 9px rgba(100,223,176,.12),0 0 34px rgba(100,223,176,.8)',translate:`${interpolate(frame,[35,58],[0,-370],{...clamp,easing:ease})}px ${interpolate(frame,[35,58],[0,300],{...clamp,easing:ease})}px`,opacity:interpolate(frame,[32,37,57,62],[0,1,1,0],clamp)}}/>
    <Interactive.Div name="Celular real nasce do profissional" style={{position:'absolute',left:740,top:76,width:440,height:820,opacity:interpolate(morph,[0,.32,1],[0,1,1],clamp),scale:interpolate(morph,[0,1],[.44,.93],{...clamp,easing:ease,output:'perceptual-scale'}),translate:interpolate(morph,[0,1],['-280px 110px','0px 0px'],{...clamp,easing:ease}),rotate:interpolate(morph,[0,1],['-7deg','0deg'],{...clamp,easing:ease})}}><BudgetPhoneMock fill={0} /></Interactive.Div>
    <Interactive.Div name="Headline profissional" style={{position:'absolute',left:100,right:100,bottom:74,textAlign:'center',color:'#f5fbfc',opacity:interpolate(frame,[4,14,80,89],[0,1,1,0],clamp)}}>
      <div style={{fontSize:11,fontWeight:850,letterSpacing:2.8,color:'#64dfb0'}}>{frame<53?'A OS ENCONTRA QUEM EXECUTA.':'NA MÃO DE QUEM EXECUTA.'}</div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontSize:46,fontWeight:820,letterSpacing:-1.8,marginTop:10}}>{frame<53?'Especialidade e disponibilidade em foco.':'Recebe, orça e acompanha pelo celular.'}</div>
    </Interactive.Div>
  </AbsoluteFill>;
};
