# Monaco PromQL language

Colorization and configuration supports for PromQL language for the Monaco Editor.

## Dev: cheat sheet

* initial setup with `npm install .`
* compile with `npm run watch`
* test with `npm run test`
* bundle with `npm run prepublishOnly`

## How to use it in an angular project
Add the [atularen/ngx-monaco-editor](https://github.com/atularen/ngx-monaco-editor) angular module to your dependencies.

```bash
npm install ngx-monaco-editor --save
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

import { def } from 'monaco-languages-promql/lib/promql/promql.contribution';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import ProviderResult = monaco.languages.ProviderResult;
import CompletionList = monaco.languages.CompletionList;
import { AppComponent } from './app.component';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'app-name/assets', // configure base path for monaco editor default: './assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => {
    // Register the PromQL language from the library
    const languageId = def.id;
    monaco.languages.register(def);
    monaco.languages.onLanguage(languageId, () => {
      def.loader().then((mod) => {
        monaco.languages.setMonarchTokensProvider(languageId, mod.language);
        monaco.languages.setLanguageConfiguration(languageId, mod.conf);
      });
    });
  }
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

## Credits
The format of this repository is directly copied from the [monaco-languages](https://github.com/microsoft/monaco-languages) repository

## License
[MIT](https://github.com/celian-garcia/monaco-languages-promql/blob/master/LICENSE.md)
