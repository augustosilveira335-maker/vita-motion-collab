/* Vita FAZ TUDO — do chamado ao relatório. Uma composição contínua (animations-v3).
   Direção: câmera única em espaço 3D, camadas com Z real, foco progressivo,
   transições por elemento compartilhado. A UI é fiel ao app. */

const C = {
  bg: '#f8fafc', fg: '#1c2431', card: '#ffffff', border: '#e1e4ea',
  muted: '#6c7c93', sec: '#eef0f3',
  primary: '#1a7f98', primaryDeep: '#136086', accent: '#f46a25', accentDeep: '#ec8013',
  sidebar: '#1c2431', sidebarFg: '#d5d8de', sidebarAccent: '#2a3646', sidebarPrimary: '#2ec9c0',
  stPend: '#e7b008', stPendBg: '#fef8e7',
  stAppr: '#21c45d', stApprBg: '#e9fbf0',
  stProg: '#3c83f6', stProgBg: '#e7f0fe',
  stDone: '#16a249', stDoneBg: '#e8fbef',
  stWait: '#a542d7', stWaitBg: '#f5eafa',
  urgHigh: '#f46a25',
};
const SANS = "Inter, system-ui, sans-serif";
const DISP = "'Plus Jakarta Sans', Inter, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, monospace";
const SHADOW_CARD = '0 1px 3px 0 rgba(28,36,49,0.06), 0 1px 2px -1px rgba(28,36,49,0.04)';
const SHADOW_WIN = '0 70px 150px -50px rgba(0,0,0,0.85), 0 0 110px -34px rgba(46,201,192,0.2)';

/* três curvas, e nada de easing fora delas */
const EZ = {
  settle: Easing.easeOutQuart,   // chega rápido e assenta
  glide: Easing.easeInOutQuart,  // câmera e transições
  snap: Easing.easeOutBack,      // toques e microimpactos
};
const MOTION = {
  enter: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.6), ease: EZ.settle }),
  move: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.8), ease: EZ.glide }),
  pop: (start, dur) => animate({ from: 0, to: 1, start, end: start + (dur || 0.45), ease: EZ.snap }),
};

const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
const typed = (s, T, start, dur) => s.slice(0, Math.round(clamp((T - start) / dur, 0, 1) * s.length));
const isTyping = (T, start, dur) => T > start && T < start + dur;
const inWin = (T, a, b) => T >= a && T < b;
/* pulso único: 1 no instante, 0 depois */
const beat = (T, at, dur) => (T < at || T > at + dur ? 0 : 1 - (T - at) / dur);

/* keyframe track: canais interpolados por segmento, easing por segmento */
function normKeys(keys) {
  const out = []; let prev = {};
  keys.forEach((k) => { out.push(Object.assign({}, prev, k)); prev = out[out.length - 1]; });
  return out;
}
function chan(keys, key, T) {
  const n = keys.length;
  if (T <= keys[0].t) return keys[0][key] || 0;
  for (let i = 1; i < n; i++) {
    const b = keys[i];
    if (T <= b.t) {
      const a = keys[i - 1];
      const span = (b.t - a.t) || 1e-6;
      const e = (b.ease || EZ.glide)(clamp((T - a.t) / span, 0, 1));
      const av = a[key] || 0, bv = b[key] == null ? av : b[key];
      return av + (bv - av) * e;
    }
  }
  return keys[n - 1][key] || 0;
}

const TEAL = '#2ec9c0';

function Logo({ size, glow }) {
  const s = size || 38;
  return (
    <div style={{
      width: s, height: s, borderRadius: s * 0.28, flexShrink: 0,
      background: 'linear-gradient(140deg,#37d8cb 0%,#1ea9a4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: glow ? '0 0 ' + glow + 'px rgba(46,201,192,0.42)' : 'none',
    }}>
      <svg width={s * 0.54} height={s * 0.54} viewBox="0 0 24 24" fill="none" stroke="#ffffff"
        strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    </div>
  );
}

function LogoAsset({ size }) {
  const s = size || 46;
  return (
    <img src="./src/assets/logo-faztudo.png" alt="Vita FAZ TUDO" style={{
      width: s, height: s, borderRadius: 999, objectFit: 'cover', flexShrink: 0, display: 'block',
    }} />
  );
}

/* ── primitives ───────────────────────────────────────────────────────── */

function Badge({ label, fg, bg, k }) {
  const kk = k == null ? 1 : k;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '5px 13px', borderRadius: 999,
      font: '600 15px ' + SANS, color: fg, background: bg, letterSpacing: '0.01em',
      transform: 'scale(' + (0.94 + 0.06 * kk) + ')',
      boxShadow: kk < 1 ? '0 0 0 ' + (10 * (1 - kk)) + 'px ' + bg : 'none',
    }}>{label}</span>
  );
}

function Glyph({ size, color, filled, radius }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: radius == null ? 5 : radius, flexShrink: 0,
      border: '2px solid ' + color, background: filled ? color : 'transparent', display: 'inline-block',
    }} />
  );
}

function NavItem({ label, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 10,
      font: (active ? '600 ' : '500 ') + '17px ' + SANS,
      color: active ? C.sidebarPrimary : C.sidebarFg,
      background: active ? C.sidebarAccent : 'transparent',
    }}>
      <Glyph size={15} color={active ? C.sidebarPrimary : 'rgba(213,216,222,0.65)'} filled={false} />
      {label}
    </div>
  );
}

function Sidebar({ role, name, company, active }) {
  const items = role === 'admin'
    ? ['Dashboard', 'Ordens de Serviço', 'Aprovar Orçamentos', 'Histórico Imóveis', 'Clientes', 'Profissionais', 'Relatórios Finais', 'Log de Auditoria']
    : ['Dashboard', 'Ordens de Serviço', 'Novo Chamado', 'Histórico Imóveis'];
  return (
    <div style={{ width: 250, flexShrink: 0, background: C.sidebar, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 74, display: 'flex', alignItems: 'center', gap: 13, padding: '0 22px', borderBottom: '1px solid ' + C.sidebarAccent }}>
        <Logo size={38} />
        <div>
          <div style={{ font: '700 17px ' + DISP, color: '#eef1f4' }}>Vita FAZ TUDO</div>
          <div style={{ font: '500 12px ' + SANS, color: 'rgba(213,216,222,0.6)' }}>Gestão de Manutenção</div>
        </div>
      </div>
      <div style={{ padding: '17px 22px', borderBottom: '1px solid ' + C.sidebarAccent }}>
        <div style={{ font: '600 15px ' + SANS, color: '#eef1f4' }}>{name}</div>
        <div style={{ font: '500 13px ' + SANS, color: 'rgba(213,216,222,0.6)', marginTop: 2 }}>
          {role === 'admin' ? 'Administrador' : 'Imobiliária'}
        </div>
        {company ? <div style={{ font: '600 13px ' + SANS, color: C.sidebarPrimary, marginTop: 4 }}>{company}</div> : null}
      </div>
      <div style={{ padding: '14px 11px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((l) => <NavItem key={l} label={l} active={l === active} />)}
      </div>
    </div>
  );
}

function Field({ label, value, caret, focus, wide }) {
  const f = focus == null ? (caret ? 1 : 0) : focus;
  return (
    <div style={{ gridColumn: wide ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ font: '600 15px ' + SANS, color: C.fg, letterSpacing: '0.01em' }}>{label}</div>
      <div style={{
        minHeight: 54, borderRadius: 10, background: C.card,
        border: '1px solid ' + (f > 0.05 ? C.primary : C.border),
        padding: '15px 16px', font: '500 19px ' + SANS, color: value ? C.fg : 'rgba(108,124,147,0.7)',
        display: 'flex', alignItems: 'center',
        boxShadow: f > 0.05 ? '0 0 0 ' + (3 * f).toFixed(2) + 'px rgba(26,127,152,' + (0.2 * f).toFixed(3) + ')' : 'none',
      }}>
        {value}
        {caret ? <span style={{ width: 2, height: 22, background: C.primary, marginLeft: 2, display: 'inline-block' }} /> : null}
      </div>
    </div>
  );
}

/* botão com hover, compressão e ripple */
function Button({ label, tone, k, wide, press, hover, ripple, wipe }) {
  const kk = k == null ? 1 : k;
  const hv = hover || 0, pr = press || 0, rp = ripple || 0;
  const base = tone === 'accent' ? 'linear-gradient(135deg,' + C.accent + ' 0%,' + C.accentDeep + ' 100%)'
    : tone === 'ghost' ? C.card
      : 'linear-gradient(135deg,' + C.primary + ' 0%,' + C.primaryDeep + ' 100%)';
  const lift = hv * 2.5;
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '16px 26px', borderRadius: 12, background: base,
      color: tone === 'ghost' ? C.fg : '#fff', font: '700 19px ' + SANS,
      border: tone === 'ghost' ? '1px solid ' + C.border : 'none',
      width: wide ? '100%' : 'auto',
      boxShadow: pr > 0.5 ? '0 2px 6px -4px rgba(28,36,49,0.4)'
        : '0 ' + (7 + 9 * hv) + 'px ' + (20 + 16 * hv) + 'px -10px rgba(28,36,49,' + (0.34 + 0.16 * hv) + ')',
      transform: 'translateY(' + (-lift + pr * 2) + 'px) scale(' + ((1 - 0.028 * pr) * (0.96 + 0.04 * kk)) + ')',
      opacity: kk,
    }}>
      {wipe > 0 && wipe < 1 ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,' + C.accent + ' 0%,' + C.accentDeep + ' 100%)',
          clipPath: 'inset(0 ' + ((1 - wipe) * 100).toFixed(2) + '% 0 0)',
        }} />
      ) : null}
      {rp > 0.001 ? (
        <div style={{
          position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, borderRadius: 999,
          background: 'rgba(255,255,255,0.55)', opacity: 0.45 * (1 - rp),
          transform: 'translate(-50%,-50%) scale(' + (0.3 + rp * 5.2) + ')',
        }} />
      ) : null}
      <span style={{ position: 'relative' }}>{label}</span>
    </div>
  );
}

const STEPS = ['Chamado Aberto', 'Orçamento Enviado', 'Serviço Aprovado', 'Em Execução', 'Concluído'];

function OSTimeline({ progress, dates }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 26, marginBottom: 8 }}>
      <div style={{ position: 'absolute', top: 17, left: '10%', right: '10%', height: 5, background: C.sec, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: (clamp(progress, 0, 4) / 4) * 100 + '%', background: C.primary }} />
      </div>
      {STEPS.map((s, i) => {
        const done = progress >= i - 0.001;
        /* pulso no instante em que a linha alcança o ponto */
        const pl = done ? clamp(1 - (progress - i) / 0.5, 0, 1) : 0;
        return (
          <div key={s} style={{ position: 'relative', zIndex: 2, width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              {pl > 0.02 ? (
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', width: 38, height: 38, borderRadius: 999,
                  border: '2px solid rgba(26,127,152,' + (0.5 * pl).toFixed(3) + ')',
                  transform: 'translate(-50%,-50%) scale(' + (1 + 1.5 * (1 - pl)) + ')',
                }} />
              ) : null}
              <div style={{
                width: 38, height: 38, borderRadius: 999, background: '#fff',
                border: '2px solid ' + (done ? C.primary : C.sec),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: pl > 0.02 ? '0 0 0 ' + (7 * pl).toFixed(2) + 'px rgba(26,127,152,0.14)' : 'none',
                transform: 'scale(' + (1 + 0.12 * pl) + ')',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: done ? C.primary : C.sec }} />
              </div>
            </div>
            <div style={{ font: '700 14px ' + SANS, color: done ? C.fg : C.muted, marginTop: 9, textAlign: 'center' }}>{s}</div>
            {dates && dates[i] ? (
              <div style={{ font: '600 12px ' + SANS, color: C.muted, marginTop: 3, opacity: clamp((progress - i + 0.6) / 0.5, 0, 1) }}>{dates[i]}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function OSCard({ progress, status, statusFg, statusBg, dates, price, priceLabel, k, hideNumber }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, border: '1px solid ' + C.border, padding: '26px 28px',
      boxShadow: SHADOW_CARD, opacity: k == null ? 1 : k,
      transform: 'translateY(' + (k == null ? 0 : (1 - k) * 18) + 'px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ font: '800 19px ' + DISP, color: C.primary, opacity: hideNumber ? 0 : 1 }}>OS-2026-0412</span>
        <Badge label={status} fg={statusFg} bg={statusBg} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 15px ' + SANS, color: C.muted }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: C.urgHigh, display: 'inline-block' }} />Alta
        </span>
      </div>
      <div style={{ font: '600 21px ' + SANS, color: C.fg, marginTop: 14 }}>
        Vazamento sob a pia da cozinha, pingando dentro do armário.
      </div>
      <div style={{ display: 'flex', gap: 26, marginTop: 12, font: '500 16px ' + SANS, color: C.muted, flexWrap: 'wrap' }}>
        <span>Rua das Flores, 182 — Apto 32 · Canoas/RS</span>
        <span>Márcia Ribeiro</span>
        <span>hoje, 08:40</span>
      </div>
      <OSTimeline progress={progress} dates={dates} />
      {price != null ? (
        <div style={{ borderTop: '1px solid ' + C.border, marginTop: 18, paddingTop: 16, font: '500 16px ' + SANS, color: C.muted }}>
          {priceLabel} <strong style={{ font: '800 22px ' + DISP, color: C.primary }}>{brl(price)}</strong>
        </div>
      ) : null}
    </div>
  );
}

function Toast({ label, k }) {
  if (k <= 0.001) return null;
  return (
    <div style={{
      position: 'absolute', right: 30, bottom: 104, background: C.fg, color: '#f4f7f9',
      borderRadius: 12, padding: '16px 22px', font: '600 18px ' + SANS, display: 'flex',
      alignItems: 'center', gap: 12, boxShadow: '0 22px 46px -20px rgba(15,22,32,0.6)',
      opacity: k, transform: 'translateY(' + (1 - k) * 20 + 'px)',
    }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: C.stAppr, display: 'inline-block' }} />
      {label}
    </div>
  );
}

function PhotoSlot({ label, k }) {
  return (
    <div style={{
      flex: 1, height: 66, borderRadius: 12, border: '1px dashed ' + C.border,
      background: 'repeating-linear-gradient(45deg,#f2f5f8 0 8px,#e9edf2 8px 16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: '600 12px ' + MONO, color: C.muted, letterSpacing: '0.04em',
      opacity: 0.3 + 0.7 * k, transform: 'scale(' + (0.94 + 0.06 * k) + ')',
    }}>{label}</div>
  );
}

/* ── desktop pages ────────────────────────────────────────────────────── */

function SectionTitle({ label }) {
  return <div style={{ font: '700 21px ' + DISP, color: C.fg, marginBottom: 12 }}>{label}</div>;
}

function SelectField({ label, value, focus, wide, open, options, picked }) {
  const f = focus || 0;
  return (
    <div style={{ gridColumn: wide ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
      <div style={{ font: '600 15px ' + SANS, color: C.fg }}>{label}</div>
      <div style={{
        minHeight: 54, borderRadius: 10, background: C.card,
        border: '1px solid ' + (f > 0.05 ? C.primary : C.border),
        padding: '15px 16px', font: '500 19px ' + SANS, color: value ? C.fg : 'rgba(108,124,147,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: f > 0.05 ? '0 0 0 ' + (3 * f).toFixed(2) + 'px rgba(26,127,152,' + (0.2 * f).toFixed(3) + ')' : 'none',
      }}>
        <span>{value}</span>
        <span style={{
          width: 9, height: 9, borderTop: '2px solid ' + C.muted, borderRight: '2px solid ' + C.muted,
          transform: 'rotate(' + (135 - 180 * (open || 0)) + 'deg)', marginBottom: 4,
        }} />
      </div>
      {open > 0.01 && options ? (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 88, zIndex: 30,
          background: C.card, border: '1px solid ' + C.border, borderRadius: 10, padding: 6,
          boxShadow: '0 26px 50px -22px rgba(15,22,32,0.42)',
          opacity: open, transformOrigin: '50% 0%',
          transform: 'translateY(' + (1 - open) * -10 + 'px) scale(' + (0.97 + 0.03 * open) + ')',
        }}>
          {options.map((o) => (
            <div key={o} style={{
              padding: '10px 12px', borderRadius: 7, font: '500 17px ' + SANS,
              color: o === picked ? C.fg : C.muted,
              background: o === picked ? 'rgba(244,106,37,0.1)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              {o === 'Alta' ? <span style={{ width: 9, height: 9, borderRadius: 999, background: C.urgHigh, display: 'inline-block' }} /> : null}
              {o}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PageNovoChamado({ T, c, dim, hov, press, ripple }) {
  const s = c.Chamado;
  const imovel = 'Rua das Flores, 182 — Apto 32 · Canoas/RS';
  const problema = 'Vazamento sob a pia da cozinha, pingando dentro do armário.';
  const t1 = s + 0.55, t2 = s + 1.15, t3 = s + 2.75;
  /* select de urgência: abre, o ponteiro desce, seleciona, fecha */
  const openK = MOTION.enter(s + 1.9, 0.2)(T) * (1 - MOTION.move(s + 2.4, 0.18)(T));
  const urgSet = T > s + 2.45;
  const urgPulse = beat(T, s + 2.45, 0.5);
  const ph = MOTION.enter(s + 3.0, 0.45)(T);
  const blur = (dim || 0) * 2.6;
  return (
    <div style={{ padding: '26px 40px 44px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ minHeight: 0,
        filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none',
        opacity: 1 - 0.28 * (dim || 0), flex: 1,
      }}>
        <div style={{ font: '800 34px ' + DISP, color: C.fg }}>Novo Chamado</div>
        <div style={{ font: '500 17px ' + SANS, color: C.muted, marginTop: 4 }}>Abra uma ordem de serviço para o imóvel</div>

        <div style={{ marginTop: 16 }}>
          <SectionTitle label="Imóvel" />
          <SelectField label="Selecionar imóvel cadastrado *"
            value={typed(imovel, T, t1, 0.4) || 'Selecione um imóvel...'}
            focus={MOTION.enter(s + 0.5, 0.2)(T) * (1 - MOTION.move(t1 + 0.55, 0.25)(T))} wide />
        </div>

        <div style={{ marginTop: 16 }}>
          <SectionTitle label="Problema" />
          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 22 }}>
            <Field label="Descrição do problema *"
              value={typed(problema, T, t2, 0.55) || 'Descreva detalhadamente o problema a ser resolvido...'}
              caret={isTyping(T, t2, 0.55)}
              focus={MOTION.enter(s + 1.1, 0.2)(T) * (1 - MOTION.move(t2 + 0.7, 0.25)(T))} />
            <div style={{ position: 'relative' }}>
              <SelectField label="Grau de urgência *"
                value={urgSet ? 'Alta' : 'Selecione a urgência'}
                focus={MOTION.enter(s + 3.55, 0.2)(T) * (1 - MOTION.move(s + 4.5, 0.3)(T))}
                open={openK} options={['Baixa', 'Média', 'Alta', 'Crítica']} picked={openK > 0.5 && T > s + 4.05 ? 'Alta' : null} />
              {urgSet ? (
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: 31, height: 54, borderRadius: 10,
                  border: '1px solid ' + C.accent, pointerEvents: 'none',
                  boxShadow: '0 0 0 ' + (5 * urgPulse).toFixed(2) + 'px rgba(244,106,37,' + (0.16 * urgPulse).toFixed(3) + ')',
                }} />
              ) : null}
              {urgSet ? (
                <div style={{
                  position: 'absolute', left: 17, top: 52, display: 'flex', alignItems: 'center', gap: 10,
                  font: '600 19px ' + SANS, color: C.fg,
                }}>
                  <span style={{ width: 11, height: 11, borderRadius: 999, background: C.urgHigh, display: 'inline-block' }} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <SectionTitle label="Solicitante" />
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 22 }}>
            <Field label="Nome do solicitante *" value={typed('Márcia Ribeiro', T, t3, 0.14) || 'Nome de quem abriu o chamado'} />
            <Field label="CPF/CNPJ" value={typed('842.117.330-14', T, t3 + 0.07, 0.12) || '000.000.000-00'} />
            <Field label="Telefone" value={typed('(51) 99184-2207', T, t3 + 0.14, 0.12) || '(00) 00000-0000'} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none', opacity: 1 - 0.28 * (dim || 0) }}>
          <div style={{ font: '600 15px ' + SANS, color: C.fg, marginBottom: 8 }}>Fotos do problema (opcional)</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              flex: 1, height: 72, borderRadius: 12, border: '1px dashed ' + C.border, background: C.card,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}>
              <div style={{ font: '500 15px ' + SANS, color: C.muted }}>Clique para enviar ou arraste as fotos</div>
              <div style={{ font: '500 13px ' + SANS, color: 'rgba(108,124,147,0.75)' }}>Máximo 5 fotos</div>
            </div>
            <PhotoSlot label="FOTO 1" k={ph} />
            <PhotoSlot label="FOTO 2" k={ph * 0.9} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none' }}>
            <Button label="Cancelar" tone="ghost" />
          </div>
          <Button label="Abrir Chamado" hover={hov} press={press} ripple={ripple} />
        </div>
      </div>
      <Toast label="Chamado OS-2026-0412 aberto" k={MOTION.enter(s + 3.9, 0.4)(T)} />
    </div>
  );
}

function PageAprovar({ T, c, dim, hov, press, ripple, hideCusto }) {
  const s = c.Aprovacao;
  const cardK = MOTION.enter(c.T2 + 0.45, 0.7)(T);
  const sug = 616;
  const wipe = MOTION.move(s + 2.75, 0.45)(T);
  const revised = wipe > 0.5;
  const blur = (dim || 0) * 2.8;
  const sugPop = 1;
  return (
    <div style={{ padding: '38px 44px' }}>
      <div style={{ filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none', opacity: 1 - 0.3 * (dim || 0) }}>
        <div style={{ font: '800 36px ' + DISP, color: C.fg }}>Aprovar Orçamentos</div>
        <div style={{ font: '500 18px ' + SANS, color: C.muted, marginTop: 6 }}>1 orçamento aguardando sua aprovação</div>
      </div>
      <div style={{
        marginTop: 28, borderRadius: 18, border: '2px solid rgba(244,106,37,0.28)', background: C.card,
        padding: 22, display: 'flex', gap: 22, boxShadow: SHADOW_CARD,
        opacity: cardK, transform: 'translateY(' + (1 - cardK) * 22 + 'px)',
      }}>
        <div style={{
          flex: 1, minWidth: 0,
          filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none',
          opacity: 1 - 0.32 * (dim || 0),
        }}>
          <OSCard progress={1} status="Aguardando Aprovação Admin" statusFg={C.stWait} statusBg={C.stWaitBg}
            dates={['11/08', '11/08']} />
        </div>
        <div style={{
          width: 300, flexShrink: 0, borderLeft: '1px solid ' + C.border, paddingLeft: 22, textAlign: 'right',
          transform: 'translateZ(' + (34 * (dim || 0)) + 'px)',
        }}>
          <div style={{ filter: 'blur(3.4px)', opacity: 0.72 }}>
            <div style={{ font: '500 15px ' + SANS, color: C.muted }}>Custo profissional</div>
            <div style={{ font: '800 24px ' + DISP, color: C.fg, marginTop: 2, opacity: hideCusto ? 0 : 1 }}>{brl(440)}</div>
            <div style={{ font: '500 15px ' + SANS, color: C.muted, marginTop: 14 }}>Valor sugerido (+40%)</div>
            <div style={{ font: '800 40px ' + DISP, color: C.accent, marginTop: 2 }}>{brl(sug)}</div>
          </div>
          <div style={{ font: '500 15px ' + SANS, color: C.muted, marginTop: 8 }}>Prazo estimado · 2 dias</div>
          <div style={{ marginTop: 18 }}>
            <Button label={revised ? 'Aprovar e Enviar Orçamento' : 'Revisar Preço'}
              tone={revised ? 'accent' : 'primary'} wide wipe={wipe} hover={hov} press={press} ripple={ripple} />
          </div>
        </div>
      </div>
      <Toast label="Orçamento enviado à imobiliária" k={MOTION.enter(s + 3.35, 0.4)(T)} />
    </div>
  );
}

function PageConcluida({ T, c }) {
  const s = c.Relatorio;
  const prog = animate({ from: 3.3, to: 4, start: s + 0.25, end: s + 1.35, ease: EZ.settle })(T);
  const done = prog > 3.94;
  return (
    <div style={{ padding: '38px 44px' }}>
      <div style={{ font: '800 36px ' + DISP, color: C.fg }}>Ordens de Serviço</div>
      <div style={{ font: '500 18px ' + SANS, color: C.muted, marginTop: 6 }}>1 ordem encontrada</div>
      <div style={{ marginTop: 28 }}>
        <OSCard progress={prog} status={done ? 'Concluído' : 'Em Execução'}
          statusFg={done ? C.stDone : C.stProg} statusBg={done ? C.stDoneBg : C.stProgBg}
          dates={['11/08', '11/08', '12/08', '13/08', done ? '13/08' : '']}
          price={616} priceLabel="Total do serviço" />
      </div>
    </div>
  );
}


function PropRow({ addr, sub, n, sel }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
      padding: '13px 14px', borderRadius: 10,
      background: sel ? 'rgba(26,127,152,0.1)' : 'transparent',
      border: '1px solid ' + (sel ? 'rgba(26,127,152,0.3)' : 'transparent'),
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '600 17px ' + SANS, color: sel ? C.primary : C.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr}</div>
        <div style={{ font: '500 14px ' + SANS, color: C.muted, marginTop: 3 }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
        <span style={{ font: '500 14px ' + SANS, color: C.muted }}>{n} OS</span>
        <span style={{ width: 8, height: 8, borderTop: '2px solid ' + (sel ? C.primary : C.muted), borderRight: '2px solid ' + (sel ? C.primary : C.muted), transform: 'rotate(45deg)' }} />
      </div>
    </div>
  );
}

const HIST_OS = [
  ['OS-2026-0412', 'Vazamento sob a pia da cozinha, pingando dentro do armário.', 'Márcia Ribeiro', 'Concluído', 'stDone', '11/08/2026', '13/08/2026', 616],
  ['OS-2025-0918', 'Troca da resistência do chuveiro do banheiro social.', 'Márcia Ribeiro', 'Concluído', 'stDone', '02/11/2025', '04/11/2025', 285],
  ['OS-2025-0641', 'Revisão elétrica da cozinha e troca de tomadas.', 'Inquilina · Apto 32', 'Concluído', 'stDone', '14/06/2025', '19/06/2025', 940],
  ['OS-2025-0207', 'Infiltração na parede da sala após chuva forte.', 'Márcia Ribeiro', 'Em Execução', 'stProg', '28/02/2025', '', 1320],
];

function PageHistorico({ T, c, reveal }) {
  const s = c.Historico;
  const rows = HIST_OS.map((r, i) => Object.assign({}, { k: MOTION.enter(s + 0.3 + i * 0.14, 0.5)(T) }, { r: r }));
  return (
    <div style={{ padding: '30px 40px' }}>
      <div style={{ font: '800 34px ' + DISP, color: C.fg }}>Histórico por Imóvel</div>
      <div style={{ font: '500 17px ' + SANS, color: C.muted, marginTop: 4 }}>Visualize todo o histórico de manutenções de cada imóvel</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginTop: 24 }}>
        <div style={{ background: C.card, border: '1px solid ' + C.border, borderRadius: 16, padding: 20, boxShadow: SHADOW_CARD }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
            <Glyph size={16} color={C.primary} filled={false} />
            <span style={{ font: '700 19px ' + DISP, color: C.fg }}>Imóveis</span>
          </div>
          <div style={{
            minHeight: 46, borderRadius: 10, border: '1px solid ' + C.border, background: C.bg,
            padding: '12px 14px', font: '500 16px ' + SANS, color: 'rgba(108,124,147,0.75)', marginBottom: 14,
          }}>Buscar imóvel...</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <PropRow addr="Rua das Flores, 182 — Apto 32" sub="Centro, Canoas" n={4} sel />
            <PropRow addr="Av. Farroupilha, 5150 — Apto 12" sub="Marechal Rondon, Canoas" n={2} />
            <PropRow addr="Rua Ipiranga, 480 — Casa" sub="Igara, Canoas" n={1} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: C.card, border: '1px solid ' + C.border, borderRadius: 16, padding: 22, boxShadow: SHADOW_CARD }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(26,127,152,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50% 50% 50% 2px', border: '2.5px solid ' + C.primary, transform: 'rotate(-45deg)', display: 'block' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: '700 23px ' + DISP, color: C.fg }}>Rua das Flores, 182 — Apto 32</div>
                <div style={{ font: '500 16px ' + SANS, color: C.muted, marginTop: 3 }}>Centro, Canoas - RS</div>
                <div style={{ font: '500 15px ' + SANS, color: C.muted, marginTop: 6 }}>Inquilino: Márcia Ribeiro • (51) 99184-2207</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 22 }}>
              {[['4', 'Total de OS', C.fg, C.sec], ['3', 'Concluídas', C.stDone, 'rgba(33,196,93,0.1)'], ['1', 'Em Andamento', C.stPend, 'rgba(231,176,8,0.1)']].map((st) => (
                <div key={st[1]} style={{ textAlign: 'center', padding: '14px 10px', borderRadius: 12, background: st[3] }}>
                  <div style={{ font: '800 30px ' + DISP, color: st[2] }}>{st[0]}</div>
                  <div style={{ font: '500 14px ' + SANS, color: C.muted, marginTop: 2 }}>{st[1]}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.card, border: '1px solid ' + C.border, borderRadius: 16, padding: 22, boxShadow: SHADOW_CARD }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Glyph size={16} color={C.primary} filled={false} radius={999} />
              <span style={{ font: '700 19px ' + DISP, color: C.fg }}>Histórico de Serviços</span>
              <span style={{ font: '500 15px ' + SANS, color: C.muted }}>(4 de 4)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rows.map((o) => {
                const r = o.r;
                return (
                  <div key={r[0]} style={{
                    display: 'flex', alignItems: 'center', gap: 18, padding: '15px 17px',
                    border: '1px solid ' + C.border, borderRadius: 12, background: C.bg,
                    opacity: reveal === false ? 1 : o.k,
                    transform: 'translateY(' + ((1 - (reveal === false ? 1 : o.k)) * 14).toFixed(1) + 'px)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ font: '800 17px ' + DISP, color: C.primary }}>{r[0]}</span>
                        <Badge label={r[3]} fg={C[r[4]]} bg={C[r[4] + 'Bg']} />
                      </div>
                      <div style={{ font: '500 17px ' + SANS, color: C.fg, marginTop: 7 }}>{r[1]}</div>
                      <div style={{ font: '500 14px ' + SANS, color: C.muted, marginTop: 5 }}>
                        {r[2]} · Aberto {r[5]}{r[6] ? ' · Concluído ' + r[6] : ''}
                      </div>
                    </div>
                    <div style={{ font: '800 20px ' + DISP, color: C.fg, flexShrink: 0 }}>{brl(r[7])}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── phone screens ────────────────────────────────────────────────────── */

function PhoneChrome({ children, sub }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ height: 62, background: C.sidebar, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={26} />
          <div style={{ font: '700 15px ' + DISP, color: '#eef1f4' }}>Vita FAZ TUDO</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: '700 12px ' + SANS, color: '#eef1f4' }}>Rafael</div>
          <div style={{ font: '600 9px ' + SANS, color: 'rgba(213,216,222,0.6)', letterSpacing: '0.08em' }}>PROFISSIONAL</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '18px 18px 22px', overflow: 'hidden' }}>
        <div style={{ font: '500 13px ' + SANS, color: C.muted, marginBottom: 4 }}>{sub}</div>
        {children}
      </div>
    </div>
  );
}

function PhoneOrcamento({ T, c, dim, hov, press, ripple, hideNumber, hideTotal }) {
  const s = c.Orcamento;
  const sent = T > s + 3.3;
  const mao = typed('260,00', T, s + 0.45, 0.3);
  const mat = typed('180,00', T, s + 0.95, 0.28);
  const total = animate({ from: 0, to: 440, start: s + 1.65, end: s + 2.45, ease: EZ.settle })(T);
  const blur = (dim || 0) * 2.2;
  const soft = { filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none', opacity: 1 - 0.3 * (dim || 0) };
  return (
    <PhoneChrome sub="Meus Serviços · OS-2026-0412">
      <div style={Object.assign({
        background: C.card, border: '1px solid ' + C.border, borderRadius: 14, padding: 16, boxShadow: SHADOW_CARD,
      }, soft)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ font: '800 15px ' + DISP, color: C.primary, opacity: hideNumber ? 0 : 1 }}>OS-2026-0412</span>
          <Badge label={sent ? 'Aguardando Aprovação Admin' : 'Aguardando Orçamento Profissional'}
            fg={sent ? C.stWait : C.stPend} bg={sent ? C.stWaitBg : C.stPendBg}
            k={sent ? MOTION.pop(s + 3.3, 0.45)(T) : 1} />
        </div>
        <div style={{ font: '600 15px ' + SANS, color: C.fg, marginTop: 10, lineHeight: 1.35 }}>
          Vazamento sob a pia da cozinha, pingando dentro do armário.
        </div>
        <div style={{ font: '500 13px ' + SANS, color: C.muted, marginTop: 8 }}>Apto 32 · Canoas/RS · Urgência alta</div>
      </div>

      <div style={Object.assign({ font: '700 16px ' + DISP, color: C.fg, margin: '20px 0 10px' }, soft)}>Enviar Orçamento</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {[['Mão de Obra (R$)', mao, isTyping(T, s + 0.45, 0.3)], ['Materiais (R$)', mat, isTyping(T, s + 0.95, 0.28)], ['Prazo estimado', typed('2 dias', T, s + 1.35, 0.18), false]].map((r) => (
          <div key={r[0]} style={Object.assign({
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: C.card, border: '1px solid ' + (r[2] ? C.primary : C.border), borderRadius: 11,
            padding: '13px 14px', boxShadow: r[2] ? '0 0 0 3px rgba(26,127,152,0.16)' : 'none',
          }, soft)}>
            <span style={{ font: '500 14px ' + SANS, color: C.muted }}>{r[0]}</span>
            <span style={{ font: '700 17px ' + SANS, color: C.fg }}>
              {r[1] || '—'}
              {r[2] ? <span style={{ display: 'inline-block', width: 2, height: 17, background: C.primary, marginLeft: 2, verticalAlign: 'middle' }} /> : null}
            </span>
          </div>
        ))}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg,' + C.primary + ' 0%,' + C.primaryDeep + ' 100%)',
          borderRadius: 11, padding: '15px 14px', color: '#fff',
          transform: 'scale(' + (1 + 0.02 * (dim || 0)) + ')',
          boxShadow: '0 ' + (10 + 16 * (dim || 0)) + 'px ' + (24 + 22 * (dim || 0)) + 'px -16px rgba(19,96,134,0.6)',
        }}>
          <span style={{ font: '600 14px ' + SANS, opacity: 0.85 }}>Total do orçamento</span>
          <span style={{ font: '800 22px ' + DISP, opacity: hideTotal ? 0 : 1 }}>{brl(total)}</span>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <Button label={sent ? 'Orçamento enviado' : 'Enviar Orçamento'} tone={sent ? 'accent' : 'primary'} wide
          hover={hov} press={press} ripple={ripple} />
      </div>
    </PhoneChrome>
  );
}

function PhoneExecucao({ T, c, dim, hov, press, ripple }) {
  const s = c.Execucao;
  const items = ['Problema identificado e diagnosticado', 'Serviço executado conforme orçamento', 'Teste de funcionamento realizado'];
  const done = T > s + 3.35;
  const blur = (dim || 0) * 2.2;
  const soft = { filter: blur > 0.04 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none', opacity: 1 - 0.3 * (dim || 0) };
  return (
    <PhoneChrome sub="Meus Serviços · OS-2026-0412">
      <div style={Object.assign({ background: C.card, border: '1px solid ' + C.border, borderRadius: 14, padding: 16, boxShadow: SHADOW_CARD }, soft)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <span style={{ font: '800 15px ' + DISP, color: C.primary }}>OS-2026-0412</span>
          <Badge label={done ? 'Concluído' : 'Em Execução'} fg={done ? C.stDone : C.stProg} bg={done ? C.stDoneBg : C.stProgBg}
            k={done ? MOTION.pop(s + 3.35, 0.45)(T) : 1} />
        </div>
        <div style={{ font: '500 13px ' + SANS, color: C.muted, marginTop: 8 }}>Apto 32 · Canoas/RS · Aprovado em 12/08</div>
      </div>

      <div style={{ font: '700 16px ' + DISP, color: C.fg, margin: '18px 0 10px' }}>Relatório de Execução</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map((it, i) => {
          const at = s + 0.4 + i * 0.45;
          const k = MOTION.pop(at, 0.4)(T);
          const on = k > 0.35;
          const pulse = beat(T, at, 0.45);
          return (
            <div key={it} style={{
              display: 'flex', alignItems: 'center', gap: 12, background: C.card,
              border: '1px solid ' + (on ? 'rgba(33,196,93,' + (0.4 + 0.4 * pulse).toFixed(2) + ')' : C.border),
              borderRadius: 11, padding: '12px 14px',
              transform: 'translateX(' + (2.5 * pulse).toFixed(2) + 'px)',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                border: '2px solid ' + (on ? C.stAppr : C.border), background: on ? C.stAppr : 'transparent',
                transform: 'scale(' + (on ? 0.9 + 0.12 * k + 0.1 * pulse : 1) + ')',
                boxShadow: pulse > 0.02 ? '0 0 0 ' + (6 * pulse).toFixed(2) + 'px rgba(33,196,93,0.16)' : 'none',
              }} />
              <span style={{ font: '500 14px ' + SANS, color: on ? C.fg : C.muted, lineHeight: 1.25 }}>{it}</span>
            </div>
          );
        })}
      </div>

      <div style={{ font: '600 13px ' + SANS, color: C.muted, margin: '14px 0 8px' }}>Registro fotográfico</div>
      <div style={{ display: 'flex', gap: 11 }}>
        <PhotoSlot label="ANTES" k={MOTION.enter(s + 1.9, 0.4)(T)} />
        <PhotoSlot label="DEPOIS" k={MOTION.enter(s + 2.25, 0.4)(T)} />
      </div>

      <div style={{ marginTop: 14 }}>
        <Button label={done ? 'Serviço finalizado' : 'Pré-visualizar e Finalizar Serviço'}
          tone={done ? 'accent' : 'primary'} wide hover={hov} press={press} ripple={ripple} k={1} />
      </div>
      <div style={{
        marginTop: 11, font: '500 12px ' + SANS, color: C.muted, textAlign: 'center',
        opacity: MOTION.enter(s + 3.65, 0.5)(T),
      }}>Assinado digitalmente por Rafael Costa · Márcia Ribeiro</div>
    </PhoneChrome>
  );
}

/* ── report sheet ─────────────────────────────────────────────────────── */

function InfoBlock({ label, value, sub }) {
  return (
    <div>
      <div style={{ font: '600 11px ' + SANS, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ font: '500 14px ' + SANS, color: C.fg, marginTop: 2 }}>{value}</div>
      {sub ? <div style={{ font: '500 12px ' + SANS, color: C.muted, marginTop: 1 }}>{sub}</div> : null}
    </div>
  );
}

function RepSection({ title, children }) {
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ font: '700 15px ' + DISP, color: C.fg, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function ReportSheet({ T, c }) {
  const s = c.Relatorio;
  const k = MOTION.enter(s + 1.55, 1.0)(T);
  const out = MOTION.move(c.T4 - 0.12, 0.66)(T);
  if (k <= 0.001) return null;
  const checks = ['Problema identificado e diagnosticado', 'Serviço executado conforme orçamento', 'Teste de funcionamento realizado'];
  const cond = [['Garantia do Serviço', '90 dias'], ['Validade do Relatório', '30 dias a partir da emissão'], ['Forma de Pagamento', 'Pgto via Imobiliária']];
  return (
    <div style={{
      position: 'absolute', left: 610, top: 58, width: 700, height: 990,
      background: '#fff', borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 70px 130px -45px rgba(15,22,32,0.58), 0 12px 32px -14px rgba(15,22,32,0.3)',
      opacity: k * (1 - out),
      transformOrigin: '50% 100%',
      transform: 'translate(' + (out * 40).toFixed(1) + 'px,' + ((1 - k) * 360 - out * 26) + 'px) rotateX(' + ((1 - k) * 7 + out * 3).toFixed(2) + 'deg) scale(' + (0.965 + 0.035 * k - out * 0.62) + ')',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0d2a2c 0%, #146b68 100%)', color: '#f2f6f8',
        padding: '18px 34px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LogoAsset size={46} />
          <div>
            <div style={{ font: '800 24px ' + DISP, letterSpacing: '0.01em' }}>RELATÓRIO FINAL</div>
            <div style={{ font: '500 13px ' + SANS, color: 'rgba(242,246,248,0.78)', marginTop: 2 }}>Vita FAZ TUDO</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ font: '800 19px ' + DISP }}>OS-2026-0412</div>
          <div style={{ font: '500 13px ' + SANS, color: 'rgba(242,246,248,0.78)', marginTop: 2 }}>13/08/2026</div>
        </div>
      </div>

      <div style={{ padding: '18px 34px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 26px' }}>
          <InfoBlock label="Imóvel" value="Rua das Flores, 182 — Apto 32" sub="Centro, Canoas - RS" />
          <InfoBlock label="Imobiliária" value="Imobiliária Horizonte" sub="contato@imobhorizonte.com.br" />
          <InfoBlock label="Solicitante" value="Márcia Ribeiro" sub="CPF/CNPJ: 842.117.330-14 | Tel: (51) 99184-2207" />
          <InfoBlock label="Profissional Responsável" value="Rafael Costa" sub="(51) 99620-4471" />
          <InfoBlock label="Data de Abertura" value="11/08/2026 às 08:40" />
          <InfoBlock label="Data de Conclusão" value="13/08/2026 às 16:12" />
        </div>

        <div style={{ height: 1, background: C.border, margin: '14px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 17px ' + DISP }}>3</div>
          <div style={{ font: '700 17px ' + DISP, color: C.fg, flex: 1 }}>Relatório Final — Conclusão do Serviço</div>
          <div style={{ font: '500 12px ' + SANS, color: C.muted }}>13/08/2026 às 16:12</div>
        </div>

        <RepSection title="O que foi feito">
          <div style={{ font: '500 14px ' + SANS, color: C.fg, lineHeight: 1.5 }}>
            Substituição do sifão e da vedação sob a pia da cozinha, com teste de estanqueidade aprovado.
            Armário inferior seco e sem sinais de infiltração remanescente.
          </div>
        </RepSection>

        <RepSection title="Checklist de Verificação">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {checks.map((ck) => (
              <div key={ck} style={{ display: 'flex', alignItems: 'center', gap: 9, background: C.sec, borderRadius: 9, padding: '9px 11px' }}>
                <span style={{ width: 15, height: 15, borderRadius: 999, background: C.stDone, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ font: '500 13px ' + SANS, color: C.fg, lineHeight: 1.2 }}>{ck}</span>
              </div>
            ))}
          </div>
        </RepSection>

        <RepSection title="Registro Fotográfico — Antes e Depois">
          <div style={{ display: 'flex', gap: 14 }}>
            <PhotoSlot label="ANTES" k={1} />
            <PhotoSlot label="DEPOIS" k={1} />
          </div>
        </RepSection>

        <div style={{ display: 'flex', gap: 14, marginTop: 12 }}>
          {[['MÃO DE OBRA', 364], ['MATERIAL', 252]].map((r) => (
            <div key={r[0]} style={{ flex: 1, background: C.sec, borderRadius: 9, padding: '11px 13px' }}>
              <div style={{ font: '600 11px ' + SANS, color: C.muted, letterSpacing: '0.08em' }}>{r[0]}</div>
              <div style={{ font: '700 15px ' + SANS, color: C.fg, marginTop: 3 }}>{brl(r[1])}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12,
          background: 'rgba(26,127,152,0.06)', border: '1px solid rgba(26,127,152,0.14)', borderRadius: 12, padding: '11px 16px',
        }}>
          <span style={{ font: '500 14px ' + SANS, color: C.muted }}>Valor Total para Imobiliária</span>
          <span style={{ font: '800 24px ' + DISP, color: C.primary }}>{brl(616)}</span>
        </div>

        <RepSection title="Condições">
          <div style={{ display: 'flex', gap: 12 }}>
            {cond.map((r) => (
              <div key={r[0]} style={{ flex: 1, background: C.sec, borderRadius: 9, padding: '10px 12px' }}>
                <div style={{ font: '600 10px ' + SANS, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r[0]}</div>
                <div style={{ font: '500 13px ' + SANS, color: C.fg, marginTop: 3, lineHeight: 1.25 }}>{r[1]}</div>
              </div>
            ))}
          </div>
        </RepSection>

        <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
          {[['Rafael Costa', 'RESPONSÁVEL PROFISSIONAL', true], ['Márcia Ribeiro', 'SOLICITANTE / APROVADOR', false]].map((r) => (
            <div key={r[1]} style={{
              flex: 1, textAlign: 'center', borderRadius: 10, padding: '9px 10px',
              border: '2px solid ' + (r[2] ? 'rgba(26,127,152,0.2)' : C.border),
              background: r[2] ? 'rgba(26,127,152,0.05)' : C.sec,
            }}>
              <div style={{ font: 'italic 500 17px ' + DISP, color: C.fg }}>{r[0]}</div>
              <div style={{ borderTop: '1px solid ' + (r[2] ? 'rgba(26,127,152,0.18)' : C.border), marginTop: 8, paddingTop: 6 }}>
                <div style={{ font: '700 12px ' + SANS, color: C.fg }}>{r[0]}</div>
                <div style={{ font: '600 9px ' + SANS, color: C.muted, letterSpacing: '0.1em', marginTop: 1 }}>{r[1]}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 11, paddingTop: 10, borderTop: '1px solid ' + C.border }}>
          <div style={{ font: '500 11px ' + SANS, color: C.muted }}>Vita FAZ TUDO — Relatório Final — OS-2026-0412</div>
        </div>
      </div>
    </div>
  );
}

/* ── cursor ───────────────────────────────────────────────────────────── */

function Cursor({ T, keys, show }) {
  if (show <= 0.001) return null;
  const ts = [], xs = [], ys = [];
  keys.forEach((k) => { ts.push(k.t); xs.push(k.x); ys.push(k.y); });
  const x = interpolate(ts, xs, EZ.settle)(T);
  const y = interpolate(ts, ys, EZ.settle)(T);
  let ring = 0, press = 0;
  keys.forEach((k) => {
    if (k.c == null) return;
    const d = T - k.c;
    if (d >= 0 && d < 0.5) ring = Math.max(ring, 1 - d / 0.5);
    if (d >= -0.04 && d < 0.14) press = 1;
  });
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: show, zIndex: 60 }}>
      {ring > 0 ? (
        <div style={{
          position: 'absolute', left: 12 - (12 + 46 * (1 - ring)), top: 12 - (12 + 46 * (1 - ring)),
          width: 24 + 92 * (1 - ring), height: 24 + 92 * (1 - ring), borderRadius: 999,
          border: '3px solid rgba(26,127,152,' + (0.5 * ring) + ')',
        }} />
      ) : null}
      <div style={{
        width: 26, height: 26, borderRadius: '50% 50% 50% 2px', background: '#fff',
        border: '2px solid ' + C.fg, boxShadow: '0 5px 14px rgba(15,22,32,0.4)',
        transform: 'rotate(-8deg) scale(' + (press ? 0.8 : 1) + ')',
    }} />
    </div>
  );
}

/* ── a rede: geometria compartilhada pela abertura e pelo final ──────── */

const NET = {
  cx: 960, cy: 540, R: 360,
  actors: [
    { id: 'imob', label: 'IMOBILIÁRIA', name: 'Márcia Ribeiro', ini: 'M', tone: '#f46a25', x: 118, y: 228, z: 60 },
    { id: 'sol', label: 'SOLICITANTE', name: 'Inquilina · Apto 32', ini: 'A', tone: '#e6ecf1', x: 98, y: 762, z: -55 },
    { id: 'adm', label: 'ADMINISTRAÇÃO VITA', name: 'Carolina Martins', ini: 'C', tone: '#6f9ad6', x: 1372, y: 222, z: -65 },
    { id: 'prof', label: 'PROFISSIONAL', name: 'Rafael Costa', ini: 'R', tone: '#5ec8e6', x: 1392, y: 756, z: 70 },
  ],
  stages: [
    { label: 'CHAMADO', a: 160 }, { label: 'ORÇAMENTO', a: 125 }, { label: 'APROVAÇÃO', a: 90 },
    { label: 'EXECUÇÃO', a: 55 }, { label: 'RELATÓRIO', a: 20 },
  ],
};
const CHIP_W = 430, CHIP_H = 122;
const hexA = (h, a) => 'rgba(' + parseInt(h.slice(1, 3), 16) + ',' + parseInt(h.slice(3, 5), 16) + ',' + parseInt(h.slice(5, 7), 16) + ',' + a + ')';
const rad = (a) => a * Math.PI / 180;
const nodeAt = (a, R) => ({ x: NET.cx + (R || NET.R) * Math.cos(rad(a)), y: NET.cy + (R || NET.R) * Math.sin(rad(a)) });
const arcD = (a0, a1, R, n) => {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const p = nodeAt(a0 + (a1 - a0) * (i / n), R);
    d += (i ? ' L ' : 'M ') + p.x.toFixed(1) + ' ' + p.y.toFixed(1);
  }
  return d;
};
const ARC_D = arcD(160, 20, NET.R, 48);
const ARC_LEN = NET.R * rad(140);
const chipHub = (a) => ({ x: a.x + CHIP_W / 2, y: a.y + CHIP_H / 2 });
const lineLen = (p, q) => Math.sqrt((q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y));

function NetLine({ d, len, k, w, op }) {
  if (k <= 0.002) return null;
  return (
    <path d={d} fill="none" stroke={'rgba(38,181,217,' + (op == null ? 0.32 : op).toFixed(3) + ')'}
      strokeWidth={w || 1.6} strokeLinecap="round"
      strokeDasharray={len.toFixed(1)} strokeDashoffset={(len * (1 - k)).toFixed(1)} />
  );
}

function Spark({ x, y, k, size }) {
  if (k <= 0.002) return null;
  const r = size || 9;
  return (
    <React.Fragment>
      <circle cx={x} cy={y} r={r * 2.6} fill={'rgba(38,181,217,' + (0.14 * k).toFixed(3) + ')'} />
      <circle cx={x} cy={y} r={r} fill={'rgba(226,248,255,' + (0.92 * k).toFixed(3) + ')'} />
    </React.Fragment>
  );
}

function ActorChip({ a, k, lit, tx, ty, sc, fade }) {
  if (k <= 0.002 || fade <= 0.002) return null;
  const li = lit || 0;
  return (
    <div style={{
      position: 'absolute', left: a.x, top: a.y, width: CHIP_W,
      opacity: k * fade,
      transform: 'translate3d(' + (tx || 0) + 'px,' + ((1 - k) * 20 + (ty || 0)) + 'px,' + a.z + 'px) scale(' + ((sc == null ? 1 : sc) * (0.95 + 0.05 * k)) + ')',
      display: 'flex', alignItems: 'center', gap: 19,
      background: 'linear-gradient(160deg, rgba(46,60,78,0.92) 0%, rgba(28,38,51,0.92) 100%)',
      border: '1px solid ' + hexA(a.tone, 0.2 + 0.4 * li),
      borderRadius: 18, padding: '21px 26px',
      boxShadow: '0 26px 60px -30px rgba(6,10,16,0.9)' + (li > 0.02 ? ', 0 0 ' + (30 * li).toFixed(1) + 'px ' + hexA(a.tone, 0.34) : ''),
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 999, flexShrink: 0,
        background: hexA(a.tone, 0.16 + 0.22 * li),
        border: '2px solid ' + hexA(a.tone, 0.55),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        font: '700 27px ' + DISP, color: a.tone,
      }}>{a.ini}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '700 24px ' + SANS, letterSpacing: '0.1em', color: hexA(a.tone, 0.82 + 0.18 * li) }}>{a.label}</div>
        <div style={{ font: '600 31px ' + SANS, color: li > 0.3 ? '#fff' : 'rgba(240,244,247,0.92)', marginTop: 4, whiteSpace: 'nowrap' }}>{a.name}</div>
      </div>
    </div>
  );
}

function StageNode({ st, k, lit, done, active, compress, fade }) {
  if (k <= 0.002 || fade <= 0.002) return null;
  const p = nodeAt(st.a);
  const li = lit || 0;
  const on = done || active || li > 0.02;
  const x = p.x + (NET.cx - p.x) * (compress || 0);
  const y = p.y + (NET.cy - p.y) * (compress || 0);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 0, opacity: k * fade,
      transform: 'translate(-50%,-50%) scale(' + ((0.9 + 0.1 * k) * (1 - 0.45 * (compress || 0)) + 0.04 * li) + ')',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {li > 0.02 ? (
        <div style={{
          position: 'absolute', top: 21, left: '50%', width: 42, height: 42, borderRadius: 999,
          border: '2px solid ' + (done ? 'rgba(33,196,93,' + (0.6 * li).toFixed(3) + ')' : 'rgba(38,181,217,' + (0.55 * li).toFixed(3) + ')'),
          transform: 'translate(-50%,-50%) scale(' + (1 + 2.2 * (1 - li)) + ')',
        }} />
      ) : null}
      <div style={{
        width: 42, height: 42, borderRadius: 999, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'rgba(38,181,217,0.94)' : 'rgba(226,240,246,0.12)',
        border: '2px solid ' + (done ? 'rgba(33,196,93,0.95)' : on ? 'rgba(38,181,217,0.95)' : 'rgba(226,240,246,0.3)'),
        boxShadow: li > 0.02 ? '0 0 ' + (22 * li).toFixed(1) + 'px ' + (done ? 'rgba(33,196,93,0.6)' : 'rgba(38,181,217,0.6)') : 'none',
        font: '800 22px ' + SANS, color: '#08222b', lineHeight: 1,
      }}>{done ? '✓' : ''}</div>
      <div style={{
        marginTop: 15, font: '700 27px ' + SANS, letterSpacing: '0.1em', whiteSpace: 'nowrap',
        color: on ? 'rgba(255,255,255,0.96)' : 'rgba(213,224,232,0.52)',
        textShadow: '0 6px 20px rgba(6,10,16,0.8)',
      }}>{st.label}</div>
    </div>
  );
}

function EcosystemScene({ T, c, cam }) {
  const s = c.Ecossistema;
  const born = MOTION.enter(s - 0.5, 0.6)(T);            // o ponto de luz nasce
  const plate = MOTION.pop(s + 0.22, 0.8)(T);            // vira o núcleo
  const morph = MOTION.move(s + 4.35, 0.9)(T);           // a rede vira o app
  const gone = clamp((morph - 0.55) / 0.45, 0, 1);
  if (born <= 0.002) return null;

  /* signal flow: imobiliária → núcleo → cinco etapas */
  const hub = chipHub(NET.actors[0]);
  const inLen = lineLen(hub, { x: NET.cx, y: NET.cy });
  const sigA = MOTION.move(s + 2.35, 0.5)(T);
  const arcP = MOTION.move(s + 2.9, 0.85)(T);
  const coreLit = beat(T, s + 2.8, 0.55);
  const pa = 160 - 140 * arcP;
  const pp = nodeAt(pa);

  const lines = NET.actors.map((a, i) => {
    const h = chipHub(a);
    return { d: 'M ' + h.x + ' ' + h.y + ' L ' + NET.cx + ' ' + NET.cy, len: lineLen(h, { x: NET.cx, y: NET.cy }), k: MOTION.move(s + 1.55 + i * 0.16, 0.62)(T) };
  });
  const stem = { d: 'M ' + NET.cx + ' ' + NET.cy + ' L ' + nodeAt(160).x.toFixed(1) + ' ' + nodeAt(160).y.toFixed(1), len: lineLen({ x: NET.cx, y: NET.cy }, nodeAt(160)), k: MOTION.move(s + 2.1, 0.5)(T) };

  return (
    <div style={{
      position: 'absolute', inset: 0, perspective: '2200px', perspectiveOrigin: '50% 50%',
      opacity: 1 - gone,
    }}>
      <div style={{
        position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
        transform: 'translate3d(' + cam.x + 'px,' + cam.y + 'px,' + cam.z + 'px) rotateX(' + cam.rx + 'deg) rotateY(' + cam.ry + 'deg) scale(' + cam.s + ')',
      }}>
        {/* luz volumétrica do núcleo */}
        <div style={{
          position: 'absolute', left: NET.cx, top: NET.cy, width: 1100, height: 1100, borderRadius: 999,
          transform: 'translate(-50%,-50%) scale(' + (0.5 + 0.5 * plate) + ')',
          background: 'radial-gradient(closest-side, rgba(38,181,217,' + (0.1 + 0.12 * plate).toFixed(3) + ') 0%, rgba(38,181,217,0) 72%)',
          filter: 'blur(14px)',
        }} />

        <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {lines.map((l, i) => <NetLine key={i} d={l.d} len={l.len} k={l.k * (1 - morph)} op={0.26} />)}
          <NetLine d={stem.d} len={stem.len} k={stem.k * (1 - morph)} op={0.3} />
          <NetLine d={ARC_D} len={ARC_LEN} k={MOTION.move(s + 2.25, 0.75)(T) * (1 - morph)} w={2} op={0.34} />
          {arcP > 0.001 && arcP < 0.999 ? (
            <NetLine d={arcD(160, pa, NET.R, 24)} len={NET.R * rad(Math.max(0.1, 160 - pa))} k={1} w={2.6} op={0.6} />
          ) : null}
          {sigA > 0.001 && sigA < 0.999 ? (
            <Spark x={hub.x + (NET.cx - hub.x) * sigA} y={hub.y + (NET.cy - hub.y) * sigA} k={Math.sin(Math.PI * sigA) * 1.2} />
          ) : null}
          {arcP > 0.001 && arcP < 0.999 ? (
            <React.Fragment>
              {[0.05, 0.1, 0.16].map((d, i) => {
                const q = nodeAt(160 - 140 * Math.max(0, arcP - d));
                return <circle key={i} cx={q.x} cy={q.y} r={7 - i * 1.6} fill={'rgba(226,248,255,' + (0.3 - i * 0.09).toFixed(2) + ')'} />;
              })}
              <Spark x={pp.x} y={pp.y} k={1} />
            </React.Fragment>
          ) : null}
        </svg>

        {NET.stages.map((st, i) => {
          const reach = s + 2.9 + 0.85 * ((160 - st.a) / 140);
          return (
            <StageNode key={st.label} st={st} k={MOTION.pop(s + 2.05 + i * 0.12, 0.5)(T)}
              lit={beat(T, reach, 0.5)} active={T > reach}
              compress={morph} fade={1 - clamp(morph * 1.5, 0, 1)} />
          );
        })}

        {NET.actors.map((a, i) => {
          if (a.id === 'imob') return null;
          const h = chipHub(a);
          return (
            <ActorChip key={a.id} a={a} k={MOTION.enter(s + 1.0 + i * 0.21, 0.7)(T)}
              lit={0}
              tx={(h.x - NET.cx) * 0.75 * morph} ty={(h.y - NET.cy) * 0.75 * morph}
              sc={1 + 0.35 * morph} fade={1 - clamp(morph * 1.35, 0, 1)} />
          );
        })}

        {/* a imobiliária permanece e se torna o usuário logado na sidebar */}
        <ActorChip a={NET.actors[0]} k={MOTION.enter(s + 1.0, 0.7)(T)}
          lit={Math.max(beat(T, s + 2.34, 0.6), 0)}
          tx={(232 - NET.actors[0].x) * morph} ty={(238 - NET.actors[0].y) * morph}
          sc={1 - 0.28 * morph} fade={1 - clamp((morph - 0.62) / 0.34, 0, 1)} />

        {/* núcleo */}
        <div style={{
          position: 'absolute', left: NET.cx, top: NET.cy, width: 300, height: 300,
          transform: 'translate(-50%,-50%) scale(' + ((0.12 + 0.88 * plate) * (1 - 0.4 * morph)) + ')',
          opacity: born * (1 - clamp(morph / 0.5, 0, 1)),
          borderRadius: (74 + 76 * (1 - plate)) + 'px',
          background: 'linear-gradient(160deg, rgba(52,68,88,0.96) 0%, rgba(24,34,46,0.96) 100%)',
          border: '1px solid rgba(38,181,217,' + (0.24 + 0.4 * coreLit).toFixed(3) + ')',
          boxShadow: '0 40px 90px -40px rgba(4,8,12,0.9), 0 0 ' + (30 + 70 * coreLit).toFixed(1) + 'px rgba(38,181,217,' + (0.14 + 0.3 * coreLit).toFixed(3) + ')',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9,
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', opacity: Math.pow(1 - plate, 0.7),
            background: 'radial-gradient(closest-side, #eafaff 0%, rgba(120,224,248,0.85) 45%, rgba(38,181,217,0) 100%)',
            boxShadow: '0 0 90px rgba(38,181,217,0.55)',
          }} />
          <div style={{ opacity: plate, transform: 'scale(' + (0.7 + 0.3 * plate) + ')' }}>
            <Logo size={84} glow={30 * coreLit} />
          </div>
          <div style={{ opacity: clamp((plate - 0.5) * 2, 0, 1), textAlign: 'center' }}>
            <div style={{ font: '700 32px ' + DISP, color: '#eef1f4', letterSpacing: '0.04em' }}>VITA</div>
            <div style={{ font: '600 18px ' + SANS, color: 'rgba(213,224,232,0.66)', letterSpacing: '0.11em', marginTop: 4 }}>GESTÃO DE MANUTENÇÃO</div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── headline editorial: entra por máscara, alterna de lado ───────────── */

function Headline({ k, out, side, top, kicker, l1, l2, sub, tone, w, size }) {
  const o = clamp(k * (1 - (out || 0)), 0, 1);
  if (o <= 0.004) return null;
  const width = w || 560;
  const pos = side === 'right' ? { right: 86 } : side === 'center' ? { left: '50%', marginLeft: -width / 2 } : { left: 54 };
  const line = (txt, i, size) => {
    const kk = clamp((k - i * 0.1) / 0.9, 0, 1);
    return (
      <div key={i} style={{
        font: '800 ' + (size || 56) + 'px ' + DISP, lineHeight: 1.08, letterSpacing: '-0.024em', color: '#f2f7f7',
        clipPath: 'inset(' + ((1 - kk) * 108).toFixed(1) + '% 0 -14% 0)',
        transform: 'translateY(' + ((1 - kk) * 20).toFixed(1) + 'px)',
      }}>{txt}</div>
    );
  };
  return (
    <div style={Object.assign({
      position: 'absolute', top: top == null ? 300 : top, width: width,
      background: 'linear-gradient(158deg, rgba(10,25,26,0.95) 0%, rgba(4,13,14,0.92) 100%)',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24,
      padding: '38px 40px 42px', boxShadow: '0 46px 100px -46px rgba(0,0,0,0.85)',
      textAlign: 'left', opacity: o,
      transform: 'translateY(' + (-14 * (out || 0) + (1 - k) * 16).toFixed(1) + 'px) scale(' + (0.985 + 0.015 * k).toFixed(4) + ')',
    }, pos)}>
      {kicker ? (
        <div style={{
          font: '700 17px ' + SANS, letterSpacing: (0.24 - 0.05 * k).toFixed(3) + 'em', marginBottom: 16,
          color: TEAL, opacity: clamp(k * 1.6, 0, 1),
        }}>{kicker}</div>
      ) : null}
      {l1 ? line(l1, 0, size) : null}
      {l2 ? line(l2, 1, size) : null}
      {sub ? (
        <div style={{
          font: '500 21px ' + SANS, lineHeight: 1.5, marginTop: 18,
          color: 'rgba(226,238,238,0.62)',
          opacity: clamp((k - 0.35) / 0.5, 0, 1),
          transform: 'translateY(' + ((1 - clamp((k - 0.35) / 0.5, 0, 1)) * 12).toFixed(1) + 'px)',
        }}>{sub}</div>
      ) : null}
    </div>
  );
}

/* ── lower third numerado (V6) ────────────────────────────────────────── */

function LowerThird({ T, items }) {
  let cur = null;
  items.forEach((it) => { if (T >= it.at && T < it.until) cur = it; });
  if (!cur) return null;
  const k = MOTION.enter(cur.at, 0.5)(T) * (1 - MOTION.move(cur.until - 0.42, 0.42)(T));
  if (k <= 0.01) return null;
  return (
    <div style={{
      position: 'absolute', left: 76, bottom: 72, opacity: k,
      transform: 'translateX(' + ((1 - k) * -20).toFixed(1) + 'px)',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 20,
        background: 'rgba(7,18,19,0.9)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '15px 32px 15px 26px', boxShadow: '0 30px 66px -34px rgba(0,0,0,0.85)',
      }}>
        <span style={{ font: '600 17px ' + MONO, color: 'rgba(226,238,238,0.45)', letterSpacing: '0.1em' }}>{cur.n}</span>
        <span style={{ width: (46 * k).toFixed(1) + 'px', height: 1, background: 'rgba(46,201,192,0.65)' }} />
        <span style={{ font: '600 27px ' + SANS, color: '#eef4f4', letterSpacing: '0.004em' }}>{cur.t}</span>
      </div>
    </div>
  );
}

/* ── abertura: comunicação fragmentada, não decoração ─────────────────── */

const CHATS = [
  { g: 'Imobiliária · Equipe', ini: 'IE', tone: '#f46a25', mem: '6 participantes', x: 196, y: 232, w: 500, rot: -1.4,
    msgs: [['Tem vazamento no apto 32.', 0, 'Márcia', '09:12'], ['O proprietário foi avisado?', 1, '', '09:14']] },
  { g: 'Prestadores · Manutenção', ini: 'PM', tone: '#5ec8e6', mem: '11 participantes', x: 1232, y: 190, w: 500, rot: 1.6,
    msgs: [['Quem vai atender?', 0, 'Renato', '09:26'], ['Tem orçamento?', 1, '', '09:31']] },
  { g: 'Interno · Administrativo', ini: 'IA', tone: '#8fa6c4', mem: '4 participantes', x: 706, y: 706, w: 512, rot: -0.8,
    msgs: [['Já abriram a OS?', 0, 'Paula', '10:04'], ['Ainda sem retorno.', 1, '', '10:47']] },
];

function ChatCard({ c: ch, T, at, k, drift, dim }) {
  if (k <= 0.004) return null;
  const rows = ch.msgs.map((m, i) => {
    const mt = at + 0.42 + i * 0.66;
    return { m: m, mk: MOTION.pop(mt, 0.42)(T), pulse: beat(T, mt, 0.55) };
  });
  const unread = rows.filter((r) => r.mk > 0.35).length;
  const kick = rows.reduce((a, r) => Math.max(a, r.pulse), 0);
  return (
    <div style={{
      position: 'absolute', left: ch.x, top: ch.y, width: ch.w,
      opacity: k * (1 - 0.55 * dim),
      transform: 'translateY(' + ((1 - k) * 26 + drift * 16 - kick * 6).toFixed(1) + 'px) rotate(' + (ch.rot * (1 + drift * 0.5)).toFixed(2) + 'deg) scale(' + (0.96 + 0.04 * k + 0.012 * kick).toFixed(4) + ')',
      background: 'rgba(24,34,38,0.9)', border: '1px solid rgba(214,229,236,0.11)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 34px 76px -34px rgba(2,8,9,0.92)' + (kick > 0.02 ? ', 0 0 ' + (46 * kick).toFixed(0) + 'px -10px rgba(46,201,192,0.4)' : ''),
    }}>
      {/* cabeçalho do grupo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        background: 'rgba(255,255,255,0.035)', borderBottom: '1px solid rgba(214,229,236,0.08)',
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 999, flexShrink: 0,
          background: 'linear-gradient(150deg,' + ch.tone + '38 0%,' + ch.tone + '18 100%)',
          border: '1px solid ' + ch.tone + '55', color: ch.tone,
          display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 17px ' + SANS, letterSpacing: '0.04em',
        }}>{ch.ini}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '700 22px ' + SANS, color: 'rgba(240,246,247,0.94)' }}>{ch.g}</div>
          <div style={{ font: '500 15px ' + SANS, color: 'rgba(214,229,236,0.42)', marginTop: 1 }}>{ch.mem}</div>
        </div>
        {unread > 0 ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {kick > 0.02 ? (
              <div style={{
                position: 'absolute', left: '50%', top: '50%', width: 34, height: 34, borderRadius: 999,
                border: '2px solid rgba(46,201,192,' + (0.55 * kick).toFixed(3) + ')',
                transform: 'translate(-50%,-50%) scale(' + (1 + 1.7 * (1 - kick)) + ')',
              }} />
            ) : null}
            <div style={{
              minWidth: 32, height: 32, borderRadius: 999, padding: '0 10px',
              background: TEAL, color: '#05201e', font: '800 18px ' + SANS,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'scale(' + (1 + 0.18 * kick).toFixed(3) + ')',
            }}>{unread}</div>
          </div>
        ) : null}
      </div>

      {/* mensagens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 18px 18px' }}>
        {rows.map((r) => {
          const m = r.m, out = m[1], mk = r.mk;
          if (mk <= 0.01) return null;
          return (
            <div key={m[0]} style={{
              alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '86%',
              opacity: clamp(mk * 1.6, 0, 1),
              transform: 'translateY(' + ((1 - mk) * 14).toFixed(1) + 'px) scale(' + (0.94 + 0.06 * mk).toFixed(3) + ')',
              transformOrigin: out ? '100% 100%' : '0% 100%',
              background: out ? 'rgba(46,201,192,0.16)' : 'rgba(226,240,246,0.075)',
              border: '1px solid ' + (out ? 'rgba(46,201,192,0.24)' : 'rgba(226,240,246,0.1)'),
              borderRadius: out ? '16px 16px 6px 16px' : '16px 16px 16px 6px',
              padding: '11px 16px 9px',
            }}>
              {!out && m[2] ? (
                <div style={{ font: '700 16px ' + SANS, color: ch.tone, marginBottom: 3 }}>{m[2]}</div>
              ) : null}
              <div style={{ font: '500 24px ' + SANS, color: 'rgba(240,244,247,0.93)', lineHeight: 1.25 }}>{m[0]}</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5, marginTop: 4,
                font: '500 14px ' + SANS, color: 'rgba(214,229,236,0.4)',
              }}>
                {m[3]}
                {out ? <span style={{ color: 'rgba(214,229,236,0.35)', letterSpacing: '-0.22em' }}>✓✓</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── uma OS, cinco etapas, um único fluxo: mostrado, não afirmado ─────── */

const FLOW_X = [300, 630, 960, 1290, 1620];

function FlowStrip({ T, c }) {
  const s = c.Fluxo;
  const osK = MOTION.pop(s + 0.15, 0.7)(T);
  const collapse = MOTION.move(c.Ecossistema - 0.85, 0.85)(T);
  if (osK <= 0.002 || collapse >= 0.999) return null;
  const y = 668;
  const drawn = MOTION.move(s + 1.55, 0.95)(T);
  const lit = (i) => beat(T, s + 1.55 + 0.95 * (i / 4), 0.55);
  const copy = T < s + 0.95 ? 0 : T < s + 1.55 ? 1 : 2;
  const copyTxt = ['UMA OS.', 'CINCO ETAPAS.', 'UM ÚNICO FLUXO.'][copy];
  const copyK = MOTION.enter([s + 0.15, s + 0.95, s + 1.55][copy], 0.5)(T);
  const px = FLOW_X[0] + (FLOW_X[4] - FLOW_X[0]) * drawn;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: 1 - collapse, transform: 'scale(' + (1 - collapse * 0.86) + ')',
    }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center' }}>
        <div style={{
          font: '800 62px ' + DISP, color: copy === 2 ? C.sidebarPrimary : '#fff', letterSpacing: '-0.02em',
          clipPath: 'inset(' + ((1 - copyK) * 108).toFixed(1) + '% 0 -10% 0)',
          transform: 'translateY(' + ((1 - copyK) * 18).toFixed(1) + 'px)',
        }}>{copyTxt}</div>
      </div>

      {/* a OS */}
      <div style={{
        position: 'absolute', left: '50%', top: 400, transform: 'translateX(-50%) scale(' + (0.9 + 0.1 * osK) + ')',
        opacity: osK, background: 'rgba(32,42,55,0.9)', border: '1px solid rgba(38,181,217,0.3)',
        borderRadius: 16, padding: '18px 30px', display: 'flex', alignItems: 'center', gap: 18,
        boxShadow: '0 30px 70px -32px rgba(4,8,12,0.9), 0 0 40px rgba(38,181,217,0.16)',
      }}>
        <Logo size={44} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ font: '700 15px ' + SANS, letterSpacing: '0.16em', color: 'rgba(214,229,236,0.55)' }}>ORDEM DE SERVIÇO</div>
          <div style={{ font: '800 34px ' + DISP, color: '#fff', marginTop: 3 }}>OS-2026-0412</div>
        </div>
      </div>

      <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={'M 960 486 L 960 ' + (y - 46)} fill="none" stroke="rgba(38,181,217,0.34)" strokeWidth="2"
          strokeDasharray="136" strokeDashoffset={(136 * (1 - MOTION.move(s + 0.85, 0.4)(T))).toFixed(1)} />
        <path d={'M ' + FLOW_X[0] + ' ' + y + ' L ' + FLOW_X[4] + ' ' + y} fill="none"
          stroke="rgba(38,181,217,0.18)" strokeWidth="2"
          strokeDasharray="1320" strokeDashoffset={(1320 * (1 - MOTION.move(s + 1.0, 0.5)(T))).toFixed(1)} />
        {drawn > 0.001 ? (
          <path d={'M ' + FLOW_X[0] + ' ' + y + ' L ' + px.toFixed(1) + ' ' + y} fill="none"
            stroke="rgba(38,181,217,0.7)" strokeWidth="3.4" strokeLinecap="round" />
        ) : null}
        {drawn > 0.003 && drawn < 0.997 ? <Spark x={px} y={y} k={1} size={10} /> : null}
      </svg>

      {NET.stages.map((st, i) => {
        const k = MOTION.pop(s + 1.0 + i * 0.1, 0.5)(T);
        const on = drawn >= i / 4 - 0.001;
        const li = lit(i);
        if (k <= 0.004) return null;
        return (
          <div key={st.label} style={{
            position: 'absolute', left: FLOW_X[i], top: y, width: 0,
            transform: 'translate(-50%,-50%) scale(' + (0.9 + 0.1 * k + 0.06 * li) + ')',
            display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: k,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 999,
              background: on ? 'rgba(38,181,217,0.94)' : 'rgba(226,240,246,0.12)',
              border: '2px solid ' + (on ? 'rgba(38,181,217,0.95)' : 'rgba(226,240,246,0.3)'),
              boxShadow: li > 0.02 ? '0 0 ' + (24 * li).toFixed(1) + 'px rgba(38,181,217,0.6)' : 'none',
            }} />
            <div style={{
              marginTop: 16, font: '700 26px ' + SANS, letterSpacing: '0.1em', whiteSpace: 'nowrap',
              color: on ? 'rgba(255,255,255,0.96)' : 'rgba(213,224,232,0.5)',
            }}>{st.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── narrative type ───────────────────────────────────────────────────── */

function OpeningType({ T, c }) {
  const out = MOTION.move(4.56, 0.34)(T);
  if (out >= 0.999) return null;

  const l1 = MOTION.enter(0.25, 0.85)(T);
  const l1dim = MOTION.move(1.25, 0.55)(T);
  const chatOut = MOTION.move(3.42, 0.24)(T);
  const acc = MOTION.move(2.5, 0.85)(T);
  const head = MOTION.enter(2.32, 0.6)(T);
  const l3 = MOTION.enter(3.56, 0.5)(T);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      {/* três conversas distintas, fragmentadas */}
      {CHATS.map((ch, i) => (
        <ChatCard key={ch.g} c={ch} T={T} at={1.4 + i * 0.26} k={MOTION.enter(1.4 + i * 0.26, 0.6)(T) * (1 - chatOut)}
          drift={acc} dim={clamp(head * 0.5 + acc * 0.5, 0, 1)} />
      ))}

      <div style={{
        position: 'absolute', left: 0, right: 0, top: 458, textAlign: 'center',
        font: '600 62px ' + DISP, color: '#eef1f4', letterSpacing: (0.05 - 0.048 * l1).toFixed(4) + 'em',
        clipPath: 'inset(' + ((1 - l1) * 110).toFixed(1) + '% 0 -10% 0)',
        opacity: 1 - l1dim,
        transform: 'translateY(' + (-22 * l1dim) + 'px)',
        textShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>Um vazamento no apto 32.</div>

      {/* headline da dor */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 418, textAlign: 'center',
        opacity: head * (1 - clamp(l3 * 1.6, 0, 1)),
      }}>
        {['Três grupos.', 'Nenhum fluxo.'].map((w, i) => {
          const k = clamp((head - i * 0.16) / 0.84, 0, 1);
          return (
            <div key={w} style={{
              font: '800 74px ' + DISP, color: i ? C.sidebarPrimary : '#fff', letterSpacing: '-0.025em',
              lineHeight: 1.14,
              clipPath: 'inset(' + ((1 - k) * 108).toFixed(1) + '% 0 -10% 0)',
              transform: 'translateY(' + ((1 - k) * 20).toFixed(1) + 'px)',
              textShadow: '0 20px 60px rgba(0,0,0,0.55)',
            }}>{w}</div>
          );
        })}
      </div>

      {/* tudo para */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 452, textAlign: 'center',
        font: '800 112px ' + DISP, color: '#fff', letterSpacing: '-0.035em',
        clipPath: 'inset(0 ' + ((1 - l3) * 50).toFixed(1) + '% -10% ' + ((1 - l3) * 50).toFixed(1) + '%)',
        opacity: l3,
        transform: 'scale(' + (1.06 - 0.06 * l3) + ')',
        textShadow: '0 30px 90px rgba(0,0,0,0.6)',
      }}>Nenhum registro.</div>
    </div>
  );
}

function ClosingType({ T, c }) {
  const s = c.Final;
  const plate = MOTION.move(s + 0.05, 0.4)(T);
  const coreK = MOTION.pop(s + 0.3, 0.85)(T);
  const arcK = MOTION.move(s + 1.5, 0.55)(T);
  const flow = MOTION.move(s + 1.78, 2.05)(T);
  const msg1 = MOTION.enter(s + 3.7, 0.7)(T);
  const msg2 = MOTION.enter(s + 4.2, 0.7)(T);
  const conv = MOTION.move(s + 4.8, 0.85)(T);
  const lock = MOTION.enter(s + 5.15, 0.65)(T);
  const out = MOTION.move(s + 5.62, 0.38)(T);
  if (plate <= 0.001) return null;

  const pa = 160 - 140 * flow;
  const pp = nodeAt(pa);
  const reachOf = (a) => s + 1.78 + 2.05 * ((160 - a) / 140);
  const fade = 1 - clamp((conv - 0.15) / 0.6, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: plate * (1 - out) }}>
      <div style={{
        position: 'absolute', inset: 0, perspective: '2200px',
        transform: 'translateY(-14px) scale(' + (0.99 - 0.07 * conv) + ')', transformOrigin: '50% 50%',
      }}>
        {/* luz do núcleo */}
        <div style={{
          position: 'absolute', left: NET.cx, top: NET.cy, width: 1150, height: 1150, borderRadius: 999,
          transform: 'translate(-50%,-50%) scale(' + (0.6 + 0.4 * coreK) + ')',
          background: 'radial-gradient(closest-side, rgba(38,181,217,' + (0.13 * coreK).toFixed(3) + ') 0%, rgba(38,181,217,0) 72%)',
          filter: 'blur(14px)',
        }} />

        <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {NET.actors.map((a, i) => {
            const h = chipHub(a);
            return <NetLine key={a.id} d={'M ' + h.x + ' ' + h.y + ' L ' + NET.cx + ' ' + NET.cy}
              len={lineLen(h, { x: NET.cx, y: NET.cy })}
              k={MOTION.move(s + 0.85 + i * 0.13, 0.65)(T) * fade} w={1.8} op={0.4} />;
          })}
          <NetLine d={ARC_D} len={ARC_LEN} k={arcK * fade} w={2} op={0.22} />
          {flow > 0.001 ? (
            <NetLine d={arcD(160, pa, NET.R, 30)} len={NET.R * rad(Math.max(0.1, 160 - pa))} k={fade} w={3.4} op={0.62} />
          ) : null}
          {flow > 0.004 && flow < 0.996 ? (
            <React.Fragment>
              {[0.03, 0.07, 0.12].map((d, i) => {
                const q = nodeAt(160 - 140 * Math.max(0, flow - d));
                return <circle key={i} cx={q.x} cy={q.y} r={8 - i * 1.8} fill={'rgba(226,248,255,' + (0.3 - i * 0.09).toFixed(2) + ')'} />;
              })}
              <Spark x={pp.x} y={pp.y} k={1} size={10} />
            </React.Fragment>
          ) : null}
        </svg>

        {/* as cinco etapas reaparecem uma a uma, concluídas */}
        {NET.stages.map((st) => {
          const reach = reachOf(st.a);
          return (
            <StageNode key={st.label} st={st} k={MOTION.pop(reach - 0.14, 0.5)(T)}
              done={T > reach} lit={beat(T, reach, 0.6)}
              compress={conv} fade={fade} />
          );
        })}

        {NET.actors.map((a) => {
          const h = chipHub(a);
          return (
            <ActorChip key={a.id} a={a} k={MOTION.enter(s + 0.7 + NET.actors.indexOf(a) * 0.13, 0.7)(T)}
              lit={0.4}
              tx={(NET.cx - h.x) * 0.82 * conv} ty={(NET.cy - h.y) * 0.82 * conv}
              sc={1 - 0.35 * conv} fade={fade} />
          );
        })}

        {/* núcleo Vita: permanece e vira a marca final */}
        <div style={{
          position: 'absolute', left: NET.cx, top: NET.cy, width: 370, height: 370,
          transform: 'translate(-50%,-50%) translateY(' + (-104 * lock) + 'px) scale(' + (0.86 + 0.14 * coreK) + ')',
          opacity: coreK, borderRadius: 92,
          background: 'linear-gradient(160deg, rgba(52,68,88,' + (0.96 * (1 - lock)).toFixed(3) + ') 0%, rgba(24,34,46,' + (0.96 * (1 - lock)).toFixed(3) + ') 100%)',
          border: '1px solid rgba(38,181,217,' + (0.26 * (1 - lock)).toFixed(3) + ')',
          boxShadow: lock > 0.9 ? 'none' : '0 40px 90px -40px rgba(4,8,12,' + (0.9 * (1 - lock)).toFixed(2) + ')',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <Logo size={96 + 44 * lock} glow={46 + 40 * lock} />
          <div style={{ textAlign: 'center', opacity: 1 - lock, height: 78 * (1 - lock), overflow: 'hidden' }}>
            <div style={{ font: '700 36px ' + DISP, color: '#eef1f4', letterSpacing: '0.03em' }}>VITA</div>
            <div style={{ font: '600 20px ' + SANS, color: 'rgba(213,224,232,0.68)', letterSpacing: '0.11em', marginTop: 5 }}>GESTÃO DE MANUTENÇÃO</div>
          </div>
        </div>
      </div>

      {/* conclusão narrativa, em duas entradas */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center',
        opacity: (1 - clamp(conv * 1.5, 0, 1)),
      }}>
        <div style={{
          font: '700 42px ' + DISP, color: '#fff', letterSpacing: '-0.015em',
          opacity: msg1, transform: 'translateY(' + (1 - msg1) * 16 + 'px)',
        }}>Do chamado ao relatório.</div>
        <div style={{
          font: '500 34px ' + SANS, color: C.sidebarPrimary, marginTop: 12,
          opacity: msg2, transform: 'translateY(' + (1 - msg2) * 14 + 'px)',
        }}>Tudo em um único fluxo.</div>
      </div>

      {/* marca */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 672, textAlign: 'center', opacity: lock,
      }}>
        <div style={{
          font: '800 76px ' + DISP, color: '#fff', letterSpacing: '-0.025em',
          transform: 'translateY(' + (1 - lock) * 18 + 'px)',
        }}>Vita FAZ TUDO</div>
        <div style={{
          font: '500 28px ' + SANS, color: 'rgba(238,241,244,0.72)', marginTop: 18, lineHeight: 1.5,
          opacity: MOTION.enter(s + 5.5, 0.55)(T),
        }}>Do chamado ao relatório. Tudo em um único fluxo.</div>
      </div>
    </div>
  );
}


/* ── interstitials conceituais: uma ideia = uma metáfora ───────────────── */

function ConceptChip({ x, y, w, tone, label, name, k, sc, op }) {
  if (k <= 0.004) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w || 330,
      opacity: k * (op == null ? 1 : op),
      transform: 'translate(-50%,-50%) scale(' + ((sc == null ? 1 : sc) * (0.94 + 0.06 * k)) + ')',
      display: 'flex', alignItems: 'center', gap: 17,
      background: 'linear-gradient(160deg, rgba(46,60,78,0.94) 0%, rgba(28,38,51,0.94) 100%)',
      border: '1px solid ' + hexA(tone, 0.34), borderRadius: 16, padding: '18px 22px',
      boxShadow: '0 28px 62px -30px rgba(4,8,12,0.92), 0 0 30px ' + hexA(tone, 0.16),
    }}>
      <div style={{
        width: 54, height: 54, borderRadius: 999, flexShrink: 0, background: hexA(tone, 0.2),
        border: '2px solid ' + hexA(tone, 0.6), display: 'flex', alignItems: 'center', justifyContent: 'center',
        font: '700 23px ' + DISP, color: tone,
      }}>{name.charAt(0)}</div>
      <div>
        <div style={{ font: '700 20px ' + SANS, letterSpacing: '0.11em', color: hexA(tone, 0.9) }}>{label}</div>
        <div style={{ font: '600 26px ' + SANS, color: '#fff', marginTop: 3, whiteSpace: 'nowrap' }}>{name}</div>
      </div>
    </div>
  );
}

function CoreMark({ x, y, k, size, sc }) {
  if (k <= 0.004) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      transform: 'translate(-50%,-50%) scale(' + ((sc == null ? 1 : sc) * (0.9 + 0.1 * k)) + ')',
      opacity: k, borderRadius: size * 0.26,
      background: 'linear-gradient(160deg, rgba(52,68,88,0.96) 0%, rgba(24,34,46,0.96) 100%)',
      border: '1px solid rgba(38,181,217,0.28)',
      boxShadow: '0 34px 80px -36px rgba(4,8,12,0.9), 0 0 46px rgba(38,181,217,0.16)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9,
    }}>
      <Logo size={size * 0.4} />
      <div style={{ font: '700 19px ' + DISP, color: '#eef1f4', letterSpacing: '0.05em' }}>VITA</div>
    </div>
  );
}

function EvidenceFrame({ x, y, w, h, label, k, sc, op }) {
  if (k <= 0.004) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      opacity: k * (op == null ? 1 : op),
      transform: 'translate(-50%,-50%) scale(' + ((sc == null ? 1 : sc) * (0.92 + 0.08 * k)) + ')',
      borderRadius: 18, border: '1px solid rgba(226,240,246,0.2)',
      background: 'repeating-linear-gradient(45deg, rgba(226,240,246,0.05) 0 12px, rgba(226,240,246,0.09) 12px 24px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 18,
      boxShadow: '0 30px 70px -34px rgba(4,8,12,0.9)',
    }}>
      <div style={{ font: '700 24px ' + SANS, letterSpacing: '0.16em', color: 'rgba(240,244,247,0.86)' }}>{label}</div>
    </div>
  );
}

function DocSheet({ x, y, k, date, rot, sc, op }) {
  if (k <= 0.004) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 110, height: 146,
      opacity: k * (op == null ? 1 : op),
      transform: 'translate(-50%,-50%) rotate(' + (rot || 0) + 'deg) scale(' + ((sc == null ? 1 : sc) * (0.9 + 0.1 * k)) + ')',
      background: 'rgba(240,246,250,0.95)', borderRadius: 10, padding: '12px 11px',
      boxShadow: '0 24px 54px -26px rgba(4,8,12,0.9)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ height: 5, width: '70%', borderRadius: 99, background: 'rgba(26,127,152,0.55)' }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ height: 4, width: (i === 3 ? '52%' : '100%'), borderRadius: 99, background: 'rgba(28,36,49,0.16)' }} />
      ))}
      <div style={{ marginTop: 'auto', font: '700 11px ' + SANS, color: 'rgba(28,36,49,0.55)' }}>{date}</div>
    </div>
  );
}

function Interstitials({ T, c }) {
  const t1 = c.T1, t3 = c.T3, t4 = c.T4;

  /* 1 · o sinal sai da Vita, chega ao profissional e o orçamento volta */
  const i1 = MOTION.enter(t1 + 0.1, 0.4)(T) * (1 - MOTION.move(t1 + 1.5, 0.45)(T));
  const sig1 = MOTION.move(t1 + 0.42, 0.55)(T);
  const back1 = MOTION.move(t1 + 1.02, 0.5)(T);
  const cA = { x: 520, y: 540 }, pB = { x: 960, y: 452 };

  /* 2 · antes → depois → check */
  const i2 = MOTION.enter(t3 + 0.15, 0.4)(T) * (1 - MOTION.move(t3 + 1.62, 0.45)(T));
  const fA = MOTION.enter(t3 + 0.3, 0.55)(T), fB = MOTION.enter(t3 + 0.72, 0.55)(T);
  const ck = MOTION.pop(t3 + 1.18, 0.55)(T);
  const merge = MOTION.move(t3 + 1.5, 0.55)(T);

  /* 3 · o imóvel acumula memória */
  const i3 = MOTION.enter(t4 + 0.12, 0.4)(T) * (1 - MOTION.move(t4 + 1.62, 0.45)(T));
  const prop = MOTION.pop(t4 + 0.2, 0.6)(T);
  const docs = [MOTION.move(t4 + 0.5, 0.5)(T), MOTION.move(t4 + 0.84, 0.5)(T), MOTION.move(t4 + 1.16, 0.5)(T)];
  const grow = MOTION.move(t4 + 1.5, 0.55)(T);

  return (
    <React.Fragment>
      {/* 1 · profissional */}
      {i1 > 0.004 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: i1 }}>
          <svg width="1920" height="1080" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <NetLine d={'M ' + cA.x + ' ' + cA.y + ' L ' + pB.x + ' ' + pB.y} len={lineLen(cA, pB)}
              k={MOTION.move(t1 + 0.3, 0.5)(T)} w={2.2} op={0.32} />
            {sig1 > 0.002 && sig1 < 0.998 ? (
              <Spark x={cA.x + (pB.x - cA.x) * sig1} y={cA.y + (pB.y - cA.y) * sig1} k={Math.sin(Math.PI * sig1) * 1.3} size={11} />
            ) : null}
          </svg>
          <CoreMark x={cA.x} y={cA.y} k={MOTION.pop(t1 + 0.12, 0.6)(T)} size={188} />
          <ConceptChip x={pB.x} y={pB.y} tone="#5ec8e6" label="PROFISSIONAL" name="Rafael Costa"
            k={MOTION.enter(t1 + 0.62, 0.5)(T)} sc={1 + 0.06 * MOTION.move(t1 + 1.5, 0.5)(T)} />
          {back1 > 0.002 && back1 < 0.998 ? (
            <div style={{
              position: 'absolute', left: pB.x + (cA.x - pB.x) * back1, top: pB.y + (cA.y - pB.y) * back1,
              transform: 'translate(-50%,-50%)', opacity: Math.sin(Math.PI * back1) * 1.6,
              background: 'rgba(240,246,250,0.96)', color: C.fg, borderRadius: 999, padding: '10px 20px',
              font: '700 22px ' + SANS, letterSpacing: '0.1em', whiteSpace: 'nowrap',
              boxShadow: '0 20px 46px -22px rgba(4,8,12,0.9)',
            }}>ORÇAMENTO</div>
          ) : null}
        </div>
      ) : null}

      {/* 2 · evidência */}
      {i2 > 0.004 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: i2 }}>
          <EvidenceFrame x={700 + (838 - 700) * merge} y={470 + (676 - 470) * merge} w={330} h={228}
            label="ANTES" k={fA} sc={1 - 0.52 * merge} />
          <EvidenceFrame x={1100 + (1042 - 1100) * merge} y={470 + (676 - 470) * merge} w={330} h={228}
            label="DEPOIS" k={fB} sc={1 - 0.52 * merge} />
          <div style={{
            position: 'absolute', left: 900, top: 760, width: 96, height: 96, borderRadius: 999,
            transform: 'translate(-50%,-50%) scale(' + (0.8 + 0.2 * ck) * (1 - 0.3 * merge) + ')',
            opacity: ck * (1 - merge), background: 'rgba(38,181,217,0.95)',
            border: '3px solid rgba(33,196,93,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: '800 48px ' + SANS, color: '#08222b',
            boxShadow: '0 0 ' + (50 * ck).toFixed(0) + 'px rgba(33,196,93,0.4)',
          }}>✓</div>
        </div>
      ) : null}

      {/* 3 · memória do imóvel */}
      {i3 > 0.004 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: i3 }}>
          <div style={{
            position: 'absolute', left: 960, top: 396, width: 460,
            transform: 'translate(-50%,-50%) scale(' + ((0.9 + 0.1 * prop) * (1 + 0.1 * grow)) + ')',
            opacity: prop, display: 'flex', alignItems: 'center', gap: 18,
            background: 'linear-gradient(160deg, rgba(46,60,78,0.94) 0%, rgba(28,38,51,0.94) 100%)',
            border: '1px solid rgba(38,181,217,0.3)', borderRadius: 18, padding: '20px 24px',
            boxShadow: '0 30px 68px -32px rgba(4,8,12,0.92)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0, background: 'rgba(38,181,217,0.16)',
              border: '1px solid rgba(38,181,217,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: '50% 50% 50% 2px', border: '2.5px solid ' + C.sidebarPrimary, transform: 'rotate(-45deg)', display: 'block' }} />
            </div>
            <div>
              <div style={{ font: '700 19px ' + SANS, letterSpacing: '0.13em', color: 'rgba(38,181,217,0.9)' }}>IMÓVEL</div>
              <div style={{ font: '600 26px ' + SANS, color: '#fff', marginTop: 3, whiteSpace: 'nowrap' }}>Apto 32 · Canoas/RS</div>
            </div>
          </div>
          {[['13/08/2026', -6], ['04/11/2025', 3], ['19/06/2025', -2]].map((d, i) => {
            const k = docs[i];
            const tx = 1560 + (860 + i * 100 - 1560) * k;
            const ty = 300 + (662 - 300) * k;
            return <DocSheet key={d[0]} x={tx} y={ty} k={clamp(k * 3, 0, 1)} date={d[0]} rot={d[1] * k} sc={1 - 0.14 * grow} op={1 - 0.2 * grow} />;
          })}
        </div>
      ) : null}
    </React.Fragment>
  );
}

/* ── the piece ────────────────────────────────────────────────────────── */

function Piece(props) {
  const comp = useComposition();
  const T = comp.T;
  const c = comp.CUES;
  const tw = props.tw || {};
  const total = comp.authoredTotal || 42.4;
  const ec = c.Ecossistema, ch = c.Chamado, or = c.Orcamento, ap = c.Aprovacao, ex = c.Execucao, re = c.Relatorio, hi = c.Historico, fi = c.Final;

  /* ── câmera: um único trilho. s=escala de enquadramento, z=dolly real,
     rx/ry/rz=inclinação, dim=perda de foco do resto, spot=luz dirigida ── */
  const cam = normKeys([
    { t: 0, s: 1.0, z: 0, x: 0, y: 0, rx: 0, ry: 0, rz: 0, dim: 0, spot: 0, sx: 0.5, sy: 0.5 },
    /* abertura → o núcleo nasce, a rede se abre e a câmera entra nela */
    { t: ec - 0.4, s: 1.0, z: -60, ease: EZ.glide },
    { t: ec + 0.25, s: 1.0, z: -300, ease: EZ.glide },
    { t: ec + 1.8, s: 1.0, z: -170, y: -12, ease: EZ.glide },
    { t: ec + 2.9, s: 1.0, z: -80, y: 0, ease: EZ.glide },
    { t: ec + 3.8, s: 1.0, z: -20, ry: 0.8, ease: EZ.glide },
    { t: ec + 4.35, s: 1.0, z: 10, ry: 0.6, ease: EZ.glide },
    { t: ch + 0.02, s: 1.0, z: 330, ry: 0, ease: EZ.settle },
    { t: ch + 0.62, s: 0.84, z: 0, x: 250, y: 24, ease: EZ.settle },
    /* produto à direita, headline à esquerda enquanto o formulário é preenchido */
    { t: ch + 1.75, s: 0.86, z: 10, x: 240, y: 20, ry: 0.6, ease: EZ.glide },
    /* a copy sai e a câmera entra no detalhe */
    { t: ch + 2.15, s: 1.02, z: 40, x: -40, y: 10, ry: 1.1, ease: EZ.settle },
    { t: ch + 2.5, s: 1.05, z: 190, x: -300, y: -90, ry: 2.2, dim: 0.55, spot: 0.5, sx: 0.62, sy: 0.5, ease: EZ.settle },
    { t: ch + 2.9, s: 1.05, z: 190, x: -290, y: -80, dim: 0.35, spot: 0.35, ease: EZ.glide },
    /* volta para o contexto: o botão precisa estar inteiro no quadro antes do clique */
    { t: ch + 3.35, s: 0.98, z: 20, x: -60, y: -40, ry: 0.8, dim: 0.1, spot: 0.1, ease: EZ.glide },
    { t: ch + 3.62, s: 0.99, z: 30, x: -120, y: -128, ease: EZ.glide },
    { t: ch + 3.95, s: 1.0, z: 150, x: -220, y: -160, ry: 2.0, rx: 0.7, dim: 0.56, spot: 0.56, sx: 0.66, sy: 0.64, ease: EZ.settle },
    { t: ch + 4.5, s: 1.0, z: 140, x: -214, y: -156, dim: 0.42, spot: 0.42, ease: EZ.glide },
    /* T1 — o número da OS carrega a transição para o celular */
    { t: c.T1 + 0.5, s: 1.0, z: 20, x: -80, y: -70, ry: -1.6, rx: 0.4, dim: 0.25, spot: 0.2, sx: 0.5, sy: 0.5, ease: EZ.glide },
    { t: c.T1 + 1.5, s: 1.0, z: 60, x: -20, y: -10, ry: -0.8, rx: 0, dim: 0.15, spot: 0.12, ease: EZ.glide },
    { t: or - 0.05, s: 0.94, z: 40, x: -300, y: 26, ry: 0, rx: 0, dim: 0, spot: 0, ease: EZ.settle },
    /* celular à esquerda, headline à direita; depois fecha no total */
    { t: or + 1.45, s: 0.98, z: 110, x: -250, y: 40, ry: -0.8, ease: EZ.glide },
    { t: or + 2.1, s: 1.03, z: 300, x: 6, y: 6, ry: -1.4, dim: 0.6, spot: 0.6, sx: 0.5, sy: 0.6, ease: EZ.settle },
    { t: or + 2.7, s: 1.02, z: 240, y: 20, dim: 0.28, spot: 0.3, ease: EZ.glide },
    { t: or + 3.1, s: 1.02, z: 250, x: 0, y: -96, dim: 0.42, spot: 0.42, sx: 0.5, sy: 0.74, ease: EZ.glide },
    { t: or + 3.9, s: 1.0, z: 120, x: 0, y: 20, dim: 0.1, spot: 0.1, ease: EZ.glide },
    /* T2 — o valor sobe para o desktop */
    { t: c.T2 + 0.5, s: 1.0, z: -160, x: 60, y: 0, ry: 3.2, dim: 0.35, spot: 0.2, ease: EZ.glide },
    { t: ap - 0.05, s: 0.86, z: 0, x: -330, y: 0, ry: 0, dim: 0, spot: 0, sx: 0.42, sy: 0.5, ease: EZ.settle },
    /* decisão: o quadro fica no card e no botão, nunca na composição de preço */
    { t: ap + 0.7, s: 0.88, z: 30, x: -330, y: -14, ry: 1.2, dim: 0.22, spot: 0.24, sx: 0.44, sy: 0.5, ease: EZ.glide },
    { t: ap + 1.5, s: 0.98, z: 90, x: -300, y: -26, ry: 1.8, dim: 0.5, spot: 0.5, sx: 0.5, sy: 0.5, ease: EZ.settle },
    { t: ap + 2.1, s: 0.98, z: 96, x: -296, y: -8, dim: 0.5, spot: 0.5, sy: 0.54, ease: EZ.glide },
    { t: ap + 2.8, s: 1.0, z: 120, x: -286, y: 26, dim: 0.52, spot: 0.52, sy: 0.58, ease: EZ.glide },
    { t: ap + 3.55, s: 0.96, z: 10, x: -70, y: 0, ry: 0.6, dim: 0.12, spot: 0.12, sx: 0.5, sy: 0.5, ease: EZ.glide },
    /* T3 — varredura de luz e o celular assume */
    { t: c.T3 + 0.45, s: 1.0, z: -60, x: 30, y: -10, ry: -1.8, dim: 0.24, spot: 0.18, ease: EZ.glide },
    { t: c.T3 + 1.55, s: 0.98, z: 10, x: -60, y: 10, ry: -0.8, dim: 0.14, spot: 0.12, ease: EZ.glide },
    { t: ex - 0.05, s: 0.94, z: 40, x: -300, y: 26, ry: 0, dim: 0, spot: 0, sx: 0.36, sy: 0.5, ease: EZ.settle },
    /* execução: celular à esquerda, headline à direita; acompanha o checklist */
    { t: ex + 1.1, s: 0.96, z: 140, x: -292, y: 56, ry: 0.9, dim: 0.26, spot: 0.3, sx: 0.36, sy: 0.42, ease: EZ.glide },
    { t: ex + 2.1, s: 0.98, z: 180, x: -280, y: -40, dim: 0.32, spot: 0.34, sx: 0.38, sy: 0.6, ease: EZ.glide },
    { t: ex + 3.1, s: 1.0, z: 200, x: -190, y: -30, ry: -0.8, dim: 0.52, spot: 0.52, sx: 0.44, sy: 0.66, ease: EZ.settle },
    { t: ex + 3.7, s: 1.0, z: 180, x: -140, y: -24, dim: 0.3, spot: 0.3, ease: EZ.glide },
    /* zoom-through: a câmera atravessa a tela do celular */
    { t: re - 0.02, s: 1.0, z: 900, x: 0, y: -40, dim: 0.5, spot: 0.4, ease: EZ.glide },
    { t: re + 0.5, s: 0.92, z: 20, x: 170, y: 0, ry: 0, dim: 0.06, spot: 0.06, sx: 0.6, sy: 0.5, ease: EZ.settle },
    /* relatório à direita, headline à esquerda; a folha é lida e recua */
    { t: re + 1.5, s: 0.93, z: 10, x: 250, y: 34, ry: -0.6, ease: EZ.glide },
    { t: re + 2.6, s: 0.96, z: 110, x: 260, y: -46, ry: 1.0, rx: 0.6, dim: 0.14, spot: 0.18, ease: EZ.settle },
    { t: re + 3.6, s: 0.94, z: 90, x: 250, y: 26, rx: 0, ease: EZ.glide },
    /* a folha encolhe e entra no histórico do imóvel */
    { t: c.T4 + 0.25, s: 0.94, z: -40, x: 60, y: 0, ry: 0, dim: 0.12, spot: 0.12, ease: EZ.glide },
    { t: c.T4 + 1.6, s: 0.9, z: -20, x: -60, y: 6, ease: EZ.glide },
    /* headline fixada à direita: a janela não anda nem cresce no horizontal
       enquanto ela está no ar — o respiro vem só do eixo vertical */
    { t: hi + 0.6, s: 0.82, z: 0, x: -286, y: 14, ry: 0, dim: 0, spot: 0, sx: 0.42, sy: 0.5, ease: EZ.settle },
    { t: hi + 2.4, s: 0.82, z: 0, x: -286, y: -28, ry: 0.8, dim: 0.2, spot: 0.22, sx: 0.46, sy: 0.56, ease: EZ.glide },
    { t: hi + 3.8, s: 0.82, z: 0, x: -286, y: 6, ry: 0.3, dim: 0.06, spot: 0.06, ease: EZ.glide },
    { t: fi + 0.05, s: 0.92, z: -220, x: 0, y: -10, ry: 0, rx: 2.2, dim: 0.2, spot: 0, ease: EZ.glide },
    { t: fi + 1.1, s: 0.86, z: -520, y: -40, rx: 4.5, dim: 0, ease: EZ.glide },
    { t: total, s: 0.86, z: -520, ease: EZ.glide },
  ]);
  const cs = chan(cam, 's', T), cz = chan(cam, 'z', T);
  const cx = chan(cam, 'x', T), cy = chan(cam, 'y', T);
  const rx = chan(cam, 'rx', T), ry = chan(cam, 'ry', T), rz = chan(cam, 'rz', T);
  /* enquanto uma headline está no ar, a interface vira contexto (perde nitidez);
     quando a interface age, a headline já saiu */
  const hlWin = (a, b) => MOTION.enter(a, 0.8)(T) * (1 - MOTION.move(b, 0.5)(T));
  const headSoft = Math.max(
    hlWin(ch + 0.5, ch + 1.62), hlWin(or + 0.4, or + 1.85), hlWin(ap + 0.35, ap + 1.5),
    hlWin(ex + 0.4, ex + 2.75), hlWin(re + 0.85, c.T4 - 0.35), hlWin(hi + 0.55, hi + 3.6)
  );
  const dim = Math.max(chan(cam, 'dim', T), headSoft * 0.52), spot = chan(cam, 'spot', T);
  const sx = chan(cam, 'sx', T), sy = chan(cam, 'sy', T);

  /* ── janela do desktop: recua em Z durante as passagens pelo celular ── */
  const birth = MOTION.move(ec + 3.87, 1.0)(T);
  const winIn = birth;
  const contentK = clamp((birth - 0.42) / 0.4, 0, 1);
  const awaySpans = [[c.T1 + 0.15, c.T2 + 0.4], [c.T3 + 0.1, re - 0.9], [c.T4 + 0.1, hi - 0.5]];
  let away = 0;
  awaySpans.forEach((b) => {
    const k = MOTION.move(b[0], 0.85)(T) * (1 - MOTION.move(b[1], 0.8)(T));
    away = Math.max(away, k);
  });
  const winOut = MOTION.move(fi + 0.02, 0.5)(T);
  const winOp = winIn * (1 - 0.55 * away) * (1 - winOut);

  /* ── celular: nasce à frente, recua com o fluxo ── */
  const phoneUp = Math.max(
    MOTION.enter(c.T1 + 1.45, 0.75)(T) * (1 - MOTION.move(c.T2 + 0.1, 0.7)(T)),
    MOTION.enter(c.T3 + 1.5, 0.7)(T) * (1 - MOTION.move(re - 0.35, 0.55)(T))
  );
  /* na passagem para o relatório o celular é atravessado pela câmera */
  const through = MOTION.move(re - 0.55, 0.6)(T) * (1 - MOTION.move(re + 0.1, 0.3)(T));

  /* ── elemento compartilhado: o número da OS e depois o valor ── */
  const chipOS = MOTION.move(c.T1 + 0.42, 1.45)(T);
  const chipVal = MOTION.move(c.T2 + 0.05, 1.2)(T);

  /* ── microinterações: hover / press / ripple por alvo ── */
  const hovOpen = clamp((T - (ch + 3.52)) / 0.26, 0, 1) * (1 - clamp((T - (ch + 4.2)) / 0.3, 0, 1));
  const prOpen = inWin(T, ch + 3.8, ch + 3.98) ? 1 : 0;
  const rpOpen = MOTION.move(ch + 3.8, 0.75)(T);
  const hovQuote = clamp((T - (or + 2.85)) / 0.26, 0, 1) * (1 - clamp((T - (or + 3.5)) / 0.3, 0, 1));
  const prQuote = inWin(T, or + 3.15, or + 3.33) ? 1 : 0;
  const rpQuote = MOTION.move(or + 3.15, 0.75)(T);
  const hovAppr = clamp((T - (ap + 1.6)) / 0.25, 0, 1) * (1 - clamp((T - (ap + 3.2)) / 0.3, 0, 1));
  const prAppr = (inWin(T, ap + 1.85, ap + 2.03) || inWin(T, ap + 2.95, ap + 3.13)) ? 1 : 0;
  const rpAppr = Math.max(MOTION.move(ap + 1.85, 0.7)(T) * (1 - MOTION.move(ap + 2.6, 0.1)(T)), MOTION.move(ap + 2.95, 0.7)(T));
  const hovFin = clamp((T - (ex + 2.9)) / 0.25, 0, 1) * (1 - clamp((T - (ex + 3.55)) / 0.3, 0, 1));
  const prFin = inWin(T, ex + 3.2, ex + 3.38) ? 1 : 0;
  const rpFin = MOTION.move(ex + 3.2, 0.75)(T);

  /* ── ponteiro ── */
  const curKeys = [
    { t: ch + 0.05, x: 1180, y: 820 },
    { t: ch + 0.48, x: 640, y: 372, c: ch + 0.54 },
    { t: ch + 1.05, x: 700, y: 528, c: ch + 1.12 },
    { t: ch + 1.78, x: 1420, y: 530, c: ch + 1.92 },
    { t: ch + 2.26, x: 1310, y: 634, c: ch + 2.42 },
    { t: ch + 2.8, x: 1180, y: 700 },
    { t: ch + 3.68, x: 1576, y: 871, c: ch + 3.8 },
    { t: ch + 4.5, x: 1520, y: 830 },
    { t: or + 3.05, x: 960, y: 858, c: or + 3.2 },
    { t: or + 4.1, x: 1040, y: 780 },
    { t: ap + 1.66, x: 1546, y: 596, c: ap + 1.88 },
    { t: ap + 2.78, x: 1546, y: 596, c: ap + 3.0 },
    { t: ap + 3.9, x: 1330, y: 800 },
    { t: ex + 0.32, x: 900, y: 466, c: ex + 0.42 },
    { t: ex + 0.77, x: 900, y: 524, c: ex + 0.87 },
    { t: ex + 1.22, x: 900, y: 582, c: ex + 1.32 },
    { t: ex + 3.1, x: 960, y: 858, c: ex + 3.25 },
    { t: ex + 4.1, x: 1050, y: 930 },
  ];
  const curShow = clamp(Math.min(
    MOTION.enter(ch - 0.1, 0.4)(T),
    1 - MOTION.move(ex + 3.9, 0.4)(T)
  ), 0, 1) * (tw.cursor === false ? 0 : 1);

  /* ── lower third ── */
  const caps = [
    { at: ch + 0.7, until: ch + 2.4, n: '01', t: 'O chamado nasce organizado' },
    { at: or + 0.35, until: or + 2.1, n: '02', t: 'O profissional orça no celular' },
    { at: ap + 0.35, until: ap + 1.8, n: '03', t: 'Decisão centralizada' },
    { at: ex + 0.3, until: ex + 2.4, n: '04', t: 'Evidência registrada' },
    { at: re + 0.5, until: re + 2.8, n: '05', t: 'O registro permanece' },
    { at: hi + 0.5, until: hi + 3.0, n: '06', t: 'A memória de cada imóvel' },
  ];

  /* varredura de luz nas transições */
  const sweep = Math.max(MOTION.move(c.T1 + 0.02, 0.7)(T) * (1 - MOTION.move(c.T1 + 0.75, 0.1)(T)),
    MOTION.move(c.T3 + 0.02, 0.65)(T) * (1 - MOTION.move(c.T3 + 0.7, 0.1)(T)));

  const iw = (a, b) => MOTION.move(a, 0.42)(T) * (1 - MOTION.move(b, 0.42)(T));
  const plateK = clamp(Math.max(1 - MOTION.move(ec + 4.55, 0.6)(T), MOTION.move(fi + 0.08, 0.42)(T),
    0.92 * iw(c.T1 + 0.02, c.T1 + 1.58), 0.92 * iw(c.T3 + 0.05, c.T3 + 1.68), 0.92 * iw(c.T4 + 0.02, c.T4 + 1.68)), 0, 1);

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{
      position: 'absolute', inset: 0, background: '#040d0e', overflow: 'hidden', fontFamily: SANS,
      perspective: '2200px', perspectiveOrigin: '50% 50%',
    }}>
      {/* luz de ambiente */}
      <div style={{
        position: 'absolute', inset: '-10%',
        background: 'radial-gradient(64% 50% at ' + (50 - cx * 0.02) + '% 24%, #103331 0%, #081a1c 46%, #040d0e 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        background: 'radial-gradient(40% 32% at ' + (52 - cx * 0.04) + '% 22%, rgba(46,201,192,0.2) 0%, rgba(46,201,192,0) 70%)',
        filter: 'blur(30px)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
        transform: 'translate3d(' + cx + 'px,' + cy + 'px,' + cz + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) scale(' + cs + ')',
      }}>
        {/* desktop */}
        <div style={{
          position: 'absolute', left: 210, top: 92, width: 1500, height: 900,
          borderRadius: (16 + 78 * (1 - birth)).toFixed(1) + 'px', overflow: 'hidden', background: C.card, boxShadow: SHADOW_WIN,
          opacity: winOp, transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
          transform: 'translate3d(' + (away * 40) + 'px,' + (away * 30 - winOut * 70) + 'px,' + (-620 * away - 300 * winOut) + 'px)'
            + ' rotateY(' + (7.5 * away).toFixed(2) + 'deg) rotateX(' + (-3.5 * winOut).toFixed(2) + 'deg)'
            + ' scale(' + (0.14 + 0.86 * birth).toFixed(4) + ')',
          filter: away > 0.02 ? 'blur(' + (3.4 * away).toFixed(2) + 'px)' : 'none',
        }}>
          <div style={{ height: 46, background: '#eceff3', borderBottom: '1px solid ' + C.border, display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px', opacity: contentK }}>
            {['#e5675f', '#e0b040', '#5ab663'].map((d) => (
              <span key={d} style={{ width: 12, height: 12, borderRadius: 999, background: d, display: 'inline-block' }} />
            ))}
            <div style={{ flex: 1, margin: '0 18px', height: 26, borderRadius: 999, background: '#fff', border: '1px solid ' + C.border, display: 'flex', alignItems: 'center', padding: '0 14px', font: '500 13px ' + MONO, color: C.muted }}>
              vitafaztudo.com.br/{T < c.T2 ? 'novo-chamado' : T < c.T3 ? 'aprovar' : T > hi - 0.7 ? 'historico' : 'ordens'}
            </div>
          </div>
          <div style={{ display: 'flex', height: 854, opacity: contentK }}>
            <Sidebar
              role={T < c.T2 ? 'imob' : 'admin'}
              name={T < c.T2 ? 'Márcia Ribeiro' : 'Carolina Martins'}
              company={T < c.T2 ? 'Imobiliária Horizonte' : null}
              active={T < c.T2 ? 'Novo Chamado' : T < c.T3 ? 'Aprovar Orçamentos' : T > hi - 0.7 ? 'Histórico Imóveis' : 'Ordens de Serviço'} />
            <div style={{ flex: 1, position: 'relative', background: C.bg, overflow: 'hidden' }}>
              <Shot from={ec + 4.0} to={c.T2}>
                <PageNovoChamado T={T} c={c} dim={T > ch + 5.5 ? dim : dim * 0.55}
                  hov={hovOpen} press={prOpen} ripple={rpOpen < 1 ? rpOpen : 0} />
              </Shot>
              <Shot from={c.T2 + 0.2} to={c.T3 + 0.6}>
                <PageAprovar T={T} c={c} dim={dim} hov={hovAppr} press={prAppr} ripple={rpAppr < 1 ? rpAppr : 0}
                  hideCusto={chipVal < 0.92} />
              </Shot>
              <Shot from={re - 0.7} to={hi - 0.7}><PageConcluida T={T} c={c} /></Shot>
              <Shot from={hi - 0.7} to={1e9}><PageHistorico T={T} c={c} /></Shot>
            </div>
          </div>
          {/* light sweep */}
          {sweep > 0.01 && sweep < 0.99 ? (
            <div style={{
              position: 'absolute', top: '-20%', left: (-30 + sweep * 130) + '%', width: '26%', height: '140%',
              background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)',
              transform: 'skewX(-14deg)', opacity: 0.55 * Math.sin(Math.PI * sweep),
            }} />
          ) : null}
        </div>

        <div style={{ transform: 'translateZ(120px)', transformStyle: 'preserve-3d' }}>
          <ReportSheet T={T} c={c} />
        </div>

        {/* celular */}
        <div style={{
          position: 'absolute', left: 770, top: 176, width: 380, height: 720,
          borderRadius: 46, background: '#11161d', padding: 12,
          boxShadow: '0 60px 110px -34px rgba(15,22,32,0.62), 0 12px 34px -14px rgba(15,22,32,0.42)',
          opacity: Math.min(1, phoneUp * 2.4) * (1 - through * 0.9),
          transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
          transform: 'translate3d(0,' + ((1 - phoneUp) * 520) + 'px,' + (240 + through * 1500) + 'px)'
            + ' rotateY(' + (-7 * (1 - phoneUp)).toFixed(2) + 'deg) rotateX(' + (4 * (1 - phoneUp)).toFixed(2) + 'deg)'
            + ' scale(' + (0.94 + 0.06 * phoneUp) + ')',
          filter: through > 0.02 ? 'blur(' + (7 * through).toFixed(2) + 'px)' : 'none',
        }}>
          <div style={{ position: 'absolute', inset: 11, borderRadius: 35, overflow: 'hidden', background: C.bg }}>
            <Shot from={c.T1 + 0.3} to={c.T2 + 0.7}>
              <PhoneOrcamento T={T} c={c} dim={dim} hov={hovQuote} press={prQuote} ripple={rpQuote < 1 ? rpQuote : 0}
                hideNumber={chipOS < 0.92} hideTotal={chipVal > 0.02 && chipVal < 1} />
            </Shot>
            <Shot from={c.T3 + 0.05} to={re + 0.2}>
              <PhoneExecucao T={T} c={c} dim={dim} hov={hovFin} press={prFin} ripple={rpFin < 1 ? rpFin : 0} />
            </Shot>
          </div>
          <div style={{ position: 'absolute', left: '50%', top: 20, width: 96, height: 8, borderRadius: 999, background: '#000', transform: 'translateX(-50%)' }} />
        </div>

        {/* elemento compartilhado 1: o número da OS vai do toast para o card do celular */}
        {chipOS > 0.001 && chipOS < 0.999 ? (
          <div style={{
            position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d',
            transform: 'translate3d(' + interpolate([0, 0.42, 1], [1400, 900, 812], Easing.linear)(chipOS) + 'px,'
              + interpolate([0, 0.42, 1], [870, 470, 306], Easing.linear)(chipOS) + 'px,'
              + interpolate([0, 0.42, 1], [40, 420, 250], Easing.linear)(chipOS) + 'px)'
              + ' scale(' + interpolate([0, 0.42, 1], [1, 2.5, 0.86], Easing.linear)(chipOS) + ')',
            opacity: clamp(Math.min(chipOS / 0.12, (1 - chipOS) / 0.1), 0, 1),
          }}>
            <div style={{
              font: '800 22px ' + DISP, color: C.primary, background: '#fff', borderRadius: 10,
              padding: '8px 14px', border: '1px solid rgba(26,127,152,0.18)',
              boxShadow: '0 26px 60px -26px rgba(15,22,32,0.5)', whiteSpace: 'nowrap',
            }}>OS-2026-0412</div>
          </div>
        ) : null}

        {/* elemento compartilhado 2: o valor sobe do celular para o painel do admin */}
        {chipVal > 0.001 && chipVal < 0.999 ? (
          <div style={{
            position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d',
            transform: 'translate3d(' + interpolate([0, 0.45, 1], [1006, 900, 1500], Easing.linear)(chipVal) + 'px,'
              + interpolate([0, 0.45, 1], [686, 470, 306], Easing.linear)(chipVal) + 'px,'
              + interpolate([0, 0.45, 1], [250, 460, 30], Easing.linear)(chipVal) + 'px)'
              + ' scale(' + interpolate([0, 0.45, 1], [1, 2.2, 1.05], Easing.linear)(chipVal) + ')',
            opacity: clamp(Math.min(chipVal / 0.12, (1 - chipVal) / 0.1), 0, 1),
          }}>
            <div style={{
              font: '800 24px ' + DISP, color: C.fg, background: '#fff', borderRadius: 10,
              padding: '8px 14px', border: '1px solid ' + C.border,
              boxShadow: '0 26px 60px -26px rgba(15,22,32,0.5)', whiteSpace: 'nowrap',
            }}>R$ 440,00</div>
          </div>
        ) : null}

        <div style={{ transform: 'translateZ(8px)' }}>
          <Cursor T={T} keys={curKeys} show={curShow} />
        </div>
      </div>

      {/* headlines editoriais: a interface mostra o quê, a copy diz por quê */}
      {tw.captions === false ? null : (
        <React.Fragment>
          <Headline side="left" top={318} w={344}
            k={MOTION.enter(ch + 0.5, 0.8)(T)} out={MOTION.move(ch + 1.62, 0.34)(T)}
            kicker="DO PROBLEMA À OS" l1="Tudo começa" l2="organizado." size={54}
            sub="Um chamado. Um registro desde o início." />

          <Headline side="right" top={286} w={600}
            k={MOTION.enter(or + 0.4, 0.8)(T)} out={MOTION.move(or + 1.85, 0.5)(T)}
            kicker="NO CAMPO" l1="Recebe. Orça." l2="Executa."
            sub="O profissional certo, com tudo registrado." />

          <Headline side="right" top={276} w={520}
            k={MOTION.enter(ap + 0.35, 0.8)(T)} out={MOTION.move(ap + 1.5, 0.5)(T)}
            kicker="DECISÕES CENTRALIZADAS" l1="Orçamento, revisão" l2="e aprovação."
            sub="No mesmo fluxo, com registro de quem decidiu." />

          <Headline side="right" top={228} w={600} tone="light"
            k={MOTION.enter(c.T3 + 0.5, 0.8)(T)} out={MOTION.move(ex - 0.8, 0.4)(T)}
            l1="Evidência," l2="não promessa."
            sub="Antes. Depois. Tudo registrado." />
          <Headline side="right" top={300} w={600}
            k={MOTION.enter(ex + 0.4, 0.8)(T)} out={MOTION.move(ex + 2.75, 0.5)(T)}
            l1="Evidência," l2="não promessa."
            sub="Antes. Depois. Tudo registrado." />

          <Headline side="left" top={318} w={330}
            k={MOTION.enter(re + 0.85, 0.8)(T)} out={MOTION.move(re + 2.15, 0.45)(T)}
            l1="O serviço" l2="termina." />
          <Headline side="left" top={318} w={330} tone="dark"
            k={MOTION.enter(re + 2.35, 0.8)(T)} out={MOTION.move(c.T4 - 0.35, 0.4)(T)}
            l1="O registro" l2="permanece." />

          <Headline side="right" top={252} w={430}
            k={MOTION.enter(hi + 0.55, 0.85)(T)} out={MOTION.move(hi + 3.6, 0.45)(T)}
            kicker="HISTÓRICO POR IMÓVEL" l1="A memória de" l2="manutenção." />
          <Headline side="right" top={560} w={430}
            k={MOTION.enter(hi + 2.35, 0.85)(T)} out={MOTION.move(hi + 3.6, 0.45)(T)}
            sub="Mais histórico hoje. Mais inteligência amanhã." />
        </React.Fragment>
      )}

      {/* luz dirigida + vinheta: reduz a atenção do resto sem apagar a UI */}
      {spot > 0.01 ? (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(34% 30% at ' + (sx * 100).toFixed(1) + '% ' + (sy * 100).toFixed(1) + '%, rgba(10,14,20,0) 0%, rgba(10,14,20,'
            + (0.3 * spot).toFixed(3) + ') 78%, rgba(10,14,20,' + (0.42 * spot).toFixed(3) + ') 100%)',
        }} />
      ) : null}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(78% 68% at 50% 48%, rgba(10,14,20,0) 55%, rgba(10,14,20,0.16) 100%)',
      }} />

      {/* placa escura: abertura e final */}
      <div style={{
        position: 'absolute', inset: 0, opacity: plateK, pointerEvents: 'none',
        background: 'radial-gradient(120% 90% at 50% 18%, #113a37 0%, #08201f 56%, #030c0d 100%)',
      }}>
        <OpeningType T={T} c={c} />
        <FlowStrip T={T} c={c} />
        <EcosystemScene T={T} c={c} cam={{ x: cx, y: cy, z: cz, s: cs, rx: rx, ry: ry }} />
        <ClosingType T={T} c={c} />
      </div>

      <Interstitials T={T} c={c} />

      {/* grão */}
      {tw.captions === false ? null : <LowerThird T={T} items={caps} />}

      {tw.grain === false ? null : (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
          <filter id="vitaGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vitaGrain)" />
        </svg>
      )}


    </div>
  );
}

function VitaApp() {
  const tk = useTweaks(window.TWEAK_DEFAULTS || {});
  const t = tk[0], setTweak = tk[1];
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#030c0d">
        <Piece tw={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Vídeo" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakToggle label="Rótulos das etapas" value={t.captions} onChange={(v) => setTweak('captions', v)} />
        <TweakToggle label="Cursor visível" value={t.cursor} onChange={(v) => setTweak('cursor', v)} />
        <TweakToggle label="Grão de filme" value={t.grain} onChange={(v) => setTweak('grain', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.VitaApp = VitaApp;
