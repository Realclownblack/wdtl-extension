import * as vscode from 'vscode';
import * as path from 'path';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

import { W_COMPLETIONS, W_HOVER_MAP, W_SIGNATURES } from './wLanguageData';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  // ─── 1. IntelliSense: completion ────────────────────────────────────────────
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
        // calculate active parameter by counting commas
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
  // The LSP server is the `w` binary called with the `lsp` subcommand.
  // It communicates over stdio (standard input / standard output).
  const serverOptions: ServerOptions = {
    command: 'w',
    args: ['lsp'],
    transport: TransportKind.stdio,
  };

  const clientOptions: LanguageClientOptions = {
    // Only activate for .w files
    documentSelector: [{ language: 'w', scheme: 'file' }],
    synchronize: {
      // Watch for changes in .w files in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.w'),
    },
  };

  client = new LanguageClient(
    'w-lsp',            // internal id
    'W Language Server', // display name (shown in Output panel)
    serverOptions,
    clientOptions
  );

  // Start the client — this also starts the server process.
  client.start();
  context.subscriptions.push(client);

  console.log('WDTL extension activated with LSP client.');
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
