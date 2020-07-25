"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const modes_1 = require("./modes");
const type_subscription_1 = require("./type_subscription");
const type_handler_1 = require("./type_handler");
const positionUtils = require("./position_utils");
const modes_types_1 = require("./modes_types");
function escapeHandler(vimState) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    if (vimState.mode === modes_types_1.Mode.Insert) {
        editor.selections = editor.selections.map(selection => {
            const newPosition = positionUtils.left(selection.active);
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterNormalMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.addTypeSubscription(vimState, type_handler_1.typeHandler);
    }
    else if (vimState.mode === modes_types_1.Mode.Normal) {
        // Clear multiple cursors
        if (editor.selections.length > 1) {
            editor.selections = [editor.selections[0]];
        }
    }
    else if (vimState.mode === modes_types_1.Mode.Visual) {
        editor.selections = editor.selections.map(selection => {
            const newPosition = new vscode.Position(selection.active.line, Math.max(selection.active.character - 1, 0));
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterNormalMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }
    else if (vimState.mode === modes_types_1.Mode.VisualLine) {
        editor.selections = editor.selections.map(selection => {
            const newPosition = selection.active.with({
                character: Math.max(selection.active.character - 1, 0),
            });
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterNormalMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }
    vimState.keysPressed = [];
}
exports.escapeHandler = escapeHandler;
//# sourceMappingURL=escape_handler.js.map