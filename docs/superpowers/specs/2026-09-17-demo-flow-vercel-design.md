---
title: Fluxo de demo por vaga, deploy na Vercel
date: 2026-09-17
status: aprovado (2026-09-17)
owner: Gustavo Nóbrega
---

# Fluxo de demo por vaga, deploy na Vercel

## Contexto

Gustavo aplica para vagas fixed-price no Upwork anexando um demo funcional, deployado e
feito sob medida para o negócio do cliente. Uma outra pessoa cuida de achar as vagas e
escrever as propostas. Este repo cobre uma coisa só: transformar uma vaga colada em um
demo no ar, em menos de 30 minutos de relógio, duas a três vezes por dia.

O que existia antes deste spec e o que acontece com cada parte:

| Peça | Estado em 2026-09-17 | Decisão |
|---|---|---|
| `mvp-archetypes` (kernel + 3 arquétipos, `RESKIN.md`) | funciona, marketplace com typecheck quebrado, nunca deployado na Vercel | é a base. Consertar e usar |
| `mvp-funnel` (radar Apify + Telegram) | não deployado, travado em Apify pago | fora de escopo. Não haverá pipeline automático |
| Pipeline de deploy no VPS `kitevps` (Caddy router + `demo-deploy`) | funciona por HTTP, sem TLS, 380MB de RAM livre | abandonado. Fica no ar até alguém derrubar |
| Skill `manha` | depende do radar e do VPS | apagada, substituída pela skill `demo` |
| `cavalo-selado` | virou o projeto de burnout do Lucas | não é template. Não nasce `cavalo-selado-nextjs` |

### Por que não criar cada demo do zero

80% de um demo é encanamento sem domínio: shell, sidebar, tabela com filtros, formulário,
modal, toast, roles. Do zero, o agente regenera isso a cada vaga, com bugs diferentes e cara
diferente, em uma a duas horas. Com a base, o agente gasta os 20 minutos inteiros no que
converte: seed e roles no vocabulário do cliente. E só existe revisão rápida porque existe uma
fronteira fixa (`packages/kernel` intocável, domínio livre).

### Por que não a base "real" com auth e banco

O que o cliente abre no link é um demo com dados fake e gate de roles, sem login. Auth e
persistência não aumentam a conversão da proposta e transformam cada demo em infra viva. Uma
base real com auth + banco entra quando um cliente fechar, compartilhando o kernel de UI, e o
`src/lib` do demo migra por cópia. Não faz parte deste spec.

## O que é um arquétipo

Não são três templates separados. É um workspace com um `packages/kernel` (primitives do
shadcn copiados do `nova-v2`, sidebar, gate de roles, DataTable, dialogs, drawers, toasts,
tema) e três apps finos em cima. Cada app tem só o que é próprio dele:

```
apps/<arquetipo>/src/lib/domain.ts        entidades + seed
apps/<arquetipo>/src/lib/demo-config.ts   org, roles com pitch, navegação por role
apps/<arquetipo>/src/app/brand.css        cor do cliente, único arquivo com hex no app
apps/<arquetipo>/src/features/            5 a 7 telas específicas do arquétipo
```

Os três são pontos de partida, não categorias rígidas:

| Arquétipo | Ponto de partida para |
|---|---|
| `console` | operação interna, staff, substitui planilha |
| `saas` | cliente se serve e paga plano |
| `marketplace` | dois lados que nunca compartilham tela, dinheiro e disponibilidade |

Vaga que não cabe em nenhum parte do mais próximo e o agente escreve as telas que faltam em
`features/`. Um quarto arquétipo só nasce quando o mesmo formato se repetir três vezes.

## Repo

Mudanças em `~/Programming/mvp-archetypes`, todas em `main`:

- Consertar o typecheck de `apps/marketplace`.
- Script `typecheck` no `package.json` da raiz que roda `tsc --noEmit` nos três apps.
- `.vercel/` no `.gitignore` da raiz.
- `deploy/vercel.console.json`, `deploy/vercel.saas.json`, `deploy/vercel.marketplace.json`.
- `scripts/deploy-demo.sh`.
- `CLAUDE.md` reescrito: sem radar, funil, Telegram ou VPS. Descreve o kernel, os arquétipos e
  como nasce um demo. Seção "State" atualizada.
- `RESKIN.md` mantido inteiro. Só a seção "Branch and naming" passa a descrever o worktree e o
  deploy na Vercel.

## Como nasce um demo

Entrada: o texto da vaga (colado, ou URL que o agente busca) e o arquétipo. Se Gustavo não
disser o arquétipo, a skill sugere um com uma frase de justificativa e espera confirmação.

1. **Worktree.** A partir de `main`:
   ```bash
   cd ~/Programming/mvp-archetypes
   git worktree add ../demos/<slug> -b demo/<slug>
   ```
   O slug é o negócio do cliente em kebab-case (`brightsmile-dental`), nunca o número da vaga.
2. **Agente.** Um agente por demo, permissões liberadas porque o worktree é descartável.
   Recebe no prompt: o texto integral da vaga, o caminho do `RESKIN.md` como contrato, o
   arquétipo e o caminho do worktree que ele possui e não pode sair. Reescreve L1 a L3 sempre
   (copy e marca, schema, seed), L4 só se a vaga descreve algo que o arquétipo não faz.
   Zero comentários no código, conforme as regras globais.
3. **Verificação pelo agente.** `bunx tsc --noEmit` no app e `bun run build` limpos. Commit no
   branch `demo/<slug>`. Nunca push.
4. **Deploy.** `scripts/deploy-demo.sh <arquetipo> <slug>` (seção abaixo). O agente reporta a
   URL.
5. **Relatório do agente.** URL, uma linha do que o demo mostra, e um opener de até 200
   caracteres para a pessoa das propostas usar se quiser. O agente acabou de ler a vaga e
   construir a coisa, é o momento mais barato de escrever esse opener.
6. **Revisão antes de entregar.** A sessão principal lê o relatório e o `git diff` e rejeita
   (redispatch no mesmo worktree) quando:
   - o seed é genérico ("Client 1, Service A")
   - o seed é limpo demais (sem registros vencidos, faltando, atrasados)
   - roles genéricos (`Admin / User`) em vez do vocabulário do cliente
   - todas as roles veem a mesma fatia de dados
   - `git diff main..demo/<slug>` toca `packages/kernel`
   - typecheck ou build sujos

Várias vagas no mesmo dia são vários worktrees e vários agentes em paralelo, despachados numa
única mensagem. A sessão principal só coordena e revisa, nunca faz reskin.

O worktree fica até Gustavo apagar (`git worktree remove ../demos/<slug>`). O branch
`demo/<slug>` fica como registro local de que estado do kernel gerou aquele demo.

## Deploy na Vercel

Um projeto Vercel por demo, no team `gustavo-nobregas-projects`, nome `demo-<slug>`, URL
`demo-<slug>.vercel.app`. Sem domínio próprio: `*.demos.robinzip.app` aponta para o VPS e
trocar isso não muda a conversão.

`scripts/deploy-demo.sh <arquetipo> <slug>`, rodado da raiz do worktree:

```bash
vercel project add demo-<slug>
vercel link --yes --project demo-<slug>
vercel deploy --prod --yes -A deploy/vercel.<arquetipo>.json
```

Cada `deploy/vercel.<arquetipo>.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "cd apps/<arquetipo> && bun run build",
  "outputDirectory": "apps/<arquetipo>/.next"
}
```

É o padrão que já funciona no `cavalo-selado` com bun workspaces. Sem env vars, sem banco.
Se `-A` não for respeitado para `buildCommand`, o fallback é o script copiar o arquivo para
`vercel.json` na raiz do worktree antes do deploy, e o `vercel.json` ir no commit do branch.

O script falha alto em qualquer passo e imprime a URL final na última linha, para o agente
copiar sem interpretar. Se `vercel project add` falhar porque o projeto já existe, o script
segue para o `link` (redeploy do mesmo demo é o caso normal depois de uma rejeição).

Decisão pendente de Gustavo, sem efeito no fluxo: o plano Hobby proíbe uso comercial. Pro é
US$20/mês e nada muda no script.

## Skill `demo`

`~/.claude/skills/demo/SKILL.md` substitui `manha`. Gatilhos: "demo", "cria um demo pra essa
vaga", vaga colada com ou sem arquétipo.

Conteúdo: o passo a passo da seção "Como nasce um demo", o prompt que o agente recebe, os
critérios de rejeição, e o formato do relatório final para Gustavo (URL, uma linha, opener).
Ela aponta para o `RESKIN.md` em vez de repetir as regras dele.

Regras que não dobram, herdadas de `manha`:

- Gustavo ou a pessoa das propostas envia toda aplicação à mão. Nada automatiza contra uma
  conta Upwork logada.
- Dados fake apenas. Nunca dado pessoal real, logo real ou marca do cliente em página
  indexável. A linha "concept prototype, not affiliated" fica no rodapé do gate.
- Nunca push para o GitHub a partir de um worktree de demo.

## Teste de aceite

Um demo real de ponta a ponta, com uma vaga que a pessoa das propostas passar, no ar em
`demo-<slug>.vercel.app` em menos de 30 minutos de relógio, aprovado pelos critérios de
rejeição. Enquanto isso não acontecer, o plano não está entregue.

## Fora de escopo

- Radar, Telegram, Apify, qualquer detecção automática de vaga.
- Derrubar `mvp-demo-tavo` e o router no `kitevps` (devolve ~80MB, pode ser feito quando
  quiser).
- Domínio próprio para os demos.
- Prune automático de projetos Vercel antigos.
- Base "real" com auth + banco para cliente fechado.
- Quarto arquétipo.
