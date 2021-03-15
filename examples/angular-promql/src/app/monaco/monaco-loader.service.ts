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

import { Injectable } from '@angular/core';
import loader, { Monaco } from '@monaco-editor/loader';

import { promLanguageDefinition } from 'monaco-promql';

@Injectable({
  providedIn: 'root'
})
export class MonacoLoaderService {

  initialize(): Promise<Monaco> {
    return new Promise((resolve, reject) => {
      loader.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.3/min/vs' }
      });
      loader.init().then(monaco => resolve(monaco)).catch(reason => reject(reason));
    });
  }

  registerPromQLLanguage(monaco: Monaco): void {
      const languageId = promLanguageDefinition.id;
      monaco.languages.register(promLanguageDefinition);
      monaco.languages.onLanguage(languageId, () => {
        promLanguageDefinition.loader().then(mod => {
          monaco.languages.setMonarchTokensProvider(languageId, mod.language);
          monaco.languages.setLanguageConfiguration(languageId, mod.languageConfiguration);
          monaco.languages.registerCompletionItemProvider(languageId, mod.completionItemProvider);
        });
      });
  }
}
