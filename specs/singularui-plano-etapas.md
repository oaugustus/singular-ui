# SingularUi — Plano de Implementação por Etapas

Complementa `singularui-especificacao-tecnica.md`. Cobre todos os ~125 componentes do Nuxt UI, organizados em etapas sequenciais, cada uma com entregáveis e critério de aceite.

**Escopo confirmado da v1: Etapas 0 a 6, seguidas diretamente pela Etapa 9 (documentação e publicação). Etapas 7 (Page) e 8 (AI Chat/Editor/Content/ColorMode/i18n) ficam fora do escopo da v1 e só entram numa v2.**

## Etapa 0 — Fundação (1–1,5 semanas)

**Objetivo:** montar o esqueleto do projeto e as peças que todos os componentes vão depender. Duração reduzida em relação à versão anterior do plano porque a camada de interatividade deixou de ser construída do zero (seção 7 da especificação técnica) — o trabalho aqui é majoritariamente instalar e empacotar dependências de terceiros, não escrever lógica de foco/posicionamento/teclado.

Entregáveis:
- Repositório com a estrutura de pastas da especificação técnica (seção 4), `package.json` com AngularJS 1.8.3, Tailwind CSS e as dependências de terceiros já resolvidas (Floating UI, focus-trap, tabbable, Mousetrap, date-fns, tailwind-merge), ESLint, Karma e Rollup (build UMD) configurados.
- Ambiente de desenvolvimento base: versão de Node/npm fixada, `.gitignore`, README inicial, pipeline de CI rodando o Karma em Chrome Headless.
- `singular-ui.module.js` (módulo raiz) e `core.module.js` — só wiring, sem lógica, agregando `singularUi.core` e (posteriormente) `singularUi.components`.
- `suTv` implementado e testado (fixtures comparando com `tailwind-variants`).
- `ngAria` e `ngAnimate` (módulos oficiais do AngularJS) incluídos como dependências do módulo `singularUi.core`.
- Serviço `suOverlayStack` (glue code — pilha de overlays e roteamento do ESC).
- Serviço `suId` (geração de ids únicos para atributos ARIA, usado por praticamente todo componente de formulário/overlay a partir da Etapa 2).
- Serviço `suColorMode` (troca de tema claro/escuro, usado pelo componente `Theme` na Etapa 1).
- Diretivas wrapper finas: `su-floating-position` (sobre Floating UI), `su-focus-trap` (sobre focus-trap), `su-hotkey` (sobre Mousetrap).
- Script `generate-tailwind-safelist.js` funcional.
- App de demo vazio, já servindo com hot-reload.
- `THIRD-PARTY-LICENSES.md` inicial, já listando as bibliotecas de terceiros adotadas.

Critério de aceite: um componente "hello world" (`suBadge`, o mais simples) consegue ser montado end-to-end usando `suTv` + estrutura de módulos, com teste unitário passando; um segundo componente de teste usando `su-floating-position` + `su-hotkey` (ex.: um Tooltip simples) confirma que os wrappers de terceiros funcionam antes de avançar para as etapas seguintes.

## Etapa 1 — Layout + Element (2,5–3 semanas)

Componentes: App, Container, Error, Footer, Header, Main, Sidebar, Theme (Layout) — Alert, Avatar, AvatarGroup, Badge, Banner, Button, Calendar, Card, Chip, Collapsible, FieldGroup, Icon, Kbd, Progress, Separator, Skeleton (Element). **24 componentes.**

Por quê primeiro: majoritariamente estáticos ou com estado local simples (Collapsible, Calendar são os únicos com lógica não trivial) — valida o padrão `component + theme + suTv` em volume antes dos casos complexos de formulário/overlay.

Entregáveis: os 24 componentes completos (contrato de componente da especificação técnica), demo app atualizado com 1 rota por componente, specs unitários.

Critério de aceite: comparação visual lado a lado com `ui.nuxt.com/docs/components/<nome>` sem divergência perceptível; Calendar navegável por teclado (paridade básica com o original).

## Etapa 2 — Form (2,5–3,5 semanas)

Componentes: Checkbox, CheckboxGroup, ColorPicker, FileUpload, Form, FormField, Input, InputDate, InputMenu, InputNumber, InputRating, InputTags, InputTime, Listbox, PinInput, RadioGroup, Select, SelectMenu, Slider, Switch, Textarea. **21 componentes.**

Trabalho específico: implementar `ngModel` customizado (`require: 'ngModel'`, `$formatters`/`$parsers`) para todos os inputs; `Form`/`FormField` usam **ngMessages** (módulo padrão do AngularJS) para agregação e exibição de erros de validação, em vez do esquema baseado em schema (zod/valibot/yup) que o Nuxt UI usa — decisão confirmada, ver seção 13. Select/SelectMenu/InputMenu/Listbox usam `su-floating-position` + roving tabindex (baseado em `tabbable`). RadioGroup e CheckboxGroup usam `<input type="radio">`/`<input type="checkbox">` nativos sempre que possível — navegação por seta em radio buttons já é comportamento nativo do navegador, dispensando roving tabindex customizado nesses dois casos. **ColorPicker** é wrapper sobre **Pickr**; **FileUpload** é wrapper sobre **ng-file-upload** (drag-and-drop e progresso prontos) — ambos reduzem o escopo desta etapa a tema Tailwind + bindings, não lógica nova.

Critério de aceite: formulário de exemplo no demo app (login + cadastro) usando 100% dos componentes desta etapa, validação via `ngMessages` funcionando (mensagens por regra: `required`, `minlength`, `pattern`, etc.), navegação por teclado completa em Select/Listbox, upload de arquivo com progresso funcional via ng-file-upload.

## Etapa 3 — Navigation (1,5–2 semanas)

Componentes: Breadcrumb, CommandPalette, FooterColumns, Link, NavigationMenu, Pagination, Stepper, Tabs. **8 componentes.**

CommandPalette reaproveita `su-floating-position` + `suOverlayStack` da Etapa 0, `su-hotkey` (Mousetrap) para o atalho global, e **Fuse.js** para fuzzy search — as três peças já vêm prontas da fundação, então o trabalho aqui é montar o componente visual e a integração, não a lógica de busca/atalho.

Critério de aceite: CommandPalette funcional com atalho de teclado global (`Cmd/Ctrl+K`) no demo app; Tabs com roving tabindex completo (setas esquerda/direita, Home/End, via `tabbable`).

## Etapa 4 — Overlay (2–2,5 semanas)

Componentes: ContextMenu, Drawer, DropdownMenu, Modal, Popover, Slideover, Toast, Tooltip. **8 componentes.**

Com `su-focus-trap` (focus-trap), `su-floating-position` (Floating UI) e `su-hotkey` (Mousetrap para ESC) já prontos da Etapa 0, o trabalho desta etapa se concentra em: portal (`$compile` + `document.body`), bloqueio de scroll do body, empilhamento correto de múltiplos overlays via `suOverlayStack`, e transições de entrada/saída via `ngAnimate`. Não há mais lógica de foco/posicionamento própria para escrever — é a etapa que mais se beneficia da mudança de estratégia (era a de maior risco no plano anterior).

Critério de aceite: dois modais abertos simultaneamente (um sobre o outro) fecham na ordem correta com ESC (roteado pelo `suOverlayStack`); leitor de tela anuncia abertura/fechamento (via `ngAria`); foco retorna ao elemento que abriu o overlay ao fechar (garantido pelo focus-trap).

## Etapa 5 — Data (2–2,5 semanas)

Componentes: Accordion, Carousel, Empty, Marquee, ScrollArea, Table, Timeline, Tree, User. **9 componentes.**

**Table** é wrapper sobre **ui-grid** ou **angular-smart-table** (ordenação/paginação/filtro prontos, nativos do ecossistema AngularJS 1.x) com template Tailwind próprio, em vez de lógica de ordenação/paginação escrita à mão. **Carousel** é wrapper fino sobre **Embla**. **ScrollArea**, quando precisar de virtualização para listas longas, usa **Clusterize.js** em vez de reimplementar virtualização manualmente. Tree continua sendo o único componente desta etapa sem biblioteca pronta equivalente — usa `tabbable` como base para a navegação por teclado (expandir/colapsar com setas).

Critério de aceite: Table com 500+ linhas mantém scroll fluido (via ui-grid/Clusterize, conforme o caso); Tree navegável por teclado.

## Etapa 6 — Dashboard (2 semanas)

Componentes: DashboardGroup, DashboardNavbar, DashboardPanel, DashboardResizeHandle, DashboardSearch(Button), DashboardSidebar(Collapse/Toggle), DashboardToolbar. **10 componentes.**

Compõe os componentes das etapas anteriores em um shell de admin completo (sidebar redimensionável e colapsável, painéis, busca).

Critério de aceite: um shell de dashboard completo no demo app (sidebar colapsável + navbar + toolbar + busca) montado 100% com componentes `su*`, sem HTML/CSS ad-hoc fora do sistema de tema.

**Fim do escopo da v1 (Etapas 0–6): ~80 componentes cobrindo Layout, Element, Form, Data, Navigation, Overlay e Dashboard — paridade com o que uma aplicação interna/painel administrativo completo precisa, incluindo o shell de admin pronto.**

Da Etapa 6, o plano segue direto para a **Etapa 9** (documentação e publicação). As Etapas 7 (Page) e 8 (AI Chat/Editor/Content/ColorMode/i18n) ficam fora do escopo da v1 — não são implementadas nesta fase do projeto, e só voltam a ser avaliadas numa v2.

## Etapa 7 — Page (fora do escopo da v1)

Componentes: AuthForm, BlogPost(s), ChangelogVersion(s), Page + subcomponentes (Anchors/Aside/Body/Card/Columns/CTA/Feature/Grid/Header/Hero/Links/List/Logos/Section), PricingPlan(s), PricingTable. **22 componentes.**

Mantido aqui só como referência para uma eventual v2, caso o SingularUi precise cobrir landing pages/marketing além de painéis internos.

## Etapa 8 — AI Chat, Editor, Content, Color Mode, i18n (fora do escopo da v1)

Componentes: Chat/ChatMessage(s)/ChatPalette/ChatPrompt(Submit)/ChatReasoning/ChatShimmer/ChatTool (9); Editor/EditorDragHandle/EditorEmojiMenu/EditorMentionMenu/EditorSuggestionMenu/EditorToolbar (6); ContentNavigation/ContentSearch(Button)/ContentSurround/ContentToc (4); ColorModeAvatar/Button/Image/Select/Switch (5); LocaleSelect (1).

Mantido aqui só como referência para uma eventual v2, caso o projeto precise de interface de chat com IA, editor de texto rico, ou navegação de conteúdo estilo Nuxt Content.

## Etapa 9 — Documentação e publicação (1,5–2 semanas)

- Site de documentação construído em **Docusaurus** (decisão confirmada), uma página MDX por componente com tabela de props/bindings + exemplo de código, no molde do `ui.nuxt.com/docs/components`.
- **Preview ao vivo:** como o Docusaurus é baseado em React e os componentes do SingularUi são AngularJS, o preview de cada componente não pode ser um componente React nativo — a abordagem é embutir um `<iframe>` apontando para a rota correspondente do `demo/` app (mesma estratégia que o próprio Tailwind Plus usa para os previews que inspecionamos, e mais simples que tentar interoperar React+Angular na mesma página).
- **Tabela de props:** sem equivalente ao `nuxt-component-meta` (que é específico de Vue/TS) — a tabela de bindings de cada componente é gerada por um script Node (`scripts/generate-props-docs.js`) que lê o objeto `bindings` de cada `*.component.js` via parsing simples (regex ou AST com `acorn`/`esprima`) e produz um JSON consumido pelas páginas MDX, evitando manutenção manual duplicada.
- Publicação como `singular-ui` no npm (privado ou público, a definir) e do site de docs (GitHub Pages ou Vercel/Netlify, ambos com suporte nativo a Docusaurus).
- Guia de contribuição referenciando as convenções do John Papa da especificação técnica (seção 3), para manter consistência em contribuições futuras.

## Resumo de esforço

| Etapa | Escopo | Duração (1 dev) | Duração (2 devs) |
|---|---|---|---|
| 0 — Fundação | core + tooling (majoritariamente integração de libs prontas) | 1–1,5 sem | 1–1,5 sem |
| 1 — Layout + Element | 24 componentes | 2,5–3 sem | 1,5–2 sem |
| 2 — Form | 21 componentes | 2,5–3,5 sem | 1,5–2 sem |
| 3 — Navigation | 8 componentes | 1,5–2 sem | 1 sem |
| 4 — Overlay | 8 componentes | 2–2,5 sem | 1–1,5 sem |
| 5 — Data | 9 componentes | 2–2,5 sem | 1–1,5 sem |
| 6 — Dashboard | 10 componentes | 2 sem | 1 sem |
| 9 — Docs e publicação | — | 1,5–2 sem | 1 sem |
| **Total v1 (Etapas 0–6 + 9)** | **~80 componentes** | **~15,5–18,5 sem** | **~9,5–11,5 sem** |
| 7 — Page (fora do escopo v1) | 22 componentes | 2 sem | 1 sem |
| 8 — AI Chat/Editor/Content/ColorMode/i18n (fora do escopo v1) | 25 componentes | 2–3 sem | 1–1,5 sem |

A redução de esforço por etapa em relação ao plano anterior reflete a decisão de reaproveitar Floating UI, focus-trap, tabbable, Mousetrap, ui-grid/angular-smart-table, ng-file-upload e Pickr em vez de construir cada peça de comportamento do zero (ver seção 7 da especificação técnica). Etapas 7 e 8 permanecem na tabela apenas como referência de esforço para uma eventual v2.

## 13. Decisão confirmada — validação de formulário (Etapa 2)

O SingularUi usa **`ngMessages`** (módulo oficial `angular-messages`, mesma major/minor do AngularJS core) para validação e exibição de erros em `Form`/`FormField`, em vez de replicar o adaptador de schema (zod/valibot/yup/joi) que o Nuxt UI usa. Isso mantém a biblioteca alinhada com as ferramentas nativas do ecossistema AngularJS/John Papa, evitando dependência externa de validação. Cada input do SingularUi expõe seu `$error` via `ngModelController` normalmente, e `suFormField` apenas provê o wrapper visual + `ng-messages` internamente, deixando as regras de validação (`ng-required`, `ng-minlength`, `ng-pattern`, validators customizados) a cargo de quem consome o componente — igual ao padrão nativo do Angular.

## Próximos passos imediatos

1. Escopo v1 confirmado: Etapas 0–6 + 9 (~80 componentes + shell de dashboard + documentação/publicação), deixando 7/8 para v2.
2. Iniciar Etapa 0 — nenhuma decisão em aberto bloqueia o início da fundação do projeto.
