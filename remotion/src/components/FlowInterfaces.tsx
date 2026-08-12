import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  History,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';
import type {ReactNode} from 'react';
import {Interactive} from 'remotion';
import {VitaBrand} from './VitaBrand';

const colors = {
  ink: '#192833',
  muted: '#75828a',
  line: '#dfe6ea',
  canvas: '#f6f8f9',
  teal: '#21869c',
  cyan: '#48cfd3',
  sidebar: '#1c2733',
  orange: '#ef7337',
  green: '#27a866',
  blue: '#3d82e6',
  purple: '#a34ed1',
};

export const StatusPill: React.FC<{children: ReactNode; tone?: 'yellow' | 'green' | 'blue' | 'purple' | 'orange'}> = ({children, tone = 'yellow'}) => {
  const map = {
    yellow: ['#fff4cc', '#9a6800'],
    green: ['#e7f8ee', '#18834a'],
    blue: ['#e8f1ff', '#2d6fc7'],
    purple: ['#f4eafd', '#8c36b7'],
    orange: ['#fff0e8', '#d35b20'],
  } as const;
  return <span style={{padding: '6px 11px', borderRadius: 999, background: map[tone][0], color: map[tone][1], fontSize: 11, fontWeight: 750, whiteSpace: 'nowrap'}}>{children}</span>;
};

const adminNav = [
  ['Dashboard', LayoutDashboard],
  ['Ordens de Serviço', ClipboardList],
  ['Novo Chamado', Plus],
  ['Aprovar Orçamentos', ClipboardCheck],
  ['Histórico Imóveis', History],
  ['Clientes', Users],
  ['Profissionais', Wrench],
  ['Relatórios Finais', FileText],
] as const;

const professionalNav = [
  ['Dashboard', LayoutDashboard],
  ['Ordens de Serviço', ClipboardList],
  ['Meus Serviços', Wrench],
  ['Histórico recente', History],
] as const;

const realtyNav = [
  ['Dashboard', LayoutDashboard],
  ['Ordens de Serviço', ClipboardList],
  ['Novo Chamado', Plus],
  ['Histórico Imóveis', History],
] as const;

export const FlowSidebar: React.FC<{active: string; role?: 'admin' | 'professional' | 'realty'}> = ({active, role = 'admin'}) => {
  const nav = role === 'professional' ? professionalNav : role === 'realty' ? realtyNav : adminNav;
  const person = role === 'admin' ? 'Carolina Martins' : role === 'professional' ? 'Rafael Costa' : 'Mariana Silva';
  const type = role === 'admin' ? 'Administrador' : role === 'professional' ? 'Profissional' : 'Imobiliária';
  return (
    <Interactive.Div name="Navegação Vita" style={{width: 248, flexShrink: 0, height: '100%', background: colors.sidebar, color: '#d4dde2', display: 'flex', flexDirection: 'column'}}>
      <div style={{height: 72, display: 'flex', alignItems: 'center', padding: '0 22px', borderBottom: '1px solid rgba(255,255,255,.075)'}}><VitaBrand compact /></div>
      <div style={{padding: '17px 22px', borderBottom: '1px solid rgba(255,255,255,.075)'}}>
        <div style={{fontSize: 14, fontWeight: 750, color: '#f4f7f8'}}>{person}</div>
        <div style={{fontSize: 11, color: 'rgba(212,221,226,.52)', marginTop: 4}}>{type}</div>
        {role === 'realty' ? <div style={{fontSize: 11, color: colors.cyan, marginTop: 4}}>Imobiliária Horizonte</div> : null}
      </div>
      <div style={{padding: '13px 11px', flex: 1}}>
        {nav.map(([label, Icon]) => {
          const selected = active === label;
          return (
            <div key={label} style={{height: 42, display: 'flex', alignItems: 'center', gap: 12, padding: '0 13px', borderRadius: 9, marginBottom: 3, color: selected ? '#55d6d9' : '#bdc9cf', background: selected ? '#293846' : 'transparent', fontSize: 12, fontWeight: selected ? 750 : 550}}>
              <Icon size={17} strokeWidth={2.1} />{label}
            </div>
          );
        })}
      </div>
      <div style={{borderTop: '1px solid rgba(255,255,255,.075)', padding: '9px 11px', fontSize: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px'}}><Settings size={16} />Configurações</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px'}}><LogOut size={16} />Sair</div>
      </div>
    </Interactive.Div>
  );
};

export const BrowserFrame: React.FC<{children: ReactNode; active: string; role?: 'admin' | 'professional' | 'realty'; url?: string}> = ({children, active, role = 'admin', url = 'ordens'}) => (
  <Interactive.Div name={`Tela ${active}`} style={{width: 1600, height: 900, borderRadius: 24, overflow: 'hidden', background: colors.canvas, border: '1px solid rgba(255,255,255,.64)', boxShadow: '0 60px 140px rgba(2,13,21,.49), 0 1px 0 rgba(255,255,255,.75) inset'}}>
    <div style={{height: 43, background: '#eaf0f2', borderBottom: `1px solid ${colors.line}`, display: 'flex', alignItems: 'center', padding: '0 15px', gap: 8}}>
      {['#e7655d', '#dfb441', '#5ab66a'].map((dot) => <span key={dot} style={{width: 11, height: 11, borderRadius: 99, background: dot}} />)}
      <div style={{margin: '0 18px', flex: 1, height: 25, borderRadius: 99, background: '#fff', border: `1px solid ${colors.line}`, display: 'flex', alignItems: 'center', padding: '0 13px', fontSize: 10, color: '#87949b'}}>app.vitafaztudo.com.br/{url}</div>
    </div>
    <div style={{height: 857, display: 'flex'}}><FlowSidebar active={active} role={role} />{children}</div>
  </Interactive.Div>
);

const FlowStepper: React.FC<{progress: number; compact?: boolean}> = ({progress, compact = false}) => {
  const labels = ['Chamado', 'Orçamento', 'Aprovado', 'Execução', 'Concluído'];
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', position: 'relative', marginTop: compact ? 14 : 20}}>
      <div style={{position: 'absolute', left: '9%', right: '9%', top: compact ? 8 : 10, height: compact ? 2 : 3, background: '#e3e9ec', borderRadius: 99}} />
      <div style={{position: 'absolute', left: '9%', top: compact ? 8 : 10, height: compact ? 2 : 3, width: `${Math.max(0, Math.min(1, progress / 4)) * 82}%`, background: colors.teal, borderRadius: 99}} />
      {labels.map((label, index) => {
        const on = progress >= index;
        return <div key={label} style={{textAlign: 'center', position: 'relative'}}><div style={{width: compact ? 18 : 23, height: compact ? 18 : 23, borderRadius: 99, border: `2px solid ${on ? colors.teal : '#dce3e7'}`, background: '#fff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{width: compact ? 5 : 7, height: compact ? 5 : 7, borderRadius: 99, background: on ? colors.teal : '#dce3e7'}} /></div><div style={{fontSize: compact ? 8 : 10, fontWeight: 700, color: on ? '#35444d' : '#96a1a7', marginTop: 6}}>{label}</div></div>;
      })}
    </div>
  );
};

const OrderCard: React.FC<{progress: number; title?: string; done?: boolean; price?: string}> = ({progress, title = 'Vazamento na cozinha do imóvel', done = false, price}) => (
  <div style={{background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 15, padding: '19px 22px', boxShadow: '0 4px 14px rgba(24,39,50,.04)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}><strong style={{fontFamily: 'Plus Jakarta Sans', color: colors.teal, fontSize: 14}}>OS-2026-0412</strong><StatusPill tone={done ? 'green' : progress >= 3 ? 'blue' : 'yellow'}>{done ? 'Concluído' : progress >= 3 ? 'Em execução' : 'Aguardando orçamento'}</StatusPill><StatusPill tone="orange">Urgência alta</StatusPill>{price ? <strong style={{marginLeft: 'auto', color: colors.ink, fontSize: 16}}>{price}</strong> : null}</div>
    <div style={{fontSize: 14, color: '#283741', fontWeight: 650, marginTop: 11}}>{title}</div>
    <div style={{display: 'flex', gap: 22, fontSize: 11, color: colors.muted, marginTop: 9}}><span>Rua das Flores, 182 · Apto 32</span><span>Márcia Ribeiro</span><span>hoje, 08:40</span></div>
    <FlowStepper progress={progress} compact />
    <div style={{height: 34, marginTop: 13, borderRadius: 8, background: colors.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 750}}>Ver detalhes <ArrowRight size={13} style={{marginLeft: 7}} /></div>
  </div>
);

export const ProfileLoginMock: React.FC<{selected?: number}> = ({selected = -1}) => {
  const profiles = [
    ['Administrador', 'Aprova, controla e acompanha as OS.', ShieldCheck, '#ef9b18', '#fff1da'],
    ['Profissional', 'Orça, executa e finaliza o serviço.', Wrench, '#397ee8', '#e8f1ff'],
    ['Imobiliária', 'Abre chamados e acompanha tudo.', Building2, '#1ba668', '#e5f7ef'],
    ['Pessoa Física', 'Solicita serviços para seus imóveis.', UserRound, '#a64bd1', '#f5e8fb'],
  ] as const;
  return (
    <Interactive.Div name="Seleção de perfis" style={{width: 1600, height: 900, borderRadius: 24, overflow: 'hidden', position: 'relative', color: '#f6fafb', background: 'radial-gradient(circle at 68% 28%,rgba(38,181,217,.16),transparent 30%),linear-gradient(135deg,#172632,#11313a)'}}>
      <div style={{position: 'absolute', left: 55, top: 44}}><VitaBrand compact /></div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 42, fontWeight: 800, letterSpacing: -1.5}}>Como deseja entrar?</div>
        <div style={{fontSize: 16, color: 'rgba(230,240,242,.64)', marginTop: 9}}>Selecione seu perfil para continuar</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 38, width: 720}}>
          {profiles.map(([title, sub, Icon, fg, bg], index) => <div key={title} style={{height: 132, borderRadius: 17, padding: '20px 21px', background: selected === index ? '#ffffff' : 'rgba(255,255,255,.96)', border: selected === index ? `2px solid ${colors.cyan}` : '1px solid rgba(255,255,255,.5)', boxShadow: selected === index ? '0 0 0 7px rgba(72,207,211,.15),0 24px 55px rgba(2,14,21,.28)' : '0 14px 36px rgba(2,14,21,.17)', color: colors.ink, display: 'flex', alignItems: 'center', gap: 17, scale: selected === index ? 1.025 : 1}}><div style={{width: 54, height: 54, borderRadius: 15, color: fg, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon size={25} /></div><div><div style={{fontWeight: 800, fontSize: 15}}>Entrar como {title}</div><div style={{fontSize: 12, color: colors.muted, marginTop: 7, lineHeight: 1.4}}>{sub}</div></div></div>)}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 31, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: 'rgba(230,240,242,.42)'}}>Vita FAZ TUDO · Sistema de Gestão de Manutenção Imobiliária</div>
    </Interactive.Div>
  );
};

export const OrdersMock: React.FC<{progress?: number}> = ({progress = 1}) => (
  <BrowserFrame active="Ordens de Serviço" role="admin" url="ordens-de-servico">
    <div style={{flex: 1, padding: '38px 43px', color: colors.ink}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div><h1 style={{fontFamily: 'Plus Jakarta Sans', fontSize: 30, margin: 0, letterSpacing: -1}}>Ordens de Serviço</h1><div style={{fontSize: 13, color: colors.muted, marginTop: 6}}>2 ordens encontradas</div></div><div style={{height: 43, borderRadius: 10, padding: '0 18px', background: colors.teal, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 750}}><Plus size={17} />Novo Chamado</div></div>
      <div style={{display: 'flex', gap: 12, marginTop: 27}}><div style={{height: 42, flex: 1, border: `1px solid ${colors.line}`, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', color: '#95a0a6', fontSize: 12}}><Search size={16} />Buscar por nome, endereço, problema...</div><div style={{height: 42, width: 180, border: `1px solid ${colors.line}`, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', color: colors.muted, fontSize: 12}}>Todos os status<ChevronDown size={15} /></div></div>
      <div style={{display: 'grid', gap: 13, marginTop: 18}}><OrderCard progress={progress} /><OrderCard progress={3} title="Reparo elétrico no corredor" price="R$ 320,00" /></div>
    </div>
  </BrowserFrame>
);

export const PhoneFrame: React.FC<{children: ReactNode; title: string}> = ({children, title}) => (
  <Interactive.Div name={`Celular ${title}`} style={{width: 440, height: 820, borderRadius: 54, background: '#0d1319', padding: 13, boxShadow: '0 70px 140px rgba(0,0,0,.52),0 20px 45px rgba(0,0,0,.32)', border: '1px solid rgba(255,255,255,.12)', position: 'relative'}}>
    <div style={{position: 'absolute', left: '50%', top: 20, translate: '-50% 0', width: 96, height: 9, borderRadius: 99, background: '#050709', zIndex: 5}} />
    <div style={{height: '100%', borderRadius: 42, overflow: 'hidden', background: colors.canvas}}>
      <div style={{height: 80, background: colors.sidebar, color: '#fff', padding: '27px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><VitaBrand compact /><span style={{fontSize: 11, color: 'rgba(255,255,255,.5)'}}>{title}</span></div>
      {children}
    </div>
  </Interactive.Div>
);

const MoneyField: React.FC<{label: string; value: string; active?: boolean}> = ({label, value, active}) => <div><div style={{fontSize: 10, fontWeight: 700, color: '#40505a', marginBottom: 6}}>{label}</div><div style={{height: 41, borderRadius: 9, padding: '0 11px', border: `1px solid ${active ? colors.teal : colors.line}`, background: '#fff', display: 'flex', alignItems: 'center', color: value ? colors.ink : '#9aa4a9', fontSize: 12, boxShadow: active ? '0 0 0 3px rgba(33,134,156,.12)' : 'none'}}>{value || 'R$ 0,00'}</div></div>;

export const BudgetPhoneMock: React.FC<{fill: number; sent?: boolean}> = ({fill, sent = false}) => (
  <PhoneFrame title="Meus Serviços">
    <div style={{padding: '20px 20px 24px', color: colors.ink}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}><strong style={{fontFamily: 'Plus Jakarta Sans', color: colors.teal, fontSize: 13}}>OS-2026-0412</strong><StatusPill tone={sent ? 'purple' : 'yellow'}>{sent ? 'Aguardando aprovação' : 'Orçamento pendente'}</StatusPill></div>
      <div style={{fontWeight: 750, fontSize: 14, marginTop: 12}}>Vazamento sob a pia da cozinha</div>
      <div style={{fontSize: 10, color: colors.muted, marginTop: 7, lineHeight: 1.45}}>Rua das Flores, 182 · Apto 32<br />Canoas/RS</div>
      <div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, marginTop: 20}}>Enviar Orçamento</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12}}><MoneyField label="Mão de obra" value={fill > .2 ? 'R$ 280,00' : ''} active={fill <= .42} /><MoneyField label="Materiais" value={fill > .52 ? 'R$ 160,00' : ''} active={fill > .42 && fill < .74} /></div>
      <div style={{marginTop: 11}}><div style={{fontSize: 10, fontWeight: 700, color: '#40505a', marginBottom: 6}}>Prazo estimado</div><div style={{height: 41, borderRadius: 9, padding: '0 11px', border: `1px solid ${colors.line}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: fill > .72 ? colors.ink : '#9aa4a9', fontSize: 12}}>{fill > .72 ? '1 dia útil' : 'Selecione'}<ChevronDown size={14} /></div></div>
      <div style={{height: 77, borderRadius: 12, background: '#e9f5f7', border: '1px solid #cbe7eb', marginTop: 14, padding: '13px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div><div style={{fontSize: 10, color: colors.muted}}>Total do orçamento</div><strong style={{display: 'block', fontFamily: 'Plus Jakarta Sans', fontSize: 22, color: colors.teal, marginTop: 5}}>{fill > .72 ? 'R$ 440,00' : 'R$ 0,00'}</strong></div><FileCheck2 size={28} color={colors.teal} /></div>
      <div style={{height: 48, borderRadius: 11, marginTop: 14, background: sent ? colors.green : `linear-gradient(135deg,${colors.teal},#176b82)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 800}}>{sent ? <Check size={18} /> : <ArrowRight size={18} />}{sent ? 'Orçamento enviado' : 'Enviar Orçamento'}</div>
    </div>
  </PhoneFrame>
);

export const ApprovalMock: React.FC<{revised: number; approved?: boolean}> = ({revised, approved = false}) => {
  const sale = Math.round(440 + 176 * revised);
  return (
    <BrowserFrame active="Aprovar Orçamentos" role="admin" url="aprovar-orcamentos">
      <div style={{flex: 1, padding: '38px 43px', color: colors.ink}}>
        <h1 style={{fontFamily: 'Plus Jakarta Sans', fontSize: 30, margin: 0, letterSpacing: -1}}>Aprovar Orçamentos</h1><div style={{fontSize: 13, color: colors.muted, marginTop: 6}}>1 orçamento aguardando sua aprovação</div>
        <div style={{marginTop: 24, background: '#fff', border: `1px solid ${approved ? '#bce8ce' : '#f2d9ca'}`, borderRadius: 17, overflow: 'hidden', boxShadow: '0 6px 22px rgba(24,39,50,.055)'}}>
          <div style={{padding: '21px 24px', borderBottom: `1px solid ${colors.line}`}}><div style={{display: 'flex', alignItems: 'center', gap: 10}}><strong style={{fontFamily: 'Plus Jakarta Sans', color: colors.teal}}>OS-2026-0412</strong><StatusPill tone="purple">{approved ? 'Enviado à imobiliária' : 'Aguardando revisão admin'}</StatusPill></div><div style={{fontSize: 14, fontWeight: 650, marginTop: 11}}>Vazamento sob a pia da cozinha</div><FlowStepper progress={approved ? 1.45 : 1} compact /></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 375}}><div style={{padding: '23px 25px'}}><div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 800}}>Resumo do orçamento</div><div style={{fontSize: 12, color: colors.muted, lineHeight: 1.65, marginTop: 12}}>Substituição do sifão, vedação das conexões e teste completo para eliminar o vazamento.</div><div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11, marginTop: 20}}>{[['Mão de obra','R$ 280,00'],['Materiais','R$ 160,00'],['Prazo','1 dia útil']].map(([a,b]) => <div key={a} style={{border: `1px solid ${colors.line}`, borderRadius: 11, padding: '13px 14px'}}><div style={{fontSize: 10, color: colors.muted}}>{a}</div><div style={{fontSize: 14, fontWeight: 800, marginTop: 6}}>{b}</div></div>)}</div><div style={{marginTop: 20, borderRadius: 12, background: '#f7f9fa', border: `1px solid ${colors.line}`, padding: '15px'}}><div style={{fontSize: 10, color: colors.muted}}>Observação do profissional</div><div style={{fontSize: 12, marginTop: 7}}>Material incluso e garantia do reparo.</div></div></div>
            <div style={{padding: '23px 24px', borderLeft: `1px solid ${colors.line}`, background: approved ? '#f3fbf6' : '#fffaf7'}}><div style={{fontSize: 10, color: colors.muted}}>Custo do profissional</div><strong style={{fontFamily: 'Plus Jakarta Sans', fontSize: 19, display: 'block', marginTop: 5}}>R$ 440,00</strong><div style={{fontSize: 10, color: colors.muted, marginTop: 22}}>Valor sugerido à imobiliária</div><div style={{height: 55, borderRadius: 10, marginTop: 7, border: `2px solid ${revised > .02 ? colors.orange : colors.line}`, background: '#fff', padding: '0 13px', display: 'flex', alignItems: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 22, fontWeight: 800, color: colors.orange, boxShadow: revised > .02 ? '0 0 0 5px rgba(239,115,55,.11)' : 'none'}}>R$ {sale},00</div><div style={{fontSize: 10, color: colors.green, fontWeight: 750, marginTop: 8}}>Margem calculada automaticamente</div><div style={{height: 49, borderRadius: 11, marginTop: 25, background: approved ? colors.green : `linear-gradient(135deg,${colors.teal},#176b82)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, fontWeight: 800}}>{approved ? <CheckCircle2 size={17} /> : <ShieldCheck size={17} />}{approved ? 'Enviado à imobiliária' : 'Revisar e Enviar'}</div></div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
};

export const RealtyApprovalMock: React.FC<{approved?: boolean}> = ({approved = false}) => (
  <BrowserFrame active="Ordens de Serviço" role="realty" url="ordens-de-servico/OS-2026-0412/aprovacao">
    <div style={{flex: 1, padding: '36px 42px', color: colors.ink}}>
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <div><div style={{fontSize: 11, color: colors.teal, fontWeight: 850, letterSpacing: 1.5}}>APROVAÇÃO DA IMOBILIÁRIA</div><h1 style={{fontFamily: 'Plus Jakarta Sans', fontSize: 30, margin: '7px 0 0', letterSpacing: -1}}>Revisar orçamento</h1><div style={{fontSize: 13, color: colors.muted, marginTop: 6}}>Confira escopo, prazo e valor antes de autorizar a execução.</div></div>
        <StatusPill tone={approved ? 'green' : 'purple'}>{approved ? 'Orçamento aprovado' : 'Aguardando sua aprovação'}</StatusPill>
      </div>
      <div style={{marginTop: 23, borderRadius: 17, overflow: 'hidden', border: `1px solid ${approved ? '#bce8ce' : colors.line}`, background: '#fff', boxShadow: approved ? '0 0 0 6px rgba(39,168,102,.09),0 16px 45px rgba(24,39,50,.08)' : '0 8px 26px rgba(24,39,50,.06)'}}>
        <div style={{padding: '20px 23px', borderBottom: `1px solid ${colors.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div><div style={{display: 'flex', alignItems: 'center', gap: 10}}><strong style={{fontFamily: 'Plus Jakarta Sans', color: colors.teal, fontSize: 15}}>OS-2026-0412</strong><StatusPill tone="orange">Urgência alta</StatusPill></div><div style={{fontSize: 14, fontWeight: 750, marginTop: 10}}>Vazamento sob a pia da cozinha</div><div style={{fontSize: 11, color: colors.muted, marginTop: 6}}>Rua das Flores, 182 · Apto 32 · Canoas/RS</div></div><Building2 size={34} color={colors.teal} strokeWidth={1.7} /></div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 365px', minHeight: 390}}>
          <div style={{padding: '23px 25px'}}><div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 800}}>Serviço proposto</div><div style={{fontSize: 12, color: colors.muted, lineHeight: 1.65, marginTop: 11}}>Substituição do sifão, vedação das conexões e teste completo para eliminar o vazamento.</div><div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11, marginTop: 20}}>{[['Profissional','Rafael Costa'],['Prazo','1 dia útil'],['Garantia','Registrada na OS']].map(([a,b]) => <div key={a} style={{border: `1px solid ${colors.line}`, borderRadius: 11, padding: '13px 14px'}}><div style={{fontSize: 10, color: colors.muted}}>{a}</div><div style={{fontSize: 13, fontWeight: 800, marginTop: 6}}>{b}</div></div>)}</div><div style={{marginTop: 21, padding: '16px 17px', borderRadius: 12, background: '#f3f8f9', border: '1px solid #d9eaed', display: 'flex', alignItems: 'center', gap: 12}}><ShieldCheck size={22} color={colors.teal}/><div><div style={{fontSize: 11, fontWeight: 800}}>Tudo registrado na mesma OS</div><div style={{fontSize: 10, color: colors.muted, marginTop: 4}}>Orçamento, autorização, execução e evidências.</div></div></div></div>
          <div style={{padding: '25px 25px', borderLeft: `1px solid ${colors.line}`, background: approved ? '#f2fbf6' : '#f8fbfc'}}><div style={{fontSize: 10, color: colors.muted}}>VALOR PARA APROVAÇÃO</div><div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 38, fontWeight: 850, color: approved ? colors.green : colors.teal, letterSpacing: -1.5, marginTop: 9}}>R$ 616,00</div><div style={{fontSize: 10, color: colors.muted, marginTop: 8}}>Serviço e materiais inclusos</div><div style={{height: 47, borderRadius: 10, marginTop: 31, border: `1px solid ${colors.line}`, background: '#fff', color: colors.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 750}}>Solicitar ajuste</div><div style={{height: 51, borderRadius: 11, marginTop: 11, background: approved ? colors.green : `linear-gradient(135deg,${colors.teal},#176b82)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 12, fontWeight: 850, boxShadow: approved ? '0 13px 28px rgba(39,168,102,.23)' : '0 13px 28px rgba(33,134,156,.22)'}}><CheckCircle2 size={18}/>{approved ? 'Aprovado para execução' : 'Aprovar orçamento'}</div><div style={{fontSize: 9, color: colors.muted, lineHeight: 1.5, marginTop: 13, textAlign: 'center'}}>A autorização fica vinculada ao histórico da ordem de serviço.</div></div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

export const ExecutionPhoneMock: React.FC<{progress: number; done?: boolean}> = ({progress, done = false}) => {
  const checklist = ['Diagnóstico confirmado', 'Reparo executado', 'Teste sem vazamento'];
  return (
    <PhoneFrame title="Execução">
      <div style={{padding: '19px 20px 22px', color: colors.ink}}><div style={{display: 'flex', alignItems: 'center', gap: 8}}><strong style={{fontFamily: 'Plus Jakarta Sans', color: colors.teal, fontSize: 13}}>OS-2026-0412</strong><StatusPill tone={done ? 'green' : 'blue'}>{done ? 'Concluído' : 'Em execução'}</StatusPill></div><div style={{fontWeight: 750, fontSize: 14, marginTop: 11}}>Vazamento sob a pia da cozinha</div><div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, marginTop: 18}}>Relatório de Execução</div>
        <div style={{display: 'grid', gap: 8, marginTop: 11}}>{checklist.map((item,index) => {const on = progress > index * .26; return <div key={item} style={{height: 43, borderRadius: 10, background: '#fff', border: `1px solid ${on ? '#bfe8ce' : colors.line}`, padding: '0 11px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 650}}><div style={{width: 20,height:20,borderRadius:6,background:on?colors.green:'#fff',border:`1.5px solid ${on?colors.green:'#cbd5da'}`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{on?<Check size={14}/>:null}</div>{item}</div>;})}</div>
        <div style={{fontSize: 10, fontWeight: 750, marginTop: 14}}>Evidências do serviço</div><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 8}}>{['ANTES','DEPOIS'].map((label,index) => {const on=progress>.58+index*.12; return <div key={label} style={{height: 96,borderRadius:11,border:`1px ${on?'solid':'dashed'} ${on?'#a9dfe3':'#cbd5da'}`,background:on?'linear-gradient(145deg,#d4ebed,#92c6cc)':'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:on?'#155e6f':colors.muted,fontSize:10,fontWeight:800,position:'relative',overflow:'hidden'}}>{on?<><div style={{position:'absolute',left:16,bottom:18,width:64,height:42,borderRadius:'42px 42px 8px 8px',background:'rgba(25,91,103,.17)'}}/><ImageIcon size={21}/><span style={{position:'absolute',bottom:8,left:0,right:0,textAlign:'center'}}>{label}</span></>:<><Upload size={18}/><span style={{marginLeft:6}}>Adicionar</span></>}</div>;})}</div>
        <div style={{height: 48,borderRadius:11,marginTop:14,background:done?colors.green:`linear-gradient(135deg,${colors.teal},#176b82)`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:13,fontWeight:800}}>{done?<CheckCircle2 size={18}/>:<ClipboardCheck size={18}/>} {done?'Serviço finalizado':'Finalizar serviço'}</div>
      </div>
    </PhoneFrame>
  );
};

export const ReportMock: React.FC<{reveal: number}> = ({reveal}) => (
  <Interactive.Div name="Relatório final" style={{width: 1180,height:820,borderRadius:18,overflow:'hidden',background:'#fff',boxShadow:'0 65px 150px rgba(1,11,18,.52)',border:'1px solid rgba(255,255,255,.72)',position:'relative'}}>
    <div style={{height:118,background:'linear-gradient(135deg,#1b2b37,#15576a)',color:'#fff',padding:'25px 34px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><VitaBrand compact/><div style={{textAlign:'right'}}><div style={{fontFamily:'Plus Jakarta Sans',fontSize:18,fontWeight:800}}>RELATÓRIO FINAL</div><div style={{fontSize:12,color:'rgba(255,255,255,.6)',marginTop:5}}>OS-2026-0412</div></div></div>
    <div style={{padding:'28px 34px',color:colors.ink}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>{[['Imóvel','Rua das Flores, 182 · Apto 32'],['Solicitante','Márcia Ribeiro'],['Profissional','Rafael Costa']].map(([a,b])=><div key={a} style={{border:`1px solid ${colors.line}`,borderRadius:12,padding:'14px 15px'}}><div style={{fontSize:10,color:colors.muted}}>{a}</div><div style={{fontSize:12,fontWeight:750,marginTop:6}}>{b}</div></div>)}</div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontSize:17,fontWeight:800,marginTop:24}}>Linha do tempo da OS</div><FlowStepper progress={Math.min(4,reveal*5)} />
      <div style={{display:'grid',gridTemplateColumns:'1.2fr .8fr',gap:15,marginTop:22}}><div style={{border:`1px solid ${colors.line}`,borderRadius:13,padding:'17px'}}><div style={{fontSize:11,color:colors.muted}}>Serviço realizado</div><div style={{fontSize:13,fontWeight:700,lineHeight:1.55,marginTop:8}}>Substituição do sifão, nova vedação e teste completo. Vazamento eliminado e área liberada.</div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginTop:15}}>{['ANTES','DURANTE','DEPOIS'].map((x,i)=><div key={x} style={{height:88,borderRadius:10,background:`linear-gradient(145deg,${i===2?'#d8f3e2':'#d8eaed'},${i===2?'#8bd4a8':'#8ec5ca'})`,display:'flex',alignItems:'center',justifyContent:'center',color:i===2?colors.green:colors.teal,fontSize:10,fontWeight:850}}><ImageIcon size={20}/><span style={{marginLeft:6}}>{x}</span></div>)}</div></div><div style={{border:`1px solid ${colors.line}`,borderRadius:13,padding:'17px'}}><div style={{display:'flex',alignItems:'center',gap:9,color:colors.green,fontWeight:800,fontSize:13}}><CheckCircle2 size={20}/>Serviço concluído</div><div style={{fontSize:11,color:colors.muted,lineHeight:1.6,marginTop:14}}>Finalizado em 11/08/2026<br/>Garantia registrada<br/>Evidências anexadas</div><div style={{marginTop:20,paddingTop:14,borderTop:`1px solid ${colors.line}`}}><div style={{fontSize:10,color:colors.muted}}>Valor final</div><div style={{fontFamily:'Plus Jakarta Sans',fontSize:22,fontWeight:800,color:colors.teal,marginTop:5}}>R$ 616,00</div></div></div></div>
    </div>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${(1-reveal)*100}%`,background:'linear-gradient(90deg,#07121a 0%,#0d2832 88%,rgba(72,207,211,.9) 100%)',boxShadow:'16px 0 42px rgba(72,207,211,.22)',opacity:.98}} />
  </Interactive.Div>
);

export const HistoryMock: React.FC<{focus?: number}> = ({focus = 0}) => (
  <BrowserFrame active="Histórico Imóveis" role="admin" url="historico-imoveis">
    <div style={{flex:1,padding:'37px 42px',color:colors.ink}}><h1 style={{fontFamily:'Plus Jakarta Sans',fontSize:30,margin:0,letterSpacing:-1}}>Histórico de Imóveis</h1><div style={{fontSize:13,color:colors.muted,marginTop:6}}>Consulte o histórico completo de serviços por imóvel</div><div style={{display:'flex',gap:11,marginTop:24}}><div style={{height:41,flex:1,border:`1px solid ${colors.line}`,borderRadius:9,background:'#fff',padding:'0 13px',display:'flex',alignItems:'center',gap:9,color:'#94a0a6',fontSize:12}}><Search size={16}/>Buscar imóvel, endereço ou OS...</div><div style={{height:41,width:160,border:`1px solid ${colors.line}`,borderRadius:9,background:'#fff',padding:'0 13px',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,color:colors.muted}}>Todos os anos<ChevronDown size={15}/></div></div>
      <div style={{marginTop:18,background:'#fff',border:`1px solid ${colors.line}`,borderRadius:16,padding:'20px 22px',boxShadow:focus>.4?'0 0 0 6px rgba(72,207,211,.12),0 15px 40px rgba(23,74,86,.11)':'0 5px 18px rgba(24,39,50,.045)'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:40,height:40,borderRadius:11,background:'#e7f5f7',color:colors.teal,display:'flex',alignItems:'center',justifyContent:'center'}}><Home size={21}/></div><div><div style={{fontWeight:800,fontSize:14}}>Rua das Flores, 182 · Apto 32</div><div style={{fontSize:11,color:colors.muted,marginTop:4}}>Canoas/RS · Imobiliária Horizonte</div></div></div><div style={{display:'flex',gap:8}}><StatusPill tone="blue">5 serviços</StatusPill><StatusPill tone="green">Sem pendências</StatusPill></div></div>
        <div style={{fontFamily:'Plus Jakarta Sans',fontSize:14,fontWeight:800,marginTop:21}}>Linha do tempo do imóvel</div><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginTop:12}}>{[['Fev','Chaveiro','#eaf2ff','#3979d3'],['Mar','Pintura','#f6ebfc','#9f45c7'],['Mai','Hidráulica','#e8f6f8','#21869c'],['Jul','Elétrica','#fff1e8','#d86c32'],['Ago','Vazamento','#e8f8ee','#279157']].map(([m,s,bg,fg],i)=><div key={m} style={{height:91,borderRadius:11,background:bg,border:`1px solid ${fg}22`,padding:'13px 12px',scale:focus>.65&&i===4?1.05:1,boxShadow:focus>.65&&i===4?'0 12px 24px rgba(39,145,87,.16)':'none'}}><div style={{fontSize:10,color:fg,fontWeight:800}}>{m}</div><div style={{fontSize:11,fontWeight:750,marginTop:9}}>{s}</div><div style={{fontSize:9,color:colors.muted,marginTop:6}}>{i===4?'Concluído':'Finalizado'}</div></div>)}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginTop:18,paddingTop:16,borderTop:`1px solid ${colors.line}`,fontSize:11}}><div><span style={{color:colors.muted}}>Última OS</span><strong style={{display:'block',marginTop:5,color:colors.teal}}>OS-2026-0412</strong></div><div><span style={{color:colors.muted}}>Problema</span><strong style={{display:'block',marginTop:5}}>Vazamento</strong></div><div><span style={{color:colors.muted}}>Profissional</span><strong style={{display:'block',marginTop:5}}>Rafael Costa</strong></div><div><span style={{color:colors.muted}}>Valor</span><strong style={{display:'block',marginTop:5}}>R$ 616,00</strong></div></div>
      </div>
    </div>
  </BrowserFrame>
);

export const FlowColors = colors;
