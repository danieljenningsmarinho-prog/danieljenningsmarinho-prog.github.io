import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, enter, lin} from './theme';
import {Icon, IconName} from './icons';
import {Badge, Item, Kicker, SceneFrame, ShowCounter, Title, useIsVertical} from './components';

/* 1. ABERTURA */
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const stats: {n: string; l: string; icon: IconName}[] = [
    {n: '2', l: 'tendas', icon: 'tent'},
    {n: '3', l: 'apresentações', icon: 'stage'},
    {n: '4', l: 'dias', icon: 'calendar'},
  ];
  const line = lin(frame, 4, 40);
  return (
    <AbsoluteFill
      style={{
        padding: v ? '0 72px' : '0 110px',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <Kicker text="Plano de operação · 20 a 23/11" color={C.teal} delay={4} />
      <div style={{height: v ? 40 : 30}} />
      <Title lines={['AVENTURI', 'ANSR 2026']} size={v ? 150 : 150} delay={10} accent={1} />
      <div
        style={{
          width: (v ? 936 : 1000) * line,
          height: 4,
          background: C.white,
          margin: v ? '40px 0' : '30px 0',
          opacity: 0.85,
        }}
      />
      <div
        style={{
          color: C.white,
          fontSize: v ? 64 : 58,
          fontWeight: 300,
          letterSpacing: v ? 6 : 10,
          opacity: lin(frame, 24, 44),
          textTransform: 'uppercase',
        }}
      >
        Nosso <b style={{fontWeight: 800}}>Amiguinho</b>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: v ? 'column' : 'row',
          gap: v ? 26 : 30,
          marginTop: v ? 90 : 70,
        }}
      >
        {stats.map((s, i) => {
          const p = enter(frame, fps, 40 + i * 10, 14);
          return (
            <div
              key={s.l}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                background: 'rgba(0,92,161,0.45)',
                border: '2px solid rgba(255,255,255,0.14)',
                borderLeft: `8px solid ${i === 1 ? C.yellow : C.teal}`,
                padding: v ? '24px 36px' : '20px 34px',
                borderRadius: 8,
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
                flex: v ? undefined : 1,
              }}
            >
              <div style={{fontSize: v ? 110 : 96, fontWeight: 900, color: C.yellow, lineHeight: 1}}>
                {s.n}
              </div>
              <div style={{fontSize: v ? 44 : 36, fontWeight: 600, color: C.white, flex: 1}}>{s.l}</div>
              <Icon name={s.icon} size={v ? 64 : 52} color={C.white} draw={lin(frame, 46 + i * 10, 70 + i * 10)} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 2. SEXTA – MONTAGEM */
export const Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  return (
    <SceneFrame
      day={0}
      left={
        <>
          <Kicker text="Sexta-feira · 20/11 · 10h" icon="clock" />
          <Title lines={['Chegada e', 'montagem das', 'DUAS tendas']} accent={2} size={v ? 96 : 84} />
          <div style={{display: 'flex', gap: 22, alignItems: 'flex-end', marginTop: 6}}>
            {[0, 1].map((i) => {
              const p = enter(frame, fps, 30 + i * 10, 12);
              return (
                <div key={i} style={{transform: `scale(${p})`, transformOrigin: 'bottom'}}>
                  <Icon name="tent" size={v ? 120 : 96} color={C.yellow} strokeWidth={2.6} draw={lin(frame, 30 + i * 10, 60 + i * 10)} />
                </div>
              );
            })}
            <Badge text="Toda a equipe" delay={56} />
          </div>
        </>
      }
      right={
        <>
          <Item icon="bolt" text="Instalação de energia" delay={40} />
          <Item icon="box" text="Transporte das caixas" sub="Brindes e materiais" delay={50} />
          <Item icon="desk" text="Preparação do atendimento" delay={60} />
          <Item icon="food" text="Alimentação no Aventuri" sub="Já reservada para quem confirmou presença" delay={70} />
          <Item icon="bed" text="Hospedagem" sub="Começa na parte da tarde" delay={80} />
        </>
      }
    />
  );
};

/* 3. SEXTA – 1ª APRESENTAÇÃO */
export const Show1: React.FC = () => {
  const v = useIsVertical();
  return (
    <SceneFrame
      day={0}
      left={
        <>
          <Kicker text="Sexta · Pré-show" icon="stage" color={C.yellow} />
          <ShowCounter n={1} />
          <Title lines={['Primeira', 'apresentação']} size={v ? 110 : 96} accent={0} />
          <div style={{color: C.soft, fontSize: v ? 38 : 32, fontFamily: FONT, fontWeight: 500, lineHeight: 1.3}}>
            Turma do Nosso Amiguinho no palco principal, antes da programação oficial.
          </div>
        </>
      }
      right={
        <>
          <Item icon="megaphone" text="Anunciar a presença das tendas" delay={44} highlight />
          <Item
            icon="turtle"
            text="Horário pensado para os personagens"
            sub="Considerando sua mobilidade mais lenta"
            delay={58}
          />
        </>
      }
    />
  );
};

/* 4. SÁBADO MANHÃ – 2ª APRESENTAÇÃO */
export const Show2: React.FC = () => {
  const v = useIsVertical();
  return (
    <SceneFrame
      day={1}
      left={
        <>
          <Kicker text="Sábado · 21/11 · Manhã" icon="sun" color={C.yellow} />
          <ShowCounter n={2} />
          <Title lines={['Segunda', 'apresentação']} size={v ? 110 : 96} accent={0} />
          <div style={{color: C.soft, fontSize: v ? 38 : 32, fontFamily: FONT, fontWeight: 500}}>
            Turma do Nosso Amiguinho
          </div>
        </>
      }
      right={
        <>
          <Kicker text="Durante o dia" color={C.teal} delay={36} />
          <Item icon="people" text="Equipe presente no Aventuri" delay={44} />
          <Item icon="tent" text="Atividades nas tendas" delay={54} />
          <Item icon="chat" text="Atendimentos nas tendas" delay={64} />
        </>
      }
    />
  );
};

/* 5. SÁBADO NOITE – LIVRE / INFLÁVEIS */
export const SaturdayNight: React.FC = () => {
  const v = useIsVertical();
  return (
    <SceneFrame
      day={1}
      left={
        <>
          <Kicker text="Sábado · Noite" icon="moon" color={C.teal} />
          <Title lines={['Programação', 'livre para', 'as crianças']} size={v ? 100 : 86} accent={2} />
        </>
      }
      right={
        <>
          <Item icon="castle" text="Brinquedos infláveis" sub="Momento livre das crianças" delay={40} />
          <Item icon="people" text="A Turma circula pelo Aventuri" delay={52} />
          <Item icon="camera" text="Fotos e interação" delay={64} highlight />
        </>
      }
    />
  );
};

/* 6. SÁBADO NOITE – PROSPECÇÃO (destaque) */
export const Prospecting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const steps: {icon: IconName; t: string}[] = [
    {icon: 'chat', t: 'Falar com pais e responsáveis'},
    {icon: 'magazine', t: 'Apresentar a revista Nosso Amiguinho'},
    {icon: 'contact', t: 'Captar contatos de interessados'},
    {icon: 'calendar', t: 'Agendar visitas'},
  ];
  const flash = lin(frame, 0, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: C.yellow, opacity: (1 - flash) * 0.25}} />
      <SceneFrame
        day={1}
        left={
          <>
            <Kicker text="Sábado · Noite · Prioridade" icon="star" color={C.yellow} />
            <Title lines={['Principal', 'janela de', 'prospecção']} size={v ? 112 : 94} accent={2} />
            <div style={{color: C.soft, fontSize: v ? 36 : 30, fontFamily: FONT, fontWeight: 500, lineHeight: 1.3}}>
              Enquanto as crianças brincam, a equipe conversa com as famílias.
            </div>
          </>
        }
        right={
          <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: v ? 26 : 20}}>
            <div
              style={{
                position: 'absolute',
                left: v ? 47 : 37,
                top: 40,
                width: 3,
                height: `${lin(frame, 40, 110) * 58}%`,
                background: C.yellow,
                opacity: 0.6,
              }}
            />
            {steps.map((s, i) => {
              const p = enter(frame, fps, 40 + i * 14);
              return (
                <div
                  key={s.t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: v ? 28 : 22,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 50}px)`,
                    fontFamily: FONT,
                  }}
                >
                  <div
                    style={{
                      width: v ? 96 : 76,
                      height: v ? 96 : 76,
                      borderRadius: '50%',
                      background: C.navy,
                      border: `3px solid ${C.yellow}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Icon name={s.icon} size={v ? 50 : 40} color={C.yellow} draw={lin(frame, 42 + i * 14, 64 + i * 14)} />
                  </div>
                  <div>
                    <div style={{color: C.teal, fontSize: v ? 24 : 20, fontWeight: 800, letterSpacing: 3}}>
                      PASSO {i + 1}
                    </div>
                    <div style={{color: C.white, fontSize: v ? 40 : 32, fontWeight: 700, lineHeight: 1.15}}>
                      {s.t}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop: v ? 20 : 10}}>
              <Badge text="Mobilização de toda a equipe" delay={110} />
            </div>
            <div
              style={{
                color: C.soft,
                fontFamily: FONT,
                fontSize: v ? 28 : 22,
                fontWeight: 500,
                opacity: lin(frame, 120, 140),
              }}
            >
              Um dos momentos de maior necessidade de mobilização.
            </div>
          </div>
        }
      />
    </AbsoluteFill>
  );
};

/* 7. DOMINGO – 3ª APRESENTAÇÃO */
export const Show3: React.FC = () => {
  const v = useIsVertical();
  return (
    <SceneFrame
      day={2}
      left={
        <>
          <Kicker text="Domingo · 22/11 · Manhã" icon="sun" color={C.yellow} />
          <ShowCounter n={3} />
          <Title lines={['Terceira', 'apresentação']} size={v ? 110 : 96} accent={0} />
          <div style={{color: C.soft, fontSize: v ? 38 : 32, fontFamily: FONT, fontWeight: 500}}>
            Turma do Nosso Amiguinho no encerramento
          </div>
        </>
      }
      right={
        <>
          <Kicker text="Último dia de" color={C.teal} delay={36} />
          <Item icon="chat" text="Contato" delay={44} />
          <Item icon="magazine" text="Prospecção" delay={52} />
          <Item icon="cart" text="Oportunidades de vendas" delay={60} />
          <Badge text="Presença de toda a equipe" delay={76} />
        </>
      }
    />
  );
};

/* 8. DOMINGO – APÓS O PROGRAMA */
export const Teardown: React.FC = () => {
  const frame = useCurrentFrame();
  const v = useIsVertical();
  const steps: {icon: IconName; t: string; s?: string}[] = [
    {icon: 'food', t: 'Almoço em conjunto', s: 'Para quem estiver hospedado no local'},
    {icon: 'wrench', t: 'Desmontagem das tendas'},
    {icon: 'box', t: 'Organização dos materiais'},
    {icon: 'flag', t: 'Liberação da equipe'},
  ];
  return (
    <SceneFrame
      day={2}
      left={
        <>
          <Kicker text="Domingo · Após o programa" icon="flag" />
          <Title lines={['Fechamento', 'no Aventuri']} size={v ? 104 : 90} accent={1} />
          <div
            style={{
              height: 4,
              width: `${lin(frame, 20, 60) * 100}%`,
              background: `linear-gradient(90deg, ${C.teal}, ${C.blue})`,
            }}
          />
        </>
      }
      right={
        <>
          {steps.map((s, i) => (
            <Item key={s.t} icon={s.icon} text={s.t} sub={s.s} delay={34 + i * 12} />
          ))}
        </>
      }
    />
  );
};

/* 9. SEGUNDA – REUNIÃO NA ASSOCIAÇÃO */
export const Meeting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const barW = v ? 936 : 820;
  const p = lin(frame, 40, 100);
  return (
    <SceneFrame
      day={3}
      left={
        <>
          <Kicker text="Segunda-feira · 23/11" icon="building" color={C.yellow} />
          <Title lines={['Reunião na', 'Associação']} size={v ? 110 : 96} accent={1} />
          <div style={{color: C.soft, fontSize: v ? 36 : 30, fontFamily: FONT, fontWeight: 500}}>
            Na Associação ANSR, não no Aventuri
          </div>
        </>
      }
      right={
        <>
          <div style={{fontFamily: FONT, width: barW}}>
            <div style={{display: 'flex', justifyContent: 'space-between', color: C.white, fontWeight: 900, fontSize: v ? 72 : 60}}>
              <span style={{opacity: enter(frame, fps, 36)}}>9h</span>
              <span style={{opacity: enter(frame, fps, 90)}}>12h</span>
            </div>
            <div style={{height: v ? 30 : 24, background: 'rgba(255,255,255,0.12)', borderRadius: 999, marginTop: 14, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${p * 100}%`, background: `linear-gradient(90deg, ${C.blueLight}, ${C.yellow})`, borderRadius: 999}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', color: C.soft, fontSize: v ? 26 : 22, fontWeight: 600, marginTop: 12, letterSpacing: 2}}>
              <span>INÍCIO</span>
              <span>TÉRMINO</span>
            </div>
          </div>
          <Item icon="people" text="Reunião da equipe" sub="Das 9h às 12h" delay={50} />
          <Item icon="food" text="Almoço na Associação" sub="Depois da reunião" delay={100} highlight />
        </>
      }
    />
  );
};

/* 10. ENCERRAMENTO */
export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const stages = ['Montagem', '3 apresentações', 'Prospecção', 'Desmontagem', 'Reunião'];
  return (
    <AbsoluteFill style={{padding: v ? '0 72px' : '0 110px', justifyContent: 'center', fontFamily: FONT}}>
      <Kicker text="Compromisso da equipe" color={C.teal} delay={4} />
      <div style={{height: 40}} />
      <Title lines={['Da montagem', 'à última', 'apresentação,']} size={v ? 112 : 104} delay={10} />
      <Title lines={['cada contato conta.']} size={v ? 92 : 104} delay={28} accent={0} />
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: v ? 70 : 50}}>
        {stages.map((s, i) => {
          const p = enter(frame, fps, 50 + i * 7, 14);
          return (
            <div
              key={s}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: v ? '16px 26px' : '14px 22px',
                border: `2px solid ${C.teal}`,
                borderRadius: 999,
                color: C.white,
                fontSize: v ? 32 : 26,
                fontWeight: 700,
                opacity: p,
                transform: `scale(${0.7 + 0.3 * p})`,
              }}
            >
              <Icon name="check" size={v ? 28 : 24} color={C.teal} strokeWidth={5} />
              {s}
            </div>
          );
        })}
      </div>
      <div style={{marginTop: v ? 60 : 44, color: C.soft, fontSize: v ? 40 : 34, fontWeight: 500, opacity: lin(frame, 90, 110)}}>
        Presença de todos em <b style={{color: C.yellow}}>todas as etapas</b>.
      </div>
    </AbsoluteFill>
  );
};
