# SingularUi — Spec de Implementação: Etapa 0 (Fundação)

> Documento autocontido para implementação por agente de codificação (Cursor AI). Referências completas de arquitetura estão em `singularui-especificacao-tecnica.md`; este documento extrai e detalha apenas o necessário para a Etapa 0, sem exigir leitura cruzada constante.

## Fluxo de trabalho desta etapa (importante)

Este agente **não tem e não deve buscar acesso** ao TickTick do projeto. O progresso é reportado exclusivamente marcando os itens do **TODO da seção 9** neste próprio arquivo — é o único lugar onde a conclusão de tarefas deve ser registrada durante a implementação.

Regras do TODO:
- Marcar `- [x]` só quando o item estiver de fato implementado e, quando aplicável, com o critério de aceite correspondente (seção 6) verificado.
- **Não alterar o texto dos itens** — os títulos são um espelho exato das tarefas do TickTick e precisam bater string-a-string para permitir cruzamento automático depois.
- Ao marcar um item como concluído, adicionar uma sub-linha logo abaixo com uma nota breve de evidência (ex.: comando rodado, arquivo criado, resultado do teste). Isso é o que será lido para decidir se o critério de aceite realmente foi cumprido antes de atualizar o TickTick.
- Não marcar um item como concluído só porque o código foi escrito — só quando o comportamento foi verificado (teste rodou e passou, comando executou sem erro, etc.).
- Não marcar nada como "concluído" em nenhum sistema de gestão de tarefas fora deste arquivo — isso é responsabilidade de outra sessão (Claude/Cowork), que lê este TODO e sincroniza com o TickTick.

## Processo de execução (padrão para todas as specs de etapa)

**Granularidade: um chat de Plan mode do Cursor por item do TODO (seção 9), não um chat por etapa inteira.** Contexto zerado a cada tarefa evita que o agente perca precisão ou desvie de convenções estabelecidas ao acumular muitas tarefas na mesma conversa.

Como cada chat começa sem memória do que veio antes, o título curto do item do TODO (ex. "Implementar suTv (motor de tema)") **não é contexto suficiente sozinho**. O prompt de abertura de cada chat de tarefa deve sempre incluir:

1. O texto exato da linha do TODO que está sendo trabalhada (copiado desta spec).
2. Referência às seções relevantes de `singularui-especificacao-tecnica.md` para aquela tarefa (para tarefas de componente em etapas futuras, isso é sempre a seção 5, "Contrato de componente", com o exemplo `button.component.js`/`button.theme.js`; para esta etapa, a seção correspondente listada em "5.x" abaixo).
3. Instrução explícita para o agente inspecionar o **estado atual do repositório** antes de planejar — é o código já existente, não o histórico da conversa, que carrega a continuidade entre uma tarefa e a próxima.

Fluxo de cada tarefa:
1. **Plan**: o agente lê a tarefa + as referências acima e propõe um plano (arquivos a criar/alterar, abordagem).
2. **Validação**: o usuário revisa o plano antes de autorizar a execução — é o checkpoint que evita retrabalho por má interpretação da spec.
3. **Build**: o agente implementa e roda os testes/comandos de verificação aplicáveis.
4. **Atualização do TODO**: só depois do comportamento verificado (não só "código escrito"), o agente marca `- [x]` no item correspondente e adiciona a sub-linha de evidência, seguindo as regras acima.

**Checkpoint manual adicional** (a partir das etapas com componentes visuais): para componentes com risco real de acessibilidade/comportamento — Modal, Select/Combobox, Table, CommandPalette, Drawer e similares — o usuário confere manualmente no navegador (demo app) antes de considerar a tarefa concluída, mesmo com a evidência do agente já registrada. Esses são os componentes mais propensos a bugs sutis de foco/teclado que uma nota de texto não captura.

## 1. Objetivo

Montar o esqueleto do repositório `singular-ui` e todas as peças de infraestrutura (tema, interatividade, tooling) das quais os componentes visuais (Etapas 1 em diante) vão depender. **Nenhum componente visual (`su*`) é implementado nesta etapa** — só a fundação.

## 2. Stack e dependências

Instalar como dependências do projeto (via npm), com AngularJS fixado na versão exata e as demais na última versão estável compatível:

- `angular` — **exatamente `1.8.3`** (última versão já lançada do AngularJS; não usar `^` ou `~`, fixar exato).
- `angular-messages` (módulo `ngMessages`, mesma versão `1.8.3`).
- `angular-animate` (módulo `ngAnimate`, mesma versão `1.8.3`).
- `angular-aria` (módulo `ngAria`, mesma versão `1.8.3`).
- `@floating-ui/dom` — posicionamento flutuante.
- `focus-trap` — focus trap.
- `tabbable` — localizar/ordenar elementos focáveis (usado por diretivas de roving tabindex nas próximas etapas, mas instalado aqui).
- `mousetrap` — atalhos de teclado.
- `date-fns` — manipulação de datas (usado a partir da Etapa 1/2, mas instalado aqui).
- `tailwind-merge` — merge de classes Tailwind conflitantes, usado por `suTv`.
- `tailwindcss` (dev dependency) — v3.x (não a v4, pela compatibilidade de baseline definida na especificação técnica, seção 10).

Dev dependencies de tooling:
- `eslint` + `eslint-plugin-angular`
- `karma`, `karma-jasmine`, `jasmine-core`, `karma-chrome-launcher` (Chrome Headless)
- `rollup` (+ plugins necessários para gerar UMD: `@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`)

**Nota sobre `eslint-plugin-angular`:** é um plugin antigo, escrito para o formato de configuração legado do ESLint (`.eslintrc`), e não para o *flat config* que o ESLint usa por padrão a partir da v9. Não é o mesmo pacote que `angular-eslint` (esse é para Angular 2+/TypeScript e não se aplica aqui). Duas saídas possíveis, à escolha do agente: (a) fixar `eslint` na v8.x, que ainda suporta `.eslintrc` nativamente, ou (b) usar ESLint 9+ com o utilitário `FlatCompat` (`@eslint/eslintrc`) para carregar a config legada do `eslint-plugin-angular` dentro de um `eslint.config.js` flat. Registrar no README qual caminho foi escolhido.

Não fixar versões exatas dessas libs de terceiros (deixar `^` normal do npm) — só `angular` e os módulos `angular-*` precisam ser exatamente `1.8.3`.

## 3. Estrutura de pastas a criar

```
singular-ui/
├── src/
│   ├── core/
│   │   ├── tv/
│   │   │   ├── tv.service.js
│   │   │   └── tv.service.spec.js
│   │   ├── overlay/
│   │   │   ├── overlay-stack.service.js
│   │   │   ├── floating-position.directive.js
│   │   │   ├── focus-trap.directive.js
│   │   │   └── hotkey.directive.js
│   │   ├── color-mode/
│   │   │   └── color-mode.service.js
│   │   ├── id/
│   │   │   └── id.service.js
│   │   └── core.module.js
│   └── singular-ui.module.js
├── demo/
├── dist/
├── test/
│   └── karma.conf.js
├── scripts/
│   └── generate-tailwind-safelist.js
├── specs/
│   ├── singularui-especificacao-tecnica.md
│   ├── singularui-plano-etapas.md
│   └── spec-etapa-0-fundacao.md      # este próprio arquivo, versionado junto
├── THIRD-PARTY-LICENSES.md
├── .gitignore
├── .nvmrc
├── package.json
├── rollup.config.js
└── README.md
```

Não criar `src/components/` ainda — essa árvore só nasce na Etapa 1. Não criar `docs/` (reservado para o site Docusaurus da Etapa 9 — por isso os documentos de planejamento vão em `specs/`, não em `docs/`, para não colidir).

## 3.1 Versionamento no GitHub (repositório `oaugustus/singular-ui`)

O repositório remoto já existe em `https://github.com/oaugustus/singular-ui`, e o diretório local já é um repositório git inicializado, com um commit inicial legado (README/LICENSE/.gitignore de um projeto antigo, não relacionados ao SingularUi) e um remote `origin` já configurado.

**Atenção de segurança:** ao inspecionar o remote configurado (`git remote -v`), foi identificado um token de acesso pessoal do GitHub embutido em texto puro na URL (`https://<token>@github.com/...`). Antes de qualquer commit/push nesta etapa, este agente deve:
1. Alertar o usuário de que esse token deve ser revogado/rotacionado no GitHub (se ainda não foi feito).
2. Reconfigurar o remote sem token na URL: `git remote set-url origin https://github.com/oaugustus/singular-ui.git`, usando `gh auth login` ou um credential helper local para autenticação, em vez de token embutido na URL.
3. Nunca imprimir, logar ou commitar o valor do token em nenhum arquivo.

Depois disso, o fluxo normal desta etapa é:
1. Confirmar que a estrutura de pastas da seção 3 foi criada.
2. Substituir o `README.md` e o `.gitignore` legados pelos definidos na seção 5.12/5.13 desta spec.
3. Copiar `singularui-especificacao-tecnica.md` e `singularui-plano-etapas.md` (já estão em `specs/`, fornecidos pelo usuário) e este próprio arquivo de spec da Etapa 0 — todos versionados em `specs/`.
4. Commit incluindo toda a estrutura desta etapa (seção 3) + a pasta `specs/`.
5. Push para a branch padrão do repositório.

Autenticação com o GitHub além disso é responsabilidade do usuário/ambiente local — este agente não deve pedir nem manipular tokens ou credenciais; se a autenticação não estiver configurada, parar e reportar isso como bloqueio, em vez de tentar contornar.

## 4. Convenções obrigatórias (John Papa AngularJS Style Guide, `a1`)

Aplicar em todo arquivo criado nesta etapa:

- Um artefato Angular por arquivo, IIFE (`(function () { 'use strict'; ... })();`) — regras **Y001**, **Y010**.
- Módulo declarado sem variável (setter), demais arquivos usam getter encadeado (`angular.module('singularUi.core').factory(...)`), nunca guardado em variável — **Y021–Y023**.
- Funções nomeadas, nunca anônimas, dentro de `.factory()`/`.directive()`/`.constant()` — **Y024**.
- `core.module.js` e `singular-ui.module.js` só declaram `angular.module(...)`, sem nenhuma lógica — são puramente wiring.
- Nome de arquivo `<feature>.<tipo>.js` conforme árvore da seção 3 — **Y070**.
- Toda diretiva usa prefixo `su-` — **Y073**.

## 5. Especificação de cada peça

### 5.1 `core/tv/tv.service.js` — `suTv`

Factory Angular que expõe uma função `suTv(theme)` retornando `resolve(props)`.

Algoritmo (implementar exatamente nesta ordem):
1. Começa com os valores de `theme.defaultVariants`.
2. Sobrescreve com os valores explicitamente passados em `props` (ignorando `undefined`).
3. Para cada slot em `theme.slots`, concatena: classe base do slot + classe de cada variante ativa que tenha uma entrada para aquele slot.
4. Aplica `theme.compoundVariants`: para cada entrada cujas condições batem simultaneamente com os valores resolvidos no passo 2, concatena as classes daquela entrada (a classes podem ser string única ou objeto `{ slotName: 'classes' }`).
5. Passa o resultado de cada slot por `twMerge` (de `tailwind-merge`) para deduplicar classes conflitantes.
6. Retorna um objeto `{ base: '...', label: '...', ... }` com uma chave por slot.

Assinatura: `suTv(theme)` retorna uma função; essa função aceita `props` e retorna o objeto de classes resolvidas. Ver exemplo de uso em `singularui-especificacao-tecnica.md`, seção 5 (`button.component.js`) e seção 6.

**Teste obrigatório (`tv.service.spec.js`):** criar um objeto de tema mínimo (2 slots, 2 variantes, 1 compound variant, defaultVariants) e verificar que `suTv(theme)(props)` produz a string de classes esperada para pelo menos 4 combinações de props diferentes, incluindo um caso que ativa o compound variant e um caso que não ativa.

### 5.2 `core/overlay/overlay-stack.service.js` — `suOverlayStack`

Serviço singleton (factory) com:
- `push(overlayRef)` — adiciona um overlay ao topo da pilha, retorna o z-index calculado (incremental a partir de um valor base configurável).
- `pop(overlayRef)` — remove um overlay específico da pilha (não necessariamente o topo).
- `top()` — retorna a referência do overlay no topo da pilha, ou `null` se vazia.
- `size()` — quantidade de overlays abertos.

Não implementar aqui a lógica de ESC (isso é `su-hotkey`, ligado a cada overlay individualmente na Etapa 4) — este serviço só gerencia a pilha e o z-index.

### 5.3 `core/overlay/floating-position.directive.js` — `su-floating-position`

Diretiva de atributo (`restrict: 'A'`) fina: no `link`, chama `computePosition` de `@floating-ui/dom` passando o elemento de referência (via binding/atributo) e o elemento flutuante (o próprio elemento da diretiva), aplicando o `top`/`left` resultante como `style` inline. Expor via bindings (isolate scope): `reference` (elemento ou seletor de referência), `placement` (default `'bottom'`), `offset` (default `0`). Limpar listeners no `$onDestroy`/`scope.$on('$destroy', ...)`.

### 5.4 `core/overlay/focus-trap.directive.js` — `su-focus-trap`

Diretiva de atributo: no `link`, instancia `createFocusTrap` (de `focus-trap`) no elemento, ativa no `link` (ou quando um binding `active` se tornar `true`), desativa e destrói no `$onDestroy`. Expor binding `active` (boolean) para permitir ativação/desativação dinâmica (necessário para Modal/Drawer que abrem e fecham sem recriar o DOM).

### 5.5 `core/overlay/hotkey.directive.js` — `su-hotkey`

Diretiva de atributo: recebe um binding `key` (string, ex. `'esc'`, `'mod+k'`) e um binding `onTrigger` (`&`, callback). No `link`, registra via `Mousetrap.bind(key, callback)`; no `$onDestroy`, `Mousetrap.unbind(key)`. Deve suportar múltiplas instâncias simultâneas sem uma sobrescrever o binding da outra (usar `Mousetrap(element[0])` por instância, não o singleton global, quando o binding for local a um elemento específico — para o atalho global do CommandPalette na Etapa 3, usar o singleton global `Mousetrap.bind`).

### 5.6 `core/color-mode/color-mode.service.js` — `suColorMode`

Factory simples: `get()` (lê de `localStorage`, default `'system'`), `set(mode)` (persiste em `localStorage` e aplica/remove a classe `dark` no `documentElement`), `toggle()`. Não precisa de biblioteca externa — é intencionalmente simples (mesma lógica de qualquer dark-mode toggle padrão).

### 5.7 `core/id/id.service.js` — `suId`

Factory: `next(prefix)` retorna uma string única incremental (`prefix + '-' + contador`), usada para gerar ids de `aria-labelledby`/`aria-describedby`/`for`/`id` em componentes de formulário e overlay nas próximas etapas. Implementação trivial (contador incremental em closure), sem dependência externa.

### 5.8 `core/core.module.js`

```js
(function () {
  'use strict';

  angular.module('singularUi.core', ['ngAria', 'ngAnimate']);
})();
```

### 5.9 `singular-ui.module.js`

```js
(function () {
  'use strict';

  angular.module('singularUi', ['singularUi.core']);
})();
```

(A dependência `singularUi.components` só é adicionada aqui a partir da Etapa 1, quando o módulo existir.)

### 5.10 `scripts/generate-tailwind-safelist.js`

Script Node (não precisa rodar em browser) que:
1. Varre recursivamente `src/**/*.theme.js` (ainda não existirá nenhum nesta etapa, mas o script deve rodar sem erro e produzir uma safelist vazia).
2. Extrai todas as strings de classe literais dos objetos de tema (via regex simples ou `require`/`eval` controlado do módulo, já que são arquivos `.constant()` com um objeto JS).
3. Escreve um arquivo `tailwind.safelist.json` (array de strings) na raiz, para ser referenciado pelo `tailwind.config.js`.

### 5.11 Demo app (`demo/`)

App Angular mínimo (`demo/index.html` + `demo/app.js`) que carrega `singular-ui.module.js` como dependência e serve uma página em branco com hot-reload (pode usar `vite` ou `browser-sync` — escolha livre do agente, desde que documentado no README). Não precisa de rotas ainda (isso começa a fazer sentido na Etapa 1, quando há componentes para mostrar).

### 5.12 `THIRD-PARTY-LICENSES.md`

Listar, com nome, versão instalada e licença: AngularJS, Nuxt UI e Reka UI (como referência comportamental/de design, não como dependência de código), Floating UI, focus-trap, tabbable, Mousetrap, date-fns, tailwind-merge, Tailwind CSS.

### 5.13 Ambiente/CI

- `.nvmrc` fixando a versão do Node usada.
- `.gitignore` (node_modules, dist, coverage).
- `README.md` com: descrição breve do projeto, como instalar, como rodar o demo, como rodar os testes, e um aviso de que o SingularUi é um port independente sem afiliação oficial com Nuxt Labs.
- Pipeline de CI (GitHub Actions ou equivalente, arquivo `.github/workflows/ci.yml`): instala dependências, roda `karma start test/karma.conf.js --single-run` em Chrome Headless, roda `eslint`.
- `rollup.config.js`: build de `src/singular-ui.module.js` (+ todos os arquivos de `src/core/`) para `dist/singular-ui.umd.js`, formato UMD, nome global `singularUi`.

## 6. Critérios de aceite (verificar e relatar todos)

1. `npm install` roda sem erro e instala `angular@1.8.3` exatamente (conferir em `node_modules/angular/package.json`).
2. `suTv` passa em todos os testes de `tv.service.spec.js` (mínimo 4 casos, incluindo 1 compound variant).
3. `karma start test/karma.conf.js --single-run` roda e passa em Chrome Headless.
4. `eslint .` roda sem erros de convenção (Y001/Y010/Y024 pelo menos, verificados manualmente já que não há regra de lint pronta para elas).
5. `rollup -c` gera `dist/singular-ui.umd.js` sem erro, e o arquivo gerado expõe `window.singularUi` quando carregado via `<script>` puro (testar num HTML simples).
6. Demo app sobe localmente (`npm run demo` ou equivalente) e carrega `singularUi` sem erros no console.
7. **Smoke test de integração** (não são os componentes de produção — esses são construídos de verdade nas Etapas 1 e 4, com fidelidade completa ao tema do Nuxt UI; aqui é só uma prova mínima e descartável de que a fundação funciona):
   - Montar um `<div>` minúsculo usando `suTv` com um tema de teste simples (2-3 classes), só para provar que `suTv` + a estrutura de módulos funcionam ponta a ponta com um teste unitário passando.
   - Montar uma página de teste temporária (dentro do próprio `demo/`) com um elemento posicionado via `su-floating-position` relativo a um botão, um `su-focus-trap` ativável por um binding, e um `su-hotkey` respondendo a `esc`. Relatar que os três se comportam como esperado (posição calculada corretamente, foco preso enquanto ativo, callback disparado no ESC).
   - Nenhum desses dois testes deve virar um arquivo permanente em `src/components/` — ficam em `demo/` ou em um teste de spec, e são descartados/substituídos quando a Etapa 1 (Badge) e a Etapa 4 (Tooltip) implementarem os componentes reais.
8. `git log` mostra pelo menos um commit desta etapa, `git remote -v` aponta `origin` para `github.com/oaugustus/singular-ui` **sem token embutido na URL**, e o push para o repositório remoto foi confirmado (branch visível no GitHub com os arquivos desta etapa, incluindo `specs/`).

## 7. Fora de escopo desta etapa

Não implementar: qualquer componente `su*` visual (Button, Badge, etc. — Etapa 1), Docusaurus/docs (Etapa 9), `generate-props-docs.js` (Etapa 9), `components.module.js` (nasce na Etapa 1).

## 8. Sobre o mapeamento com o TickTick

O TODO da seção 9 é um espelho exato (mesmo texto) das 25 tarefas do projeto "Etapa 0 - Fundação" no TickTick. As duas tarefas `[Critério de aceite] suBadge end-to-end...` e `[Critério de aceite] Tooltip de teste...` correspondem ao smoke test da seção 6, item 7 deste documento — não a uma implementação completa de Badge/Tooltip (essa só acontece nas Etapas 1 e 4). Marque-as com base nesse smoke test, não com base em componentes de produção.

## 9. TODO (espelho das tarefas do TickTick — marcar aqui, não no TickTick)

- [x] Estrutura de pastas do repositório (LIFT + folder-by-feature)
  - Evidência: criados `src/core/{tv,overlay,color-mode,id}/` com placeholders vazios (`*.service.js`, `*.directive.js`, `*.module.js`, `tv.service.spec.js`), `demo/.gitkeep`, `dist/.gitkeep`, `test/karma.conf.js`, `scripts/generate-tailwind-safelist.js`; confirmado via `find src demo dist test scripts -print` — sem `src/components/` nem `docs/`.
- [x] package.json com dependências de terceiros (Floating UI, focus-trap, tabbable, Mousetrap, date-fns, tailwind-merge)
  - Evidência: criado `package.json` + `npm install` das 6 deps (`^`); versões em `node_modules`: `@floating-ui/dom@1.8.0`, `focus-trap@7.8.0`, `tabbable@6.5.0`, `mousetrap@1.6.5`, `date-fns@4.4.0`, `tailwind-merge@3.6.0`; `package-lock.json` gerado; 0 vulnerabilities.
- [x] Configurar ESLint (eslint-plugin-angular)
  - Evidência: ESLint 8.57.1 + eslint-plugin-angular@4.1.0 (caminho legado `.eslintrc.cjs` + `plugin:angular/johnpapa`); criados `.eslintrc.cjs`, `.eslintignore`, script `npm run lint`; `npm run lint` / `eslint .` exit 0; escolha documentada no README.
- [ ] Configurar Karma + Jasmine
- [ ] Implementar suTv (motor de tema)
- [ ] Testes de fixture: suTv vs tailwind-variants
- [ ] Incluir ngAria e ngAnimate no módulo singularUi.core
- [ ] Implementar serviço suOverlayStack
- [ ] Diretiva su-floating-position (wrapper Floating UI)
- [ ] Diretiva su-focus-trap (wrapper focus-trap)
- [ ] Diretiva su-hotkey (wrapper Mousetrap)
- [ ] Script generate-tailwind-safelist.js
- [ ] App de demo vazio com hot-reload
- [ ] THIRD-PARTY-LICENSES.md inicial
- [ ] [Critério de aceite] suBadge end-to-end com teste unitário passando
- [ ] [Critério de aceite] Tooltip de teste validando su-floating-position + su-hotkey
- [ ] Instalar e fixar AngularJS 1.8.3 como dependência core do projeto
- [ ] Instalar e configurar Tailwind CSS (CLI/PostCSS)
- [ ] Configurar bundler Rollup para build UMD (singular-ui.js)
- [ ] Ambiente de desenvolvimento base: versão do Node/npm fixada, .gitignore, README inicial, pipeline de CI (Karma em Chrome Headless)
- [ ] Implementar serviço suId (geração de ids únicos para ARIA)
- [ ] Implementar serviço suColorMode (troca de tema claro/escuro)
- [ ] Criar core.module.js e singular-ui.module.js (módulo raiz agregando singularUi.core e singularUi.components)
- [x] Corrigir remote do git (remover token embutido na URL) e confirmar autenticação local com o GitHub
  - Evidência: `git remote -v` verificado em 2026-08-01 — fetch e push de `origin` ambos limpos, apontando para `https://github.com/oaugustus/singular-ui.git` sem credencial embutida.
- [ ] Primeiro commit: estrutura inicial + specs de planejamento em /specs, push para o GitHub
