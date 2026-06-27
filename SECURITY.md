# Política de Segurança

## Versões Suportadas

Versões que atualmente recebem atualizações de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.1.x  | ✅                 |
| 1.0.x  | ✅                 |
| < 1.0  | ❌                 |

## Reportando uma Vulnerabilidade

Se você encontrar uma vulnerabilidade de segurança nesta extensão (por exemplo, algo que
permita execução de código arbitrário, exfiltração de dados, ou qualquer comportamento que
fuja do escopo de syntax highlighting / IntelliSense / snippets / ícones / cliente LSP),
por favor **não abra uma issue pública**. Reporte de forma privada por um dos canais abaixo:

- **E-mail**: danilowilliam3255@gmail.com
- **GitHub**: utilize a aba *Security → Report a vulnerability* do repositório (vulnerabilidade
  reportada de forma privada, visível apenas para os mantenedores até ser corrigida)

Ao reportar, inclua se possível:

- Versão da extensão e do VS Code utilizados
- Passos para reproduzir o problema
- Impacto esperado (o que um atacante conseguiria fazer)

### O que esperar

- **Confirmação de recebimento**: em até 3 dias úteis.
- **Avaliação inicial**: em até 7 dias úteis, informando se o reporte foi aceito como
  vulnerabilidade válida, necessita mais informações, ou foi classificado como não aplicável.
- **Correção**: para vulnerabilidades confirmadas, o objetivo é publicar uma nova versão
  corrigida o quanto antes; o tempo exato depende da severidade e complexidade do problema.

Agradecemos relatos responsáveis — eles ajudam a manter o projeto seguro para todos que usam
a linguagem WDTL no dia a dia.

## Escopo

Esta extensão executa apenas localmente dentro do VS Code (grammar de highlighting, snippets,
tema de ícones e providers de IntelliSense em TypeScript/JavaScript). A partir da versão 1.1,
ela também inicia o processo `w lsp` via stdio como servidor de linguagem LSP.

A extensão:
- **Não** faz chamadas de rede por conta própria.
- **Não** envia dados do seu código para servidores externos.
- **Não** executa os scripts `.w` que você escreve — apenas fornece sintaxe colorida,
  sugestões no editor e se comunica com o servidor LSP local via stdio.

O servidor `w lsp` é um binário externo e independente desta extensão. Vulnerabilidades
no servidor LSP devem ser reportadas ao mantenedor do projeto `w`.
