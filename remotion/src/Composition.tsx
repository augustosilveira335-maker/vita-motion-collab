import {Composition, Folder} from 'remotion';
import {OSFlowScene, StageFlowScene, TimeOrbit} from './V8CoreScenes';
import {V8_DURATION_IN_FRAMES, VitaMotionV8} from './VitaMotionV8';
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

const scene = {fps: 30, width: 1920, height: 1080};

export const MyComposition: React.FC = () => (
  <>
    <Composition
      id="Vita-Motion-V8-Nativo"
      component={VitaMotionV8}
      durationInFrames={V8_DURATION_IN_FRAMES}
      {...scene}
    />
    <Folder name="Cenas-V8-editaveis">
      <Composition id="01-Abertura" component={ChaosScene} durationInFrames={204} {...scene} />
      <Composition id="02-Tempo" component={TimeOrbit} durationInFrames={150} {...scene} />
      <Composition id="03-OS-unica" component={OSFlowScene} durationInFrames={180} {...scene} />
      <Composition id="04-Etapas" component={StageFlowScene} durationInFrames={210} {...scene} />
      <Composition id="05-Perfis" component={ProfilesScene} durationInFrames={150} {...scene} />
      <Composition id="06-Dashboard" component={DashboardScene} durationInFrames={180} {...scene} />
      <Composition id="07-Novo-Chamado" component={NewTicketScene} durationInFrames={240} {...scene} />
      <Composition id="08-Profissional" component={ProfessionalMatchScene} durationInFrames={165} {...scene} />
      <Composition id="09-Orcamento" component={BudgetScene} durationInFrames={210} {...scene} />
      <Composition id="10-Revisao" component={ApprovalScene} durationInFrames={180} {...scene} />
      <Composition id="11-Aprovacao" component={RealtyApprovalScene} durationInFrames={165} {...scene} />
      <Composition id="12-Execucao" component={ExecutionScene} durationInFrames={195} {...scene} />
      <Composition id="13-Relatorio" component={ReportScene} durationInFrames={195} {...scene} />
      <Composition id="14-Historico" component={HistoryScene} durationInFrames={210} {...scene} />
      <Composition id="15-Fechamento" component={ClosingScene} durationInFrames={165} {...scene} />
    </Folder>
  </>
);
