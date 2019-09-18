# How to use it in an angular project
Add the these dependencies to your ``package.json`` :
- [atularen/ngx-monaco-editor](https://github.com/atularen/ngx-monaco-editor)
- [celian-garcia/monaco-languages-promql](https://github.com/celian-garcia/monaco-languages-promql)

```bash
npm install ngx-monaco-editor --save
npm install monaco-languages-promql --save
```

Add the glob to assets in your ``angular.json`` configuration file.

```json
{
  "projects": {
    "my-project": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              { "glob": "**/*", "input": "./node_modules/ngx-monaco-editor/assets/monaco", "output": "./assets/monaco/" }
            ]
          }
        }
      }
    }
  }
}
```

Integrate the language into the configuration of the angular module.

```typescript
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { promLanguageDefinition } from 'monaco-languages-promql/lib/promql/promql.contribution';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AppComponent } from './app.component';

export function onMonacoLoad(): void {
  // Register the PromQL language from the library
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

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // configure base path for monaco editor default: './assets'
  defaultOptions: {scrollBeyondLastLine: false}, // pass default options to be used
  onMonacoLoad
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
