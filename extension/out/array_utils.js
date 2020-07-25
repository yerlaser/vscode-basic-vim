"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayFindLast(xs, p) {
    const filtered = xs.filter(p);
    if (filtered.length === 0) {
        return undefined;
    }
    else {
        return filtered[filtered.length - 1];
    }
}
exports.arrayFindLast = arrayFindLast;
//# sourceMappingURL=array_utils.js.map