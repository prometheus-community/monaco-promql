import {EnvironmentProviders, inject, provideAppInitializer} from '@angular/core';
import loader from '@monaco-editor/loader';
import {MonacoStoreService} from './monaco-store.service';

import { promLanguageDefinition } from 'monaco-promql';

function initializeMonaco(store: MonacoStoreService): () => Promise<void> {
  return async () => {
    loader.config({ paths: { vs: 'assets/monaco/vs' } });

    const monaco = await loader.init();
    store.monacoInstance = monaco;

    const languageId = promLanguageDefinition.id;
    monaco.languages.register(promLanguageDefinition);
    monaco.languages.onLanguage(languageId, () => {
      promLanguageDefinition.loader().then((mod) => {
        monaco.languages.setMonarchTokensProvider(languageId, mod.language);
        monaco.languages.setLanguageConfiguration(languageId, mod.languageConfiguration as any);
        monaco.languages.registerCompletionItemProvider(languageId, mod.completionItemProvider as any);
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
