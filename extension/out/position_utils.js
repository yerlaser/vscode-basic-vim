"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function left(position, count = 1) {
    return position.with({
        character: Math.max(position.character - count, 0),
    });
}
exports.left = left;
function right(document, position, count = 1) {
    const lineLength = document.lineAt(position.line).text.length;
    return position.with({
        character: Math.min(position.character + count, lineLength),
    });
}
exports.right = right;
function rightNormal(document, position, count = 1) {
    const lineLength = document.lineAt(position.line).text.length;
    if (lineLength === 0) {
        return position.with({ character: 0 });
    }
    else {
        return position.with({
            character: Math.min(position.character + count, lineLength - 1),
        });
    }
}
exports.rightNormal = rightNormal;
function leftWrap(document, position) {
    if (position.character <= 0) {
        if (position.line <= 0) {
            return position;
        }
        else {
            const previousLineLength = document.lineAt(position.line - 1).text.length;
            return new vscode.Position(position.line - 1, previousLineLength);
        }
    }
    else {
        return position.with({ character: position.character - 1 });
    }
}
exports.leftWrap = leftWrap;
function rightWrap(document, position) {
    const lineLength = document.lineAt(position.line).text.length;
    if (position.character >= lineLength) {
        if (position.line >= document.lineCount - 1) {
            return position;
        }
        else {
            return new vscode.Position(position.line + 1, 0);
        }
    }
    else {
        return position.with({ character: position.character + 1 });
    }
}
exports.rightWrap = rightWrap;
function lineEnd(document, position) {
    const lineLength = document.lineAt(position.line).text.length;
    return position.with({
        character: lineLength,
    });
}
exports.lineEnd = lineEnd;
//# sourceMappingURL=position_utils.js.map