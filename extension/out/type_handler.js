"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const parse_keys_types_1 = require("./parse_keys_types");
const actions_1 = require("./actions");
function typeHandler(vimState, char) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    vimState.keysPressed.push(char);
    try {
        let could = false;
        for (const action of actions_1.actions) {
            const result = action(vimState, vimState.keysPressed, editor);
            if (result === parse_keys_types_1.ParseKeysStatus.YES) {
                vimState.keysPressed = [];
                break;
            }
            else if (result === parse_keys_types_1.ParseKeysStatus.MORE_INPUT) {
                could = true;
            }
        }
        if (!could) {
            vimState.keysPressed = [];
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.typeHandler = typeHandler;
//# sourceMappingURL=type_handler.js.map