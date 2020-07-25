"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const modes_types_1 = require("../modes_types");
const parse_keys_1 = require("../parse_keys");
const selection_utils_1 = require("../selection_utils");
const positionUtils = require("../position_utils");
const word_utils_1 = require("../word_utils");
const search_utils_1 = require("../search_utils");
const paragraph_utils_1 = require("../paragraph_utils");
const visual_line_utils_1 = require("../visual_line_utils");
const visual_utils_1 = require("../visual_utils");
exports.motions = [
    parse_keys_1.parseKeysExact(['l'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return positionUtils.rightNormal(document, position);
        });
    }),
    parse_keys_1.parseKeysExact(['h'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return positionUtils.left(position);
        });
    }),
    parse_keys_1.parseKeysExact(['k'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'up', by: 'wrappedLine' });
    }),
    parse_keys_1.parseKeysExact(['k'], [modes_types_1.Mode.Visual], (vimState, editor) => {
        const originalSelections = editor.selections;
        vscode.commands.executeCommand('cursorMove', { to: 'up', by: 'wrappedLine', select: true }).then(() => {
            visual_utils_1.setVisualSelections(editor, originalSelections);
        });
    }),
    parse_keys_1.parseKeysExact(['k'], [modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'up', by: 'line', select: true }).then(() => {
            visual_line_utils_1.setVisualLineSelections(editor);
        });
    }),
    parse_keys_1.parseKeysExact(['j'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'down', by: 'wrappedLine' });
    }),
    parse_keys_1.parseKeysExact(['j'], [modes_types_1.Mode.Visual], (vimState, editor) => {
        const originalSelections = editor.selections;
        vscode.commands.executeCommand('cursorMove', { to: 'down', by: 'wrappedLine', select: true }).then(() => {
            visual_utils_1.setVisualSelections(editor, originalSelections);
        });
    }),
    parse_keys_1.parseKeysExact(['j'], [modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'down', by: 'line', select: true }).then(() => {
            visual_line_utils_1.setVisualLineSelections(editor);
        });
    }),
    parse_keys_1.parseKeysExact(['w'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordForwardHandler(word_utils_1.wordRanges)),
    parse_keys_1.parseKeysExact(['W'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordForwardHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.parseKeysExact(['b'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordBackwardHandler(word_utils_1.wordRanges)),
    parse_keys_1.parseKeysExact(['B'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordBackwardHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.parseKeysExact(['e'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordEndHandler(word_utils_1.wordRanges)),
    parse_keys_1.parseKeysExact(['E'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], createWordEndHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.parseKeysRegex(/^f(..)$/, /^(f|f.)$/, [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor, match) => {
        findForward(vimState, editor, match);
        vimState.semicolonAction = (innerVimState, innerEditor) => {
            findForward(innerVimState, innerEditor, match);
        };
        vimState.commaAction = (innerVimState, innerEditor) => {
            findBackward(innerVimState, innerEditor, match);
        };
    }),
    parse_keys_1.parseKeysRegex(/^F(..)$/, /^(F|F.)$/, [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor, match) => {
        findBackward(vimState, editor, match);
        vimState.semicolonAction = (innerVimState, innerEditor) => {
            findBackward(innerVimState, innerEditor, match);
        };
        vimState.commaAction = (innerVimState, innerEditor) => {
            findForward(innerVimState, innerEditor, match);
        };
    }),
    parse_keys_1.parseKeysRegex(/^t(.)$/, /^t$/, [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor, match) => {
        tillForward(vimState, editor, match);
        vimState.semicolonAction = (innerVimState, innerEditor) => {
            tillForward(innerVimState, innerEditor, match);
        };
        vimState.commaAction = (innerVimState, innerEditor) => {
            tillBackward(innerVimState, innerEditor, match);
        };
    }),
    parse_keys_1.parseKeysRegex(/^T(.)$/, /^T$/, [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual], (vimState, editor, match) => {
        tillBackward(vimState, editor, match);
        vimState.semicolonAction = (innerVimState, innerEditor) => {
            tillBackward(innerVimState, innerEditor, match);
        };
        vimState.commaAction = (innerVimState, innerEditor) => {
            tillForward(innerVimState, innerEditor, match);
        };
    }),
    parse_keys_1.parseKeysExact(['g', 'g'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return new vscode.Position(0, 0);
        });
    }),
    parse_keys_1.parseKeysExact(['G'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return new vscode.Position(document.lineCount - 1, 0);
        });
    }),
    parse_keys_1.parseKeysExact(['}'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return new vscode.Position(paragraph_utils_1.paragraphForward(document, position.line), 0);
        });
    }),
    parse_keys_1.parseKeysExact(['{'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            return new vscode.Position(paragraph_utils_1.paragraphBackward(document, position.line), 0);
        });
    }),
    parse_keys_1.parseKeysExact(['$'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            const lineLength = document.lineAt(position.line).text.length;
            return position.with({ character: Math.max(lineLength - 1, 0) });
        });
    }),
    parse_keys_1.parseKeysExact(['_'], [modes_types_1.Mode.Normal, modes_types_1.Mode.Visual, modes_types_1.Mode.VisualLine], (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            const line = document.lineAt(position.line);
            return position.with({ character: line.firstNonWhitespaceCharacterIndex });
        });
    }),
    parse_keys_1.parseKeysExact(['H'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortTop', by: 'line' });
    }),
    parse_keys_1.parseKeysExact(['H'], [modes_types_1.Mode.Visual], (vimState, editor) => {
        const originalSelections = editor.selections;
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortTop', by: 'line', select: true }).then(() => {
            visual_utils_1.setVisualSelections(editor, originalSelections);
        });
    }),
    parse_keys_1.parseKeysExact(['H'], [modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortTop', by: 'line', select: true }).then(() => {
            visual_line_utils_1.setVisualLineSelections(editor);
        });
    }),
    parse_keys_1.parseKeysExact(['M'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortCenter', by: 'line' });
    }),
    parse_keys_1.parseKeysExact(['M'], [modes_types_1.Mode.Visual], (vimState, editor) => {
        const originalSelections = editor.selections;
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortCenter', by: 'line', select: true }).then(() => {
            visual_utils_1.setVisualSelections(editor, originalSelections);
        });
    }),
    parse_keys_1.parseKeysExact(['M'], [modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortCenter', by: 'line', select: true }).then(() => {
            visual_line_utils_1.setVisualLineSelections(editor);
        });
    }),
    parse_keys_1.parseKeysExact(['L'], [modes_types_1.Mode.Normal], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortBottom', by: 'line' });
    }),
    parse_keys_1.parseKeysExact(['L'], [modes_types_1.Mode.Visual], (vimState, editor) => {
        const originalSelections = editor.selections;
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortBottom', by: 'line', select: true }).then(() => {
            visual_utils_1.setVisualSelections(editor, originalSelections);
        });
    }),
    parse_keys_1.parseKeysExact(['L'], [modes_types_1.Mode.VisualLine], (vimState, editor) => {
        vscode.commands.executeCommand('cursorMove', { to: 'viewPortBottom', by: 'line', select: true }).then(() => {
            visual_line_utils_1.setVisualLineSelections(editor);
        });
    }),
];
function execRegexMotion(vimState, editor, match, regexMotion) {
    return execMotion(vimState, editor, motionArgs => {
        return regexMotion(Object.assign({}, motionArgs, { match: match }));
    });
}
function execMotion(vimState, editor, motion) {
    const document = editor.document;
    const newSelections = editor.selections.map((selection, i) => {
        if (vimState.mode === modes_types_1.Mode.Normal) {
            const newPosition = motion({
                document: document,
                position: selection.active,
                selectionIndex: i,
                vimState: vimState,
            });
            return new vscode.Selection(newPosition, newPosition);
        }
        else if (vimState.mode === modes_types_1.Mode.Visual) {
            const vimSelection = selection_utils_1.vscodeToVimVisualSelection(document, selection);
            const motionPosition = motion({
                document: document,
                position: vimSelection.active,
                selectionIndex: i,
                vimState: vimState,
            });
            return selection_utils_1.vimToVscodeVisualSelection(document, new vscode.Selection(vimSelection.anchor, motionPosition));
        }
        else if (vimState.mode === modes_types_1.Mode.VisualLine) {
            const vimSelection = selection_utils_1.vscodeToVimVisualLineSelection(document, selection);
            const motionPosition = motion({
                document: document,
                position: vimSelection.active,
                selectionIndex: i,
                vimState: vimState,
            });
            return selection_utils_1.vimToVscodeVisualLineSelection(document, new vscode.Selection(vimSelection.anchor, motionPosition));
        }
        else {
            return selection;
        }
    });
    editor.selections = newSelections;
    editor.revealRange(new vscode.Range(newSelections[0].active, newSelections[0].active), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}
function findForward(vimState, editor, outerMatch) {
    execRegexMotion(vimState, editor, outerMatch, ({ document, position, match }) => {
        const fromPosition = position.with({ character: position.character + 1 });
        const result = search_utils_1.searchForward(document, match[1], fromPosition);
        if (result) {
            return result;
        }
        else {
            return position;
        }
    });
}
function findBackward(vimState, editor, outerMatch) {
    execRegexMotion(vimState, editor, outerMatch, ({ document, position, match }) => {
        const fromPosition = positionLeftWrap(document, position);
        const result = search_utils_1.searchBackward(document, match[1], fromPosition);
        if (result) {
            return result;
        }
        else {
            return position;
        }
    });
}
function tillForward(vimState, editor, outerMatch) {
    execRegexMotion(vimState, editor, outerMatch, ({ document, position, match }) => {
        const lineText = document.lineAt(position.line).text;
        const result = lineText.indexOf(match[1], position.character + 1);
        if (result >= 0) {
            return position.with({ character: result });
        }
        else {
            return position;
        }
    });
}
function tillBackward(vimState, editor, outerMatch) {
    execRegexMotion(vimState, editor, outerMatch, ({ document, position, match }) => {
        const lineText = document.lineAt(position.line).text;
        const result = lineText.lastIndexOf(match[1], position.character - 1);
        if (result >= 0) {
            return position.with({ character: result });
        }
        else {
            return position;
        }
    });
}
function positionLeftWrap(document, position) {
    if (position.character === 0) {
        if (position.line === 0) {
            return position;
        }
        else {
            const lineLength = document.lineAt(position.line - 1).text.length;
            return new vscode.Position(position.line - 1, lineLength);
        }
    }
    else {
        return position.with({ character: position.character - 1 });
    }
}
function createWordForwardHandler(wordRangesFunction) {
    return (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            const lineText = document.lineAt(position.line).text;
            const ranges = wordRangesFunction(lineText);
            const result = ranges.find(x => x.start > position.character);
            if (result) {
                return position.with({ character: result.start });
            }
            else {
                return position;
            }
        });
    };
}
function createWordBackwardHandler(wordRangesFunction) {
    return (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            const lineText = document.lineAt(position.line).text;
            const ranges = wordRangesFunction(lineText);
            const result = ranges.reverse().find(x => x.start < position.character);
            if (result) {
                return position.with({ character: result.start });
            }
            else {
                return position;
            }
        });
    };
}
function createWordEndHandler(wordRangesFunction) {
    return (vimState, editor) => {
        execMotion(vimState, editor, ({ document, position }) => {
            const lineText = document.lineAt(position.line).text;
            const ranges = wordRangesFunction(lineText);
            const result = ranges.find(x => x.end > position.character);
            if (result) {
                return position.with({ character: result.end });
            }
            else {
                return position;
            }
        });
    };
}
//# sourceMappingURL=motions.js.map