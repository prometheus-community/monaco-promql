'use strict';

// noinspection JSUnusedGlobalSymbols
export const promLanguageDefinition = {
	id: 'promql',
	extensions: ['.promql'],
	aliases: ['Prometheus', 'prometheus', 'prom', 'Prom', 'promql', 'Promql', 'promQL', 'PromQL'],
	mimetypes: [],
	loader: () => import('./promql')
};
