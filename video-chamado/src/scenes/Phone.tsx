import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Legenda palavra a palavra, com a palavra atual em caixa amarela. */
const WordCaptions: React.FC<{ texto: string; start: number; perWord: number }> = ({
  texto,
  start,
  perWord,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = texto.toUpperCase().split(" ");
  const t = (frame - start * fps) / (perWord * fps);
  const current = Math.floor(t);
  // mostra uma "janela" de 3 palavras por vez
  const windowStart = Math.max(0, Math.floor(current / 3) * 3);
  const visible = words.slice(windowStart, windowStart + 3);
  if (t < 0) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        fontFamily: fonts.sans,
        fontWeight: 800,
        fontSize: 54,
        letterSpacing: -1,
        color: "white",
        textShadow: "0 3px 0 rgba(0,0,0,0.6)",
      }}
    >
      {visible.map((w, i) => {
        const idx = windowStart + i;
        const active = idx === Math.min(current, words.length - 1);
        return (
          <span
            key={idx}
            style={{
              padding: "2px 10px",
              background: active ? colors.amber : "transparent",
              color: active ? colors.ink : "white",
              textShadow: active ? "none" : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const SideCard: React.FC<{ side: "left" | "right"; bg: string; children?: React.ReactNode }> = ({
  side,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: 520,
        [left ? "left" : "right"]: -260,
        width: 440,
        height: 640,
        borderRadius: 50,
        border: "14px solid #EDEDED",
        background: bg,
        boxShadow: "0 40px 70px rgba(0,0,0,0.2)",
        filter: "blur(3px)",
        overflow: "hidden",
        rotate: left ? "-38deg" : "38deg",
        translate: interpolate(
          frame,
          [0, 0.9 * fps],
          [left ? "-300px 0px" : "300px 0px", "0px 0px"],
          { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
        ),
      }}
    >
      {children}
    </div>
  );
};

/** Gráfico de "pirulitos" que sobe (pessoas alcançadas). */
const Lollipops: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const values = [0.35, 0.55, 0.45, 0.8, 0.65, 1];
  return (
    <div style={{ position: "absolute", left: 250, right: 250, top: 1350 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 260 }}>
        {values.map((v, i) => {
          const s = (1.5 + i * 0.15) * fps;
          const h = interpolate(frame, [s, s + 0.8 * fps], [0, v * 220], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
          });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  border: `8px solid ${i === values.length - 1 ? colors.purple : "#9A9A9A"}`,
                  boxSizing: "border-box",
                  background: "white",
                }}
              />
              <div style={{ width: 8, height: h, background: i === values.length - 1 ? colors.purple : "#9A9A9A" }} />
            </div>
          );
        })}
      </div>
      <div style={{ height: 6, background: "#7A7A7A", borderRadius: 3 }} />
      <div
        style={{
          marginTop: 22,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 24,
          letterSpacing: 4,
          color: colors.muted,
          opacity: interpolate(frame, [2.4 * fps, 2.9 * fps], [0, 1], clamp),
        }}
      >
        UM LIVRO · UM LAR · UMA VIDA
      </div>
    </div>
  );
};

export const PhoneScene: React.FC<{ texto: string; fonte: string }> = ({ texto, fonte }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 45%, #FFFFFF, #DCDCDC 80%)",
      }}
    >
      <SideCard side="left" bg="linear-gradient(160deg,#1A1A1A,#444)" />
      <SideCard side="right" bg="linear-gradient(160deg,#E3F2DA,#9CCB8A)">
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 30,
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 72,
            color: colors.ink,
            rotate: "-38deg",
          }}
        >
          +1 lar
        </div>
      </SideCard>
      {/* Cartão central (formato de celular) */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 260,
          width: 500,
          height: 800,
          borderRadius: 60,
          border: "16px solid #F2F2F2",
          boxShadow: "0 50px 90px rgba(0,0,0,0.25)",
          overflow: "hidden",
          background: `linear-gradient(170deg, #3B2A6B 0%, ${colors.purple} 55%, #E39A3B 130%)`,
          scale: interpolate(frame, [0, 0.8 * fps], [0.8, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 14 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 36,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 26,
            lineHeight: 1.2,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Ellen G. White
          <br />
          Sobre a colportagem
        </div>
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            width: 86,
            height: 34,
            borderRadius: 17,
            background: "#1A1A1A",
          }}
        />
        {/* Livro aberto estilizado */}
        <svg
          width={320}
          height={220}
          viewBox="0 0 160 110"
          style={{ position: "absolute", left: 74, top: 190 }}
        >
          <path d="M80 20 C60 8 30 6 8 12 L8 96 C30 90 60 92 80 104 Z" fill="#FFF8EC" />
          <path d="M80 20 C100 8 130 6 152 12 L152 96 C130 90 100 92 80 104 Z" fill="#FFFFFF" />
          {[30, 42, 54, 66, 78].map((y) => (
            <g key={y} stroke="#C9BFAE" strokeWidth="2">
              <line x1="20" y1={y} x2="70" y2={y + 4} />
              <line x1="90" y1={y + 4} x2="140" y2={y} />
            </g>
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 70,
          }}
        >
          <WordCaptions texto={texto} start={0.6} perWord={0.32} />
        </div>
      </div>
      <Lollipops />
      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 24,
          color: colors.muted,
          opacity: interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], clamp),
        }}
      >
        {fonte}
      </div>
    </AbsoluteFill>
  );
};
