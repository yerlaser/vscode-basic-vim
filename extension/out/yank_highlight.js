"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function flashYankHighlight(editor, ranges) {
    const decoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: vscode.workspace.getConfiguration('basicVim').get('yankHighlightBackgroundColor'),
    });
    editor.setDecorations(decoration, ranges);
    setTimeout(() => decoration.dispose(), 200);
}
exports.flashYankHighlight = flashYankHighlight;
//# sourceMappingURL=yank_highlight.js.map