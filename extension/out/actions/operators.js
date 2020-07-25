"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const operator_ranges_1 = require("./operator_ranges");
const parse_keys_1 = require("../parse_keys");
const modes_1 = require("../modes");
const type_subscription_1 = require("../type_subscription");
const modes_types_1 = require("../modes_types");
const yank_highlight_1 = require("../yank_highlight");
exports.operators = [
    parse_keys_1.parseKeysOperator(['d'], operator_ranges_1.operatorRanges, (vimState, editor, ranges, linewise) => {
        if (ranges.every(x => x === undefined))
            return;
        cursorsToRangesStart(editor, ranges);
        delete_(editor, ranges, linewise);
        if (vimState.mode === modes_types_1.Mode.Visual || vimState.mode === modes_types_1.Mode.VisualLine) {
            modes_1.enterNormalMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, editor);
        }
    }),
    parse_keys_1.parseKeysOperator(['c'], operator_ranges_1.operatorRanges, (vimState, editor, ranges, linewise) => {
        if (ranges.every(x => x === undefined))
            return;
        cursorsToRangesStart(editor, ranges);
        editor.edit(editBuilder => {
            ranges.forEach(range => {
                if (!range)
                    return;
                editBuilder.delete(range);
            });
        });
        modes_1.enterInsertMode(vimState);
        modes_1.setModeCursorStyle(vimState.mode, editor);
        type_subscription_1.removeTypeSubscription(vimState);
    }),
    parse_keys_1.parseKeysOperator(['y'], operator_ranges_1.operatorRanges, (vimState, editor, ranges, linewise) => {
        if (ranges.every(x => x === undefined))
            return;
        yank(vimState, editor, ranges, linewise);
        if (vimState.mode === modes_types_1.Mode.Visual || vimState.mode === modes_types_1.Mode.VisualLine) {
            // Move cursor to start of yanked text
            editor.selections = editor.selections.map(selection => {
                return new vscode.Selection(selection.start, selection.start);
            });
            modes_1.enterNormalMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, editor);
        }
        else {
            // Yank highlight
            const highlightRanges = [];
            ranges.forEach(range => {
                if (range) {
                    highlightRanges.push(new vscode.Range(range.start, range.end));
                }
            });
            yank_highlight_1.flashYankHighlight(editor, highlightRanges);
        }
    }),
    parse_keys_1.parseKeysOperator(['r'], operator_ranges_1.operatorRanges, (vimState, editor, ranges, linewise) => {
        if (ranges.every(x => x === undefined))
            return;
        cursorsToRangesStart(editor, ranges);
        yank(vimState, editor, ranges, linewise);
        delete_(editor, ranges, linewise);
        if (vimState.mode === modes_types_1.Mode.Visual || vimState.mode === modes_types_1.Mode.VisualLine) {
            modes_1.enterNormalMode(vimState);
            modes_1.setModeCursorStyle(vimState.mode, editor);
        }
    }),
    parse_keys_1.parseKeysOperator(['s'], operator_ranges_1.operatorRanges, (vimState, editor, ranges, linewise) => {
        if (ranges.every(x => x === undefined) ||
            vimState.mode === modes_types_1.Mode.Visual ||
            vimState.mode === modes_types_1.Mode.VisualLine) {
            return;
        }
        editor.selections = ranges.map((range, i) => {
            if (range) {
                const start = range.start;
                const end = range.end;
                return new vscode.Selection(start, end);
            }
            else {
                return editor.selections[i];
            }
        });
        if (linewise) {
            modes_1.enterVisualLineMode(vimState);
        }
        else {
            modes_1.enterVisualMode(vimState);
        }
        modes_1.setModeCursorStyle(vimState.mode, editor);
    }),
];
function cursorsToRangesStart(editor, ranges) {
    editor.selections = editor.selections.map((selection, i) => {
        const range = ranges[i];
        if (range) {
            const newPosition = range.start;
            return new vscode.Selection(newPosition, newPosition);
        }
        else {
            return selection;
        }
    });
}
function delete_(editor, ranges, linewise) {
    editor.edit(editBuilder => {
        ranges.forEach(range => {
            if (!range)
                return;
            let deleteRange = range;
            if (linewise) {
                const start = range.start;
                const end = range.end;
                if (end.line === editor.document.lineCount - 1) {
                    if (start.line === 0) {
                        deleteRange = new vscode.Range(start.with({ character: 0 }), end);
                    }
                    else {
                        deleteRange = new vscode.Range(new vscode.Position(start.line - 1, editor.document.lineAt(start.line - 1).text.length), end);
                    }
                }
                else {
                    deleteRange = new vscode.Range(range.start, new vscode.Position(end.line + 1, 0));
                }
            }
            editBuilder.delete(deleteRange);
        });
    }).then(() => {
        // For linewise deletions, make sure cursor is at beginning of line
        editor.selections = editor.selections.map((selection, i) => {
            const range = ranges[i];
            if (range && linewise) {
                const newPosition = selection.start.with({ character: 0 });
                return new vscode.Selection(newPosition, newPosition);
            }
            else {
                return selection;
            }
        });
    });
}
function yank(vimState, editor, ranges, linewise) {
    vimState.registers = {
        contentsList: ranges.map((range, i) => {
            if (range) {
                return editor.document.getText(range);
            }
            else {
                return vimState.registers.contentsList[i];
            }
        }),
        linewise: linewise,
    };
}
//# sourceMappingURL=operators.js.map