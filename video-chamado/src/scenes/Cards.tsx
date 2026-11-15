import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Badge, CaptionPill } from "../components";
import { colors, fonts } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Tile = { icon: string; label: string };

const GlassCard: React.FC<{
  title: string;
  badge: "minus" | "check";
  bg: string;
  tiles: Tile[];
  delay: number;
  rotate: number;
  offset: [number, number];
  tileBg: string;
}> = ({ title, badge, bg, tiles, delay, rotate, offset, tileBg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = delay * fps;
  const float = Math.sin((frame + delay * 40) / 22) * 8;
  return (
    <div
      style={{
        position: "absolute",
        width: 760,
        height: 400,
        left: 540 - 380 + offset[0],
        top: offset[1],
        borderRadius: 48,
        background: bg,
        boxShadow:
          "0 50px 80px rgba(0,0,0,0.22), inset 0 2px 0 rgba(255,255,255,0.25)",
        padding: "56px 60px",
        boxSizing: "border-box",
        opacity: interpolate(frame, [s, s + 0.4 * fps], [0, 1], clamp),
        rotate: `${rotate}deg`,
        translate: interpolate(
          frame,
          [s, s + 0.9 * fps],
          [`0px ${300 + float}px`, `0px ${float}px`],
          { ...clamp, easing: Easing.spring({ damping: 14 }) },
        ),
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 62,
          color: "white",
          letterSpacing: -1.5,
        }}
      >
        {title}
        <Badge kind={badge} />
      </div>
      <div style={{ display: "flex", gap: 34, marginTop: 56 }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 26,
                background: tileBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
                boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25)",
              }}
            >
              {t.icon}
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: 28,
                color: "rgba(255,255,255,0.9)",
                marginTop: 14,
              }}
            >
              {t.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Livro 3D simples, desenhado com CSS (substitui o porquinho do modelo). */
const Book: React.FC<{ delay: number; title: string; color: string }> = ({
  delay,
  title,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = delay * fps;
  return (
    <div
      style={{
        position: "absolute",
        right: 110,
        top: 780,
        width: 260,
        height: 340,
        borderRadius: "10px 22px 22px 10px",
        background: `linear-gradient(135deg, ${color}, #3B2A6B)`,
        boxShadow:
          "inset 18px 0 0 rgba(0,0,0,0.25), 0 40px 60px rgba(0,0,0,0.3)",
        padding: "40px 30px 30px 50px",
        boxSizing: "border-box",
        fontFamily: fonts.serif,
        color: "white",
        fontSize: 42,
        lineHeight: 1.05,
        opacity: interpolate(frame, [s, s + 0.3 * fps], [0, 1], clamp),
        rotate: interpolate(frame, [s, s + 0.9 * fps], ["-30deg", "8deg"], {
          ...clamp,
          easing: Easing.spring({ damping: 10 }),
        }),
        scale: interpolate(frame, [s, s + 0.9 * fps], [0.4, 1], {
          ...clamp,
          easing: Easing.spring({ damping: 10 }),
          output: "perceptual-scale",
        }),
      }}
    >
      {title}
      <div
        style={{
          marginTop: 30,
          width: 60,
          height: 4,
          background: colors.amber,
        }}
      />
    </div>
  );
};

export const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 40%, #FFFFFF, ${colors.paper} 70%)`,
    }}
  >
    <GlassCard
      title="Fica pra depois"
      badge="minus"
      bg="linear-gradient(160deg, #4A4A4F, #2A2A2E)"
      tileBg="rgba(255,255,255,0.12)"
      tiles={[
        { icon: "⏳", label: "Tempo" },
        { icon: "😟", label: "Medo" },
        { icon: "❔", label: "Dúvida" },
      ]}
      delay={0.1}
      rotate={-5}
      offset={[-30, 520]}
    />
    <GlassCard
      title="Só a rotina"
      badge="minus"
      bg={`linear-gradient(160deg, #B5835C, ${colors.brown})`}
      tileBg="rgba(255,255,255,0.18)"
      tiles={[
        { icon: "💼", label: "Trabalho" },
        { icon: "📱", label: "Celular" },
        { icon: "🛋️", label: "Sofá" },
      ]}
      delay={0.4}
      rotate={-3}
      offset={[20, 910]}
    />
    <Book delay={0.9} title="A verdade em suas mãos" color={colors.purple} />
    <AbsoluteFill
      style={{ justifyContent: "flex-end", paddingBottom: 380 }}
    >
      <CaptionPill delay={1.3}>
        Sempre há uma <span style={{ color: colors.amber }}>desculpa</span>.
      </CaptionPill>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const CtaScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 40%, #FFFFFF, ${colors.paper} 70%)`,
    }}
  >
    <GlassCard
      title="Chamado aceito"
      badge="check"
      bg={`linear-gradient(160deg, #8C7FF5, ${colors.purple})`}
      tileBg="rgba(255,255,255,0.18)"
      tiles={[
        { icon: "🙏", label: "Oração" },
        { icon: "📖", label: "Preparo" },
        { icon: "🚪", label: "Portas" },
      ]}
      delay={0.1}
      rotate={-4}
      offset={[-20, 360]}
    />
    <GlassCard
      title="Vidas alcançadas"
      badge="check"
      bg={`linear-gradient(160deg, #3FA571, ${colors.green})`}
      tileBg="rgba(255,255,255,0.18)"
      tiles={[
        { icon: "🏠", label: "Lares" },
        { icon: "📚", label: "Livros" },
        { icon: "✝️", label: "Fé" },
      ]}
      delay={0.4}
      rotate={-2}
      offset={[20, 750]}
    />
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 300,
        gap: 40,
      }}
    >
      <CaptionPill delay={1.1}>
        Responda: <span style={{ color: colors.amber }}>“Eis-me aqui.”</span>
      </CaptionPill>
      <CtaText />
    </AbsoluteFill>
  </AbsoluteFill>
);

const CtaText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        textAlign: "center",
        opacity: interpolate(frame, [1.8 * fps, 2.3 * fps], [0, 1], clamp),
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: 4,
          color: colors.muted,
        }}
      >
        ISAÍAS 6:8
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: -3,
          color: colors.ink,
          marginTop: 24,
          lineHeight: 1.05,
        }}
      >
        Seja colportor
        <br />
        evangelista.
      </div>
    </div>
  );
};
