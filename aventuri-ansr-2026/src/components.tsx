import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, enter, lin} from './theme';
import {Icon, IconName} from './icons';

export const useIsVertical = () => {
  const {width, height} = useVideoConfig();
  return height > width;
};

/* ---------- Fundo editorial com grade e formas geométricas ---------- */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const v = height > width;
  const step = v ? 90 : 80;
  const drift = (frame * 0.25) % step;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at ${v ? '80% 0%' : '85% 10%'}, #0B3474 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`,
      }}
    >
      <svg width={width} height={height} style={{position: 'absolute'}}>
        {Array.from({length: Math.ceil(width / step) + 2}).map((_, i) => (
          <line
            key={'v' + i}
            x1={i * step - drift}
            x2={i * step - drift}
            y1={0}
            y2={height}
            stroke={C.navyLine}
            strokeWidth={1}
          />
        ))}
        {Array.from({length: Math.ceil(height / step) + 2}).map((_, i) => (
          <line
            key={'h' + i}
            y1={i * step - drift}
            y2={i * step - drift}
            x1={0}
            x2={width}
            stroke={C.navyLine}
            strokeWidth={1}
          />
        ))}
        <circle
          cx={width * (v ? 0.95 : 0.92) + Math.sin(frame / 90) * 20}
          cy={height * (v ? 0.12 : 0.18)}
          r={v ? 320 : 280}
          fill={C.blue}
          opacity={0.35}
        />
        <circle
          cx={width * 0.05}
          cy={height * 0.95 + Math.cos(frame / 80) * 16}
          r={v ? 220 : 180}
          fill="none"
          stroke={C.teal}
          strokeOpacity={0.25}
          strokeWidth={2}
        />
        <rect
          x={width * 0.86}
          y={height * (v ? 0.86 : 0.78)}
          width={36}
          height={36}
          fill="none"
          stroke={C.yellow}
          strokeOpacity={0.5}
          strokeWidth={3}
          transform={`rotate(${frame * 0.4} ${width * 0.86 + 18} ${height * (v ? 0.86 : 0.78) + 18})`}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- Cabeçalho fixo ---------- */
export const Header: React.FC = () => {
  const v = useIsVertical();
  const pad = v ? 72 : 80;
  return (
    <div
      style={{
        position: 'absolute',
        top: v ? 70 : 48,
        left: pad,
        right: pad,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: FONT,
        color: C.soft,
        fontSize: v ? 26 : 22,
        letterSpacing: 4,
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 14, height: 14, background: C.yellow}} />
        Aventuri ANSR 2026
      </div>
      <div style={{color: C.white}}>Nosso Amiguinho</div>
    </div>
  );
};

/* ---------- Linha do tempo dos 4 dias ---------- */
const DAYS = [
  {d: 'SEX', n: '20'},
  {d: 'SÁB', n: '21'},
  {d: 'DOM', n: '22'},
  {d: 'SEG', n: '23'},
];

export const DayStrip: React.FC<{active: number}> = ({active}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const w = v ? 936 : 720;
  const cell = w / 4;
  const p = enter(frame, fps, 2);
  return (
    <div style={{width: w, position: 'relative', fontFamily: FONT}}>
      <div style={{display: 'flex'}}>
        {DAYS.map((day, i) => {
          const on = i === active;
          const past = i < active;
          return (
            <div
              key={day.d}
              style={{
                width: cell,
                textAlign: 'left',
                color: on ? C.yellow : past ? C.soft : 'rgba(255,255,255,0.35)',
                opacity: lin(frame, i * 3, i * 3 + 12),
              }}
            >
              <div style={{fontSize: v ? 22 : 18, letterSpacing: 3, fontWeight: 700}}>
                {day.d}
              </div>
              <div style={{fontSize: v ? 40 : 32, fontWeight: 800, lineHeight: 1.1}}>
                {day.n}/11
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          height: 4,
          background: 'rgba(255,255,255,0.15)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: cell * active + cell * 0.7 * p,
            background: C.yellow,
          }}
        />
      </div>
    </div>
  );
};

/* ---------- Etiqueta (kicker) ---------- */
export const Kicker: React.FC<{text: string; color?: string; delay?: number; icon?: IconName}> = ({
  text,
  color = C.teal,
  delay = 6,
  icon,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const p = enter(frame, fps, delay);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: v ? 30 : 26,
        letterSpacing: 5,
        color,
        textTransform: 'uppercase',
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      {icon ? <Icon name={icon} size={v ? 40 : 34} color={color} draw={p} /> : null}
      <div style={{width: 48 * p, height: 3, background: color}} />
      {text}
    </div>
  );
};

/* ---------- Título com revelação por máscara ---------- */
export const Title: React.FC<{
  lines: string[];
  size?: number;
  delay?: number;
  accent?: number; // index da linha em amarelo
}> = ({lines, size, delay = 10, accent = -1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const fs = size ?? (v ? 104 : 92);
  return (
    <div style={{fontFamily: FONT}}>
      {lines.map((l, i) => {
        const p = enter(frame, fps, delay + i * 5, 20);
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: fs * 0.06}}>
            <div
              style={{
                fontSize: fs,
                lineHeight: 1.0,
                fontWeight: 900,
                letterSpacing: -2,
                color: i === accent ? C.yellow : C.white,
                transform: `translateY(${(1 - p) * 110}%)`,
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Item de lista com ícone ---------- */
export const Item: React.FC<{
  icon: IconName;
  text: string;
  sub?: string;
  delay: number;
  highlight?: boolean;
}> = ({icon, text, sub, delay, highlight}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const p = enter(frame, fps, delay);
  const box = v ? 96 : 76;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: v ? 30 : 24,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: box,
          height: box,
          flexShrink: 0,
          borderRadius: 18,
          background: highlight ? C.yellow : 'rgba(0,92,161,0.55)',
          border: highlight ? 'none' : `2px solid rgba(255,255,255,0.18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name={icon}
          size={box * 0.56}
          color={highlight ? C.navy : C.white}
          draw={lin(frame, delay + 2, delay + 22)}
        />
      </div>
      <div>
        <div
          style={{
            color: C.white,
            fontSize: v ? 42 : 34,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {text}
        </div>
        {sub ? (
          <div
            style={{
              color: C.soft,
              fontSize: v ? 30 : 24,
              fontWeight: 500,
              marginTop: 6,
              lineHeight: 1.25,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ---------- Selo de destaque ---------- */
export const Badge: React.FC<{text: string; delay: number; color?: string; textColor?: string}> = ({
  text,
  delay,
  color = C.yellow,
  textColor = C.navy,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const p = enter(frame, fps, delay, 12);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 16,
        background: color,
        color: textColor,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: v ? 32 : 26,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: v ? '20px 30px' : '16px 26px',
        borderRadius: 999,
        transform: `scale(${0.6 + 0.4 * p})`,
        transformOrigin: 'left center',
        opacity: p,
      }}
    >
      <Icon name="check" size={v ? 34 : 28} color={textColor} strokeWidth={5} />
      {text}
    </div>
  );
};

/* ---------- Contador de apresentações (1/3, 2/3, 3/3) ---------- */
export const ShowCounter: React.FC<{n: 1 | 2 | 3; delay?: number}> = ({n, delay = 8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = useIsVertical();
  const r = v ? 54 : 44;
  const labels = ['1ª', '2ª', '3ª'];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: v ? 22 : 18, fontFamily: FONT}}>
      {[1, 2, 3].map((i) => {
        const p = enter(frame, fps, delay + i * 6, 14);
        const on = i <= n;
        const current = i === n;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: r * 0.62,
                background: current ? C.yellow : on ? C.blue : 'transparent',
                color: current ? C.navy : on ? C.white : 'rgba(255,255,255,0.4)',
                border: on ? 'none' : '3px solid rgba(255,255,255,0.25)',
                transform: `scale(${p * (current ? 1 + 0.05 * Math.sin(frame / 8) : 1)})`,
                boxShadow: current ? `0 0 0 ${8 + 4 * Math.sin(frame / 8)}px rgba(255,225,74,0.18)` : 'none',
              }}
            >
              {labels[i - 1]}
            </div>
            {i < 3 ? (
              <div
                style={{
                  width: v ? 46 : 36,
                  height: 3,
                  background: i < n ? C.blue : 'rgba(255,255,255,0.2)',
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ---------- Layout padrão de cena ---------- */
export const SceneFrame: React.FC<{
  day: number;
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({day, left, right}) => {
  const v = useIsVertical();
  if (v) {
    return (
      <AbsoluteFill style={{padding: '170px 72px 120px', display: 'flex', flexDirection: 'column'}}>
        <DayStrip active={day} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>{left}</div>
          <div style={{marginTop: 80, display: 'flex', flexDirection: 'column', gap: 40}}>{right}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{padding: '130px 80px 90px', display: 'flex', flexDirection: 'column'}}>
      <DayStrip active={day} />
      <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 80}}>
        <div style={{flex: 1.05, display: 'flex', flexDirection: 'column', gap: 30}}>{left}</div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26}}>{right}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Barra de progresso inferior ---------- */
export const Progress: React.FC<{index: number; total: number}> = ({index, total}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const v = useIsVertical();
  const pad = v ? 72 : 80;
  return (
    <div
      style={{
        position: 'absolute',
        left: pad,
        right: pad,
        bottom: v ? 70 : 40,
        display: 'flex',
        gap: 8,
      }}
    >
      {Array.from({length: total}).map((_, i) => (
        <div key={i} style={{flex: 1, height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 3}}>
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              background: i === index ? C.yellow : C.blueLight,
              width: i < index ? '100%' : i === index ? `${(frame / durationInFrames) * 100}%` : '0%',
            }}
          />
        </div>
      ))}
    </div>
  );
};
