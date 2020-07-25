"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const modes_types_1 = require("../modes_types");
const parse_keys_1 = require("../parse_keys");
const modes_1 = require("../modes");
const positionUtils = require("../position_utils");
const type_subscription_1 = require("../type_subscription");
const visual_line_utils_1 = require("../visual_line_utils");
const yank_highlight_1 = require("../yank_highlight");
const put_after_1 = require("../put_utils/put_after");
const put_before_1 = require("../put_utils/put_before");
exports.actions = [
    parse_keys_1.parseKeysExact(['i'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['I'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map(selection => {
            const character = editor.document.lineAt(selection.active.line).firstNonWhitespaceCharacterIndex;
            const newPosition = selection.active.with({ character: character });
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['a'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map(selection => {
            const newPosition = positionUtils.right(editor.document, selection.active);
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['A'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map(selection => {
            const lineLength = editor.document.lineAt(selection.active.line).text.length;
            const newPosition = selection.active.with({ character: lineLength });
            return new vscode.Selection(newPosition, newPosition);
        });
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['v'], [modes_types_1.Mode.Normal, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        if (vimState.mode === modes_types_1.Mode.Normal) {
            editor.selections = editor.selections.map(selection => {
                const lineLength = editor.document.lineAt(selection.active.line).text.length;
                if (lineLength === 0)
                    return selection;
                return new vscode.Selection(selection.active, positionUtils.right(editor.document, selection.active));
            });
        }
        modes_1.enterVisualMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }),
    parse_keys_1.parseKeysExact(['V'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor) => {
        modes_1.enterVisualLineMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        visual_line_utils_1.setVisualLineSelections(editor);
    }),
    parse_keys_1.parseKeysExact(['o'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('editor.action.insertLineAfter');
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['O'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('editor.action.insertLineBefore');
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['p'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], put_after_1.putAfter),
    parse_keys_1.parseKeysExact(['P'], [modes_types_1.Mode.Normal], put_before_1.putBefore),
    parse_keys_1.parseKeysExact(['g', 'p'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map((selection, i) => {
            const putRange = vimState.lastPutRanges.ranges[i];
            if (putRange) {
                return new vscode.Selection(putRange.start, putRange.end);
            }
            else {
                return selection;
            }
        });
        if (vimState.lastPutRanges.linewise) {
            modes_1.enterVisualLineMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, editor);
        }
        else {
            modes_1.enterVisualMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, editor);
        }
    }),
    parse_keys_1.parseKeysExact(['u'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('undo');
    }),
    parse_keys_1.parseKeysExact(['"', '_', 'd', 'd'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        deleteLine(vimState, editor);
    }),
    parse_keys_1.parseKeysExact(['"', '_', 'D'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('deleteAllRight');
    }),
    parse_keys_1.parseKeysExact(['c', 'c'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.edit(editBuilder => {
            editor.selections.forEach(selection => {
                const line = editor.document.lineAt(selection.active.line);
                editBuilder.delete(new vscode.Range(selection.active.with({ character: line.firstNonWhitespaceCharacterIndex }), selection.active.with({ character: line.text.length })));
            });
        });
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['C'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('deleteAllRight');
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysExact(['y', 'y'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        yankLine(vimState, editor);
        // Yank highlight
        const highlightRanges = editor.selections.map(selection => {
            const lineLength = editor.document.lineAt(selection.active.line).text.length;
            return new vscode.Range(selection.active.with({ character: 0 }), selection.active.with({ character: lineLength }));
        });
        yank_highlight_1.flashYankHighlight(editor, highlightRanges);
    }),
    parse_keys_1.parseKeysExact(['Y'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        yankToEndOfLine(vimState, editor);
        // Yank highlight
        const highlightRanges = editor.selections.map(selection => {
            const lineLength = editor.document.lineAt(selection.active.line).text.length;
            return new vscode.Range(selection.active, selection.active.with({ character: lineLength }));
        });
        yank_highlight_1.flashYankHighlight(editor, highlightRanges);
    }),
    parse_keys_1.parseKeysExact(['d', 'd'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        yankLine(vimState, editor);
        deleteLine(vimState, editor);
    }),
    parse_keys_1.parseKeysExact(['D'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        yankToEndOfLine(vimState, editor);
        vscode.commands.executeCommand('deleteAllRight');
    }),
    parse_keys_1.parseKeysExact(['s', 's'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map(selection => {
            return new vscode.Selection(selection.active.with({ character: 0 }), positionUtils.lineEnd(editor.document, selection.active));
        });
        modes_1.enterVisualLineMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }),
    parse_keys_1.parseKeysExact(['S'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        editor.selections = editor.selections.map(selection => {
            return new vscode.Selection(selection.active, positionUtils.lineEnd(editor.document, selection.active));
        });
        modes_1.enterVisualMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }),
    parse_keys_1.parseKeysExact(['x'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('deleteRight');
    }),
    parse_keys_1.parseKeysExact(['z', 't'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('revealLine', {
            lineNumber: editor.selection.active.line,
            at: 'top',
        });
    }),
    parse_keys_1.parseKeysExact(['z', 'z'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('revealLine', {
            lineNumber: editor.selection.active.line,
            at: 'center',
        });
    }),
    parse_keys_1.parseKeysExact(['z', 'b'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('revealLine', {
            lineNumber: editor.selection.active.line,
            at: 'bottom',
        });
    }),
    parse_keys_1.parseKeysExact([';'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vimState.semicolonAction(vimState, editor);
    }),
    parse_keys_1.parseKeysExact([','], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vimState.commaAction(vimState, editor);
    }),
];
function deleteLine(vimState, editor) {
    vscode.commands.executeCommand('editor.action.deleteLines').then(() => {
        editor.selections = editor.selections.map(selection => {
            const character = editor.document.lineAt(selection.active.line).firstNonWhitespaceCharacterIndex;
            const newPosition = selection.active.with({ character: character });
            return new vscode.Selection(newPosition, newPosition);
        });
    });
}
function yankLine(vimState, editor) {
    vimState.registers = {
        contentsList: editor.selections.map(selection => {
            return editor.document.lineAt(selection.active.line).text;
        }),
        linewise: true,
    };
}
function yankToEndOfLine(vimState, editor) {
    vimState.registers = {
        contentsList: editor.selections.map(selection => {
            return editor.document.lineAt(selection.active.line).text.substring(selection.active.character);
        }),
        linewise: false,
    };
}
//# sourceMappingURL=actions.js.map