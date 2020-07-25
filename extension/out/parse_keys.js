"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modes_types_1 = require("./modes_types");
const parse_keys_types_1 = require("./parse_keys_types");
function arrayStartsWith(prefix, xs) {
    if (xs.length < prefix.length) {
        return false;
    }
    for (let i = 0; i < prefix.length; ++i) {
        if (prefix[i] !== xs[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayStartsWith = arrayStartsWith;
function arrayEquals(xs, ys) {
    if (xs.length !== ys.length) {
        return false;
    }
    for (let i = 0; i < xs.length; ++i) {
        if (xs[i] !== ys[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayEquals = arrayEquals;
function parseKeysExact(matchKeys, modes, action) {
    return (vimState, keys, editor) => {
        if (modes && modes.indexOf(vimState.mode) < 0) {
            return parse_keys_types_1.ParseKeysStatus.NO;
        }
        if (arrayEquals(keys, matchKeys)) {
            action(vimState, editor);
            return parse_keys_types_1.ParseKeysStatus.YES;
        }
        else if (arrayStartsWith(keys, matchKeys)) {
            return parse_keys_types_1.ParseKeysStatus.MORE_INPUT;
        }
        else {
            return parse_keys_types_1.ParseKeysStatus.NO;
        }
    };
}
exports.parseKeysExact = parseKeysExact;
function parseKeysRegex(doesPattern, couldPattern, modes, action) {
    return (vimState, keys, editor) => {
        if (modes && modes.indexOf(vimState.mode) < 0) {
            return parse_keys_types_1.ParseKeysStatus.NO;
        }
        const keysStr = keys.join('');
        const doesMatch = keysStr.match(doesPattern);
        if (doesMatch) {
            action(vimState, editor, doesMatch);
            return parse_keys_types_1.ParseKeysStatus.YES;
        }
        else if (keysStr.match(couldPattern)) {
            return parse_keys_types_1.ParseKeysStatus.MORE_INPUT;
        }
        else {
            return parse_keys_types_1.ParseKeysStatus.NO;
        }
    };
}
exports.parseKeysRegex = parseKeysRegex;
function parseOperatorPart(keys, operatorKeys) {
    if (arrayStartsWith(operatorKeys, keys)) {
        return {
            kind: 'success',
            rest: keys.slice(operatorKeys.length),
        };
    }
    else if (arrayStartsWith(keys, operatorKeys)) {
        return {
            kind: 'failure',
            status: parse_keys_types_1.ParseKeysStatus.MORE_INPUT,
        };
    }
    else {
        return {
            kind: 'failure',
            status: parse_keys_types_1.ParseKeysStatus.NO,
        };
    }
}
function parseOperatorRangePart(vimState, keys, editor, motions) {
    let could = false;
    for (const motion of motions) {
        const result = motion(vimState, keys, editor);
        if (result.kind === 'success') {
            return result;
        }
        else if (result.status === parse_keys_types_1.ParseKeysStatus.MORE_INPUT) {
            could = true;
        }
    }
    if (could) {
        return {
            kind: 'failure',
            status: parse_keys_types_1.ParseKeysStatus.MORE_INPUT,
        };
    }
    else {
        return {
            kind: 'failure',
            status: parse_keys_types_1.ParseKeysStatus.NO,
        };
    }
}
function parseKeysOperator(operatorKeys, motions, operator) {
    return (vimState, keys, editor) => {
        const operatorResult = parseOperatorPart(keys, operatorKeys);
        if (operatorResult.kind === 'failure') {
            return operatorResult.status;
        }
        let ranges;
        let linewise = true;
        if (vimState.mode === modes_types_1.Mode.Normal) {
            if (operatorResult.rest.length === 0) {
                return parse_keys_types_1.ParseKeysStatus.MORE_INPUT;
            }
            const motionResult = parseOperatorRangePart(vimState, operatorResult.rest, editor, motions);
            if (motionResult.kind === 'failure') {
                return motionResult.status;
            }
            ranges = motionResult.ranges;
            linewise = motionResult.linewise;
        }
        else if (vimState.mode === modes_types_1.Mode.VisualLine) {
            ranges = editor.selections;
            linewise = true;
        }
        else {
            ranges = editor.selections;
            linewise = false;
        }
        operator(vimState, editor, ranges, linewise);
        return parse_keys_types_1.ParseKeysStatus.YES;
    };
}
exports.parseKeysOperator = parseKeysOperator;
function createOperatorRangeExactKeys(matchKeys, linewise, f) {
    return (vimState, keys, editor) => {
        if (arrayEquals(keys, matchKeys)) {
            const ranges = editor.selections.map(selection => {
                return f(vimState, editor.document, selection.active);
            });
            return {
                kind: 'success',
                ranges: ranges,
                linewise: linewise,
            };
        }
        else if (arrayStartsWith(keys, matchKeys)) {
            return {
                kind: 'failure',
                status: parse_keys_types_1.ParseKeysStatus.MORE_INPUT,
            };
        }
        else {
            return {
                kind: 'failure',
                status: parse_keys_types_1.ParseKeysStatus.NO,
            };
        }
    };
}
exports.createOperatorRangeExactKeys = createOperatorRangeExactKeys;
function createOperatorRangeRegex(doesPattern, couldPattern, linewise, f) {
    return (vimState, keys, editor) => {
        const keysStr = keys.join('');
        const doesMatch = keysStr.match(doesPattern);
        if (doesMatch) {
            const ranges = editor.selections.map(selection => {
                return f(vimState, editor.document, selection.active, doesMatch);
            });
            return {
                kind: 'success',
                ranges: ranges,
                linewise: linewise,
            };
        }
        else if (keysStr.match(couldPattern)) {
            return {
                kind: 'failure',
                status: parse_keys_types_1.ParseKeysStatus.MORE_INPUT,
            };
        }
        else {
            return {
                kind: 'failure',
                status: parse_keys_types_1.ParseKeysStatus.NO,
            };
        }
    };
}
exports.createOperatorRangeRegex = createOperatorRangeRegex;
//# sourceMappingURL=parse_keys.js.map