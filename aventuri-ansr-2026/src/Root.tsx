import React from 'react';
import {Composition} from 'remotion';
import {AventuriVideo, TOTAL} from './Video';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AventuriVertical" component={AventuriVideo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="AventuriHorizontal" component={AventuriVideo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
  </>
);
