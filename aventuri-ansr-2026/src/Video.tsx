import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Background, Header, useIsVertical} from './components';
import {C} from './theme';
import {
  Closing, Meeting, Opening, Prospecting, SaturdayNight, Setup, Show1, Show2, Show3, Teardown,
} from './scenes';

export const SCENES: {C: React.FC; d: number; label: string}[] = [
  {C: Opening, d: 150, label: 'Abertura'},
  {C: Setup, d: 270, label: 'Sexta · Montagem'},
  {C: Show1, d: 210, label: 'Sexta · 1ª apresentação'},
  {C: Show2, d: 200, label: 'Sábado · 2ª apresentação'},
  {C: SaturdayNight, d: 180, label: 'Sábado · Noite livre'},
  {C: Prospecting, d: 270, label: 'Sábado · Prospecção'},
  {C: Show3, d: 210, label: 'Domingo · 3ª apresentação'},
  {C: Teardown, d: 190, label: 'Domingo · Desmontagem'},
  {C: Meeting, d: 220, label: 'Segunda · Reunião'},
  {C: Closing, d: 200, label: 'Encerramento'},
];
export const T = 15; // duração da transição

export const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].d - T);
  return acc;
}, []);
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

const GlobalProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const v = useIsVertical();
  const pad = v ? 72 : 80;
  return (
    <div style={{position: 'absolute', left: pad, right: pad, bottom: v ? 70 : 40, display: 'flex', gap: 8}}>
      {SCENES.map((s, i) => {
        const start = STARTS[i];
        const end = i < SCENES.length - 1 ? STARTS[i + 1] : TOTAL;
        const p = Math.min(1, Math.max(0, (frame - start) / (end - start)));
        const active = frame >= start && frame < end;
        return (
          <div key={i} style={{flex: 1, height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 3}}>
            <div style={{height: '100%', width: `${p * 100}%`, borderRadius: 3, background: active ? C.yellow : C.blueLight}} />
          </div>
        );
      })}
    </div>
  );
};

export const AventuriVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        {SCENES.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.d}>
              <s.C />
            </TransitionSeries.Sequence>
            {i < SCENES.length - 1 ? (
              <TransitionSeries.Transition
                presentation={i % 2 === 0 ? slide({direction: 'from-right'}) : fade()}
                timing={linearTiming({durationInFrames: T})}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Header />
      <GlobalProgress />
    </AbsoluteFill>
  );
};
