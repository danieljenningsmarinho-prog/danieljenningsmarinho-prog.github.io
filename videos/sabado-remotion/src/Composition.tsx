import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import data from "./words.json";

const inter = "Inter";
const playfair = "Playfair Display";
for (const w of ["400", "600", "800", "900"]) {
  loadFont({ family: inter, url: staticFile(`fonts/inter-${w}.woff2`), weight: w });
}
loadFont({ family: playfair, url: staticFile("fonts/playfair-italic.woff2"), weight: "500", style: "italic" });

const FPS = 30;
const AUDIO_END = 71.9;
const TAIL = 1.6;
export const DURATION = Math.ceil((AUDIO_END + TAIL) * FPS);

const COLORS = {
  bg: "#ffffff",
  ink: "#0f1419",
  muted: "#c9ced3",
  sub: "#536471",
  accent: "#e0662b",
  accentSoft: "#fff1e8",
  line: "#eff3f4",
};

type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (data.words as { text: string; type: string; start: number; end: number }[])
  .filter((w) => w.type === "word")
  .map((w) => ({ text: w.text.replace(/"/g, ""), start: w.start, end: w.end }));

type Scene = {
  id: string;
  from: number; // seconds
  to: number;
  label: string;
  num?: number;
  title?: string;
  reference?: string;
  source?: string;
};

// Scene boundaries follow the narration's own pauses.
const SCENES: Scene[] = [
  { id: "gancho", from: 0, to: 6.4, label: "Você sabia?" },
  { id: "intro", from: 6.4, to: 11.2, label: "Bíblia + Ellen G. White" },
  { id: "b1", from: 11.2, to: 19.6, label: "Benefício", num: 1, title: "Descanso para o corpo e a mente", reference: "Êxodo 20:9-10", source: "Bíblia" },
  { id: "b2", from: 19.6, to: 25.8, label: "Benefício", num: 2, title: "Um presente feito para você", reference: "Marcos 2:27", source: "Bíblia" },
  { id: "b3", from: 25.8, to: 32.5, label: "Benefício", num: 3, title: "Comunhão com Deus", reference: "Isaías 58:13-14", source: "Bíblia" },
  { id: "b4", from: 32.5, to: 40.8, label: "Benefício", num: 4, title: "Sinal de transformação", reference: "O Desejado de Todas as Nações, p. 288", source: "Ellen G. White" },
  { id: "b5", from: 40.8, to: 46.2, label: "Benefício", num: 5, title: "Fortalece a família", reference: "Educação, p. 250", source: "Ellen G. White" },
  { id: "b6", from: 46.2, to: 52.1, label: "Benefício", num: 6, title: "Memória da criação", reference: "Gênesis 2:3", source: "Bíblia" },
  { id: "b7", from: 52.1, to: 58.6, label: "Benefício", num: 7, title: "Esperança", reference: "Isaías 66:23", source: "Bíblia" },
  { id: "convite", from: 58.6, to: 64.7, label: "O convite", reference: "Mateus 11:28" },
  { id: "final", from: 64.7, to: AUDIO_END + TAIL, label: "Neste sábado" },
];

const wordsFor = (s: Scene) => WORDS.filter((w) => w.start >= s.from - 0.05 && w.start < s.to - 0.05);

// ---------- pieces ----------

const Avatar: React.FC<{ size?: number }> = ({ size = 104 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(180deg,#2b2350 0%,#7a3f62 45%,#f08a3c 100%)",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: size * 0.27,
        top: size * 0.5,
        width: size * 0.46,
        height: size * 0.46,
        borderRadius: "50%",
        background: "#ffd27a",
        boxShadow: "0 0 30px #ffd27a",
      }}
    />
  </div>
);

const Header: React.FC<{ source?: string }> = ({ source }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
    <Avatar />
    <div>
      <div style={{ fontWeight: 800, fontSize: 44, color: COLORS.ink, letterSpacing: -0.5 }}>Descanse no Senhor</div>
      <div style={{ fontSize: 36, color: COLORS.sub, marginTop: 2 }}>{source ?? "Bíblia · Ellen G. White"}</div>
    </div>
  </div>
);

// Narrated text: each word turns from gray to black as it is spoken.
const SpokenText: React.FC<{ scene: Scene; size: number; weight?: number; italic?: boolean }> = ({
  scene,
  size,
  weight = 800,
  italic,
}) => {
  const frame = useCurrentFrame();
  const t = scene.from + frame / FPS;
  const words = wordsFor(scene);
  return (
    <div
      style={{
        fontFamily: italic ? playfair : inter,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: italic ? 500 : weight,
        fontSize: size,
        lineHeight: 1.2,
        letterSpacing: italic ? 0 : -1.2,
        display: "flex",
        flexWrap: "wrap",
        columnGap: size * 0.26,
        rowGap: size * 0.06,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(t, [w.start - 0.05, w.start + 0.12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const active = t >= w.start && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              color: p >= 1 ? COLORS.ink : p > 0 ? COLORS.ink : COLORS.muted,
              opacity: 0.35 + 0.65 * p,
              background: active ? COLORS.accentSoft : "transparent",
              boxShadow: active ? `0 0 0 6px ${COLORS.accentSoft}` : "none",
              borderRadius: 10,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Progress: React.FC<{ current?: number }> = ({ current }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 10,
          borderRadius: 5,
          background: current !== undefined && i < current ? COLORS.accent : COLORS.line,
        }}
      />
    ))}
  </div>
);

// Shared entrance for each scene's content.
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 14 });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` };
};

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: COLORS.bg,
      fontFamily: inter,
      padding: "260px 110px 440px 110px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---------- scenes ----------

const HookScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const head = useEnter(0);
  return (
    <Page>
      <div style={head}>
        <Header />
      </div>
      <div style={{ marginTop: 56 }}>
        <SpokenText scene={scene} size={92} weight={900} />
      </div>
    </Page>
  );
};

const IntroScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const head = useEnter(0);
  return (
    <Page>
      <div style={head}>
        <Header />
      </div>
      <div style={{ marginTop: 56 }}>
        <SpokenText scene={scene} size={86} weight={900} />
      </div>
      <div style={{ marginTop: 60, ...useEnter(8) }}>
        <Progress current={0} />
      </div>
    </Page>
  );
};

const BenefitScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const refIn = interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Page>
      <div style={useEnter(0)}>
        <Header source={scene.source} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 50 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 36,
            background: COLORS.accent,
            color: "#fff",
            fontWeight: 900,
            fontSize: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pop}) rotate(${interpolate(pop, [0, 1], [-12, 0])}deg)`,
          }}
        >
          {scene.num}
        </div>
        <div style={{ fontWeight: 700, fontSize: 40, color: COLORS.sub, ...useEnter(4) }}>de 7 benefícios</div>
      </div>
      <div style={{ marginTop: 44 }}>
        <SpokenText scene={scene} size={74} weight={800} />
      </div>
      <div
        style={{
          marginTop: 44,
          alignSelf: "flex-start",
          fontFamily: playfair,
          fontStyle: "italic",
          fontSize: 44,
          color: COLORS.accent,
          borderLeft: `8px solid ${COLORS.accent}`,
          paddingLeft: 24,
          opacity: refIn,
        }}
      >
        {scene.reference}
      </div>
      <div style={{ marginTop: 56 }}>
        <Progress current={scene.num} />
      </div>
    </Page>
  );
};

const InviteScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  return (
    <Page>
      <div style={useEnter(0)}>
        <Header source="Mateus 11:28" />
      </div>
      <div style={{ marginTop: 60 }}>
        <SpokenText scene={scene} size={84} italic />
      </div>
    </Page>
  );
};

const FinalScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ctaStart = (68.1 - scene.from) * fps;
  const cta = spring({ frame: frame - ctaStart, fps, config: { damping: 10, stiffness: 140 } });
  const sun = interpolate(frame, [0, 3 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <Page>
      <div style={useEnter(0)}>
        <Header />
      </div>
      <div style={{ marginTop: 56 }}>
        <SpokenText scene={{ ...scene, to: 68.1 }} size={96} weight={900} />
      </div>
      <div
        style={{
          marginTop: 64,
          alignSelf: "flex-start",
          background: COLORS.ink,
          color: "#fff",
          borderRadius: 999,
          padding: "30px 48px",
          fontWeight: 800,
          fontSize: 50,
          transform: `scale(${cta})`,
          transformOrigin: "left center",
        }}
      >
        Comente <span style={{ color: "#ffb37a" }}>DESCANSO</span>
      </div>
      <div style={{ marginTop: 26, fontSize: 40, color: COLORS.sub, opacity: cta }}>e envie para quem precisa descansar</div>
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: 1500 + (1 - sun) * 300,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle,#ffe3a8 0%,#ffc069 40%,rgba(240,138,60,0.35) 62%,rgba(240,138,60,0) 72%)",
          opacity: sun,
        }}
      />
    </Page>
  );
};

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  if (scene.id === "gancho") return <HookScene scene={scene} />;
  if (scene.id === "intro") return <IntroScene scene={scene} />;
  if (scene.id === "convite") return <InviteScene scene={scene} />;
  if (scene.id === "final") return <FinalScene scene={scene} />;
  return <BenefitScene scene={scene} />;
};

export const Sabado: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {SCENES.map((s) => (
        <Sequence
          key={s.id}
          name={s.id}
          from={Math.round(s.from * FPS)}
          durationInFrames={Math.round(s.to * FPS) - Math.round(s.from * FPS)}
        >
          <SceneView scene={s} />
        </Sequence>
      ))}
      <Audio src={staticFile("narracao.mp3")} />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="BeneficiosDoSabado"
      component={Sabado}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
