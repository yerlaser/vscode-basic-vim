"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const positionUtils = require("./position_utils");
function vscodeToVimVisualSelection(document, vscodeSelection) {
    if (vscodeSelection.active.isBefore(vscodeSelection.anchor)) {
        return new vscode.Selection(positionUtils.left(vscodeSelection.anchor), vscodeSelection.active);
    }
    else {
        return new vscode.Selection(vscodeSelection.anchor, positionUtils.left(vscodeSelection.active));
    }
}
exports.vscodeToVimVisualSelection = vscodeToVimVisualSelection;
function vimToVscodeVisualSelection(document, vimSelection) {
    if (vimSelection.active.isBefore(vimSelection.anchor)) {
        return new vscode.Selection(positionUtils.right(document, vimSelection.anchor), vimSelection.active);
    }
    else {
        return new vscode.Selection(vimSelection.anchor, positionUtils.right(document, vimSelection.active));
    }
}
exports.vimToVscodeVisualSelection = vimToVscodeVisualSelection;
function vscodeToVimVisualLineSelection(document, vscodeSelection) {
    return new vscode.Selection(vscodeSelection.anchor.with({ character: 0 }), vscodeSelection.active.with({ character: 0 }));
}
exports.vscodeToVimVisualLineSelection = vscodeToVimVisualLineSelection;
function vimToVscodeVisualLineSelection(document, vimSelection) {
    const anchorLineLength = document.lineAt(vimSelection.anchor.line).text.length;
    const activeLineLength = document.lineAt(vimSelection.active.line).text.length;
    if (vimSelection.active.isBefore(vimSelection.anchor)) {
        return new vscode.Selection(vimSelection.anchor.with({ character: anchorLineLength }), vimSelection.active.with({ character: 0 }));
    }
    else {
        return new vscode.Selection(vimSelection.anchor.with({ character: 0 }), vimSelection.active.with({ character: activeLineLength }));
    }
}
exports.vimToVscodeVisualLineSelection = vimToVscodeVisualLineSelection;
//# sourceMappingURL=selection_utils.js.map