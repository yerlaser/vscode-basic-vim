"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const modes_types_1 = require("./modes_types");
function enterInsertMode(vimState) {
    vimState.mode = modes_types_1.Mode.Insert;
    setModeContext('extension.basicVim.insertMode');
}
exports.enterInsertMode = enterInsertMode;
function enterNormalMode(vimState) {
    vimState.mode = modes_types_1.Mode.Normal;
    setModeContext('extension.basicVim.normalMode');
}
exports.enterNormalMode = enterNormalMode;
function enterVisualMode(vimState) {
    vimState.mode = modes_types_1.Mode.Visual;
    setModeContext('extension.basicVim.visualMode');
}
exports.enterVisualMode = enterVisualMode;
function enterVisualLineMode(vimState) {
    vimState.mode = modes_types_1.Mode.VisualLine;
    setModeContext('extension.basicVim.visualLineMode');
}
exports.enterVisualLineMode = enterVisualLineMode;
function setModeContext(key) {
    const modeKeys = [
        'extension.basicVim.insertMode',
        'extension.basicVim.normalMode',
        'extension.basicVim.visualMode',
        'extension.basicVim.visualLineMode',
    ];
    modeKeys.forEach(modeKey => {
        vscode.commands.executeCommand('setContext', modeKey, key === modeKey);
    });
}
function setModeCursorStyle(mode, editor) {
    if (mode === modes_types_1.Mode.Insert) {
        editor.options.cursorStyle = vscode.TextEditorCursorStyle.Line;
    }
    else if (mode === modes_types_1.Mode.Normal) {
        editor.options.cursorStyle = vscode.TextEditorCursorStyle.Underline;
    }
    else if (mode === modes_types_1.Mode.Visual || mode === modes_types_1.Mode.VisualLine) {
        editor.options.cursorStyle = vscode.TextEditorCursorStyle.LineThin;
    }
}
exports.setModeCursorStyle = setModeCursorStyle;
//# sourceMappingURL=modes.js.map