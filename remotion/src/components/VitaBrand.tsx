import {Wrench} from 'lucide-react';
import {Img, Interactive, staticFile} from 'remotion';

export const VitaBrand: React.FC<{compact?: boolean; light?: boolean}> = ({compact = false, light = true}) => {
  if (!compact) {
    return (
      <Interactive.Div name="Marca oficial Faz Tudo" style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <Img src={staticFile('logo-faztudo.png')} style={{width: 138, height: 138, borderRadius: 999, boxShadow: '0 20px 48px rgba(0,0,0,.3)'}} />
        <Interactive.Div name="Assinatura Vita" style={{lineHeight: 1.04}}>
          <div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 40, letterSpacing: -1.4, color: light ? '#f5fbfc' : '#182732'}}>Vita FAZ TUDO</div>
          <div style={{fontSize: 16, marginTop: 9, letterSpacing: 1.4, color: light ? 'rgba(222,239,240,.66)' : '#71808a'}}>Gestão de Manutenção</div>
        </Interactive.Div>
      </Interactive.Div>
    );
  }
  return (
    <Interactive.Div name="Marca Vita" style={{display: 'flex', alignItems: 'center', gap: compact ? 12 : 18}}>
      <Interactive.Div
        name="Símbolo Vita"
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: light ? '#49c9d3' : '#21869c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: light ? '0 14px 34px rgba(54,196,200,.28)' : '0 12px 28px rgba(33,134,156,.22)',
        }}
      >
        <Wrench size={23} strokeWidth={2.45} color={light ? '#13222d' : '#ffffff'} />
      </Interactive.Div>
      <Interactive.Div name="Nome Vita" style={{lineHeight: 1.06}}>
        <Interactive.Div
          name="Vita FAZ TUDO"
          style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 19, letterSpacing: -1.2, color: light ? '#f5fbfc' : '#182732'}}
        >
          Vita FAZ TUDO
        </Interactive.Div>
        <Interactive.Div
          name="Gestão de Manutenção"
          style={{fontSize: 11, marginTop: 4, letterSpacing: 0, color: light ? 'rgba(222,239,240,.58)' : '#71808a'}}
        >
          Gestão de Manutenção
        </Interactive.Div>
      </Interactive.Div>
    </Interactive.Div>
  );
};
