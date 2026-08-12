# Publicação segura no GitHub

Crie um repositório novo, privado e vazio chamado `vita-motion-collab`.

Não use “Import repository”, não selecione o repositório do aplicativo e não crie o novo projeto como branch dele.

Depois, conecte este diretório somente ao repositório novo:

```bash
git remote add origin https://github.com/SEU-USUARIO/vita-motion-collab.git
git push -u origin main
```

Confirme antes do primeiro push:

```bash
git remote -v
```

O único endereço permitido deve terminar em `/vita-motion-collab.git`. Se aparecer o nome do repositório do aplicativo, pare e remova o remoto errado antes de qualquer push.

## Claude e Codex

- Claude abre o repositório novo e trabalha em `claude/<tema>`.
- Codex abre o mesmo repositório novo e trabalha em `codex/<tema>`.
- Ambos abrem PR para a `main` deste projeto de motion.
