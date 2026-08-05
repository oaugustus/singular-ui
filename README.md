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

## Demo

App AngularJS mínimo em `demo/` (página em branco, dependente de `gravityElements`). Hot-reload via **Vite**:

```bash
npm run demo
```

Abre `/demo/index.html` e recarrega ao alterar arquivos em `demo/` ou `src/`.
