# SingularUi — Especificação Técnica

Versão 1.0 — biblioteca de componentes UI para AngularJS 1.8.3 (última versão lançada do AngularJS), portando o design system do Nuxt UI (Vue 3 + Reka UI + tailwind-variants), estruturada segundo o guia de estilo do John Papa, para construção de SPAs (dashboards, painéis administrativos, ferramentas internas).

## 1. Objetivo e escopo

O SingularUi é uma biblioteca de componentes reutilizáveis para AngularJS 1.8.3, com paridade visual e de API com o Nuxt UI, e paridade estrutural de projeto com o guia de estilo do John Papa para AngularJS ([johnpapa/angular-styleguide, pasta `a1`](https://github.com/johnpapa/angular-styleguide/tree/main/a1) — confirmado como a referência exata deste projeto). Não é um site de blocos copiáveis: é um pacote instalável (`singular-ui`), com componentes versionados, tema consistente e comportamento acessível, destinado a aplicações internas modernas — não a websites de marketing.

Escopo confirmado da v1: Etapas 0 a 6 do plano de implementação (Layout, Element, Form, Data, Navigation, Overlay e Dashboard, ~80 componentes), seguidas da Etapa 9 (documentação e publicação). Fora de escopo da v1: categorias Page (marketing/blog), AI Chat, Editor, Content, Color Mode e i18n do Nuxt UI (ver seção 12 — candidatas a v2).

## 2. Pilares arquiteturais

1. **Component-based**: todo elemento visual é um `.component()` do Angular (disponível desde 1.5), nunca diretiva crua isolada ou controller solto amarrado a HTML genérico.
2. **Motor de tema desacoplado** (`suTv`): função pura que resolve classes Tailwind a partir de props, replicando o papel do `tailwind-variants` do Nuxt UI. Os arquivos de tema (`*.theme.js`) são portados quase 1:1 dos arquivos `theme/*.ts` do Nuxt UI, pois são apenas dados.
3. **Camada de interatividade por composição, não por reinvenção**: em vez de reescrever foco, teclado e posicionamento do zero, o SingularUi encapsula bibliotecas headless de terceiros já maduras e mantidas (Floating UI, focus-trap, tabbable, Mousetrap/hotkeys-js, Embla, Fuse.js) atrás de diretivas/serviços finos — o mesmo papel que o Reka UI cumpre no Nuxt UI, só que montado a partir de peças prontas em vez de escritas do zero (ver seção 7). Também se usam os módulos oficiais do próprio AngularJS (`ngAria`, `ngAnimate`, `ngMessages`) sempre que cobrirem a necessidade, antes de cogitar código próprio.
4. **Convenção de projeto do John Papa**: LIFT (Locate, Identify, Flat, Try to stay DRY), um artefato Angular por arquivo, `controllerAs`, nomenclatura `feature.tipo.js`.
5. **Build agnóstico de app host**: consumível via `<script>` (UMD) ou via bundler, sem forçar um stack de build específico no projeto consumidor.

## 3. Convenções de código (regras do John Papa aplicadas)

Referência: [johnpapa/angular-styleguide, pasta `a1`](https://github.com/johnpapa/angular-styleguide/tree/main/a1) — códigos de regra (`Y0xx`) conferidos diretamente contra o README oficial.

- Um artefato Angular por arquivo — um `.component()`, um `.factory()`, um `.directive()` por arquivo, <400 linhas (**Y001**, "Rule of 1").
- IIFE em todo arquivo: `(function () { 'use strict'; ... })();` (**Y010**).
- Módulo declarado sem variável, via setter syntax, uma única vez por módulo (**Y021**, **Y023**); todo arquivo que adiciona algo ao módulo usa a getter syntax encadeada (`angular.module('singularUi.element').component(...)`), nunca guarda o módulo numa variável (**Y022**).
- Funções nomeadas em vez de anônimas dentro de `.component()`/`.factory()`/`.directive()` — melhora stack traces e legibilidade (**Y024**).
- `controllerAs` em vez do `$scope` clássico (**Y030**, **Y031**), com variável de captura curta e consistente `vm` (**Y032**).
- Nome de arquivo = `<feature>.<tipo>.js`: `button.component.js`, `overlay-stack.service.js`, `focus-trap.directive.js`, `button.theme.js`, `button.component.spec.js` — mesma convenção usada nos exemplos do guia para diretivas (**Y070**, "Limit 1 Per File").
- Prefixo curto e exclusivo para todo elemento/atributo customizado: `su-` (ex.: `su-button`, `su-floating-position`), evitando colisão com `ng-` e com prefixos de outras libs (**Y073**, "Provide a Unique Directive Prefix").
- Módulo por feature: cada pasta de categoria (`element/`, `form/`, `overlay/`...) tem seu próprio módulo, seguindo a mesma ideia de setter/getter das regras Y021–Y023, só que aplicada a um módulo por feature em vez de um único módulo de app.
- Evitar `$scope` fora dos casos necessários (broadcast entre componentes, integração com libs de terceiros); preferir bindings isolados + `controllerAs`.
- Pastas organizadas por feature, nunca por tipo técnico (nada de pasta `controllers/` ou `templates/` genérica) — princípio **LIFT** (**Y140**–**Y144**: Locate, Identify, Flat, T-DRY) e **Folders-by-Feature Structure** (**Y152**).
- `bindings` documentados via JSDoc no topo do controller, espelhando o nome das props originais do Nuxt UI sempre que possível (`color`, `variant`, `size`, `disabled`, `loading`...) para facilitar consulta cruzada com a documentação de referência.

## 4. Estrutura de projeto (LIFT + folder-by-feature)

```
singular-ui/
├── src/
│   ├── core/
│   │   ├── tv/
│   │   │   ├── tv.service.js            # suTv — resolvedor de variantes
│   │   │   └── tv.service.spec.js
│   │   ├── overlay/
│   │   │   ├── overlay-stack.service.js          # glue: pilha de overlays, z-index, roteamento do ESC
│   │   │   ├── floating-position.directive.js    # wrapper fino sobre @floating-ui/dom
│   │   │   ├── focus-trap.directive.js           # wrapper fino sobre focus-trap (davidtheclark)
│   │   │   └── hotkey.directive.js               # wrapper fino sobre Mousetrap/hotkeys-js
│   │   ├── color-mode/
│   │   │   └── color-mode.service.js
│   │   ├── id/
│   │   │   └── id.service.js             # suId — geração de ids únicos p/ ARIA
│   │   └── core.module.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app/
│   │   │   │   ├── app.component.js
│   │   │   │   ├── app.html
│   │   │   │   └── app.component.spec.js
│   │   │   ├── container/ ...
│   │   │   ├── sidebar/ ...
│   │   │   └── layout.module.js
│   │   ├── element/
│   │   │   ├── button/
│   │   │   │   ├── button.component.js
│   │   │   │   ├── button.html
│   │   │   │   ├── button.theme.js       # porte de theme/button.ts do Nuxt UI
│   │   │   │   └── button.component.spec.js
│   │   │   ├── badge/ ...
│   │   │   ├── avatar/ ...
│   │   │   └── element.module.js
│   │   ├── form/ ...
│   │   ├── data/ ...
│   │   ├── navigation/ ...
│   │   ├── overlay/ ...
│   │   └── components.module.js           # agrega os módulos de categoria
│   └── singular-ui.module.js              # angular.module('singularUi', ['singularUi.core', 'singularUi.components'])
├── demo/                                   # showcase app, 1 rota por componente
├── dist/                                   # build UMD + CSS final
├── test/
│   └── karma.conf.js
├── docs/                                   # site Docusaurus (1 página MDX por componente)
│   ├── docusaurus.config.js
│   ├── docs/components/<categoria>/<nome>.mdx
│   └── static/props/                       # JSON gerado por generate-props-docs.js
├── scripts/
│   ├── generate-tailwind-safelist.js       # varre *.theme.js e gera safelist p/ Tailwind
│   └── generate-props-docs.js              # varre *.component.js e gera JSON de bindings p/ o Docusaurus
├── THIRD-PARTY-LICENSES.md                 # atribuição MIT ao Nuxt UI/Reka UI/Floating UI/etc.
├── package.json
└── README.md
```

## 5. Contrato de componente

Todo componente do SingularUi deve conter, no mínimo:

- `*.component.js` — definição do `.component()`, bindings documentados, controller nomeado, `controllerAs: 'vm'`.
- `*.html` — template.
- `*.theme.js` — objeto de tema (`slots`, `variants`, `compoundVariants`, `defaultVariants`), consumido via `suTv`.
- `*.component.spec.js` — teste unitário Karma/Jasmine.
- Opcional: `*.directive.js` para comportamento de baixo nível reaproveitado por múltiplos componentes (ex.: `focus-trap` é usado por Modal, Drawer e Slideover).

### Exemplo — `button.component.js`

```js
(function () {
  'use strict';

  angular.module('singularUi.element').component('suButton', {
    templateUrl: 'components/element/button/button.html',
    controllerAs: 'vm',
    bindings: {
      label: '@',
      color: '@',      // 'primary' | 'neutral' | ...
      variant: '@',    // 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
      size: '@',       // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      block: '<',
      square: '<',
      loading: '<',
      disabled: '<',
      onClick: '&'
    },
    controller: ButtonController
  });

  ButtonController.$inject = ['suTv', 'suButtonTheme'];

  function ButtonController(suTv, suButtonTheme) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.classes = suTv(suButtonTheme)({
        color: vm.color || 'primary',
        variant: vm.variant || 'solid',
        size: vm.size || 'md',
        block: vm.block,
        square: vm.square,
        loading: vm.loading
      });
    }
  }
})();
```

### Exemplo — `button.theme.js` (porte direto do Nuxt UI)

```js
(function () {
  'use strict';

  angular.module('singularUi.element').constant('suButtonTheme', {
    slots: {
      base: 'rounded-md font-medium inline-flex items-center transition-colors',
      label: 'truncate',
      leadingIcon: 'shrink-0',
      trailingIcon: 'shrink-0'
    },
    variants: {
      color: { primary: '', neutral: '' },
      variant: { solid: '', outline: '', soft: '', subtle: '', ghost: '', link: '' },
      size: {
        xs: { base: 'px-2 py-1 text-xs gap-1' },
        sm: { base: 'px-2.5 py-1.5 text-xs gap-1.5' },
        md: { base: 'px-2.5 py-1.5 text-sm gap-1.5' },
        lg: { base: 'px-3 py-2 text-sm gap-2' },
        xl: { base: 'px-3 py-2 text-base gap-2' }
      },
      block: { true: { base: 'w-full justify-center' } }
    },
    compoundVariants: [
      { color: 'primary', variant: 'solid', class: 'text-inverted bg-primary hover:bg-primary/75' }
      /* ...demais combinações, copiadas de theme/button.ts do Nuxt UI */
    ],
    defaultVariants: { color: 'primary', variant: 'solid', size: 'md' }
  });
})();
```

## 6. Especificação do `suTv` (motor de tema)

- **Input**: objeto `{ slots, variants, compoundVariants, defaultVariants }` — mesmo formato dos arquivos `theme/*.ts` do Nuxt UI.
- **Output**: função `resolve(props)` que devolve um objeto `{ base: 'classes...', label: 'classes...', ... }`, uma chave por slot.
- **Algoritmo de resolução**:
  1. Aplicar `defaultVariants`.
  2. Sobrescrever com os valores de `props` explicitamente informados.
  3. Para cada slot, concatenar: classe base do slot + classe da variante ativa em cada dimensão (`color`, `variant`, `size`, etc.) que afete aquele slot.
  4. Aplicar `compoundVariants` cujas condições batem simultaneamente com os valores resolvidos, anexando suas classes.
  5. Deduplicar classes conflitantes usando a mesma lógica de merge do `tailwind-merge` (o Nuxt UI usa isso internamente) — recomenda-se importar `tailwind-merge` como dependência direta em vez de reimplementá-lo.
- **Testabilidade**: `suTv` deve ser testável isoladamente, sem Angular carregado, para permitir testes de fixture comparando a saída do SingularUi com a saída real do `tailwind-variants` para o mesmo input de props (ver seção 9).

## 7. Camada de interatividade (composição de bibliotecas prontas, decisão confirmada)

**Decisão:** a camada de interatividade não é escrita do zero. O Reka UI (exclusivo do Vue) é substituído por um conjunto de bibliotecas headless de terceiros, ativamente mantidas e agnósticas de framework, encapsuladas em diretivas/serviços finos do SingularUi. Regra geral do projeto: antes de escrever qualquer lógica de comportamento nova, verificar se um módulo oficial do AngularJS ou uma biblioteca vanilla já resolve o problema.

### 7.1 Módulos oficiais do próprio AngularJS (primeira escolha, sempre)

| Módulo | Uso no SingularUi |
|---|---|
| `ngAria` | Adiciona automaticamente atributos ARIA (`aria-disabled`, `aria-required`, `aria-checked`, `aria-invalid`) a `ng-disabled`, `ng-required`, `ng-checked`, `ngModel` — cobre boa parte do trabalho de acessibilidade sem código próprio. |
| `ngAnimate` | Transições de entrada/saída (`ng-enter`/`ng-leave`) para Modal, Drawer, Slideover, Toast, Collapsible, Accordion — dispensa uma diretiva de transição customizada. |
| `ngMessages` | Validação e exibição de erros em Form/FormField (decisão já registrada na seção 13 do plano de etapas). |

### 7.2 Bibliotecas de terceiros (headless, sem HTML/CSS próprio)

| Necessidade | Biblioteca | Componentes que dependem |
|---|---|---|
| Posicionamento flutuante | **Floating UI** (`@floating-ui/dom`) | Popover, Tooltip, DropdownMenu, ContextMenu, CommandPalette, SelectMenu, InputMenu |
| Focus trap | **focus-trap** (davidtheclark) | Modal, Drawer, Slideover, ContextMenu |
| Localizar/ordenar elementos focáveis | **tabbable** (mesma família do focus-trap) | Base para roving tabindex em Listbox, Tabs, Accordion, RadioGroup, CheckboxGroup |
| Atalhos de teclado (ESC, Cmd/Ctrl+K, setas) | **Mousetrap** (ou `hotkeys-js`) | Todos os overlays (ESC fecha), CommandPalette (atalho global), navegação por teclado em geral |
| Busca fuzzy | **Fuse.js** | CommandPalette |
| Carousel com swipe | **Embla** | Carousel |
| Datas | **date-fns** (+ opcionalmente `@internationalized/date`, já usado pelo próprio Nuxt UI e agnóstico de framework) | Calendar, InputDate, InputTime |

Nenhuma dessas bibliotecas tem markup ou CSS próprio — todas retornam comportamento puro (posição calculada, foco gerenciado, elementos filtrados), deixando o Tailwind/`suTv` no controle total da aparência. Isso preserva a mesma divisão de responsabilidade do Reka UI original: comportamento desacoplado de estilo.

### 7.3 O que continua sendo código próprio do SingularUi (glue code, não reinvenção)

Só permanece custom aquilo que é integração específica com o ciclo de vida do Angular, sem equivalente pronto:

- **`suOverlayStack`**: serviço que mantém a pilha de overlays abertos, resolve z-index incrementalmente e decide qual overlay recebe o ESC do Mousetrap (o do topo, não todos). É orquestração, não reimplementação de foco/posicionamento.
- **Diretivas wrapper finas** (`su-floating-position`, `su-focus-trap`, `su-hotkey`) que só chamam a API da respectiva biblioteca no `$onInit`/`$onDestroy` do componente Angular — poucas linhas cada, sem lógica de comportamento própria.
- **`suToast`**: fila de mensagens + portal fixo; não precisa de posicionamento dinâmico (Floating UI) nem de foco (focus-trap), então não há biblioteca externa equivalente a reaproveitar aqui — é intencionalmente simples.

### 7.4 Outras bibliotecas de terceiros recomendadas por componente (fora do núcleo de interatividade)

| Componente | Biblioteca sugerida em vez de lógica própria |
|---|---|
| Table | **ui-grid** ou **angular-smart-table** — ambas nativas do ecossistema AngularJS 1.x, com ordenação/paginação/filtro prontos; usar só como motor de dados, com template Tailwind próprio. |
| FileUpload | **ng-file-upload** — drag-and-drop, progresso e validação de arquivo já prontos para AngularJS 1.x. |
| ColorPicker | **Pickr** (`@simonwep/pickr`) ou **vanilla-picker** — headless o suficiente para restylizar com Tailwind. |
| ScrollArea (virtualização) | **Clusterize.js** para listas longas, evitando reimplementar virtualização manualmente. |

Ao adotar essas bibliotecas, a Etapa correspondente do plano de implementação passa a ser majoritariamente trabalho de *wrapper* (bindings Angular + tema Tailwind em cima do comportamento pronto), não de escrever a lógica do zero — o que reduz o esforço estimado nas etapas 2, 4 e 5 (ver plano de etapas, seção atualizada).

## 8. Build e tooling

- **CSS**: Tailwind CLI/PostCSS gerando um `singular-ui.css` único. Como várias classes são geradas via template string (`bg-${color}`), é necessário um script (`scripts/generate-tailwind-safelist.js`) que varre todos os `*.theme.js` e monta a safelist do Tailwind — mesmo problema que o próprio Nuxt UI resolve com seu módulo Nuxt; aqui resolvido via script Node standalone.
- **JS**: bundler gerando UMD, compatível tanto com `<script>` tag (modelo clássico do AngularJS) quanto com `require`/`import` em bundlers modernos. Rollup é preferível a Webpack para output de biblioteca (menos boilerplate de configuração).
- **Testes**: Karma + Jasmine (padrão da era AngularJS/John Papa), rodando em Chrome Headless via CI.
- **Lint**: ESLint com plugin de Angular (`eslint-plugin-angular`) + checklist de PR reforçando as convenções da seção 3 (IIFE, arquivo único por artefato, funções nomeadas) — parte disso pode virar regra de lint custom, parte fica em checklist de revisão humana.
- **Documentação**: **Docusaurus** (decisão confirmada). Uma página MDX por componente, com tabela de props/bindings e exemplo de código. Como o Docusaurus é baseado em React e o SingularUi é AngularJS, o preview ao vivo de cada componente é embutido via `<iframe>` apontando para a rota correspondente do app `demo/` — não há tentativa de interoperar React e Angular na mesma árvore de renderização. A tabela de props é gerada automaticamente pelo script `scripts/generate-props-docs.js`, que faz parsing dos `bindings` de cada `*.component.js` (via AST, ex. `acorn`) e produz um JSON consumido pelas páginas MDX, evitando duplicar manualmente a documentação de props que já existe no código.

## 9. Estratégia de testes e verificação

- Teste unitário por componente (Karma/Jasmine), cobrindo bindings, eventos (`onClick`, etc.) e estados (disabled/loading).
- Teste de fixture para `suTv`: gerar casos de teste a partir dos mesmos inputs de props usados nos testes do Nuxt UI original e comparar string de classes resultante (normalizada) — pega regressões de tema cedo.
- Checklist de acessibilidade manual para componentes de overlay/navegação (paridade com garantias do Reka UI): navegação por teclado, ordem de foco, `aria-*` corretos, anúncio em leitor de tela.
- Comparação visual componente a componente com o preview ao vivo de `ui.nuxt.com/docs/components/<nome>` (fonte confiável, sem ofuscação de CSS).

## 10. Compatibilidade

- AngularJS 1.8.3 (última versão estável lançada) não dá suporte oficial a IE9/10/11 — baseline assumida: navegadores evergreen modernos (Chrome, Firefox, Edge, Safari atualizados), compatível com o objetivo de SPAs modernas.
- Tailwind CSS v3 é a escolha mais segura no início (maior compatibilidade); avaliar migração para v4 conforme necessidade do projeto consumidor.

## 11. Licenciamento e atribuição

O Nuxt UI é licenciado sob MIT, que permite uso, modificação e redistribuição — inclusive como base de um projeto derivado como o SingularUi — desde que o aviso de copyright original seja preservado. Ações concretas:

- Cabeçalho de comentário nos arquivos `*.theme.js` portados, citando a origem (`Portado de github.com/nuxt/ui, MIT License, Copyright (c) Nuxt Labs`).
- Arquivo `THIRD-PARTY-LICENSES.md` na raiz do repositório, listando todas as dependências de terceiros usadas como comportamento pronto (seção 7): Nuxt UI e Reka UI (referência), Floating UI, focus-trap, tabbable, Mousetrap/hotkeys-js, Fuse.js, Embla, date-fns, `tailwind-merge`, e as libs por componente da seção 7.4 (ui-grid/angular-smart-table, ng-file-upload, Pickr/vanilla-picker, Clusterize.js) — todas com licenças permissivas (MIT/Apache-2.0), a confirmar individualmente antes da publicação.
- `README.md` do SingularUi deixando claro que o projeto é um port independente, sem afiliação oficial com Nuxt Labs.

## 12. Fora de escopo da v1 (candidatos a v2)

- Categoria **Page** (AuthForm, BlogPost(s), Pricing*, Changelog*) — componentes de marketing/conteúdo, não essenciais para painéis internos.
- Categoria **AI Chat** — só relevante se o projeto precisar de interface de chatbot.
- Categoria **Editor** — editor de texto rico, esforço próprio considerável (ligado a ProseMirror/Tiptap no original).
- Categoria **Content** e **i18n** (`LocaleSelect`) — dependentes do ecossistema de conteúdo do Nuxt, sem equivalente direto necessário fora dele.
- Categoria **Color Mode** (`ColorModeAvatar/Button/Image/Select/Switch`) — variantes de outros componentes por tema claro/escuro; o `suColorMode` (serviço core) já cobre a troca de tema, essas variantes de componente ficam para v2.
- **Dashboard entra no escopo da v1** (Etapa 6 do plano de implementação) — não está mais na lista de itens fora de escopo.
