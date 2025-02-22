import {EnvironmentProviders, inject, provideAppInitializer} from '@angular/core';
import * as monaco from 'monaco-editor';
import {MonacoStoreService} from './monaco-store.service';

import { promLanguageDefinition } from 'monaco-promql';

function initializeMonaco(store: MonacoStoreService): () => Promise<void> {
  return async () => {
    store.monacoInstance = monaco;
    const languageId = promLanguageDefinition.id;
    monaco.languages.register(promLanguageDefinition);
    monaco.languages.onLanguage(languageId, () => {
      promLanguageDefinition.loader().then(mod => {
        monaco.languages.setMonarchTokensProvider(languageId, mod.language);
        monaco.languages.setLanguageConfiguration(languageId, mod.languageConfiguration);
        monaco.languages.registerCompletionItemProvider(languageId, mod.completionItemProvider);
      });
    });
  };
}

export function provideMonacoInstance(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const initializerFn = initializeMonaco(inject(MonacoStoreService));
    return initializerFn();
  });
}
