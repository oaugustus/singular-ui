# Gravity Elements — Status atual

> Resumo de contexto para retomar o projeto em uma nova sessão. Última atualização: 2026-08-01.

## O que é o projeto

Biblioteca de componentes UI para AngularJS 1.8.3, portando o design system do Nuxt UI (Vue), seguindo o John Papa Style Guide (`a1`). Interatividade (posicionamento, focus trap, atalhos) reaproveita bibliotecas de terceiros (Floating UI, focus-trap, tabbable, Mousetrap, date-fns) em vez de reconstruir do zero.

Faz parte do ecossistema **Orbtal**: Gravity é o framework/infraestrutura interna compartilhada (não vendido isoladamente), Helios é o portal, Kepler é a primeira aplicação de negócio (SFA + roteirização de entregas). Este projeto é a camada de componentes de UI dessa arquitetura.

**Prioridade: baixa.** Não compete por tempo com o desenvolvimento do Kepler (MVP prioritário: autenticação, multi-tenant, APIs core, app de vendas em campo). Concluir a Etapa 0 é desejável quando houver disponibilidade, sem prazo.

## Nome do projeto — histórico

1. Nasceu como **SingularUi**.
2. Renomeado para **GravityUi** ao alinhar com a arquitetura Orbtal.
3. Renomeado de novo para **Gravity Elements** — "GravityUi" colidia com o "Gravity UI" da Yandex (design system open source já estabelecido, mesma categoria de produto: `gravity-ui.com`, `@gravity-ui/uikit` no npm). "Gravity Elements" é nome descritivo, não marca própria, dispensa checagem formal de marca (mesmo tratamento dado ao "Helios" no plano de negócios da Orbtal).

Convenção de código adotada: prefixo `ge-`/`ge` (ex.: `geTv`, `geOverlayStack`, `ge-floating-position`), módulo Angular `gravityElements`/`gravityElements.core`.

## Repositório

- GitHub: `github.com/oaugustus/gravity-elements` (renomeado de `singular-ui`; URL antiga redireciona).
- Pasta local: `~/Projetos/htdocs/gravity-elements` (renomeada de `singular-ui`).
- Remote local (`git remote -v`) confirmado limpo, fetch e push ambos em `gravity-elements.git`, sem token embutido.
- Commit mais recente: `9347c35` — já enviado ao GitHub (push confirmado).

## Documentos de planejamento (`specs/`)

- `gravity-elements-especificacao-tecnica.md` — especificação técnica completa (arquitetura, convenções, contrato de componente, `geTv`, camada de interatividade, build/tooling, testes, licenciamento, fora de escopo).
- `gravity-elements-plano-etapas.md` — plano por etapas (0–6 + 9 no escopo da v1; 7–8 só como referência para v2).
- `spec-etapa-0-fundacao.md` — spec de implementação da Etapa 0 para o Cursor, com TODO (seção 9) espelhando as tarefas do TickTick. **Fonte de verdade do progresso técnico.**

Etapas 1–6 e 9 ainda não têm spec de implementação detalhada — só a Etapa 0.

## Progresso da Etapa 0 (Fundação)

13 de 19 tarefas concluídas e **verificadas de forma independente** (não só por relato):

- Estrutura de pastas, `package.json` com dependências de terceiros, ESLint, Karma+Jasmine.
- Motor de tema `geTv` (implementado e testado; lógica validada manualmente fora do Karma).
- Testes de fixture `geTv` vs `tailwind-variants`.
- AngularJS 1.8.3 + `angular-aria` + `angular-animate` instalados e fixados.
- `core.module.js`/`gravity-elements.module.js` wireados corretamente.
- `geOverlayStack`, diretivas `ge-floating-position`, `ge-focus-trap`, `ge-hotkey`.
- Script `generate-tailwind-safelist.js`.
- App de demo com Vite (hot-reload).

**Pendente:**
- `THIRD-PARTY-LICENSES.md`.
- Critérios de aceite (smoke tests `geBadge` end-to-end, Tooltip validando `ge-floating-position` + `ge-hotkey`).
- Tailwind CSS (CLI/PostCSS).
- Rollup (build UMD → `gravity-elements.js`).
- Ambiente de desenvolvimento base: `.gitignore` ainda é o antigo (Dart/Flutter, não atualizado), README ainda incompleto (falta descrição completa + aviso de port independente sem afiliação com Nuxt Labs — parcialmente corrigido no rename, mas a tarefa formal de "Ambiente de desenvolvimento base" segue em aberto), `.nvmrc`, pipeline de CI.
- `geId` (serviço de ids únicos para ARIA) — arquivo ainda vazio.
- `geColorMode` (troca de tema claro/escuro) — arquivo ainda vazio.

## Qualidade / verificação

- `eslint .` limpo em todo o código.
- Testes unitários existem para todas as peças implementadas.
- Execução completa do `npm test` (Karma + Chrome Headless) **não pôde ser confirmada** no ambiente de revisão usado nesta sessão (sandbox ARM64 sem Chrome, sem acesso root) — a lógica central do `geTv` foi validada manualmente via script Node à parte, e o restante por revisão de código linha a linha contra a spec. Recomenda-se rodar `npm test` localmente ou via CI (quando existir) para confirmar a suíte completa.

## Gestão de tarefas (TickTick)

- Grupo "Gravity Elements" (antes "GravityUi", antes "SingularUi"), com um projeto por etapa (Etapa 0 a 6 + Etapa 9).
- Sincronizado manualmente, sempre após verificação independente da entrega real no repositório — nunca por relato automático do Cursor ou autoclaim.
- Regra do processo: o Cursor nunca edita o TickTick diretamente; o TODO da seção 9 de cada spec de etapa é o espelho/fonte de verdade, e a sincronização com o TickTick é feita nesta sessão (Claude/Cowork), sempre após inspeção direta do código/testes.

## Processo de execução (Cursor)

Detalhado por completo em `specs/processo-implementacao.md`. Resumo: um chat de "Plan mode" no Cursor por tarefa individual do TODO (não por etapa inteira); fluxo Plan → aprovação do Otávio → Build → atualizar o TODO com evidência só depois de verificar comportamento; TickTick é sincronizado exclusivamente por esta sessão (Claude/Cowork), sempre após verificação independente, nunca por relato. Arquivo `plantask.md` na raiz do repo é o template usado para abrir os chats do Cursor.
