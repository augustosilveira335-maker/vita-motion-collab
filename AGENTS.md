# Escopo obrigatório para agentes

Este repositório é exclusivo do motion da VITA.

## Permitido

- Editar arquivos dentro deste repositório.
- Renderizar, revisar e comparar cenas do motion.
- Consultar a interface do aplicativo somente em modo de leitura quando o usuário pedir sincronização visual.

## Proibido

- Fazer commit, push, merge ou abrir PR no repositório do aplicativo real.
- Alterar `src/`, Supabase, configurações, banco ou produção do aplicativo real.
- Adicionar o repositório do aplicativo como remoto, submódulo ou subtree.
- Copiar segredos, `.env`, chaves ou dados reais de clientes.
- Reutilizar V4, V5, V6 ou V7 como camada de vídeo da composição principal.

Se uma tarefa exigir mudança no aplicativo real, pare e solicite autorização explícita separada.

## Colaboração

- Codex: Remotion, animação, ritmo, áudio, legendas e render.
- Claude: auditoria visual e propostas em branch própria.
- Um agente altera uma cena por vez; o outro revisa o diff.
- Nenhuma alteração entra em `main` sem revisão.
