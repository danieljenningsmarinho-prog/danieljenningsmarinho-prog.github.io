import React from "react";
import { Composition } from "remotion";
import { Chamado } from "./Chamado";

// 31s de cenas − 5 transições de 12 frames = 870 frames
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Chamado"
      component={Chamado}
      durationInFrames={870}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
