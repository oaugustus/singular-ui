# Gravity Elements — Status atual

> Resumo de contexto para retomar o projeto em uma nova sessão. Última atualização: 2026-08-06 (Etapa 0 concluída; Etapa 1 em andamento — 2 de 24 componentes).

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
- Branch local sincronizada com `origin/master` (nenhum commit pendente de push) no momento desta revisão. `geApp` já commitado e enviado (`991a783`).
- **Há mudanças não commitadas no momento desta revisão**: `geContainer` completo (`src/components/layout/container/`, ainda untracked) + a correção do `window.twMerge` (`src/index.js`, `.eslintrc.cjs`) + artefatos de build regenerados (`dist/`, `tailwind.safelist.json`) + este próprio arquivo de status e a spec da Etapa 1. Recomenda-se commitar antes da próxima tarefa do Cursor.

## Documentos de planejamento (`specs/`)

- `gravity-elements-especificacao-tecnica.md` — especificação técnica completa (arquitetura, convenções, contrato de componente, `geTv`, camada de interatividade, build/tooling, testes, licenciamento, fora de escopo).
- `gravity-elements-plano-etapas.md` — plano por etapas (0–6 + 9 no escopo da v1; 7–8 só como referência para v2).
- `spec-etapa-0-fundacao.md` — spec de implementação da Etapa 0 para o Cursor, com TODO (seção 9) espelhando as tarefas do TickTick. **Concluída (25/25).**
- `spec-etapa-1-layout-element.md` — spec de implementação da Etapa 1 (Layout + Element, 24 componentes), escrita em 2026-08-06 nos moldes da Etapa 0. TODO (seção 12) espelha as 27 tarefas do TickTick (24 componentes + demo app + 2 critérios de aceite). **Em andamento: 2 de 24 componentes** (`geApp`, `geContainer`). Próxima tarefa (`Componente: Error`) a preencher em `plantask.md`.
- `processo-implementacao.md` — processo operacional (papéis Claude/Cursor/TickTick), válido para todas as etapas.

Etapas 2–6 e 9 ainda não têm spec de implementação detalhada.

## Progresso da Etapa 0 (Fundação) — **CONCLUÍDA**

**25 de 25 tarefas concluídas e verificadas de forma independente** (não só por relato). TickTick zerado (projeto "Etapa 0 - Fundação" sem tarefas em aberto) em 2026-08-06.

Entregas completas: estrutura de pastas, `package.json` + dependências de terceiros fixadas, ESLint, Karma+Jasmine, `geTv` (+ testes de fixture vs `tailwind-variants`), AngularJS 1.8.3/`angular-aria`/`angular-animate`, `core.module.js`/`gravity-elements.module.js`, `geOverlayStack`, `ge-floating-position`, `ge-focus-trap`, `ge-hotkey`, `generate-tailwind-safelist.js`, demo app com Vite, `THIRD-PARTY-LICENSES.md`, os dois smoke tests de critério de aceite (`geBadge` end-to-end, Tooltip com floating+focus-trap+hotkey), Tailwind CSS (CLI/PostCSS, `dist/gravity-elements.css`), Rollup (build UMD, `dist/gravity-elements.umd.js`), ambiente de desenvolvimento base (`.nvmrc`, `.gitignore` atualizado, README, CI no GitHub Actions), `geId`, `geColorMode`, remote do git corrigido e histórico de commits publicado.

## Qualidade / verificação

- `eslint .` limpo, confirmado em instalação nativa isolada do sandbox (fora do `node_modules` do Mac do usuário, para evitar binários nativos cruzados).
- `npm run build:css` e `npm run build:js` (Rollup) rodados de forma independente nesta sessão — geram `dist/gravity-elements.css` e `dist/gravity-elements.umd.js` sem erro.
- **Karma + Chrome Headless segue sem poder ser confirmado automaticamente no ambiente Cowork**: sandbox Linux ARM64 sem root; o Chrome que o `puppeteer` baixa para "linux_arm" é na verdade um binário x86-64 (não há build oficial de Chrome para Linux ARM64), e `apt install chromium` falha por falta de permissão de root.
- **Mitigação usada nesta revisão** — em vez de só ler o código, o bundle UMD final e os serviços `geId`/`geColorMode` foram **executados de verdade** via `jsdom` + AngularJS real (`angular.js`/`angular-aria`/`angular-animate` carregados num DOM simulado, sem depender de Chrome): confirmado que `window.gravityElements` é o módulo Angular real (`name: 'gravityElements'`, `requires: ['gravityElements.core']`), que `geId.next('aria')` gera `aria-1`, `aria-2`, `aria-3` incrementalmente, e que `geColorMode.set('dark')`/`toggle()` aplicam e removem a classe `dark` em `documentElement` corretamente. Os demais serviços/diretivas (`geTv`, `geOverlayStack`, `ge-floating-position`, `ge-focus-trap`, `ge-hotkey`, `geBadge`, Tooltip) foram confirmados por revisão de código linha a linha contra a spec, sem contradição com os resultados de Karma relatados pelo Cursor (contagem de testes cresceu de forma consistente ao longo das entregas: 11→15→18→21→24→26→29→32→37).
- **Recomenda-se rodar `npm test` localmente (Mac do usuário, que tem Chrome de verdade) ou via CI (já configurado em `.github/workflows/ci.yml`) para confirmar a suíte completa Karma pelo menos uma vez.**

## Progresso da Etapa 1 (Layout + Element) — em andamento

**2 de 24 componentes concluídos e verificados de forma independente**, mais uma correção retroativa no núcleo da Etapa 0:

- **`geApp`** (stub) — sem `theme.js` (exceção documentada: `App` na Nuxt UI v4.10.0 é só provedor de contexto, sem `theme/app.ts`); transclusion + aplica `geColorMode` persistido no `$onInit`. Papel completo de provedor (Toast/overlays) fica para a Etapa 4.
- **`geContainer`** — primeiro componente com tema real da etapa; validou a safelist do Tailwind (Etapa 0, nunca testada antes contra tema de verdade) capturando corretamente inclusive sintaxe de valor arbitrário (`max-w-[var(--ui-container)]`).
- **Correção retroativa (fora do fluxo Cursor, feita nesta sessão Claude/Cowork)**: `window.twMerge` nunca era setado no bundle publicado — só no shim de teste do Karma. `geTv` (Etapa 0) degradava silenciosamente para "sem merge" em produção desde a Etapa 0; passou despercebido porque nenhum smoke test tinha classes conflitantes no mesmo slot. Descoberto ao validar `geContainer` (`size="lg"` produzia duas classes `max-w-*` conflitantes, sem quebrar visualmente só por coincidência de ordem no CSS gerado). Corrigido em `src/index.js` (import real de `tailwind-merge` + `window.twMerge`) e `.eslintrc.cjs` (exceção `angular/window-service`, mesmo padrão de `tv.service.js`). Validado via build isolado + execução real em `jsdom`.

Restam 22 componentes (ver TODO da spec, seção 12). Próxima tarefa: `Componente: Error`.

## Próximo passo

Dar `git push` do que estiver pendente localmente (checar `git status` — o volume de commits pendentes muda a cada tarefa concluída). Seguir a Etapa 1 componente a componente, um chat de Plan mode no Cursor por vez, com verificação independente (Claude/Cowork) antes de marcar cada um no TickTick.

## Gestão de tarefas (TickTick)

- Grupo "Gravity Elements" (antes "GravityUi", antes "SingularUi"), com um projeto por etapa (Etapa 0 a 6 + Etapa 9).
- Sincronizado manualmente, sempre após verificação independente da entrega real no repositório — nunca por relato automático do Cursor ou autoclaim.
- Regra do processo: o Cursor nunca edita o TickTick diretamente; o TODO da seção 9 de cada spec de etapa é o espelho/fonte de verdade, e a sincronização com o TickTick é feita nesta sessão (Claude/Cowork), sempre após inspeção direta do código/testes.

## Processo de execução (Cursor)

Detalhado por completo em `specs/processo-implementacao.md`. Resumo: um chat de "Plan mode" no Cursor por tarefa individual do TODO (não por etapa inteira); fluxo Plan → aprovação do Otávio → Build → atualizar o TODO com evidência só depois de verificar comportamento; TickTick é sincronizado exclusivamente por esta sessão (Claude/Cowork), sempre após verificação independente, nunca por relato. Arquivo `plantask.md` na raiz do repo é o template usado para abrir os chats do Cursor.
