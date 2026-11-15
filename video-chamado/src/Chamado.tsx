import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { CtaScene, HookScene } from "./scenes/Cards";
import { IntroScene, QuoteScene, TimelineStrip } from "./scenes/Editorial";
import { PhoneScene } from "./scenes/Phone";
import { textos } from "./theme";

export const TRANSITION_FRAMES = 12;

export const Chamado: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: TRANSITION_FRAMES });
  return (
    <TransitionSeries name="Cenas">
      <TransitionSeries.Sequence name="Gancho" durationInFrames={3.5 * fps}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence name="Chamado" durationInFrames={4.5 * fps}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t} />
      <TransitionSeries.Sequence name="Citação 1" durationInFrames={6 * fps}>
        <QuoteScene
          index={2}
          kicker="A obra mais importante"
          texto={textos.citacao1.texto}
          destaque={textos.citacao1.destaque}
          fonte={textos.citacao1.fonte}
          footer="LIVROS QUE ABREM A BÍBLIA"
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence name="Citação 2" durationInFrames={6 * fps}>
        <PhoneScene texto={textos.citacao2.texto} fonte={textos.citacao2.fonte} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t} />
      <TransitionSeries.Sequence name="Citação 3" durationInFrames={6 * fps}>
        <QuoteScene
          index={4}
          kicker="O chamado é para você"
          texto={textos.citacao3.texto}
          destaque={textos.citacao3.destaque}
          fonte={textos.citacao3.fonte}
          footer="DE TODAS AS IGREJAS"
        >
          <TimelineStrip labels={["HOJE", "AMANHÃ", "ESTE ANO", "SEMPRE"]} />
        </QuoteScene>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence name="Convite" durationInFrames={5 * fps}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
