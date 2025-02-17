// The MIT License (MIT)
//
// Copyright (c) Celian Garcia and Augustin Husson @ Amadeus IT Group
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

'use strict';
import { languages } from "monaco-editor";
import IRichLanguageConfiguration = languages.LanguageConfiguration;
import ILanguage = languages.IMonarchLanguage;
import ProviderResult = languages.ProviderResult;
import CompletionList = languages.CompletionList;
import CompletionItemProvider = languages.CompletionItemProvider;
import CompletionItem = languages.CompletionItem;

// noinspection JSUnusedGlobalSymbols
export const languageConfiguration: IRichLanguageConfiguration = {
	// the default separators except `@$`
	wordPattern: /(-?\d*\.\d\w*)|([^`~!#%^&*()\-=+\[{\]}\\|;:'",.<>\/?\s]+)/g,
	// Not possible to make comments in PromQL syntax
	comments: {
		lineComment: '#',
	},
	brackets: [
		[ '{', '}' ],
		[ '[', ']' ],
		[ '(', ')' ],
	],
	autoClosingPairs: [
		{open: '{', close: '}'},
		{open: '[', close: ']'},
		{open: '(', close: ')'},
		{open: '"', close: '"'},
		{open: '\'', close: '\''},
	],
	surroundingPairs: [
		{open: '{', close: '}'},
		{open: '[', close: ']'},
		{open: '(', close: ')'},
		{open: '"', close: '"'},
		{open: '\'', close: '\''},
		{open: '<', close: '>'},
	],
	folding: {}
};

// PromQL Aggregation Operators
// (https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)
const aggregations = [
	'sum',
	'min',
	'max',
	'avg',
	'group',
	'stddev',
	'stdvar',
	'count',
	'count_values',
	'bottomk',
	'topk',
	'quantile',
	'limitk',
	'limit_ratio',
];

// PromQL functions
// (https://prometheus.io/docs/prometheus/latest/querying/functions/)
const functions = [
	'abs',
	'absent',
	'ceil',
	'changes',
	'clamp',
	'clamp_max',
	'clamp_min',
	'day_of_month',
	'day_of_week',
	'day_of_year',
	'days_in_month',
	'delta',
	'deriv',
	'exp',
	'floor',
	'histogram_avg',
	'histogram_count',
	'histogram_sum',
	'histogram_fraction',
	'histogram_quantile',
	'histogram_stddev',
	'histogram_stdvar',
	'double_exponential_smoothing',
	'holt_winters', // keep it in case it's still v2
	'hour',
	'idelta',
	'increase',
	'info',
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
	'sgn',
	'sort',
	'sort_desc',
	'sort_by_label',
	'sort_by_label_desc',
	'sqrt',
	'time',
	'timestamp',
	'vector',
	'year',
];

// PromQL trigonometric functions
// https://prometheus.io/docs/prometheus/latest/querying/functions/#trigonometric-functions
const trigonometricFunctions = [
	'acos',
	'acosh',
	'asin',
	'asinh',
	'atan',
	'atanh',
	'cos',
	'cosh',
	'sin',
	'sinh',
	'tan',
	'tanh',
	'deg',
	'pi',
	'rad',
];

// PromQL specific functions: Aggregations over time
// (https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time)
const aggregationsOverTime = [];
for (const agg of aggregations) {
	aggregationsOverTime.push(agg + '_over_time');
}

// PromQL vector matching + the by and without clauses
// (https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching)
const vectorMatching = [
	'on',
	'ignoring',
	'group_right',
	'group_left',
	'by',
	'without',
];
// Produce a regex matching elements : (elt1|elt2|...)
const vectorMatchingRegex = `(${vectorMatching.reduce((prev, curr) => `${prev}|${curr}`)})`;

// PromQL Operators
// (https://prometheus.io/docs/prometheus/latest/querying/operators/)
const operators = [
	'+', '-', '*', '/', '%', '^',
	'==', '!=', '>', '<', '>=', '<=',
	'and', 'or', 'unless',
];

// PromQL offset modifier
// (https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier)
const offsetModifier = [
	'offset',
];

// Merging all the keywords in one list
const keywords = aggregations.concat(functions).concat(trigonometricFunctions).concat(aggregationsOverTime).concat(vectorMatching).concat(offsetModifier);

// noinspection JSUnusedGlobalSymbols
export const language = {
	ignoreCase: false,
	defaultToken: '',
	tokenPostfix: '.promql',

	keywords: keywords,

	operators: operators,
	vectorMatching: vectorMatchingRegex,

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/^%]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	digits: /\d+(_+\d+)*/,
	octaldigits: /[0-7]+(_+[0-7]+)*/,
	binarydigits: /[0-1]+(_+[0-1]+)*/,
	hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
	integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
	floatsuffix: /[fFlL]?/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [

			// 'by', 'without' and vector matching
			[ /@vectorMatching\s*(?=\()/, 'type', '@clauses' ],

			// labels
			[ /[a-z_]\w*(?=\s*(=|!=|=~|!~))/, 'tag' ],

			// comments
			[ /(^#.*$)/, 'comment' ],

			// all keywords have the same color
			[ /[a-zA-Z_]\w*/, {
				cases: {
					'@keywords': 'type',
					'@default': 'identifier'
				}
			} ],

			// strings
			[ /"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
			[ /'([^'\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
			[ /"/, 'string', '@string_double' ],
			[ /'/, 'string', '@string_single' ],
			[ /`/, 'string', '@string_backtick' ],

			// whitespace
			{include: '@whitespace'},

			// delimiters and operators
			[ /[{}()\[\]]/, '@brackets' ],
			[ /[<>](?!@symbols)/, '@brackets' ],
			[ /@symbols/, {
				cases: {
					'@operators': 'delimiter',
					'@default': ''
				}
			} ],

			// numbers
			[ /\d+[smhdwy]/, 'number' ], // 24h, 5m are often encountered in prometheus
			[ /\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float' ],
			[ /\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float' ],
			[ /0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex' ],
			[ /0[0-7']*[0-7](@integersuffix)/, 'number.octal' ],
			[ /0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary' ],
			[ /\d[\d']*\d(@integersuffix)/, 'number' ],
			[ /\d(@integersuffix)/, 'number' ],
		],

		string_double: [ // eslint-disable-line @typescript-eslint/naming-convention
			[ /[^\\"]+/, 'string' ],
			[ /@escapes/, 'string.escape' ],
			[ /\\./, 'string.escape.invalid' ],
			[ /"/, 'string', '@pop' ]
		],

		string_single: [  // eslint-disable-line @typescript-eslint/naming-convention
			[ /[^\\']+/, 'string' ],
			[ /@escapes/, 'string.escape' ],
			[ /\\./, 'string.escape.invalid' ],
			[ /'/, 'string', '@pop' ]
		],

		string_backtick: [ // eslint-disable-line @typescript-eslint/naming-convention
			[ /[^\\`$]+/, 'string' ],
			[ /@escapes/, 'string.escape' ],
			[ /\\./, 'string.escape.invalid' ],
			[ /`/, 'string', '@pop' ]
		],

		clauses: [
			[ /[^(,)]/, 'tag' ],
			[ /\)/, 'identifier', '@pop' ]
		],

		whitespace: [
			[ /[ \t\r\n]+/, 'white' ],
		],
	},
} as ILanguage;

// noinspection JSUnusedGlobalSymbols
export const completionItemProvider: CompletionItemProvider = {
	provideCompletionItems: () => {

		// To simplify, we made the choice to never create automatically the parenthesis behind keywords
		// It is because in PromQL, some keywords need parenthesis behind, some don't, some can have but it's optional.
		const suggestions = keywords.map(value => {
			return {
				label: value,
				kind: languages.CompletionItemKind.Keyword,
				insertText: value,
				insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
			} as CompletionItem
		});

		return {suggestions} as ProviderResult<CompletionList>;
	}
};

