reference-only-source: aplicativo VITA
reference-branch-at-export: main
write-access: forbidden

> Este mapa registra de onde vieram as referências visuais. Ele não configura remoto, submódulo ou integração com o aplicativo real.

## Last sync
date: 2026-08-12T03:02:26Z

### Updated in this project
- Verificação de sync em 12/08/2026: `main` sem alterações — todos os arquivos do mapa de telas com o mesmo conteúdo da leitura anterior
- Dados de cena e marca alinhados ao projeto V6 do cliente (Rua das Flores 182, Carolina Martins, Rafael Costa, Imobiliária Horizonte, tile teal + chave inglesa) — decisão editorial do usuário, não do repo
- Vídeo walkthrough de 36s (16:9) do ciclo completo da OS, com UI recriada a partir do código real
- Paleta, tipografia (Inter + Plus Jakarta Sans) e status/urgência lidos de `src/index.css` e `src/types/serviceOrder.ts`
- Sidebar, OSCard e timeline de 5 etapas reproduzidos a partir dos componentes do repo
- Dados de exemplo em Canoas/RS (OS-2026-0412), fictícios
- Marca real importada do repo: src/assets/logo-faztudo.png e public/icon-512.png

## Screen map
| Cena do vídeo | Arquivos do repo |
| --- | --- |
| Chrome + sidebar (todas as cenas) | src/components/layout/Sidebar.tsx, src/components/layout/DashboardLayout.tsx, src/index.css, tailwind.config.ts, src/assets/logo-faztudo.png |
| Cena 2 · Novo Chamado (desktop) | src/pages/NovoChamado.tsx (seções Imóvel/Problema/Solicitante, labels e botão), src/App.tsx (rotas) |
| Cena 3 · Orçamento (celular/PWA) | src/components/os-detail/OSActionSections.tsx (Enviar Orçamento), src/types/serviceOrder.ts (STATUS_LABELS) |
| Cena 4 · Aprovar Orçamentos (desktop) | src/pages/AprovarOrcamentos.tsx, src/components/os-detail/OSActionSections.tsx, src/lib/currencyBRL.ts |
| Cena 5 · Execução (celular/PWA) | src/components/CompletionReportForm.tsx (checklist padrão, botão) |
| Cena Histórico · Histórico por Imóvel | src/pages/HistoricoImoveis.tsx, src/hooks/useProperties.ts |
| Cena 6 · OS concluída + Relatório PDF | src/components/OSCard.tsx, src/components/reports/FinalReportDocument.tsx (modelo oficial do relatório) |
