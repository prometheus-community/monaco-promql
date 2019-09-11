define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.conf = {
        // the default separators except `@$`
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        // Not possible to make comments in PromQL syntax
        comments: {},
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' },
            { open: '<', close: '>' },
        ],
        folding: {}
    };
    // PromQL Aggregation Operators
    // (https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)
    var aggregations = [
        'sum',
        'min',
        'max',
        'avg',
        'stddev',
        'stdvar',
        'count',
        'count_values',
        'bottomk',
        'topk',
        'quantile',
    ];
    // PromQL functions
    // (https://prometheus.io/docs/prometheus/latest/querying/functions/)
    var functions = [
        'abs',
        'absent',
        'ceil',
        'changes',
        'clamp_max',
        'clamp_min',
        'day_of_month',
        'day_of_week',
        'days_in_month',
        'delta',
        'deriv',
        'exp',
        'floor',
        'histogram_quantile',
        'holt_winters',
        'hour',
        'idelta',
        'increase',
        'irate',
        'label_join',
        'label_replace',
        'ln',
        'log2',
        'log10',
        'minute',
        'month',
        'predict_linear',
        'rate',
        'resets',
        'round',
        'scalar',
        'sort',
        'sort_desc',
        'sqrt',
        'time',
        'timestamp',
        'vector',
        'year',
    ];
    // PromQL specific functions: Aggregations over time
    // (https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time)
    var aggregationsOverTime = [];
    for (var _i = 0, aggregations_1 = aggregations; _i < aggregations_1.length; _i++) {
        var agg = aggregations_1[_i];
        aggregationsOverTime.push(agg + '_over_time');
    }
    // Merging all the keywords in one list, adding the 'by' and 'without' clauses.
    var keywords = aggregations.concat(functions).concat(aggregationsOverTime);
    keywords.push('by');
    keywords.push('without');
    // PromQL Operators
    // (https://prometheus.io/docs/prometheus/latest/querying/operators/)
    var operators = [
        '+', '-', '*', '/', '%', '^',
        '==', '!=', '>', '<', '>=', '<=',
        'and', 'or', 'unless',
    ];
    exports.language = {
        ignoreCase: false,
        defaultToken: '',
        tokenPostfix: '.promql',
        keywords: keywords,
        operators: operators,
        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,
        octaldigits: /[0-7]+(_+[0-7]+)*/,
        binarydigits: /[0-1]+(_+[0-1]+)*/,
        hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // labels
                [/\w+(?==)/, 'tag'],
                // functions
                [/[a-zA-Z_]\w*/, {
                        cases: {
                            '@keywords': 'type',
                            '@default': 'identifier'
                        }
                    }],
                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string_double'],
                [/'/, 'string', '@string_single'],
                [/`/, 'string', '@string_backtick'],
                // whitespace
                { include: '@whitespace' },
                [/\d+[smhdwy]/, 'number']
            ],
            string_double: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop']
            ],
            string_single: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'/, 'string', '@pop']
            ],
            string_backtick: [
                [/[^\\`$]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/`/, 'string', '@pop']
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    };
});
