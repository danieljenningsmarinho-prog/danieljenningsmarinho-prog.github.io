import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, textos } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Fade + subida, com atraso em segundos. */
export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 40, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delay * fps;
  return (
    <div
      style={{
        opacity: interpolate(frame, [start, start + 0.5 * fps], [0, 1], clamp),
        translate: interpolate(
          frame,
          [start, start + 0.8 * fps],
          [`0px ${y}px`, "0px 0px"],
          { ...clamp, easing: ease },
        ),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Cabeçalho editorial: marca à esquerda, contador à direita. */
export const Header: React.FC<{ index: number; total: number }> = ({
  index,
  total,
}) => (
  <div
    style={{
      position: "absolute",
      top: 110,
      left: 90,
      right: 90,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: 56,
        letterSpacing: -2,
        color: colors.ink,
      }}
    >
      {textos.marca}
      <span style={{ color: colors.purple, fontSize: 36, fontWeight: 600 }}>
        {" "}missão
      </span>
    </div>
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 32,
        color: "white",
        background: "#8A8A8A",
        borderRadius: 40,
        padding: "10px 24px",
      }}
    >
      {index}/{total}
    </div>
  </div>
);

/** Rodapé editorial com linha, rótulo e "arrasta". */
export const Footer: React.FC<{ label: string; index: number }> = ({
  label,
  index,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 120,
      left: 90,
      right: 90,
      borderTop: `2px solid ${colors.line}`,
      paddingTop: 32,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: fonts.mono,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: 3,
      color: colors.muted,
    }}
  >
    <span>{label}</span>
    <span>
      <span style={{ color: colors.purple }}>ASSISTA →</span>{" "}
      <span style={{ color: colors.ink }}>0{index}</span>
    </span>
  </div>
);

/** Kicker em serifa, caixa alta. */
export const Kicker: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: fonts.serif,
      fontSize: 40,
      letterSpacing: 2,
      color: colors.muted,
      textTransform: "uppercase",
      marginBottom: 36,
    }}
  >
    {children}
  </div>
);

/** Marca-texto roxo que "pinta" da esquerda para a direita. */
export const Highlight: React.FC<{
  start: number;
  children: React.ReactNode;
  color?: string;
}> = ({ start, children, color = colors.highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [start * fps, start * fps + 0.6 * fps], [0, 100], {
    ...clamp,
    easing: ease,
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p}% 38%`,
        backgroundPosition: "0 88%",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
};

/** Pílula escura de legenda (estilo "Um app pra cada coisa."). */
export const CaptionPill: React.FC<{
  children: React.ReactNode;
  delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = delay * fps;
  return (
    <div
      style={{
        alignSelf: "center",
        background: "#3A3A3C",
        color: "white",
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 54,
        letterSpacing: -1,
        padding: "22px 44px",
        borderRadius: 30,
        boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        opacity: interpolate(frame, [s, s + 0.4 * fps], [0, 1], clamp),
        scale: interpolate(frame, [s, s + 0.6 * fps], [0.85, 1], {
          ...clamp,
          easing: Easing.spring({ damping: 12 }),
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </div>
  );
};

/** Selo redondo (menos vermelho ou check verde). */
export const Badge: React.FC<{ kind: "minus" | "check" }> = ({ kind }) => (
  <span
    style={{
      display: "inline-flex",
      width: 40,
      height: 40,
      borderRadius: 20,
      background: kind === "minus" ? colors.red : colors.green,
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 30,
      fontWeight: 800,
      marginLeft: 16,
      verticalAlign: "middle",
      boxShadow: "0 0 0 4px rgba(255,255,255,0.9)",
    }}
  >
    {kind === "minus" ? "–" : "✓"}
  </span>
);

/** Chip com a fonte da citação. */
export const SourceChip: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      border: `2px solid ${colors.line}`,
      background: "white",
      borderRadius: 50,
      padding: "16px 30px",
      fontFamily: fonts.mono,
      fontWeight: 500,
      fontSize: 26,
      color: colors.ink,
    }}
  >
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        background: colors.green,
      }}
    />
    {children}
  </div>
);

/** Divide um texto e destaca o trecho indicado. */
export const QuoteText: React.FC<{
  texto: string;
  destaque: string;
  highlightAt: number;
}> = ({ texto, destaque, highlightAt }) => {
  const i = texto.indexOf(destaque);
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <Highlight start={highlightAt}>{destaque}</Highlight>
      {texto.slice(i + destaque.length)}
    </>
  );
};
