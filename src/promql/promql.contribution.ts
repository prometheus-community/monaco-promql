/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { registerLanguage } from '../_.contribution';

registerLanguage({
	id: 'promql',
	extensions: ['.cls'],
	aliases: ['Prometheus', 'prometheus', 'prom', 'Prom', 'promql', 'Promql', 'promQL', 'PromQL'],
	mimetypes: [],
	loader: () => import('./promql')
});
