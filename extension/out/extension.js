"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const modes_types_1 = require("./modes_types");
const scrollCommands = require("./scroll_commands");
const modes_1 = require("./modes");
const type_handler_1 = require("./type_handler");
const type_subscription_1 = require("./type_subscription");
const escape_handler_1 = require("./escape_handler");
const globalVimState = {
    typeSubscription: undefined,
    mode: modes_types_1.Mode.Insert,
    keysPressed: [],
    registers: {
        contentsList: [],
        linewise: true,
    },
    semicolonAction: () => undefined,
    commaAction: () => undefined,
    lastPutRanges: {
        ranges: [],
        linewise: true,
    },
};
function onSelectionChange(vimState, e) {
    if (vimState.mode === modes_types_1.Mode.Insert)
        return;
    if (e.selections.every(selection => selection.isEmpty)) {
        // It would be nice if we could always go from visual to normal mode when all selections are empty
        // but visual mode on an empty line will yield an empty selection and there's no good way of
        // distinguishing that case from the rest. So we only do it for mouse events.
        if ((vimState.mode === modes_types_1.Mode.Visual || vimState.mode === modes_types_1.Mode.VisualLine) &&
            e.kind === vscode.TextEditorSelectionChangeKind.Mouse) {
            modes_1.enterNormalMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, e.textEditor);
        }
    }
    else {
        if (vimState.mode === modes_types_1.Mode.Normal) {
            modes_1.enterVisualMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, e.textEditor);
        }
    }
}
function onDidChangeActiveTextEditor(vimState, editor) {
    if (!editor)
        return;
    if (editor.selections.every(selection => selection.isEmpty)) {
        if (vimState.mode === modes_types_1.Mode.Visual || vimState.mode === modes_types_1.Mode.VisualLine) {
            modes_1.enterNormalMode(vimState);
        }
    }
    else {
        if (vimState.mode === modes_types_1.Mode.Normal) {
            modes_1.enterVisualMode(vimState);
        }
    }
    modes_1.setModeCursorStyle(vimState.mode, editor);
    vimState.keysPressed = [];
}
function activate(context) {
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => onDidChangeActiveTextEditor(globalVimState, editor)), vscode.window.onDidChangeTextEditorSelection((e) => onSelectionChange(globalVimState, e)), vscode.commands.registerCommand('extension.basicVim.escapeKey', () => escape_handler_1.escapeHandler(globalVimState)), vscode.commands.registerCommand('extension.basicVim.scrollDownHalfPage', scrollCommands.scrollDownHalfPage), vscode.commands.registerCommand('extension.basicVim.scrollUpHalfPage', scrollCommands.scrollUpHalfPage), vscode.commands.registerCommand('extension.basicVim.scrollDownPage', scrollCommands.scrollDownPage), vscode.commands.registerCommand('extension.basicVim.scrollUpPage', scrollCommands.scrollUpPage));
    modes_1.enterNormalMode(globalVimState);
    type_subscription_1.addTypeSubscription(globalVimState, type_handler_1.typeHandler);
    if (vscode.window.activeTextEditor) {
        onDidChangeActiveTextEditor(globalVimState, vscode.window.activeTextEditor);
    }
}
exports.activate = activate;
function deactivate() {
    type_subscription_1.removeTypeSubscription(globalVimState);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map