"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function searchForward(document, needle, fromPosition) {
    for (let i = fromPosition.line; i < document.lineCount; ++i) {
        const lineText = document.lineAt(i).text;
        const fromIndex = i === fromPosition.line ? fromPosition.character : 0;
        const matchIndex = lineText.indexOf(needle, fromIndex);
        if (matchIndex >= 0) {
            return new vscode.Position(i, matchIndex);
        }
    }
    return undefined;
}
exports.searchForward = searchForward;
function searchBackward(document, needle, fromPosition) {
    for (let i = fromPosition.line; i >= 0; --i) {
        const lineText = document.lineAt(i).text;
        const fromIndex = i === fromPosition.line ? fromPosition.character : +Infinity;
        const matchIndex = lineText.lastIndexOf(needle, fromIndex);
        if (matchIndex >= 0) {
            return new vscode.Position(i, matchIndex);
        }
    }
    return undefined;
}
exports.searchBackward = searchBackward;
function searchForwardBracket(document, openingChar, closingChar, fromPosition) {
    let n = 0;
    for (let i = fromPosition.line; i < document.lineCount; ++i) {
        const lineText = document.lineAt(i).text;
        const fromIndex = i === fromPosition.line ? fromPosition.character : 0;
        for (let j = fromIndex; j < lineText.length; ++j) {
            if (lineText[j] === openingChar) {
                ++n;
            }
            else if (lineText[j] === closingChar) {
                if (n === 0) {
                    return new vscode.Position(i, j);
                }
                else {
                    --n;
                }
            }
        }
    }
    return undefined;
}
exports.searchForwardBracket = searchForwardBracket;
function searchBackwardBracket(document, openingChar, closingChar, fromPosition) {
    let n = 0;
    for (let i = fromPosition.line; i >= 0; --i) {
        const lineText = document.lineAt(i).text;
        const fromIndex = i === fromPosition.line ? fromPosition.character : lineText.length - 1;
        for (let j = fromIndex; j >= 0; --j) {
            if (lineText[j] === closingChar) {
                ++n;
            }
            else if (lineText[j] === openingChar) {
                if (n === 0) {
                    return new vscode.Position(i, j);
                }
                else {
                    --n;
                }
            }
        }
    }
    return undefined;
}
exports.searchBackwardBracket = searchBackwardBracket;
//# sourceMappingURL=search_utils.js.map