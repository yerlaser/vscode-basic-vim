"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function addTypeSubscription(vimState, typeHandler) {
    vimState.typeSubscription = vscode.commands.registerCommand('type', e => {
        typeHandler(vimState, e.text);
    });
}
exports.addTypeSubscription = addTypeSubscription;
function removeTypeSubscription(vimState) {
    if (vimState.typeSubscription) {
        vimState.typeSubscription.dispose();
    }
}
exports.removeTypeSubscription = removeTypeSubscription;
//# sourceMappingURL=type_subscription.js.map