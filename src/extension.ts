// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import initSqlJs from 'sql.js';

// This method is called when your extension is activated
// Your extension is activated when you try to open a .db file in VSCode
export function activate(context: vscode.ExtensionContext) {

    const provider = new SqliteViewProvider(context);
    const providerReg = vscode.workspace.registerTextDocumentContentProvider('sqliteview', provider);
    context.subscriptions.push(providerReg);

    const foldingReg = vscode.languages.registerFoldingRangeProvider(
        { language: 'sqliteview' },
        new SqliteFoldingProvider()
    );
    context.subscriptions.push(foldingReg);

    const tabListener = vscode.window.tabGroups.onDidChangeTabs(async (event) => {
        for (const tab of event.opened) {
            const input = tab.input;
            if (input instanceof vscode.TabInputText && input.uri.fsPath.endsWith('.db')) {
                await vscode.window.tabGroups.close(tab);
                const viewName = path.basename(input.uri.fsPath, '.db') + '.SQLiteView';
                const viewUri = vscode.Uri.parse('sqliteview:' + viewName).with({ query: encodeURIComponent(input.uri.fsPath) });
                const doc = await vscode.workspace.openTextDocument(viewUri);
                await vscode.languages.setTextDocumentLanguage(doc, 'sqliteview');
                await vscode.window.showTextDocument(doc);
            }
        }
    });
    context.subscriptions.push(tabListener);
}

function formatTable(name: string, columns: string[], values: any[][]): string {
    const allRows = [columns, ...values.map(row => row.map(cell => cell === null ? '(null)' : String(cell)))];
    const widths = columns.map((_, i) => Math.max(...allRows.map(row => row[i].length)));
    const renderRow = (row: string[]) => row.map((cell, i) => cell.padEnd(widths[i])).join(' | ');
    const separator = widths.map(w => '-'.repeat(w)).join('-+-');
    const separator2 = widths.map(w => '='.repeat(w)).join('=⧧=');
    const header = renderRow(allRows[0]);
    const dataRows = allRows.slice(1).map(renderRow).join('\n');
    return makeBanner(name) + '\n\n' + separator2 + '\n' + header + '\n' + separator + '\n' + dataRows + '\n' + separator2;
}

function makeBanner(name: string): string {
    const middle = '=  ' + name + '  =';
    const bar = '='.repeat(middle.length);
    return bar + '\n' + middle + '\n' + bar;
}

class SqliteViewProvider implements vscode.TextDocumentContentProvider {
    constructor(private context: vscode.ExtensionContext) {}

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const dbPath = decodeURIComponent(uri.query);
        const wasmPath = path.join(this.context.extensionPath, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
        const wasmBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(wasmPath));
        const SQL = await initSqlJs({ wasmBinary: wasmBytes.buffer as ArrayBuffer });
        const dbBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(dbPath));
        const db = new SQL.Database(dbBytes);
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        const blocks: string[] = [];
        for (const tableName of tables[0].values.map(row => String(row[0]))) {
            const data = db.exec("SELECT * FROM " + tableName);
            const columns = data.length > 0 ? data[0].columns : [];
            const values = data.length > 0 ? data[0].values : [];
            blocks.push(formatTable(tableName, columns, values));
        }
        return blocks.join('\n\n\n');
    }
}

class SqliteFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        const lines = document.getText().split('\n');
        const isBar = (s: string) => /^=+$/.test(s);
        const isHeavy = (s: string) => s.includes('⧧');
        for (let i = 0; i < lines.length; i++) {
            const isBannerName = lines[i].startsWith('=  ')
                && i >= 1 && isBar(lines[i - 1])
                && i + 1 < lines.length && isBar(lines[i + 1]);
            if (isBannerName) {
                const nameLine = i;
                const bottomBar = i + 1;
                ranges.push(new vscode.FoldingRange(nameLine, bottomBar));
                let firstHeavy = -1;
                let secondHeavy = -1;
                for (let j = bottomBar + 1; j < lines.length; j++) {
                    if (isHeavy(lines[j])) {
                        if (firstHeavy === -1) {
                            firstHeavy = j;
                        } else {
                            secondHeavy = j;
                            break;
                        }
                    }
                }
                if (firstHeavy !== -1 && secondHeavy !== -1) {
                    const headerLine = firstHeavy + 1;
                    ranges.push(new vscode.FoldingRange(headerLine, secondHeavy));
                }
                i = secondHeavy !== -1 ? secondHeavy : i;
            }
        }
        return ranges;
    }
}
// This method is called when your extension is deactivated
export function deactivate() {}
