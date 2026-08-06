# Processo de implementação — Claude ⇄ Cursor ⇄ Claude ⇄ TickTick

> Processo operacional válido para todas as etapas do Gravity Elements (não é específico da Etapa 0). Referenciado a partir de cada spec de etapa.

## Papel de cada ferramenta

- **Claude (Cowork, esta sessão de planejamento)** — escreve a especificação técnica e a spec de implementação de cada etapa (com o TODO da seção 9, espelhando exatamente os títulos das tarefas do TickTick); depois de cada entrega, verifica de forma independente o que foi feito e sincroniza o status no TickTick. Também é quem versiona no GitHub e resolve pendências de repositório/segurança.
- **Cursor** — implementa o código, uma tarefa do TODO por vez, em modo Plan.
- **TickTick** — sistema de tracking do progresso (grupo "Gravity Elements", um projeto por etapa). **O Cursor nunca acessa o TickTick.** A única fonte que o Cursor lê e escreve é o TODO (seção 9) do arquivo de spec da etapa.

## Fluxo por tarefa (não por etapa inteira)

Cada tarefa do TODO vira **um chat de Plan mode separado no Cursor** — não um chat único cobrindo a etapa toda.

1. **Abrir o chat no Cursor** com um prompt que inclua obrigatoriamente:
   - O texto exato da tarefa, copiado do TODO (seção 9 da spec da etapa).
   - Referência à(s) seção(ões) correspondente(s) da especificação técnica (`gravity-elements-especificacao-tecnica.md`) relevantes para aquela tarefa.
   - Instrução explícita para o Cursor **inspecionar o estado atual do repositório** antes de propor qualquer coisa — não assumir nada de conversas anteriores.
   - O arquivo `plantask.md` (raiz do repo) é o template reaproveitável para montar esse prompt.
2. **Plan** — o Cursor propõe o que vai ser criado/alterado (arquivos, funções, testes). Não implementa nada ainda.
3. **Aprovação** — Otávio revisa e aprova o plano antes do build.
4. **Build** — o Cursor implementa e roda qualquer verificação aplicável (testes, lint).
5. **Atualizar o TODO** — só depois de **verificar o comportamento** (não só escrever código e assumir que funciona), o Cursor marca o item como `- [x]` na seção 9 da spec da etapa, com uma sub-linha de evidência (comandos rodados, resultado, arquivos criados). Não altera o texto do item.

## Sincronização com o TickTick (regra crítica)

A sincronização do TickTick é feita **exclusivamente por esta sessão (Claude/Cowork)**, nunca pelo Cursor, e **nunca por confiança em relato** — nem do Cursor, nem do próprio Otávio dizendo "pronto, feito".

Antes de marcar qualquer tarefa como concluída no TickTick:
1. Ler a evidência escrita no TODO da spec.
2. **Verificar diretamente** — inspecionar o código real, rodar `eslint`/testes quando possível, checar `git log`/`git status`/`git diff --stat`, ler o conteúdo real dos arquivos citados como evidência.
3. Só então marcar a tarefa como concluída no TickTick (e, se necessário, corrigir/reabrir a evidência na spec quando a verificação não bater com o que foi relatado).

Esse padrão já pegou dois problemas reais neste projeto: um token do GitHub que ficou parcialmente exposto mesmo depois de um "resolvido" reportado, e uma tarefa do TODO marcada como pronta sem o ambiente de teste realmente validado.

## Outras práticas estabelecidas

- **Commits incrementais** — não acumular "centenas de arquivos alterados" para um commit gigante no final; commitar em pedaços pequenos e coerentes, um por entrega/tarefa quando possível.
- **Nunca lidar com credenciais/tokens diretamente** — se um token aparecer exposto (ex.: em `git remote -v`), alertar o Otávio e instruir a correção; nunca imprimir, logar, reutilizar ou commitar o valor.
- **Checagem de colisão de nome/marca antes de adotar publicamente** — lição do caso GravityUi → Gravity Elements (colisão com o "Gravity UI" da Yandex). Qualquer nome novo (projeto, módulo público, pacote) deveria passar por uma checagem rápida antes de virar definitivo.
- **Verificação independente como padrão geral** — vale para qualquer alegação de "está pronto", em qualquer contexto (código, ambiente, configuração), não só para o TickTick.

## Pendências relacionadas a este processo

- Definição de modelo/nível de esforço recomendado para os chats do Cursor foi discutida em sessão anterior, mas não ficou registrada formalmente aqui — se for retomada, documentar o resultado nesta seção.
