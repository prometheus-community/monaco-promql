# Monaco PromQL language [![npm version](https://badge.fury.io/js/monaco-languages-promql.svg)](https://badge.fury.io/js/monaco-languages-promql) [![License](https://img.shields.io/:license-mit-blue.svg)](LICENSE.md)

Colorization and configuration supports for PromQL language for the Monaco Editor.

![Display samples](./docs/samples.png)
> Samples coming from https://github.com/infinityworks/prometheus-example-queries

## Playground
https://amadeusitgroup.github.io/Monaco-language-PromQL/

## Installation

* initial setup with `npm install .`
* compile with `npm run watch`
* test with `npm run test`

## Usage

- [How to use it in an react project.](docs/react_integration.md)
- [How to use it in an angular project.](docs/angular_integration.md)

## Development
### Run example with local version
```shell script
npm compile
npm link
cd examples/<example-folder>
npm link monaco-languages-promql
npm start
```

## Roadmap
- [x] More usage documentation.
- [x] Provide the auto-completion support.
- [ ] Versions mapping with PromQL.
- [ ] More automation on release version in npmjs and angular gh-pages update 

## Credits
This repository is inspired by [monaco-languages](https://github.com/microsoft/monaco-languages) repository.
