Você vai trabalhar em uma única tarefa do projeto Gravity Elements, definida no arquivo
specs/spec-etapa-1-layout-element.md deste repositório.

Tarefa (copiar exatamente): "Componente: App"

Antes de propor qualquer plano:
1. Leia specs/spec-etapa-1-layout-element.md por completo, especialmente a seção 3
   (estrutura de pastas), a seção 6 (tabela de bindings do geApp) e a seção 5
   (contrato de componente / origem dos valores de tema).
2. Leia specs/gravity-elements-especificacao-tecnica.md, seção 5 (contrato de
   componente, exemplo button.component.js/button.theme.js — molde de estrutura).
3. Inspecione o estado atual do repositório — não assuma nada de conversas anteriores.
   Em especial, confirme que src/components/ ainda não existe (nasce nesta etapa) e
   que geColorMode (Etapa 0) já está disponível para o geApp consumir no $onInit.
4. Consulte o Nuxt UI real na versão fixada pela seção 5.1 (**v4.10.0**,
   github.com/nuxt/ui ou ui.nuxt.com/docs/components/app) para os valores de
   tema/comportamento exatos do App antes de portar — este documento não embute
   os valores de classe, só a estrutura esperada.
5. Confira a seção 5.5 (ARIA mínimo) e a seção 9 (Critérios de aceite) — em
   especial os itens 1, 2 e 5 (contrato completo + teste + build UMD/Rollup sem
   regressão) se aplicam a esta tarefa.

Proponha um plano do que vai ser criado (arquivos e pastas) para completar essa
tarefa. Não implemente nada ainda — aguarde minha aprovação do plano.

Depois de aprovado: implemente, rode qualquer verificação aplicável, e só então
marque o item como "- [x]" no TODO (seção 12) deste mesmo arquivo de spec, com uma
sub-linha de evidência do que foi feito. Não altere o texto do item. Não toque
em nenhum sistema de gestão de tarefas fora deste arquivo.