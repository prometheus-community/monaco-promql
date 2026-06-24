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
import { languages as monacoLanguages, type languages } from "monaco-editor";
type IRichLanguageConfiguration = languages.LanguageConfiguration;
type ILanguage = languages.IMonarchLanguage;
type ProviderResult<T> = languages.ProviderResult<T>;
type CompletionList = languages.CompletionList;
type CompletionItemProvider = languages.CompletionItemProvider;
type CompletionItem = languages.CompletionItem;

import {
	aggregateOpModifierTerms,
	aggregateOpTerms, atModifierTerms, binOpModifierTerms, binOpTerms,
	functionIdentifierTerms
} from "@prometheus-io/codemirror-promql/dist/cjs/complete/promql.terms";

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

const vectorMatching = binOpModifierTerms.map(t => t.label).concat(aggregateOpModifierTerms.map(t => t.label)).concat(atModifierTerms.map(t => t.label));
// Produce a regex matching elements : (elt1|elt2|...)
const vectorMatchingRegex = `(${vectorMatching.reduce((prev, curr) => `${prev}|${curr}`)})`;

// PromQL Operators
// (https://prometheus.io/docs/prometheus/latest/querying/operators/)
const operators = binOpTerms.map(t => t.label)

// Merging all the keywords in one list
const keywords = aggregateOpTerms.map(t => t.label)
	.concat(functionIdentifierTerms.map(t => t.label))
	.concat(binOpModifierTerms.map(t => t.label))
	.concat(atModifierTerms.map(t => t.label))
	.concat(aggregateOpModifierTerms.map(t => t.label));

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
	hexdigits: /[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
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
				kind: monacoLanguages.CompletionItemKind.Keyword,
				insertText: value,
				insertTextRules: monacoLanguages.CompletionItemInsertTextRule.InsertAsSnippet
			} as CompletionItem
		});

		return {suggestions} as ProviderResult<CompletionList>;
	}
};
