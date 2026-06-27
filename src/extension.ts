import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

import { W_COMPLETIONS, W_HOVER_MAP, W_SIGNATURES } from './wLanguageData';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  // ─── 1. IntelliSense: completion (keywords estáticas) ───────────────────────
  // Retorna apenas keywords fixas da linguagem W.
  // Frames e colunas dinâmicas são responsabilidade do LSP (completion.rs),
  // que analisa o script e sugere os frames definidos até a linha atual.
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'w', scheme: 'file' },
    {
      provideCompletionItems() {
        return W_COMPLETIONS.map((entry) => {
          const item = new vscode.CompletionItem(
            entry.label,
            vscode.CompletionItemKind.Keyword
          );
          item.detail = entry.detail;
          item.documentation = new vscode.MarkdownString(entry.doc);
          return item;
        });
      },
    }
  );

  // ─── 2. IntelliSense: hover ─────────────────────────────────────────────────
  const hoverProvider = vscode.languages.registerHoverProvider(
    { language: 'w', scheme: 'file' },
    {
      provideHover(document, position) {
        const wordRange = document.getWordRangeAtPosition(
          position,
          /[A-Za-z_][\w-]*/
        );
        if (!wordRange) return;
        const word = document.getText(wordRange).toUpperCase();
        const entry = W_HOVER_MAP[word];
        if (!entry) return;
        const md = new vscode.MarkdownString();
        md.appendCodeblock(entry.detail, 'w');
        md.appendMarkdown('\n\n' + entry.doc);
        return new vscode.Hover(md, wordRange);
      },
    }
  );

  // ─── 3. IntelliSense: signature help ────────────────────────────────────────
  const signatureProvider = vscode.languages.registerSignatureHelpProvider(
    { language: 'w', scheme: 'file' },
    {
      provideSignatureHelp(document, position) {
        const linePrefix = document
          .lineAt(position)
          .text.slice(0, position.character);
        const match = linePrefix.match(/([A-Za-z_][\w-]*)\s*\(([^)]*)$/);
        if (!match) return;
        const fnName = match[1].toUpperCase();
        const sig = W_SIGNATURES[fnName];
        if (!sig) return;

        const info = new vscode.SignatureInformation(
          sig.label,
          new vscode.MarkdownString(sig.doc)
        );
        info.parameters = sig.parameters.map(
          (p) => new vscode.ParameterInformation(p.label, p.doc)
        );

        const help = new vscode.SignatureHelp();
        help.signatures = [info];
        help.activeSignature = 0;
        const args = match[2];
        help.activeParameter = args ? args.split(',').length - 1 : 0;
        return help;
      },
    },
    '(',
    ','
  );

  context.subscriptions.push(completionProvider, hoverProvider, signatureProvider);

  // ─── 4. LSP Client ──────────────────────────────────────────────────────────
  // O servidor LSP é o binário `w` chamado com o subcomando `lsp`.
  // Ele comunica via stdio e é responsável por:
  //   - Sugerir frames definidos no script (ex: após `filter `, `sort `, etc.)
  //   - Sugerir colunas do frame referenciado (ex: após `filter clientes where `)
  //   - Emitir diagnósticos (erros e avisos) em tempo real
  const serverOptions: ServerOptions = {
    command: 'w',
    args: ['lsp'],
    transport: TransportKind.stdio,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'w', scheme: 'file' }],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.w'),
    },
    // Middleware garante que o LSP não seja bloqueado pelo completionProvider
    // nativo acima. Quando o LSP retorna sugestões (frames, colunas), elas
    // chegam ao usuário sem interferência.
    middleware: {
      provideCompletionItem: async (document, position, context, token, next) => {
        return next(document, position, context, token);
      },
    },
  };

  client = new LanguageClient(
    'w-lsp',
    'W Language Server',
    serverOptions,
    clientOptions
  );

  client.start();
  context.subscriptions.push(client);

  console.log('WDTL extension activated with LSP client.');
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}