"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paragraphForward(document, line) {
    let visitedNonEmptyLine = false;
    for (let i = line; i < document.lineCount; ++i) {
        if (visitedNonEmptyLine) {
            if (document.lineAt(i).isEmptyOrWhitespace) {
                return i;
            }
        }
        else {
            if (!document.lineAt(i).isEmptyOrWhitespace) {
                visitedNonEmptyLine = true;
            }
        }
    }
    return document.lineCount - 1;
}
exports.paragraphForward = paragraphForward;
function paragraphBackward(document, line) {
    let visitedNonEmptyLine = false;
    for (let i = line; i >= 0; --i) {
        if (visitedNonEmptyLine) {
            if (document.lineAt(i).isEmptyOrWhitespace) {
                return i;
            }
        }
        else {
            if (!document.lineAt(i).isEmptyOrWhitespace) {
                visitedNonEmptyLine = true;
            }
        }
    }
    return 0;
}
exports.paragraphBackward = paragraphBackward;
function paragraphRangeOuter(document, line) {
    if (document.lineAt(line).isEmptyOrWhitespace)
        return undefined;
    return {
        start: paragraphRangeBackward(document, line - 1),
        end: paragraphRangeForwardOuter(document, line + 1),
    };
}
exports.paragraphRangeOuter = paragraphRangeOuter;
function paragraphRangeForwardOuter(document, line) {
    let seenWhitespace = false;
    for (let i = line; i < document.lineCount; ++i) {
        if (document.lineAt(i).isEmptyOrWhitespace) {
            seenWhitespace = true;
        }
        else if (seenWhitespace) {
            return i - 1;
        }
    }
    return document.lineCount - 1;
}
function paragraphRangeBackward(document, line) {
    for (let i = line; i >= 0; --i) {
        if (document.lineAt(i).isEmptyOrWhitespace) {
            return i + 1;
        }
    }
    return 0;
}
function paragraphRangeInner(document, line) {
    if (document.lineAt(line).isEmptyOrWhitespace)
        return undefined;
    return {
        start: paragraphRangeBackward(document, line - 1),
        end: paragraphRangeForwardInner(document, line + 1),
    };
}
exports.paragraphRangeInner = paragraphRangeInner;
function paragraphRangeForwardInner(document, line) {
    for (let i = line; i < document.lineCount; ++i) {
        if (document.lineAt(i).isEmptyOrWhitespace) {
            return i - 1;
        }
    }
    return document.lineCount - 1;
}
//# sourceMappingURL=paragraph_utils.js.map