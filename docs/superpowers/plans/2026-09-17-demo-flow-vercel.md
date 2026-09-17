# Fluxo de demo por vaga (Vercel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar `mvp-archetypes` pronto para transformar uma vaga colada em um demo no ar em `demo-<slug>.vercel.app`, operado por uma skill `demo`.

**Architecture:** Nada muda no kernel nem nos arquétipos. O trabalho é higiene do repo (typecheck verde nos 3 apps), um script de deploy que cria/linka um projeto Vercel por demo e sobe o app certo do workspace, docs reescritas sem radar/VPS, e a skill que orquestra worktree + agente + deploy + revisão.

**Tech Stack:** Bun workspaces, Next.js 16, Vercel CLI 50.x, bash, jq.

**Spec:** `docs/superpowers/specs/2026-09-17-demo-flow-vercel-design.md`

## Global Constraints

- Nunca editar `packages/kernel`.
- Nunca `git push`. O repo não tem remote e continua sem.
- Team Vercel: `gustavo-nobregas-projects`. Projeto: `demo-<slug>`.
- Slug em kebab-case, nome do negócio do cliente.
- Worktrees de demo em `~/Programming/demos/<slug>`, branch `demo/<slug>`.
- Zero comentários em código novo (regra global do Gustavo). Sem travessões em texto.
- Commits convencionais, mensagem foca no porquê.

---

### Task 1: Typecheck verde nos três apps

**Files:**
- Modify: `.gitignore`
- Modify: `package.json`
- Delete (do índice): `apps/console/tsconfig.tsbuildinfo`, `apps/saas/tsconfig.tsbuildinfo`, `apps/marketplace/tsconfig.tsbuildinfo`, `apps/console/bun.lock`

**Interfaces:**
- Produces: `bun run typecheck` na raiz, sai 0 quando os três apps estão limpos. Tasks 2 e 4 dependem dele.

O erro do marketplace não é código: `apps/marketplace/.next/dev/types/routes.d.ts` gerado pelo dev server está corrompido, e o `tsconfig` inclui `.next/dev/types`. `tsconfig.tsbuildinfo` e um `bun.lock` aninhado estão versionados por engano.

- [ ] **Step 1: Confirmar a falha**

Run: `cd apps/marketplace && bunx tsc --noEmit`
Expected: FAIL com `TS1435` e `TS1128` em `.next/dev/types/routes.d.ts`.

- [ ] **Step 2: Adicionar o script da raiz**

`package.json`:

```json
{
  "name": "mvp-archetypes",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "typecheck": "bun run --filter './apps/*' typecheck"
  }
}
```

`apps/console` e `apps/marketplace` precisam ter `"typecheck": "tsc --noEmit"` em `scripts`, igual ao saas. Adicionar onde faltar.

- [ ] **Step 3: Rodar e ver falhar só no marketplace**

Run: `bun run typecheck`
Expected: console e saas ok, marketplace FAIL com o mesmo erro do Step 1.

- [ ] **Step 4: Apagar o artefato corrompido**

Run: `rm -rf apps/marketplace/.next`

- [ ] **Step 5: Rodar de novo**

Run: `bun run typecheck`
Expected: exit 0 nos três.

- [ ] **Step 6: Ignorar e desversionar artefatos**

Acrescentar ao `.gitignore`:

```
.vercel/
*.tsbuildinfo
```

Run:

```bash
git rm --cached apps/*/tsconfig.tsbuildinfo
git rm apps/console/bun.lock
```

- [ ] **Step 7: Build dos três**

Run: `for a in console saas marketplace; do (cd apps/$a && bun run build) || break; done`
Expected: três builds concluídos sem erro.

- [ ] **Step 8: Commit**

```bash
git add .gitignore package.json apps/console/package.json apps/marketplace/package.json
git commit -m "chore: typecheck unico na raiz e artefatos de build fora do git"
```

---

### Task 2: Script de deploy e smoke na Vercel

**Files:**
- Create: `deploy/vercel.console.json`, `deploy/vercel.saas.json`, `deploy/vercel.marketplace.json`
- Create: `scripts/deploy-demo.sh`

**Interfaces:**
- Consumes: `bun run typecheck` (Task 1).
- Produces: `scripts/deploy-demo.sh <console|saas|marketplace> <slug>`, rodado de qualquer lugar dentro de um worktree. Última linha do stdout é a URL pública `https://...vercel.app`, já verificada com HTTP 200. Exit != 0 em qualquer falha. A skill (Task 4) depende exatamente disso.

- [ ] **Step 1: Configs por arquétipo**

`deploy/vercel.saas.json` (console e marketplace idênticos, trocando o nome do app nas duas linhas):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "cd apps/saas && bun run build",
  "outputDirectory": "apps/saas/.next"
}
```

- [ ] **Step 2: Script**

`scripts/deploy-demo.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() { echo "usage: scripts/deploy-demo.sh <console|saas|marketplace> <slug>" >&2; exit 1; }

[ $# -eq 2 ] || usage
archetype=$1
slug=$2
case "$archetype" in console|saas|marketplace) ;; *) usage ;; esac
[[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "slug must be kebab-case: $slug" >&2; exit 1; }

cd "$(git rev-parse --show-toplevel)"

scope=gustavo-nobregas-projects
project="demo-$slug"
config="deploy/vercel.$archetype.json"

if ! vercel project inspect "$project" --scope "$scope" >/dev/null 2>&1; then
  vercel project add "$project" --scope "$scope" >&2
fi
vercel link --yes --project "$project" --scope "$scope" >&2

deployment=$(vercel deploy --prod --yes --scope "$scope" -A "$config" | tail -1)
url=$(vercel inspect "$deployment" --scope "$scope" --format json | jq -r '.aliases[0] // empty')
[ -n "$url" ] || { echo "no production alias for $deployment" >&2; exit 1; }
url="https://${url#https://}"

status=$(curl -s -o /dev/null -w '%{http_code}' "$url")
[ "$status" = 200 ] || { echo "$url answered $status" >&2; exit 1; }
echo "$url"
```

Run: `chmod +x scripts/deploy-demo.sh`

O formato JSON de `vercel inspect` precisa ser confirmado no Step 4. Se a chave dos aliases for outra, ajustar o filtro do `jq` para a que existir.

- [ ] **Step 3: Validação de argumentos**

Run: `scripts/deploy-demo.sh foo bar; echo "exit $?"`
Expected: `usage: ...` e `exit 1`.

Run: `scripts/deploy-demo.sh saas Bad_Slug; echo "exit $?"`
Expected: `slug must be kebab-case: Bad_Slug` e `exit 1`.

- [ ] **Step 4: Commit antes do smoke**

O worktree de smoke nasce de `main`, então script e configs precisam estar commitados.

```bash
git add deploy/vercel.*.json scripts/deploy-demo.sh
git commit -m "feat: deploy de demo como projeto proprio na Vercel"
```

- [ ] **Step 5: Smoke em worktree descartável**

```bash
git worktree add ~/Programming/demos/smoke-saas -b demo/smoke-saas
cd ~/Programming/demos/smoke-saas && bun install
scripts/deploy-demo.sh saas smoke-saas
```

Expected: última linha `https://demo-smoke-saas...vercel.app`, exit 0.

Se o build na Vercel falhar com "No Next.js version detected" (o `-A` não aplicou o config), trocar a linha do deploy por copiar o config para a raiz, que é o padrão já provado no `cavalo-selado`:

```bash
cp "$config" vercel.json
deployment=$(vercel deploy --prod --yes --scope "$scope" | tail -1)
```

Se a URL responder 401 (Deployment Protection ligada por padrão no projeto novo), desligar dentro do script logo após o `link`, com o subcomando `vercel project protection` e o flag que o `--help` dele indicar.

- [ ] **Step 6: Redeploy idempotente**

Run: `scripts/deploy-demo.sh saas smoke-saas`
Expected: pula o `project add`, mesma URL, exit 0.

- [ ] **Step 7: Commit dos ajustes do smoke (se houver)**

```bash
git -C ~/Programming/mvp-archetypes add scripts/deploy-demo.sh
git -C ~/Programming/mvp-archetypes commit -m "fix: <o que o smoke revelou>"
```

Manter o projeto `demo-smoke-saas` e o worktree. Gustavo decide se apaga.

---

### Task 3: Docs sem radar e sem VPS

**Files:**
- Modify: `CLAUDE.md`
- Modify: `RESKIN.md` (seção "Branch and naming")

**Interfaces:**
- Consumes: nomes do script e das configs da Task 2.
- Produces: `RESKIN.md` é o contrato que o agente da skill lê (Task 4). A seção "Definition of done" continua sendo a checklist dele.

- [ ] **Step 1: `CLAUDE.md`**

Remover toda menção a `mvp-funnel`, radar, Telegram, VPS, Apify. Manter: "The one idea", Layout, Why these three archetypes, Stack, Running, Tailwind gotcha, Server and client boundary, Demo data. Adicionar a seção "How a demo is born" resumindo worktree, agente, `scripts/deploy-demo.sh`, revisão, apontando para a spec e para a skill `demo`. Trocar o `bunx tsc --noEmit` por app pelo `bun run typecheck` da raiz. Reescrever "State": três arquétipos com typecheck verde, deploy por projeto Vercel, smoke `demo-smoke-saas`, lacuna de cor por app resolvida pelo `brand.css`, Console sem drawer de pessoa só se ainda for verdade (conferir em `apps/console/src/features`).

- [ ] **Step 2: `RESKIN.md`, "Branch and naming"**

Substituir a seção inteira por:

```markdown
## Branch and naming

One worktree and one branch per demo: `~/Programming/demos/<client-slug>` on `demo/<client-slug>`.
The branch records the exact kernel state that built that demo. **A deployed demo is
immutable**: a later kernel change reaches new demos only, so a demo attached to a live
proposal never breaks.

Deploy from inside the worktree:

    scripts/deploy-demo.sh <console|saas|marketplace> <client-slug>

It creates or reuses the Vercel project `demo-<client-slug>`, deploys the archetype to
production and prints the public URL on its last line. Never push the branch anywhere.

Eject to a standalone repo only when the contract is won.
```

Em "Definition of done", trocar `bunx tsc --noEmit clean` por `bunx tsc --noEmit` e `bun run build` limpos no app do demo.

- [ ] **Step 3: Conferir**

Run: `rg -n -i 'radar|telegram|kitevps|funnel|apify|pm2|caddy' CLAUDE.md RESKIN.md`
Expected: nenhum resultado.

Run: `rg -n '—|–' CLAUDE.md RESKIN.md`
Expected: nenhum travessão introduzido por esta task.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md RESKIN.md
git commit -m "docs: repo descreve so o fluxo de demo, radar e VPS sairam de cena"
```

---

### Task 4: Skill `demo`, fim da `manha`, memória

**Files:**
- Create: `~/.claude/skills/demo/SKILL.md`
- Delete: `~/.claude/skills/manha/`
- Create: `~/.claude/projects/-Users-gustavonobregab/memory/project_demo_flow.md`
- Modify: `~/.claude/projects/-Users-gustavonobregab/memory/MEMORY.md`

**Interfaces:**
- Consumes: `scripts/deploy-demo.sh` (Task 2), `RESKIN.md` (Task 3), `bun run typecheck` (Task 1).

- [ ] **Step 1: Escrever a skill**

Frontmatter com `name: demo` e uma `description` que dispara em "demo", "cria um demo pra essa vaga", vaga colada. Corpo, nesta ordem:

1. O que é e o que não é (sem radar, sem proposta automática, a pessoa das propostas manda tudo à mão).
2. Entrada: texto ou URL da vaga, arquétipo opcional. Sem arquétipo, sugerir um com uma frase e esperar confirmação. Tabela dos três arquétipos como pontos de partida.
3. Passo 1, worktree: comandos `git worktree add ~/Programming/demos/<slug> -b demo/<slug>` a partir de `main` e `bun install` dentro dele. Regra do slug.
4. Passo 2, despacho: um agente `general-purpose` por vaga, todos numa única mensagem. O prompt completo do agente em bloco de código, com: texto integral da vaga, caminho do `RESKIN.md` como contrato binding, arquétipo, worktree que ele possui, L1 a L3 obrigatórios e L4 só se necessário, zero comentários, sem travessões, `bunx tsc --noEmit` e `bun run build` no app, commit no branch, `scripts/deploy-demo.sh`, nunca push, nunca tocar `packages/kernel`, e o formato do relatório (URL, uma linha do que o demo mostra, opener de até 200 caracteres em inglês).
5. Passo 3, revisão: `git -C <worktree> diff --stat main..demo/<slug>`, leitura do seed e do `demo-config.ts`, e os critérios de rejeição da spec. Rejeição vira `SendMessage` para o mesmo agente com o motivo.
6. Passo 4, entrega para Gustavo: por demo, link, uma linha, opener.
7. Regras que não dobram (da spec).
8. Limpeza: `git worktree remove` e `vercel project remove demo-<slug> --scope gustavo-nobregas-projects`, só quando Gustavo pedir.

- [ ] **Step 2: Apagar a `manha`**

Run: `rm -r ~/.claude/skills/manha`

- [ ] **Step 3: Memória**

`project_demo_flow.md` com: base é `~/Programming/mvp-archetypes`, demos em `~/Programming/demos/<slug>`, deploy Vercel por projeto `demo-<slug>`, skill `demo`, radar e VPS abandonados em 2026-09-17, `cavalo-selado` não é template, pendência do plano Hobby vs Pro. Linha nova no `MEMORY.md`. Atualizar `project_burnout_mvp.md` não é necessário.

- [ ] **Step 4: Conferir**

Run: `rg -n -i 'kitevps|radar|telegram|manha' ~/.claude/skills/demo/SKILL.md`
Expected: só menções que dizem que isso não existe mais, ou nenhuma.

---

### Task 5: Aceite

Bloqueado em entrada do Gustavo: uma vaga real vinda da pessoa das propostas. Quando chegar, rodar a skill `demo` com ela e medir do worktree até a URL. Aceite: menos de 30 minutos e aprovado pelos critérios de rejeição.
