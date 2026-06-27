# WDTL — W Language Extension for Visual Studio Code

<img src="./public/Git-header-3.png" alt="WDTL Extension header" width="900"/>

A Visual Studio Code extension with rich support for the **W Language** — providing syntax highlighting, IntelliSense, snippets, and LSP client for `.w` data pipeline files.

---

## Features

### Syntax Highlighting
Full grammar support for `.w` files, making your data pipeline code easier to read and navigate.

### IntelliSense
Smart auto-completion powered by the W Language Server Protocol (LSP) client, helping you write pipelines faster and with fewer errors.

### Snippets
Ready-to-use code snippets for common W Language patterns, reducing boilerplate and speeding up development.

### File Icons
Custom file icons for `.w` files to easily identify your pipeline files in the VS Code explorer.

---

## Quick Start

**Step 1.** Install the WDTL — W Language extension from the VS Code Marketplace.

**Step 2.** Open or create a `.w` file and start coding!

**Step 3.** The extension activates automatically when a W Language file is detected.

---

## Extension Settings

This extension contributes the following to VS Code:

- **Language support** for `.w` files with the `W Language` identifier
- **Syntax grammar** via TextMate grammar (`source.w`)
- **Snippets** for common W Language constructs
- **W Language Icons** theme for file explorer icons

---

## Installed Dependencies

The WDTL extension relies on the following package:

- [`vscode-languageclient`](https://www.npmjs.com/package/vscode-languageclient) — Connects VS Code to the W Language Server for advanced language features

---

## Useful Commands

Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS) and type:

| Command | Description |
|---|---|
| `W Language: Restart Server` | Restarts the W Language Server |
| `Developer: Reload Window` | Reloads VS Code if the extension doesn't activate |

---

## Requirements

- Visual Studio Code `^1.75.0`
- A `.w` file to get started

---

## Known Issues

If you encounter any issues, please report them on our [GitHub repository](https://github.com/Realclownblack/wdtl-extension/issues).

---

## Contributing

Contributions are always welcome! Feel free to open issues or submit pull requests on [GitHub](https://github.com/Realclownblack/wdtl-extension).

---

## Release Notes

### 1.1.0
- Added LSP client support via `vscode-languageclient`
- Custom file icons for `.w` files
- Improved snippets and grammar

### 1.0.0
- Initial release with syntax highlighting and basic snippets