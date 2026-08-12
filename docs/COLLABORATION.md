# Fluxo de colaboração

## Branches

- `main`: estado aprovado do projeto de motion.
- `codex/<tema>`: implementação Remotion, áudio e render.
- `claude/<tema>`: auditoria e propostas visuais.

## Processo

1. Atualizar a branch a partir de `main`.
2. Alterar apenas uma cena ou conjunto claramente delimitado.
3. Rodar lint e uma prévia da cena afetada.
4. Abrir PR com quadro antes/depois e lista de arquivos.
5. O outro agente revisa antes do merge.

## Sincronização com o aplicativo

“Sincronizar” significa apenas ler a interface atual e atualizar a reprodução visual dentro deste repositório. Não significa escrever no aplicativo nem conectar os históricos Git.
