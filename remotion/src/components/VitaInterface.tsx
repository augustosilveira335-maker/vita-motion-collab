import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plus,
  ShieldCheck,
  Settings,
  Upload,
  User,
} from 'lucide-react';
import {Interactive} from 'remotion';
import {VitaBrand} from './VitaBrand';

const navItems = [
  {label: 'Dashboard', icon: LayoutDashboard, active: true},
  {label: 'Ordens de Serviço', icon: ClipboardList},
  {label: 'Novo Chamado', icon: Plus},
  {label: 'Aprovações', icon: ShieldCheck},
  {label: 'Histórico Imóveis', icon: History},
];

const Sidebar: React.FC<{active?: 'dashboard' | 'new'}> = ({active = 'dashboard'}) => (
  <Interactive.Div
    name="Sidebar da Vita"
    style={{width: 260, height: '100%', background: '#1c2733', color: '#d4dde2', display: 'flex', flexDirection: 'column', flexShrink: 0}}
  >
    <Interactive.Div name="Logo da sidebar" style={{height: 78, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
      <VitaBrand compact />
    </Interactive.Div>
    <Interactive.Div name="Perfil" style={{padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
      <div style={{fontSize: 15, fontWeight: 700, color: '#f2f6f8'}}>Mariana Silva</div>
      <div style={{fontSize: 12, color: 'rgba(212,221,226,.54)', marginTop: 5}}>Imobiliária</div>
      <div style={{fontSize: 12, color: '#46c9cd', marginTop: 5}}>Imobiliária Horizonte</div>
    </Interactive.Div>
    <Interactive.Div name="Navegação" style={{padding: '16px 12px', flex: 1}}>
      {navItems.map((item) => {
        const selected = active === 'dashboard' ? item.label === 'Dashboard' : item.label === 'Novo Chamado';
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              height: 46,
              padding: '0 14px',
              borderRadius: 10,
              marginBottom: 4,
              color: selected ? '#54d5d8' : '#bfccd2',
              background: selected ? '#273746' : 'transparent',
              fontSize: 14,
              fontWeight: selected ? 700 : 550,
            }}
          >
            <Icon size={20} strokeWidth={2.1} />
            {item.label}
          </div>
        );
      })}
    </Interactive.Div>
    <Interactive.Div name="Ações da sidebar" style={{borderTop: '1px solid rgba(255,255,255,.08)', padding: 12, fontSize: 14}}>
      <div style={{display: 'flex', gap: 13, alignItems: 'center', padding: '12px 14px'}}><Settings size={19} />Configurações</div>
      <div style={{display: 'flex', gap: 13, alignItems: 'center', padding: '12px 14px'}}><LogOut size={19} />Sair</div>
    </Interactive.Div>
  </Interactive.Div>
);

const StatCard: React.FC<{title: string; value: string; icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>; variant?: 'teal' | 'plain'}> = ({title, value, icon: Icon, variant = 'plain'}) => (
  <Interactive.Div
    name={`Indicador ${title}`}
    style={{
      height: 132,
      borderRadius: 16,
      padding: '25px 24px',
      color: variant === 'teal' ? '#fff' : '#1c2a33',
      background: variant === 'teal' ? 'linear-gradient(135deg,#23869b,#176b82)' : '#ffffff',
      border: variant === 'teal' ? '1px solid rgba(35,134,155,.45)' : '1px solid #e1e7eb',
      boxShadow: '0 5px 18px rgba(24,39,50,.055)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    }}
  >
    <div>
      <div style={{fontSize: 14, fontWeight: 650, color: variant === 'teal' ? 'rgba(255,255,255,.7)' : '#71808a'}}>{title}</div>
      <div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 34, fontWeight: 800, marginTop: 12, letterSpacing: -1}}>{value}</div>
    </div>
    <div style={{width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: variant === 'teal' ? 'rgba(255,255,255,.15)' : 'rgba(33,134,156,.1)'}}>
      <Icon size={25} color={variant === 'teal' ? '#fff' : '#21869c'} strokeWidth={2.1} />
    </div>
  </Interactive.Div>
);

export const DashboardMock: React.FC<{buttonPulse?: number}> = ({buttonPulse = 0}) => (
  <Interactive.Div name="Tela Dashboard" style={{width: 1600, height: 900, background: '#f7f9fa', borderRadius: 24, overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,.55)', boxShadow: '0 55px 130px rgba(4,15,23,.45), 0 1px 0 rgba(255,255,255,.7) inset'}}>
    <Sidebar />
    <Interactive.Div name="Conteúdo Dashboard" style={{flex: 1, padding: '54px 52px 44px'}}>
      <Interactive.Div name="Cabeçalho Dashboard" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35}}>
        <div>
          <div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 34, letterSpacing: -1.15, color: '#192833'}}>Olá, Mariana!</div>
          <div style={{fontSize: 16, color: '#75828a', marginTop: 7}}>Acompanhe suas ordens de serviço</div>
        </div>
        <Interactive.Div
          name="Botão Novo Chamado"
          style={{
            height: 54,
            padding: '0 23px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#fff',
            fontWeight: 750,
            fontSize: 15,
            background: 'linear-gradient(135deg,#23869b,#176b82)',
            boxShadow: buttonPulse > 0 ? `0 0 0 ${4 + buttonPulse * 12}px rgba(64,204,208,${0.18 - buttonPulse * 0.12}), 0 14px 30px rgba(25,111,130,.28)` : '0 12px 28px rgba(25,111,130,.22)',
          }}
        >
          <Plus size={20} strokeWidth={2.4} />Novo Chamado
        </Interactive.Div>
      </Interactive.Div>
      <Interactive.Div name="Indicadores" style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 37}}>
        <StatCard title="Total de OS" value="24" icon={ClipboardList} />
        <StatCard title="Em Andamento" value="07" icon={Clock3} variant="teal" />
        <StatCard title="Em Execução" value="03" icon={AlertCircle} />
        <StatCard title="Concluídas" value="14" icon={CheckCircle2} />
      </Interactive.Div>
      <Interactive.Div name="Ordens Recentes - título" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 21, fontWeight: 750, color: '#1b2a34'}}>Ordens Recentes</div>
        <div style={{fontSize: 14, fontWeight: 700, color: '#21869c'}}>Ver todas</div>
      </Interactive.Div>
      <Interactive.Div name="Ordem recente" style={{background: '#fff', border: '1px solid #e1e7eb', borderRadius: 16, padding: '22px 25px', boxShadow: '0 4px 14px rgba(24,39,50,.045)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#21869c'}}>OS-2026-024</div>
          <div style={{padding: '6px 11px', borderRadius: 999, background: '#fff4cc', color: '#a86f00', fontSize: 11, fontWeight: 750}}>Aguardando orçamento</div>
          <div style={{padding: '6px 11px', borderRadius: 999, background: '#fff0e8', color: '#d35b20', fontSize: 11, fontWeight: 750}}>Urgência alta</div>
        </div>
        <div style={{fontSize: 16, color: '#24323b', fontWeight: 650, marginTop: 14}}>Vazamento na cozinha do imóvel</div>
        <div style={{display: 'flex', gap: 27, fontSize: 13, color: '#7b878e', marginTop: 13}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 7}}><MapPin size={15} />Rua das Flores, 182</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 7}}><User size={15} />Ana Souza</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 7}}><CalendarDays size={15} />há 2 horas</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, marginTop: 24, position: 'relative'}}>
          <div style={{position: 'absolute', left: '8%', right: '8%', top: 10, height: 3, borderRadius: 99, background: 'linear-gradient(90deg,#21869c 0 31%,#e6ebee 31% 100%)'}} />
          {['Chamado Aberto','Orçamento','Aprovado','Execução','Concluído'].map((label, index) => (
            <div key={label} style={{textAlign: 'center', position: 'relative', zIndex: 1}}>
              <div style={{width: 23, height: 23, borderRadius: 999, margin: '0 auto', border: `2px solid ${index < 2 ? '#21869c' : '#dce3e7'}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 7, height: 7, borderRadius: 99, background: index < 2 ? '#21869c' : '#dce3e7'}} />
              </div>
              <div style={{fontSize: 10, fontWeight: 700, color: index < 2 ? '#35444d' : '#96a1a7', marginTop: 6}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>
          <div style={{height: 40, padding: '0 19px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 9, background: '#21869c', color: '#fff', fontSize: 13, fontWeight: 750}}>Ver Detalhes <ArrowRight size={16} /></div>
        </div>
      </Interactive.Div>
    </Interactive.Div>
  </Interactive.Div>
);

const Field: React.FC<{label: string; placeholder: string; wide?: boolean}> = ({label, placeholder, wide = false}) => (
  <div style={{gridColumn: wide ? '1 / -1' : undefined}}>
    <div style={{fontSize: 12, fontWeight: 700, color: '#34434c', marginBottom: 8}}>{label}</div>
    <div style={{height: 43, border: '1px solid #dce3e7', borderRadius: 9, padding: '0 13px', color: '#929da3', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff'}}>
      {placeholder}{label.includes('Imóvel') || label.includes('urgência') ? <ChevronDown size={15} /> : null}
    </div>
  </div>
);

export const NewTicketMock: React.FC<{urgencyOpen?: boolean; urgencySelected?: boolean; submitted?: boolean}> = ({urgencyOpen = false, urgencySelected = false, submitted = false}) => (
  <Interactive.Div name="Tela Novo Chamado" style={{width: 1600, height: 900, background: '#f7f9fa', borderRadius: 24, overflow: 'hidden', display: 'flex', position: 'relative', border: '1px solid rgba(255,255,255,.55)', boxShadow: '0 55px 130px rgba(4,15,23,.42), 0 1px 0 rgba(255,255,255,.7) inset'}}>
    <Sidebar active="new" />
    <Interactive.Div name="Conteúdo Novo Chamado" style={{flex: 1, padding: '43px 52px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 15, marginBottom: 27}}>
        <div style={{width: 42, height: 42, borderRadius: 11, border: '1px solid #dbe2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#52616a'}}>←</div>
        <div>
          <div style={{fontFamily: 'Plus Jakarta Sans', fontSize: 31, fontWeight: 800, letterSpacing: -1, color: '#192833'}}>Abrir Novo Chamado</div>
          <div style={{fontSize: 14, color: '#75828a', marginTop: 5}}>Preencha os dados para solicitar um serviço</div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 18}}>
        <Interactive.Div name="Cartão Imóvel" style={{background: '#fff', border: '1px solid #e0e6ea', borderRadius: 15, padding: 21, boxShadow: '0 4px 14px rgba(24,39,50,.04)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 19}}><MapPin size={19} color="#21869c" /><span style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 750, color: '#25343d'}}>Imóvel</span></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13}}>
            <Field label="Imóvel *" placeholder="Selecione ou cadastre um imóvel" wide />
            <Field label="CEP" placeholder="00000-000" />
            <Field label="Código do imóvel" placeholder="Ex: AP-101" />
            <Field label="Rua / Logradouro *" placeholder="Rua, Avenida, etc." wide />
          </div>
        </Interactive.Div>
        <Interactive.Div name="Cartão Problema" style={{background: '#fff', border: '1px solid #e0e6ea', borderRadius: 15, padding: 21, boxShadow: '0 4px 14px rgba(24,39,50,.04)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 19}}><AlertCircle size={19} color="#21869c" /><span style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 750, color: '#25343d'}}>Problema</span></div>
          <div style={{fontSize: 12, fontWeight: 700, color: '#34434c', marginBottom: 8}}>Descrição do problema *</div>
          <div style={{height: 94, border: '1px solid #dce3e7', borderRadius: 9, padding: 13, color: '#929da3', fontSize: 12, background: '#fff'}}>Descreva detalhadamente o problema a ser resolvido...</div>
          <div style={{marginTop: 13, position: 'relative', zIndex: 4}}>
            <div style={{fontSize: 12, fontWeight: 700, color: '#34434c', marginBottom: 8}}>Grau de urgência *</div>
            <div style={{height: 43, border: `1px solid ${urgencyOpen || urgencySelected ? '#21869c' : '#dce3e7'}`, borderRadius: 9, padding: '0 13px', color: urgencySelected ? '#293942' : '#929da3', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', boxShadow: urgencyOpen || urgencySelected ? '0 0 0 4px rgba(33,134,156,.10)' : 'none'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: 8}}>{urgencySelected ? <span style={{width: 8, height: 8, borderRadius: 99, background: '#ef742f'}} /> : null}{urgencySelected ? 'Alta' : 'Selecione a urgência'}</span><ChevronDown size={15} />
            </div>
            {urgencyOpen ? <div style={{position: 'absolute', left: 0, right: 0, top: 68, padding: 7, borderRadius: 11, background: '#fff', border: '1px solid #dce3e7', boxShadow: '0 18px 45px rgba(24,39,50,.18)'}}>{['Baixa','Média','Alta','Crítica'].map((item)=><div key={item} style={{height: 35, borderRadius: 7, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 8, background: item === 'Alta' ? '#fff1e8' : 'transparent', color: item === 'Alta' ? '#d45e24' : '#46555d', fontSize: 12, fontWeight: item === 'Alta' ? 750 : 550}}>{item === 'Alta' ? <span style={{width: 7, height: 7, borderRadius: 99, background: '#ef742f'}} /> : null}{item}</div>)}</div> : null}
          </div>
          <div style={{marginTop: 13, height: 61, border: '1.5px dashed #cfd8dd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#7f8b92', fontSize: 12}}><Upload size={18} />Adicionar fotos do problema</div>
        </Interactive.Div>
      </div>
      <Interactive.Div name="Resumo de fluxo" style={{marginTop: 18, background: 'linear-gradient(135deg,#1d2a35,#173947)', borderRadius: 15, padding: '20px 25px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 13}}><Building2 size={23} color="#4dd2d5" /><div><div style={{fontFamily: 'Plus Jakarta Sans', fontWeight: 750}}>Uma solicitação inicia todo o fluxo</div><div style={{fontSize: 12, color: 'rgba(255,255,255,.58)', marginTop: 4}}>Administração, profissional, orçamento e acompanhamento no mesmo lugar.</div></div></div>
        <div style={{height: 47, padding: '0 21px', borderRadius: 11, background: 'linear-gradient(135deg,#2ea7b5,#207b91)', display: 'flex', alignItems: 'center', gap: 9, fontWeight: 750, fontSize: 14}}><Plus size={18} />Abrir Chamado</div>
      </Interactive.Div>
      {submitted ? <Interactive.Div name="Chamado criado" style={{position: 'absolute', right: 38, top: 34, zIndex: 8, padding: '15px 19px', borderRadius: 13, background: '#f2fff7', border: '1px solid #bce8ce', boxShadow: '0 18px 48px rgba(24,39,50,.18)', color: '#1d5e3b', display: 'flex', alignItems: 'center', gap: 11, fontSize: 13, fontWeight: 800}}><CheckCircle2 size={20} color="#27a866"/><span>Chamado <strong><span style={{color:'#ef742f'}}>OS</span>-2026-0412</strong> aberto</span></Interactive.Div> : null}
    </Interactive.Div>
  </Interactive.Div>
);
