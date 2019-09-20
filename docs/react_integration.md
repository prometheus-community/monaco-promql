# How to use it in an react project

> #### Create a react project
> I'm not used to play with react so I found an easy to use spawner. 
> If you are like me, you can use the [facebook/create-react-app](https://github.com/facebook/create-react-app)
> ```bash
> npx create-react-app my-app
> cd my-app
> ```
> It will handle for you a lot of boring configuration stuff ;)

Add these dependencies to your ``package.json`` :
- [microsoft/monaco-editor](https://github.com/microsoft/monaco-editor)
- [react-monaco-editor/react-monaco-editor](https://github.com/react-monaco-editor/react-monaco-editor)
- [celian-garcia/monaco-languages-promql](https://github.com/celian-garcia/monaco-languages-promql)

```bash
npm install monaco-editor --save
npm install react-monaco-editor --save
npm install monaco-languages-promql --save
```

Here is an example of simple component.

```javascript
import MonacoEditor from 'react-monaco-editor';
import {promLanguageDefinition} from 'monaco-languages-promql/lib/promql/promql.contribution';

function App() {
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
		<MonacoEditor
			width="800"
			height="600"
			language="promql"
			theme="vs-dark"
			value="sum(http_request_total)"
			editorWillMount={editorWillMount}
		/>
	);
}
```

> Troubleshooting: if you used the ``facebook/create-react-app`` don't forget to change the App.css.
