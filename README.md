gravity-elements
===========

Biblioteca de componentes UI para AngularJS 1.8.3, portando o design system do Nuxt UI. Parte da arquitetura Gravity (Orbtal) — port independente, sem afiliação oficial com Nuxt Labs.

## Lint

O projeto usa **ESLint 8.x** com configuração legada (`.eslintrc.cjs`) e `eslint-plugin-angular` (preset `plugin:angular/johnpapa`), em vez de ESLint 9 flat config + FlatCompat — o plugin AngularJS é legado e não oferece flat config nativo.

```bash
npm run lint
```

## Testes

Os testes unitários usam **Karma + Jasmine** em Chrome Headless.

```bash
npm test
```

## CSS / Tailwind

O CSS da biblioteca é gerado com **Tailwind CSS v3** (CLI + PostCSS/Autoprefixer). Classes dinâmicas dos `*.theme.js` entram via safelist (`npm run generate:safelist` → `tailwind.safelist.json`).

```bash
npm run build:css
```

Gera `dist/gravity-elements.css` (entrada em `src/styles/gravity-elements.css`).

## Build JS (UMD)

O bundle JavaScript é gerado com **Rollup** (formato UMD, global `gravityElements`):

```bash
npm run build:js
```

Gera `dist/gravity-elements.umd.js` a partir de `src/index.js`. Carregue `angular` (e peers de overlay via `<script>`) antes do UMD.

## Demo

App AngularJS mínimo em `demo/` (página em branco, dependente de `gravityElements`). Hot-reload via **Vite**:

```bash
npm run demo
```

Abre `/demo/index.html` e recarrega ao alterar arquivos em `demo/` ou `src/`. Rode `npm run build:css` antes se `dist/gravity-elements.css` ainda não existir.
