import type {ComponentType} from 'react';
import {Audio} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CaptionsV8} from './CaptionsV8';
import {TimeOrbit, OSFlowScene, StageFlowScene} from './V8CoreScenes';
import {ChaosScene} from './scenes/ChaosScene';
import {DashboardScene} from './scenes/DashboardScene';
import {
  ApprovalScene,
  BudgetScene,
  ClosingScene,
  ExecutionScene,
  HistoryScene,
  ProfilesScene,
  RealtyApprovalScene,
  ReportScene,
} from './scenes/FullFlowScenes';
import {NewTicketScene} from './scenes/NewTicketScene';
import {ProfessionalMatchScene} from './scenes/ProfessionalMatchScene';

export const V8_DURATION_IN_FRAMES = 2607;
const TRANSITION_FRAMES = 12;
const timing = linearTiming({durationInFrames: TRANSITION_FRAMES});
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const HeldScene: React.FC<{component: ComponentType; freezeAt: number}> = ({component: Scene, freezeAt}) => {
  const frame = useCurrentFrame();
  return <Freeze frame={Math.min(frame, freezeAt)}><Scene /></Freeze>;
};

const SceneAudio: React.FC = () => {
  const whooshes = [168, 306, 474, 672, 810, 978, 1206, 1359, 1557, 1725, 1878, 2061, 2244, 2442];
  const clicks = [1100, 1260, 1449, 1659, 1837, 1957];
  return (
    <>
      <Sequence durationInFrames={900}>
        <Audio src={staticFile('v8-bed-01.ogg')} volume={(frame) => interpolate(frame, [0, 24], [0, 1], clamp)} />
      </Sequence>
      <Sequence from={900} durationInFrames={900}>
        <Audio src={staticFile('v8-bed-02.ogg')} />
      </Sequence>
      <Sequence from={1800} durationInFrames={V8_DURATION_IN_FRAMES - 1800}>
        <Audio
          src={staticFile('v8-bed-03.ogg')}
          volume={(frame) => interpolate(frame, [0, V8_DURATION_IN_FRAMES - 1854, V8_DURATION_IN_FRAMES - 1800], [1, 1, 0], clamp)}
        />
      </Sequence>
      {whooshes.map((from) => <Sequence key={`whoosh-${from}`} from={from} durationInFrames={36}><Audio src={staticFile('v8-whoosh.wav')} volume={.2} /></Sequence>)}
      {clicks.map((from) => <Sequence key={`click-${from}`} from={from} durationInFrames={18}><Audio src={staticFile('v8-click.wav')} volume={.36} /></Sequence>)}
      <Sequence from={2520} durationInFrames={60}><Audio src={staticFile('v8-pulse.wav')} volume={.28} /></Sequence>
    </>
  );
};

export const VitaMotionV8: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#06141B'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={204} name="Abertura legível — seis segundos completos"><ChaosScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={126} name="Tempo sob controle"><HeldScene component={TimeOrbit} freezeAt={44} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={180} name="Tudo em uma OS"><HeldScene component={OSFlowScene} freezeAt={64} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={210} name="Etapas do fluxo"><HeldScene component={StageFlowScene} freezeAt={106} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={150} name="Perfil imobiliária"><HeldScene component={ProfilesScene} freezeAt={75} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={180} name="Dashboard real"><HeldScene component={DashboardScene} freezeAt={125} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={240} name="Novo chamado"><HeldScene component={NewTicketScene} freezeAt={145} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={165} name="Profissional certo"><HeldScene component={ProfessionalMatchScene} freezeAt={82} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={210} name="Orçamento no celular"><HeldScene component={BudgetScene} freezeAt={146} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={180} name="Revisão administrativa"><HeldScene component={ApprovalScene} freezeAt={151} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={165} name="Aprovação da imobiliária"><HeldScene component={RealtyApprovalScene} freezeAt={122} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={195} name="Execução e evidências"><HeldScene component={ExecutionScene} freezeAt={151} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={195} name="Relatório final"><HeldScene component={ReportScene} freezeAt={150} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={210} name="Memória do imóvel"><HeldScene component={HistoryScene} freezeAt={95} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={165} name="Encerramento"><HeldScene component={ClosingScene} freezeAt={108} /></TransitionSeries.Sequence>
    </TransitionSeries>
    <SceneAudio />
    <CaptionsV8 />
  </AbsoluteFill>
);
