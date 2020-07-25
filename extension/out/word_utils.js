"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NON_WORD_CHARACTERS = '/\\()"\':,.;<>~!@#$%^&*|+=[]{}`?-';
function whitespaceWordRanges(text) {
    let State;
    (function (State) {
        State[State["Whitespace"] = 0] = "Whitespace";
        State[State["Word"] = 1] = "Word";
    })(State || (State = {}));
    let state = State.Whitespace;
    let startIndex = 0;
    const ranges = [];
    for (let i = 0; i < text.length; ++i) {
        const char = text[i];
        if (state === State.Whitespace) {
            if (!isWhitespaceCharacter(char)) {
                startIndex = i;
                state = State.Word;
            }
        }
        else {
            if (isWhitespaceCharacter(char)) {
                ranges.push({
                    start: startIndex,
                    end: i - 1,
                });
                state = State.Whitespace;
            }
        }
    }
    if (state === State.Word) {
        ranges.push({
            start: startIndex,
            end: text.length - 1,
        });
    }
    return ranges;
}
exports.whitespaceWordRanges = whitespaceWordRanges;
function wordRanges(text) {
    let State;
    (function (State) {
        State[State["Whitespace"] = 0] = "Whitespace";
        State[State["Word"] = 1] = "Word";
        State[State["NonWord"] = 2] = "NonWord";
    })(State || (State = {}));
    let state = State.Whitespace;
    let startIndex = 0;
    const ranges = [];
    for (let i = 0; i < text.length; ++i) {
        const char = text[i];
        if (state === State.Whitespace) {
            if (!isWhitespaceCharacter(char)) {
                startIndex = i;
                state = isWordCharacter(char) ? State.Word : State.NonWord;
            }
        }
        else if (state === State.Word) {
            if (!isWordCharacter(char)) {
                ranges.push({
                    start: startIndex,
                    end: i - 1,
                });
                if (isWhitespaceCharacter(char)) {
                    state = State.Whitespace;
                }
                else {
                    state = State.NonWord;
                    startIndex = i;
                }
            }
        }
        else {
            if (!isNonWordCharacter(char)) {
                ranges.push({
                    start: startIndex,
                    end: i - 1,
                });
                if (isWhitespaceCharacter(char)) {
                    state = State.Whitespace;
                }
                else {
                    state = State.Word;
                    startIndex = i;
                }
            }
        }
    }
    if (state !== State.Whitespace) {
        ranges.push({
            start: startIndex,
            end: text.length - 1,
        });
    }
    return ranges;
}
exports.wordRanges = wordRanges;
function isNonWordCharacter(char) {
    return NON_WORD_CHARACTERS.indexOf(char) >= 0;
}
function isWhitespaceCharacter(char) {
    return char === ' ' || char === '\t';
}
function isWordCharacter(char) {
    return !isWhitespaceCharacter(char) && !isNonWordCharacter(char);
}
//# sourceMappingURL=word_utils.js.map