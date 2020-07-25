"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function editorScroll(to, by) {
    vscode.commands.executeCommand('editorScroll', {
        to: to,
        by: by,
    });
}
function scrollDownHalfPage() {
    editorScroll('down', 'halfPage');
}
exports.scrollDownHalfPage = scrollDownHalfPage;
function scrollUpHalfPage() {
    editorScroll('up', 'halfPage');
}
exports.scrollUpHalfPage = scrollUpHalfPage;
function scrollDownPage() {
    editorScroll('down', 'page');
}
exports.scrollDownPage = scrollDownPage;
function scrollUpPage() {
    editorScroll('up', 'page');
}
exports.scrollUpPage = scrollUpPage;
//# sourceMappingURL=scroll_commands.js.map