import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Footer,
  Header,
  Highlight,
  Kicker,
  QuoteText,
  Reveal,
  SourceChip,
  ease,
} from "../components";
import { colors, fonts } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TOTAL = 5;

const headline: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 800,
  fontSize: 112,
  lineHeight: 1.0,
  letterSpacing: -5,
  color: colors.ink,
  margin: 0,
};

/** Ícone de app arredondado (estilo do diagrama Edits ↔ Claude Code). */
const AppIcon: React.FC<{
  bg: string;
  label: string;
  sub: string;
  children: React.ReactNode;
}> = ({ bg, label, sub, children }) => (
  <div style={{ textAlign: "center", width: 260 }}>
    <div
      style={{
        width: 200,
        height: 200,
        margin: "0 auto",
        borderRadius: 50,
        background: bg,
        boxShadow: "0 30px 50px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: 44,
        letterSpacing: -1.5,
        marginTop: 28,
        color: colors.ink,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 22,
        letterSpacing: 3,
        color: colors.muted,
        marginTop: 8,
      }}
    >
      {sub}
    </div>
  </div>
);

const Connector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [1.6 * fps, 2.6 * fps], [1, 0], {
    ...clamp,
    easing: ease,
  });
  const dot = (frame / fps) % 1.4;
  return (
    <div style={{ position: "relative", width: 420, height: 200 }}>
      <svg width={420} height={200} style={{ position: "absolute" }}>
        <path
          d="M 0 70 Q 210 230 420 70"
          fill="none"
          stroke={colors.highlight}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw}
        />
        <circle
          cx={interpolate(dot, [0, 1.4], [40, 380])}
          cy={interpolate(dot, [0, 0.7, 1.4], [92, 150, 92])}
          r={10}
          fill={colors.purple}
          opacity={draw < 0.05 ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 210 - 105,
          top: 120,
          width: 210,
          padding: "14px 0",
          textAlign: "center",
          background: "white",
          border: `3px solid ${colors.highlight}`,
          borderRadius: 50,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 4,
          color: colors.ink,
          opacity: interpolate(frame, [2.2 * fps, 2.6 * fps], [0, 1], clamp),
        }}
      >
        <span style={{ color: colors.green }}>●</span> MISSÃO
      </div>
    </div>
  );
};

export const IntroScene: React.FC = () => (
  <AbsoluteFill style={{ background: colors.paper }}>
    <Header index={1} total={TOTAL} />
    <div style={{ position: "absolute", top: 330, left: 90, right: 90 }}>
      <Reveal delay={0}>
        <Kicker>Novo · Um chamado para você</Kicker>
      </Reveal>
      <Reveal delay={0.15}>
        <h1 style={headline}>Deus ainda</h1>
      </Reveal>
      <Reveal delay={0.3}>
        <h1 style={headline}>está chamando</h1>
      </Reveal>
      <Reveal delay={0.45}>
        <h1 style={headline}>
          <Highlight start={1.0}>obreiros.</Highlight>
        </h1>
      </Reveal>
    </div>
    <Reveal
      delay={1.2}
      style={{
        position: "absolute",
        top: 1050,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <AppIcon bg="linear-gradient(150deg,#1D1D22,#3A3A44)" label="Você" sub="DISCÍPULO">
        <svg width={110} height={110} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={colors.highlight} strokeWidth="2" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke={colors.amber} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </AppIcon>
      <Connector />
      <AppIcon bg={`linear-gradient(150deg,#F0A15F,${colors.amber})`} label="O mundo" sub="CAMPO · LARES">
        <svg width={110} height={110} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
      </AppIcon>
    </Reveal>
    <Footer label="5 VERDADES SOBRE O CHAMADO" index={1} />
  </AbsoluteFill>
);

/** Citação editorial grande, com marca-texto. */
export const QuoteScene: React.FC<{
  index: number;
  kicker: string;
  texto: string;
  destaque: string;
  fonte: string;
  footer: string;
  children?: React.ReactNode;
}> = ({ index, kicker, texto, destaque, fonte, footer, children }) => (
  <AbsoluteFill style={{ background: colors.paper }}>
    <Header index={index} total={TOTAL} />
    <div style={{ position: "absolute", top: 330, left: 90, right: 90 }}>
      <Reveal delay={0}>
        <Kicker>{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          style={{
            fontFamily: fonts.serifItalic,
            fontSize: 220,
            lineHeight: 0.6,
            height: 90,
            color: colors.purple,
          }}
        >
          “
        </div>
      </Reveal>
      <Reveal delay={0.25}>
        <p
          style={{
            ...headline,
            fontSize: texto.length > 110 ? 80 : 96,
            letterSpacing: -3,
            lineHeight: 1.08,
          }}
        >
          <QuoteText texto={texto} destaque={destaque} highlightAt={1.4} />
        </p>
      </Reveal>
      <Reveal delay={1.0} style={{ marginTop: 50 }}>
        <SourceChip>{fonte}</SourceChip>
      </Reveal>
    </div>
    {children}
    <Footer label={footer} index={index} />
  </AbsoluteFill>
);

/** Faixa tipo linha do tempo (como o editor de vídeo do modelo). */
export const TimelineStrip: React.FC<{ labels: string[] }> = ({ labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gradients = [
    "linear-gradient(90deg,#F08A6B,#C4546F)",
    "linear-gradient(90deg,#2F5D8A,#4C8BB5)",
    "linear-gradient(90deg,#7B6CF0,#5B3FD1)",
    "linear-gradient(90deg,#D9A06B,#9C6B45)",
    "linear-gradient(90deg,#2F8F5B,#7CC48E)",
  ];
  const head = interpolate(frame, [1.2 * fps, 5 * fps], [0, 100], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <Reveal
      delay={1.2}
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 260,
        background: "white",
        borderRadius: 28,
        padding: "26px 26px 30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: fonts.mono,
            fontSize: 20,
            color: colors.muted,
            marginBottom: 14,
          }}
        >
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, height: 90 }}>
          {gradients.map((g, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 10, background: g }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: -10,
            left: `${head}%`,
            width: 4,
            background: colors.ink,
          }}
        />
      </div>
    </Reveal>
  );
};
