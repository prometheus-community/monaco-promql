// The MIT License (MIT)
//
// Copyright (c) Amadeus IT Group
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

import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import {promLanguageDefinition} from 'monaco-languages-promql/lib/promql/promql.contribution';


function App() {
	const code = '100 * (1 - avg by(instance)(irate(node_cpu{mode=\'idle\'}[5m])))\n' +
		'\n' +
		'rate(demo_api_request_duration_seconds_count{status="500",job="demo"}[5m]) * 50\n' +
		'      > on(job, instance, method, path)\n' +
		'    rate(demo_api_request_duration_seconds_count{status="200",job="demo"}[5m])\n' +
		'\n' +
		'histogram_quantile(0.9, rate(demo_api_request_duration_seconds_bucket{job="demo"}[5m])) > 0.05\n' +
		'      and\n' +
		'    rate(demo_api_request_duration_seconds_count{job="demo"}[5m]) > 1\n' +
		'\n' +
		'rate(api_http_requests_total{status=500}[5m] offset 1h)\n';

	function editorWillMount(monaco) {
		const languageId = promLanguageDefinition.id;
		monaco.languages.register(promLanguageDefinition);
		monaco.languages.onLanguage(languageId, () => {
			promLanguageDefinition.loader().then((mod) => {
				monaco.languages.setMonarchTokensProvider(languageId, mod.language);
				monaco.languages.setLanguageConfiguration(languageId, mod.languageConfiguration);
				monaco.languages.registerCompletionItemProvider(languageId, mod.completionItemProvider);
			});
		});
	}

	return (
		<div>
			<h1>monaco-languages-promql</h1>

			<MonacoEditor
				width="1000"
				height="600"
				language="promql"
				theme="vs-dark"
				value={code}
				editorWillMount={editorWillMount}
			/>
		</div>
	);
}

export default App;
