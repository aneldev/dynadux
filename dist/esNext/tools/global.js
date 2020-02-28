export var global = (function () {
    var global;
    if (typeof window !== 'undefined')
        global = window;
    if (!global && typeof process !== 'undefined')
        global = process;
    return global;
})();
//# sourceMappingURL=global.js.map