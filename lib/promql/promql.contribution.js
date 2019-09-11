define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.def = {
        id: 'promql',
        extensions: ['.promql'],
        aliases: ['Prometheus', 'prometheus', 'prom', 'Prom', 'promql', 'Promql', 'promQL', 'PromQL'],
        mimetypes: [],
        loader: function () { return new Promise(function (resolve_1, reject_1) { require(['./promql'], resolve_1, reject_1); }); }
    };
});
