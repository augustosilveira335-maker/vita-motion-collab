# VITA Motion — projeto independente

Este repositório contém exclusivamente o motion demonstrativo da VITA.

Ele não é o aplicativo do cliente, não é uma branch do aplicativo e não deve receber arquivos do sistema de produção.

## Estrutura

- `remotion/`: versão V8 nativa, renderizável e editável.
- `claude-reference/`: exportação visual do Claude/Fable usada para comparação e aproveitamento de direção, câmera e composição.
- `docs/`: regras de segurança, colaboração e mapa das fontes.

## Começar pela V8

```bash
cd remotion
npm ci
npm run dev
```

Composição principal: `Vita-Motion-V8-Nativo` — 1920x1080, 30 fps, 87 segundos.

## Regra absoluta

Nunca adicionar como remoto, submódulo ou pasta deste projeto o repositório do aplicativo real. A interface do app pode ser consultada somente em modo de leitura para atualizar referências visuais.
