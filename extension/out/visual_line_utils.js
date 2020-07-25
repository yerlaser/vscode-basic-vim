"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function setVisualLineSelections(editor) {
    editor.selections = editor.selections.map(selection => {
        if (!selection.isReversed || selection.isSingleLine) {
            const activeLineLength = editor.document.lineAt(selection.active.line).text.length;
            return new vscode.Selection(selection.anchor.with({ character: 0 }), selection.active.with({ character: activeLineLength }));
        }
        else {
            const anchorLineLength = editor.document.lineAt(selection.anchor.line).text.length;
            return new vscode.Selection(selection.anchor.with({ character: anchorLineLength }), selection.active.with({ character: 0 }));
        }
    });
}
exports.setVisualLineSelections = setVisualLineSelections;
//# sourceMappingURL=visual_line_utils.js.map