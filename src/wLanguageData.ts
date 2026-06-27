// ─── GERADO A PARTIR DO LEXER, PARSER E AST OFICIAIS DA LINGUAGEM W ──────────
// Fonte: lexer.rs, parser.rs, ast.rs
// Qualquer adição à linguagem deve ser refletida aqui.

export interface CompletionEntry {
  label: string;
  kind: 'statement' | 'function' | 'aggfunc' | 'type' | 'keyword' | 'source';
  detail: string;
  doc: string;
}

// ─── Statements (comandos de pipeline) ───────────────────────────────────────
const STATEMENTS: CompletionEntry[] = [
  {
    label: 'load', kind: 'statement',
    detail: 'load <source>(<path>) as <frame>',
    doc: 'Carrega uma fonte de dados e registra como frame no pipeline.\n\n**Exemplos:**\n```w\nload csv("clientes.csv") as clientes\nload excel("dados.xlsx", sheet="Plan1") as dados\nload postgres("conn", "SELECT * FROM tb") as tb\n```',
  },
  {
    label: 'filter', kind: 'statement',
    detail: 'filter <frame> where <expr>',
    doc: 'Mantém apenas as linhas onde a expressão booleana é verdadeira.\n\n**Exemplos:**\n```w\nfilter clientes where idade >= 18\nfilter clientes where estado in ["SP", "RJ"] and ativo = true\nfilter clientes where not (email like "%@spam.com")\n```',
  },
  {
    label: 'select', kind: 'statement',
    detail: 'select <frame> [col1, col2, ...]',
    doc: 'Seleciona e reordena colunas do frame.\n\n**Exemplo:**\n```w\nselect clientes [nome, email, cidade]\n```',
  },
  {
    label: 'rename', kind: 'statement',
    detail: 'rename <frame> <col_antigo> to <col_novo>, ...',
    doc: 'Renomeia uma ou mais colunas.\n\n**Exemplos:**\n```w\nrename clientes nome to nome_completo\nrename clientes nome to nome_completo, idade to idade_anos\n```',
  },
  {
    label: 'cast', kind: 'statement',
    detail: 'cast <frame> <col> as <Tipo>, ...',
    doc: 'Converte o tipo de uma ou mais colunas.\n\n**Tipos:** `Int32`, `Int64`, `Float32`, `Float64`, `String`, `Boolean`, `Date`, `Timestamp`\n\n**Exemplo:**\n```w\ncast clientes idade as Int64, salario as Float64\n```',
  },
  {
    label: 'join', kind: 'statement',
    detail: 'join [inner|left|right|full] <left> with <right> on <left>.<col> = <right>.<col> [as <output>]',
    doc: 'Combina dois frames por uma condição de igualdade. Tipo padrão: `inner`.\n\n**Exemplos:**\n```w\njoin clientes with vendas on clientes.id = vendas.id\njoin clientes with vendas on clientes.id = vendas.id left as resultado\n```',
  },
  {
    label: 'groupby', kind: 'statement',
    detail: 'groupby <frame> [col1, col2] aggregate <alias> = <func>(<col>), ...',
    doc: 'Agrupa linhas e calcula agregações.\n\n**Funções:** `sum`, `avg`, `count`, `count_distinct`, `max`, `min`, `first`, `last`, `stddev`, `variance`\n\n**Exemplo:**\n```w\ngroupby vendas [estado] aggregate total = sum(valor), qtd = count(id)\n```',
  },
  {
    label: 'sort', kind: 'statement',
    detail: 'sort <frame> by <col> [asc|desc], ...',
    doc: 'Ordena o frame. Padrão: `asc`.\n\n**Exemplo:**\n```w\nsort clientes by estado asc, salario desc\n```',
  },
  {
    label: 'deduplicate', kind: 'statement',
    detail: 'deduplicate <frame> [on col1, col2, ...]',
    doc: 'Remove linhas duplicadas. Sem `on` considera todas as colunas.\n\n**Exemplos:**\n```w\ndeduplicate clientes\ndeduplicate clientes on email, cpf\n```',
  },
  {
    label: 'pivot', kind: 'statement',
    detail: 'pivot <frame> on <col> [values [v1, v2]] aggregate <func>(<col>)',
    doc: 'Transforma valores únicos de uma coluna em novas colunas.\n\n**Exemplos:**\n```w\npivot vendas on categoria aggregate sum(valor)\npivot vendas on categoria values ["A", "B"] aggregate sum(valor)\n```',
  },
  {
    label: 'let', kind: 'statement',
    detail: 'let <frame> <coluna> = <expr>',
    doc: 'Cria ou sobrescreve uma coluna calculada por expressão.\n\n**Exemplos:**\n```w\nlet clientes nome = trim(nome)\nlet clientes bonus = salario * 0.1\nlet clientes faixa = if salario > 5000 then "alto" else "normal" end\n```',
  },
  {
    label: 'limit', kind: 'statement',
    detail: 'limit <frame> <N>',
    doc: 'Mantém apenas as primeiras N linhas.\n\n**Exemplo:**\n```w\nlimit clientes 100\n```',
  },
  {
    label: 'skip', kind: 'statement',
    detail: 'skip <frame> <N>',
    doc: 'Pula as primeiras N linhas.\n\n**Exemplo:**\n```w\nskip clientes 1\n```',
  },
  {
    label: 'drop', kind: 'statement',
    detail: 'drop column <frame> [col1, col2] | drop row <frame> where <expr>',
    doc: 'Remove colunas ou linhas do frame.\n\n**Exemplos:**\n```w\ndrop column clientes [cpf, rg]\ndrop row clientes where ativo = false\n```',
  },
  {
    label: 'promote', kind: 'statement',
    detail: 'promote row <frame> <N> | promote row <frame> where wid = <N>',
    doc: 'Transforma a linha N nos nomes das colunas do frame.\n\n**Exemplos:**\n```w\npromote row dados 0\npromote row dados where wid = 0\n```',
  },
  {
    label: 'replace', kind: 'statement',
    detail: 'replace in <frame> column <col> <from> with <to>',
    doc: 'Substitui um valor por outro em uma coluna.\n\n**Exemplos:**\n```w\nreplace in dados column cidade "SP" with "São Paulo"\nreplace in dados column quantidade 0 with null\nreplace empty in dados column cidade with "Não informado"\n```',
  },
  {
    label: 'split', kind: 'statement',
    detail: 'split in <frame> column <col> by <tipo> into columns [a, b] | into rows as <col>',
    doc: 'Divide o valor de uma coluna.\n\n**Tipos de split:** `delimiter ";"`, `chars 5`, `positions [0,3,6]`, `lower_to_upper`, `upper_to_lower`, `digit_to_alpha`, `alpha_to_digit`\n\n**Exemplos:**\n```w\nsplit in dados column nome by delimiter ";" into columns [primeiro, segundo]\nsplit in dados column cep by chars 5 into columns [parte1, parte2]\nsplit in dados column codigo by digit_to_alpha into rows as partes\n```',
  },
  {
    label: 'append', kind: 'statement',
    detail: 'append <base> from <frame2>[, <frame3>...] [as <output>]',
    doc: 'Empilha frames verticalmente, alinhando por nome de coluna.\n\n**Exemplos:**\n```w\nappend dados from vendas_2024\nappend dados from vendas_2024, vendas_2023 as resultado\n```',
  },
  {
    label: 'copy', kind: 'statement',
    detail: 'copy <source> as <alias>',
    doc: 'Cria uma cópia independente (deep clone) de um frame.\n\n**Exemplo:**\n```w\ncopy clientes as clientes_backup\n```',
  },
  {
    label: 'preview', kind: 'statement',
    detail: 'preview <frame> rows <N>',
    doc: 'Exibe N linhas do frame no terminal e continua o pipeline.\n\n**Exemplo:**\n```w\npreview clientes rows 10\n```',
  },
  {
    label: 'export', kind: 'statement',
    detail: 'export <frame> <destination>(<path>)',
    doc: 'Salva o frame em um destino externo.\n\n**Exemplos:**\n```w\nexport clientes csv("result/clientes.csv")\nexport resumo excel("result/resumo.xlsx", sheet="Dados")\nexport dados json("result/dados.json", pretty=true)\nexport dados parquet("result/dados.parquet")\n```',
  },
  {
    label: 'set', kind: 'statement',
    detail: 'set <chave> = <valor>',
    doc: 'Define metadados do pipeline.\n\n**Exemplo:**\n```w\nset nome_pipeline = "ETL Clientes"\nset versao = 2\n```',
  },
];

// ─── Funções de expressão ─────────────────────────────────────────────────────
const EXPR_FUNCTIONS: CompletionEntry[] = [
  { label: 'concat',   kind: 'function', detail: 'concat(a, b, ...)',        doc: 'Concatena strings.' },
  { label: 'upper',    kind: 'function', detail: 'upper(str)',                doc: 'Converte para maiúsculas.' },
  { label: 'lower',    kind: 'function', detail: 'lower(str)',                doc: 'Converte para minúsculas.' },
  { label: 'trim',     kind: 'function', detail: 'trim(str)',                 doc: 'Remove espaços no início e fim.' },
  { label: 'round',    kind: 'function', detail: 'round(number, decimals)',   doc: 'Arredonda para N casas decimais.' },
  { label: 'coalesce', kind: 'function', detail: 'coalesce(a, b, ...)',       doc: 'Retorna o primeiro argumento não-nulo.' },
];

// ─── Funções de agregação ─────────────────────────────────────────────────────
const AGG_FUNCTIONS: CompletionEntry[] = [
  { label: 'sum',            kind: 'aggfunc', detail: 'sum(col)',            doc: 'Soma dos valores.' },
  { label: 'avg',            kind: 'aggfunc', detail: 'avg(col)',            doc: 'Média dos valores. Alias: `mean`.' },
  { label: 'count',          kind: 'aggfunc', detail: 'count(col)',          doc: 'Conta valores não-nulos.' },
  { label: 'count_distinct', kind: 'aggfunc', detail: 'count_distinct(col)', doc: 'Conta valores únicos não-nulos.' },
  { label: 'max',            kind: 'aggfunc', detail: 'max(col)',            doc: 'Valor máximo.' },
  { label: 'min',            kind: 'aggfunc', detail: 'min(col)',            doc: 'Valor mínimo.' },
  { label: 'first',          kind: 'aggfunc', detail: 'first(col)',          doc: 'Primeiro valor do grupo.' },
  { label: 'last',           kind: 'aggfunc', detail: 'last(col)',           doc: 'Último valor do grupo.' },
  { label: 'stddev',         kind: 'aggfunc', detail: 'stddev(col)',         doc: 'Desvio padrão. Alias: `std`.' },
  { label: 'variance',       kind: 'aggfunc', detail: 'variance(col)',       doc: 'Variância. Alias: `var`.' },
];

// ─── Tipos (cast) ─────────────────────────────────────────────────────────────
const TYPES: CompletionEntry[] = [
  { label: 'Int32',     kind: 'type', detail: 'Int32',     doc: 'Inteiro de 32 bits.' },
  { label: 'Int64',     kind: 'type', detail: 'Int64',     doc: 'Inteiro de 64 bits. Aliases: `int`, `integer`.' },
  { label: 'Float32',   kind: 'type', detail: 'Float32',   doc: 'Float de 32 bits.' },
  { label: 'Float64',   kind: 'type', detail: 'Float64',   doc: 'Float de 64 bits. Aliases: `float`, `double`.' },
  { label: 'String',    kind: 'type', detail: 'String',    doc: 'Texto. Aliases: `text`, `utf8`.' },
  { label: 'Boolean',   kind: 'type', detail: 'Boolean',   doc: 'Booleano. Aliases: `bool`.' },
  { label: 'Date',      kind: 'type', detail: 'Date',      doc: 'Data calendário.' },
  { label: 'Timestamp', kind: 'type', detail: 'Timestamp', doc: 'Data + hora. Alias: `datetime`.' },
];

// ─── Sources / Destinations ───────────────────────────────────────────────────
const SOURCES: CompletionEntry[] = [
  { label: 'csv',       kind: 'source', detail: 'csv("<path>"[, delimiter=";", header=false, encoding="utf-8"])', doc: 'Arquivo CSV.' },
  { label: 'excel',     kind: 'source', detail: 'excel("<path>"[, sheet="Plan1", range="A1:Z100"])',              doc: 'Planilha Excel.' },
  { label: 'json',      kind: 'source', detail: 'json("<path>"[, root="items"])',                                 doc: 'Arquivo JSON.' },
  { label: 'xml',       kind: 'source', detail: 'xml("<path>"[, row_tag="row"])',                                 doc: 'Arquivo XML.' },
  { label: 'parquet',   kind: 'source', detail: 'parquet("<path>")',                                              doc: 'Arquivo Parquet.' },
  { label: 'postgres',  kind: 'source', detail: 'postgres("<conn>", "<query>")',                                  doc: 'PostgreSQL.' },
  { label: 'mysql',     kind: 'source', detail: 'mysql("<conn>", "<query>")',                                     doc: 'MySQL.' },
  { label: 'sqlserver', kind: 'source', detail: 'sqlserver("<conn>", "<query>")',                                 doc: 'SQL Server.' },
  { label: 'oracle',    kind: 'source', detail: 'oracle("<conn>", "<query>")',                                    doc: 'Oracle.' },
  { label: 'mongodb',   kind: 'source', detail: 'mongodb("<conn>", "<database>", "<collection>")',                doc: 'MongoDB.' },
  { label: 'rest_api',  kind: 'source', detail: 'rest_api("<url>")',                                             doc: 'REST API.' },
];

// ─── Keywords estruturais ─────────────────────────────────────────────────────
const KEYWORDS: CompletionEntry[] = [
  { label: 'where',      kind: 'keyword', detail: 'where',      doc: 'Condição de filtro.' },
  { label: 'as',         kind: 'keyword', detail: 'as',         doc: 'Define um alias.' },
  { label: 'on',         kind: 'keyword', detail: 'on',         doc: 'Condição do join.' },
  { label: 'by',         kind: 'keyword', detail: 'by',         doc: 'Chave de ordenação ou groupby.' },
  { label: 'to',         kind: 'keyword', detail: 'to',         doc: 'Destino de rename.' },
  { label: 'asc',        kind: 'keyword', detail: 'asc',        doc: 'Ordem crescente (padrão).' },
  { label: 'desc',       kind: 'keyword', detail: 'desc',       doc: 'Ordem decrescente.' },
  { label: 'aggregate',  kind: 'keyword', detail: 'aggregate',  doc: 'Define as agregações do groupby/pivot.' },
  { label: 'inner',      kind: 'keyword', detail: 'inner',      doc: 'Join interno (padrão).' },
  { label: 'left',       kind: 'keyword', detail: 'left',       doc: 'Left join.' },
  { label: 'right',      kind: 'keyword', detail: 'right',      doc: 'Right join.' },
  { label: 'full',       kind: 'keyword', detail: 'full',       doc: 'Full outer join.' },
  { label: 'and',        kind: 'keyword', detail: 'and',        doc: 'Operador lógico AND.' },
  { label: 'or',         kind: 'keyword', detail: 'or',         doc: 'Operador lógico OR.' },
  { label: 'not',        kind: 'keyword', detail: 'not',        doc: 'Operador lógico NOT.' },
  { label: 'in',         kind: 'keyword', detail: 'in [...] ',  doc: 'Verifica se o valor está na lista.' },
  { label: 'like',       kind: 'keyword', detail: 'like "<pattern>"', doc: 'Correspondência de padrão. Use `%` como wildcard.' },
  { label: 'is_null',    kind: 'keyword', detail: 'is_null',    doc: 'Verifica se o valor é nulo.' },
  { label: 'is_not_null',kind: 'keyword', detail: 'is_not_null',doc: 'Verifica se o valor não é nulo.' },
  { label: 'if',         kind: 'keyword', detail: 'if <cond> then <a> else <b> end', doc: 'Expressão condicional. Suporta `else if` encadeado.' },
  { label: 'then',       kind: 'keyword', detail: 'then',       doc: 'Parte do if/then/else.' },
  { label: 'else',       kind: 'keyword', detail: 'else',       doc: 'Parte do if/then/else.' },
  { label: 'end',        kind: 'keyword', detail: 'end',        doc: 'Fecha o bloco if/then/else.' },
  { label: 'true',       kind: 'keyword', detail: 'true',       doc: 'Literal booleano verdadeiro.' },
  { label: 'false',      kind: 'keyword', detail: 'false',      doc: 'Literal booleano falso.' },
  { label: 'null',       kind: 'keyword', detail: 'null',       doc: 'Valor nulo/ausente.' },
  { label: 'with',       kind: 'keyword', detail: 'with',       doc: 'Frame do lado direito no join.' },
  { label: 'from',       kind: 'keyword', detail: 'from',       doc: 'Origem no append.' },
  { label: 'rows',       kind: 'keyword', detail: 'rows <N>',   doc: 'Número de linhas no preview.' },
  { label: 'column',     kind: 'keyword', detail: 'column',     doc: 'Referência a uma coluna (drop, replace, split).' },
  { label: 'empty',      kind: 'keyword', detail: 'empty',      doc: 'Substitui valores nulos/vazios (replace empty).' },
  { label: 'delimiter',  kind: 'keyword', detail: 'delimiter "<sep>"', doc: 'Tipo de split por delimitador.' },
  { label: 'positions',  kind: 'keyword', detail: 'positions [0, 3, 6]', doc: 'Tipo de split por posições.' },
  // split-by identifiers
  { label: 'lower_to_upper', kind: 'keyword', detail: 'lower_to_upper', doc: 'Split na transição minúscula→maiúscula.' },
  { label: 'upper_to_lower', kind: 'keyword', detail: 'upper_to_lower', doc: 'Split na transição maiúscula→minúscula.' },
  { label: 'digit_to_alpha', kind: 'keyword', detail: 'digit_to_alpha', doc: 'Split na transição dígito→letra.' },
  { label: 'alpha_to_digit', kind: 'keyword', detail: 'alpha_to_digit', doc: 'Split na transição letra→dígito.' },
  { label: 'chars',          kind: 'keyword', detail: 'chars <N>',      doc: 'Split em fatias de N caracteres.' },
];

// ─── Exports ──────────────────────────────────────────────────────────────────
export const W_COMPLETIONS: CompletionEntry[] = [
  ...STATEMENTS,
  ...EXPR_FUNCTIONS,
  ...AGG_FUNCTIONS,
  ...TYPES,
  ...SOURCES,
  ...KEYWORDS,
];

export const W_HOVER_MAP: Record<string, CompletionEntry> = Object.fromEntries(
  W_COMPLETIONS.map(e => [e.label.toUpperCase(), e])
);

// ─── Signature help ────────────────────────────────────────────────────────────
export interface ParamInfo   { label: string; doc: string; }
export interface SignatureEntry { label: string; doc: string; parameters: ParamInfo[]; }

export const W_SIGNATURES: Record<string, SignatureEntry> = {
  // Expr functions
  CONCAT:   { label: 'concat(a, b, ...)',        doc: 'Concatena strings.',           parameters: [{ label: 'a', doc: 'Primeira string.' }, { label: 'b', doc: 'Segunda string.' }] },
  UPPER:    { label: 'upper(str)',               doc: 'Converte para maiúsculas.',    parameters: [{ label: 'str', doc: 'String de entrada.' }] },
  LOWER:    { label: 'lower(str)',               doc: 'Converte para minúsculas.',    parameters: [{ label: 'str', doc: 'String de entrada.' }] },
  TRIM:     { label: 'trim(str)',                doc: 'Remove espaços nas bordas.',   parameters: [{ label: 'str', doc: 'String de entrada.' }] },
  ROUND:    { label: 'round(number, decimals)',  doc: 'Arredonda o número.',          parameters: [{ label: 'number', doc: 'Valor a arredondar.' }, { label: 'decimals', doc: 'Casas decimais.' }] },
  COALESCE: { label: 'coalesce(a, b, ...)',      doc: 'Primeiro argumento não-nulo.', parameters: [{ label: 'a', doc: 'Primeiro valor.' }, { label: 'b', doc: 'Fallback.' }] },
  // Agg functions
  SUM:            { label: 'sum(col)',            doc: 'Soma.',            parameters: [{ label: 'col', doc: 'Coluna.' }] },
  AVG:            { label: 'avg(col)',            doc: 'Média.',           parameters: [{ label: 'col', doc: 'Coluna.' }] },
  MEAN:           { label: 'avg(col)',            doc: 'Média (alias avg).', parameters: [{ label: 'col', doc: 'Coluna.' }] },
  COUNT:          { label: 'count(col)',          doc: 'Contagem.',        parameters: [{ label: 'col', doc: 'Coluna.' }] },
  COUNT_DISTINCT: { label: 'count_distinct(col)', doc: 'Valores únicos.',  parameters: [{ label: 'col', doc: 'Coluna.' }] },
  MAX:            { label: 'max(col)',            doc: 'Máximo.',          parameters: [{ label: 'col', doc: 'Coluna.' }] },
  MIN:            { label: 'min(col)',            doc: 'Mínimo.',          parameters: [{ label: 'col', doc: 'Coluna.' }] },
  FIRST:          { label: 'first(col)',          doc: 'Primeiro valor.',  parameters: [{ label: 'col', doc: 'Coluna.' }] },
  LAST:           { label: 'last(col)',           doc: 'Último valor.',    parameters: [{ label: 'col', doc: 'Coluna.' }] },
  STDDEV:         { label: 'stddev(col)',         doc: 'Desvio padrão.',   parameters: [{ label: 'col', doc: 'Coluna.' }] },
  STD:            { label: 'stddev(col)',         doc: 'Desvio padrão (alias stddev).', parameters: [{ label: 'col', doc: 'Coluna.' }] },
  VARIANCE:       { label: 'variance(col)',       doc: 'Variância.',       parameters: [{ label: 'col', doc: 'Coluna.' }] },
  VAR:            { label: 'variance(col)',       doc: 'Variância (alias variance).', parameters: [{ label: 'col', doc: 'Coluna.' }] },
};
