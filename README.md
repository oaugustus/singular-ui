singular-ui
===========

SingularUI - Módulo de UI do framework Singular

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
