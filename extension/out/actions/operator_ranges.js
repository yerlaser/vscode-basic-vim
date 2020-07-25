"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const parse_keys_1 = require("../parse_keys");
const search_utils_1 = require("../search_utils");
const positionUtils = require("../position_utils");
const word_utils_1 = require("../word_utils");
const paragraph_utils_1 = require("../paragraph_utils");
const quote_utils_1 = require("../quote_utils");
const indent_utils_1 = require("../indent_utils");
const tag_utils_1 = require("../tag_utils");
const array_utils_1 = require("../array_utils");
exports.operatorRanges = [
    parse_keys_1.createOperatorRangeExactKeys(['l'], false, (vimState, document, position) => {
        const right = positionUtils.right(document, position);
        if (right.isEqual(position)) {
            return undefined;
        }
        else {
            return new vscode.Range(position, right);
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['h'], false, (vimState, document, position) => {
        const left = positionUtils.left(position);
        if (left.isEqual(position)) {
            return undefined;
        }
        else {
            return new vscode.Range(position, left);
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['k'], true, (vimState, document, position) => {
        if (position.line === 0) {
            return new vscode.Range(new vscode.Position(0, 0), positionUtils.lineEnd(document, position));
        }
        else {
            return new vscode.Range(new vscode.Position(position.line - 1, 0), positionUtils.lineEnd(document, position));
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['j'], true, (vimState, document, position) => {
        if (position.line === document.lineCount - 1) {
            return new vscode.Range(new vscode.Position(position.line, 0), positionUtils.lineEnd(document, position));
        }
        else {
            return new vscode.Range(new vscode.Position(position.line, 0), positionUtils.lineEnd(document, position.with({ line: position.line + 1 })));
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['w'], false, createWordForwardHandler(word_utils_1.wordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['W'], false, createWordForwardHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['b'], false, createWordBackwardHandler(word_utils_1.wordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['B'], false, createWordBackwardHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['e'], false, createWordEndHandler(word_utils_1.wordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['E'], false, createWordEndHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['i', 'w'], false, createInnerWordHandler(word_utils_1.wordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['i', 'W'], false, createInnerWordHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['a', 'w'], false, createOuterWordHandler(word_utils_1.wordRanges)),
    parse_keys_1.createOperatorRangeExactKeys(['a', 'W'], false, createOuterWordHandler(word_utils_1.whitespaceWordRanges)),
    parse_keys_1.createOperatorRangeRegex(/^f(..)$/, /^(f|f.)$/, false, (vimState, document, position, match) => {
        const fromPosition = position.with({ character: position.character + 1 });
        const result = search_utils_1.searchForward(document, match[1], fromPosition);
        if (result) {
            return new vscode.Range(position, result);
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeRegex(/^F(..)$/, /^(F|F.)$/, false, (vimState, document, position, match) => {
        const fromPosition = position.with({ character: position.character - 1 });
        const result = search_utils_1.searchBackward(document, match[1], fromPosition);
        if (result) {
            return new vscode.Range(position, result);
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeRegex(/^t(.)$/, /^t$/, false, (vimState, document, position, match) => {
        const lineText = document.lineAt(position.line).text;
        const result = lineText.indexOf(match[1], position.character + 1);
        if (result >= 0) {
            return new vscode.Range(position, position.with({ character: result }));
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeRegex(/^T(.)$/, /^T$/, false, (vimState, document, position, match) => {
        const lineText = document.lineAt(position.line).text;
        const result = lineText.lastIndexOf(match[1], position.character - 1);
        if (result >= 0) {
            const newPosition = positionUtils.right(document, position.with({ character: result }));
            return new vscode.Range(newPosition, position);
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['g', 'g'], true, (vimState, document, position) => {
        const lineLength = document.lineAt(position.line).text.length;
        return new vscode.Range(new vscode.Position(0, 0), position.with({ character: lineLength }));
    }),
    parse_keys_1.createOperatorRangeExactKeys(['G'], true, (vimState, document, position) => {
        const lineLength = document.lineAt(document.lineCount - 1).text.length;
        return new vscode.Range(position.with({ character: 0 }), new vscode.Position(document.lineCount - 1, lineLength));
    }),
    // TODO: return undefined?
    parse_keys_1.createOperatorRangeExactKeys(['}'], true, (vimState, document, position) => {
        return new vscode.Range(position.with({ character: 0 }), new vscode.Position(paragraph_utils_1.paragraphForward(document, position.line), 0));
    }),
    // TODO: return undefined?
    parse_keys_1.createOperatorRangeExactKeys(['{'], true, (vimState, document, position) => {
        return new vscode.Range(new vscode.Position(paragraph_utils_1.paragraphBackward(document, position.line), 0), position.with({ character: 0 }));
    }),
    parse_keys_1.createOperatorRangeExactKeys(['i', 'p'], true, (vimState, document, position) => {
        const result = paragraph_utils_1.paragraphRangeInner(document, position.line);
        if (result) {
            return new vscode.Range(new vscode.Position(result.start, 0), new vscode.Position(result.end, document.lineAt(result.end).text.length));
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['a', 'p'], true, (vimState, document, position) => {
        const result = paragraph_utils_1.paragraphRangeOuter(document, position.line);
        if (result) {
            return new vscode.Range(new vscode.Position(result.start, 0), new vscode.Position(result.end, document.lineAt(result.end).text.length));
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['i', "'"], false, createInnerQuoteHandler("'")),
    parse_keys_1.createOperatorRangeExactKeys(['a', "'"], false, createOuterQuoteHandler("'")),
    parse_keys_1.createOperatorRangeExactKeys(['i', '"'], false, createInnerQuoteHandler('"')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '"'], false, createOuterQuoteHandler('"')),
    parse_keys_1.createOperatorRangeExactKeys(['i', '`'], false, createInnerQuoteHandler('`')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '`'], false, createOuterQuoteHandler('`')),
    parse_keys_1.createOperatorRangeExactKeys(['i', '('], false, createInnerBracketHandler('(', ')')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '('], false, createOuterBracketHandler('(', ')')),
    parse_keys_1.createOperatorRangeExactKeys(['i', '{'], false, createInnerBracketHandler('{', '}')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '{'], false, createOuterBracketHandler('{', '}')),
    parse_keys_1.createOperatorRangeExactKeys(['i', '['], false, createInnerBracketHandler('[', ']')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '['], false, createOuterBracketHandler('[', ']')),
    parse_keys_1.createOperatorRangeExactKeys(['i', '<'], false, createInnerBracketHandler('<', '>')),
    parse_keys_1.createOperatorRangeExactKeys(['a', '<'], false, createOuterBracketHandler('<', '>')),
    parse_keys_1.createOperatorRangeExactKeys(['i', 't'], false, (vimState, document, position) => {
        const tags = tag_utils_1.getTags(document);
        const closestTag = array_utils_1.arrayFindLast(tags, tag => {
            if (tag.closing) {
                return (position.isAfterOrEqual(tag.opening.start) &&
                    position.isBeforeOrEqual(tag.closing.end));
            }
            else {
                // Self-closing tags have no inside
                return false;
            }
        });
        if (closestTag) {
            if (closestTag.closing) {
                return new vscode.Range(closestTag.opening.end.with({ character: closestTag.opening.end.character + 1 }), closestTag.closing.start);
            }
            else {
                throw new Error('We should have already filtered out self-closing tags above');
            }
        }
        else {
            return undefined;
        }
    }),
    parse_keys_1.createOperatorRangeExactKeys(['a', 't'], false, (vimState, document, position) => {
        const tags = tag_utils_1.getTags(document);
        const closestTag = array_utils_1.arrayFindLast(tags, tag => {
            const afterStart = position.isAfterOrEqual(tag.opening.start);
            if (tag.closing) {
                return afterStart && position.isBeforeOrEqual(tag.closing.end);
            }
            else {
                return afterStart && position.isBeforeOrEqual(tag.opening.end);
            }
        });
        if (closestTag) {
            if (closestTag.closing) {
                return new vscode.Range(closestTag.opening.start, closestTag.closing.end.with({ character: closestTag.closing.end.character + 1 }));
            }
            else {
                return new vscode.Range(closestTag.opening.start, closestTag.opening.end.with({ character: closestTag.opening.end.character + 1 }));
            }
        }
        else {
            return undefined;
        }
    }),
    // TODO: return undefined?
    parse_keys_1.createOperatorRangeExactKeys(['i', 'i'], true, (vimState, document, position) => {
        const simpleRange = indent_utils_1.indentLevelRange(document, position.line);
        return new vscode.Range(new vscode.Position(simpleRange.start, 0), new vscode.Position(simpleRange.end, document.lineAt(simpleRange.end).text.length));
    }),
];
function createInnerBracketHandler(openingChar, closingChar) {
    return (vimState, document, position) => {
        const bracketRange = getBracketRange(document, position, openingChar, closingChar);
        if (bracketRange) {
            return new vscode.Range(bracketRange.start.with({ character: bracketRange.start.character + 1 }), bracketRange.end);
        }
        else {
            return undefined;
        }
    };
}
function createOuterBracketHandler(openingChar, closingChar) {
    return (vimState, document, position) => {
        const bracketRange = getBracketRange(document, position, openingChar, closingChar);
        if (bracketRange) {
            return new vscode.Range(bracketRange.start, bracketRange.end.with({ character: bracketRange.end.character + 1 }));
        }
        else {
            return undefined;
        }
    };
}
function getBracketRange(document, position, openingChar, closingChar) {
    const lineText = document.lineAt(position.line).text;
    const currentChar = lineText[position.character];
    let start;
    let end;
    if (currentChar === openingChar) {
        start = position;
        end = search_utils_1.searchForwardBracket(document, openingChar, closingChar, positionUtils.rightWrap(document, position));
    }
    else if (currentChar === closingChar) {
        start = search_utils_1.searchBackwardBracket(document, openingChar, closingChar, positionUtils.leftWrap(document, position));
        end = position;
    }
    else {
        start = search_utils_1.searchBackwardBracket(document, openingChar, closingChar, position);
        end = search_utils_1.searchForwardBracket(document, openingChar, closingChar, position);
    }
    if (start && end) {
        return new vscode.Range(start, end);
    }
    else {
        return undefined;
    }
}
function createInnerQuoteHandler(quoteChar) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = quote_utils_1.quoteRanges(quoteChar, lineText);
        const result = quote_utils_1.findQuoteRange(ranges, position);
        if (result) {
            return new vscode.Range(position.with({ character: result.start + 1 }), position.with({ character: result.end }));
        }
        else {
            return undefined;
        }
    };
}
function createOuterQuoteHandler(quoteChar) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = quote_utils_1.quoteRanges(quoteChar, lineText);
        const result = quote_utils_1.findQuoteRange(ranges, position);
        if (result) {
            return new vscode.Range(position.with({ character: result.start }), position.with({ character: result.end + 1 }));
        }
        else {
            return undefined;
        }
    };
}
function createWordForwardHandler(wordRangesFunction) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = wordRangesFunction(lineText);
        const result = ranges.find(x => x.start > position.character);
        if (result) {
            return new vscode.Range(position, position.with({ character: result.start }));
        }
        else {
            return new vscode.Range(position, position.with({ character: lineText.length }));
        }
    };
}
function createWordBackwardHandler(wordRangesFunction) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = wordRangesFunction(lineText);
        const result = ranges.reverse().find(x => x.start < position.character);
        if (result) {
            return new vscode.Range(position.with({ character: result.start }), position);
        }
        else {
            return undefined;
        }
    };
}
function createWordEndHandler(wordRangesFunction) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = wordRangesFunction(lineText);
        const result = ranges.find(x => x.end > position.character);
        if (result) {
            return new vscode.Range(position, positionUtils.right(document, position.with({ character: result.end })));
        }
        else {
            return undefined;
        }
    };
}
function createInnerWordHandler(wordRangesFunction) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = wordRangesFunction(lineText);
        const result = ranges.find(x => x.start <= position.character && position.character <= x.end);
        if (result) {
            return new vscode.Range(position.with({ character: result.start }), positionUtils.right(document, position.with({ character: result.end })));
        }
        else {
            return undefined;
        }
    };
}
function createOuterWordHandler(wordRangesFunction) {
    return (vimState, document, position) => {
        const lineText = document.lineAt(position.line).text;
        const ranges = wordRangesFunction(lineText);
        for (let i = 0; i < ranges.length; ++i) {
            const range = ranges[i];
            if (range.start <= position.character && position.character <= range.end) {
                if (i < ranges.length - 1) {
                    return new vscode.Range(position.with({ character: range.start }), position.with({ character: ranges[i + 1].start }));
                }
                else if (i > 0) {
                    return new vscode.Range(positionUtils.right(document, position.with({ character: ranges[i - 1].end })), positionUtils.right(document, position.with({ character: range.end })));
                }
                else {
                    return new vscode.Range(position.with({ character: range.start }), positionUtils.right(document, position.with({ character: range.end })));
                }
            }
        }
        return undefined;
    };
}
//# sourceMappingURL=operator_ranges.js.map