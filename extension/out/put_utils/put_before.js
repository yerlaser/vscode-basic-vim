"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const positionUtils = require("../position_utils");
const common_1 = require("./common");
function putBefore(vimState, editor) {
    const registerContentsList = common_1.getRegisterContentsList(vimState, editor);
    if (registerContentsList === undefined)
        return;
    if (vimState.registers.linewise) {
        normalModeLinewise(vimState, editor, registerContentsList);
    }
    else {
        normalModeCharacterwise(vimState, editor, registerContentsList);
    }
}
exports.putBefore = putBefore;
function normalModeLinewise(vimState, editor, registerContentsList) {
    const insertContentsList = registerContentsList.map(contents => {
        if (contents === undefined)
            return undefined;
        else
            return contents + '\n';
    });
    const insertPositions = editor.selections.map(selection => {
        return new vscode.Position(selection.active.line, 0);
    });
    const adjustedInsertPositions = common_1.adjustInsertPositions(insertPositions, insertContentsList);
    editor.edit(editBuilder => {
        insertPositions.forEach((position, i) => {
            const contents = insertContentsList[i];
            if (contents === undefined)
                return;
            editBuilder.insert(position, contents);
        });
    }).then(() => {
        editor.selections = editor.selections.map((selection, i) => {
            const position = adjustedInsertPositions[i];
            if (position === undefined)
                return selection;
            return new vscode.Selection(position, position);
        });
    });
    vimState.lastPutRanges = {
        ranges: common_1.getInsertRangesFromBeginning(adjustedInsertPositions, registerContentsList),
        linewise: true,
    };
}
function normalModeCharacterwise(vimState, editor, registerContentsList) {
    const insertPositions = editor.selections.map(selection => selection.active);
    const adjustedInsertPositions = common_1.adjustInsertPositions(insertPositions, registerContentsList);
    const insertRanges = common_1.getInsertRangesFromBeginning(adjustedInsertPositions, registerContentsList);
    editor.edit(editBuilder => {
        insertPositions.forEach((insertPosition, i) => {
            const registerContents = registerContentsList[i];
            if (registerContents === undefined)
                return;
            editBuilder.insert(insertPosition, registerContents);
        });
    }).then(() => {
        editor.selections = editor.selections.map((selection, i) => {
            const range = insertRanges[i];
            if (range === undefined)
                return selection;
            const position = positionUtils.left(range.end);
            return new vscode.Selection(position, position);
        });
    });
    vimState.lastPutRanges = {
        ranges: insertRanges,
        linewise: false,
    };
}
//# sourceMappingURL=put_before.js.map