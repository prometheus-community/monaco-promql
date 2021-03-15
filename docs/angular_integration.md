# How to use it in an angular project
Add the these dependencies to your ``package.json`` :
- [atularen/ngx-monaco-editor](https://github.com/atularen/ngx-monaco-editor)
- [prometheus-community/monaco-promql](https://github.com/prometheus-community/monaco-promql)

```bash
npm install @monaco-editor/loader --save
npm install monaco-promql --save
```

> **Disclaimer**
> I didn't manage to make a good plug-and-play integration for Angular.
> It is a bit a mess but so far it works, modify as you wish and propose enhancements !

- Copy the homemade monaco module from the [angular example](./../examples/angular-promql/src/app/monaco).
- Mind the version of monaco-editor in the [MonacoLoaderService](./../examples/angular-promql/src/app/monaco/monaco-loader.service.ts).
  It should be the same as the one in your [package.json](./../examples/angular-promql/package.json).
- Initialize monaco from your main angular module.

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { MonacoStoreService } from './monaco/monaco-store.service';
import { MonacoLoaderService } from './monaco/monaco-loader.service';
import { MonacoModule } from './monaco/monaco.module';

function initializeMonaco(loader: MonacoLoaderService, store: MonacoStoreService): () => Promise<void> {
	return () => {
		return loader.initialize().then(monaco => {
			loader.registerPromQLLanguage(monaco);
			store.monacoInstance = monaco;
		});
	};
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		MonacoModule
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			multi: true,
			deps: [MonacoLoaderService, MonacoStoreService],
			useFactory: initializeMonaco
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
```

- Implements now the editor as simply as using the ``app-monaco-editor`` component.

```html
<app-monaco-editor [(ngModel)]="'sum(http_request_total)'"></app-monaco-editor>
```
