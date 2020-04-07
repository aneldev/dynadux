var consoled = {};
export var consoledOnce = function (consoleType) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var consoledKey = JSON.stringify({ consoleType: consoleType, args: args });
    if (consoled[consoledKey])
        return;
    consoled[consoledKey] = true;
    console[consoleType].apply(console, args);
};
//# sourceMappingURL=consoleOnce.js.map