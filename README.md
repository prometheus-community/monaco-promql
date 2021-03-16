# Monaco PromQL language [![CircleCI](https://circleci.com/gh/prometheus-community/monaco-promql.svg?style=shield)](https://circleci.com/gh/prometheus-community/monaco-promql) [![npm version](https://badge.fury.io/js/monaco-promql.svg)](https://badge.fury.io/js/monaco-promql) [![License](https://img.shields.io/:license-mit-blue.svg)](LICENSE.md)

## Overview

This project provides a support for the [Monaco](https://microsoft.github.io/monaco-editor/) editor that handles the PromQL ([Prometheus](https://prometheus.io/docs/introduction/overview/) Query Language) syntax (with syntax highlighting).

Initially the repository was owned by AmadeusITGroup and it has been transferred to the prometheus-community (Thanks to [Julius Volz](https://github.com/juliusv) that helped us for that)
During the transfer, the repository and the package changed its name from **monaco-languages-promql** to the current one: **monaco-promql**.

### Installation
Language support is available on npm :

| Version         | command to use                        |
| --------------- | ------------------------------------- |
| >= 1.5          | `npm install monaco-promql`           |
| >= 1.4 < 1.5    | `npm install monaco-languages-promql` |

### Playground
If you want to test it, you have the last version available on the following website:

https://prometheus-community.github.io/monaco-promql/

Here is a picture that displays what happen when you write a promQL expression:

![Display samples](./docs/samples.png)
> Samples coming from https://github.com/infinityworks/prometheus-example-queries

## Usage

- [How to use it in an react project.](docs/react_integration.md)
- [How to use it in an angular project.](docs/angular_integration.md)

## Contributions
Any contribution or suggestion would be really appreciated. Feel free to use the Issue section or to send a pull request.

## Development
### Run example with local version
```shell script
npm install
npm run build
npm link
cd examples/<example-folder>
npm install
npm link monaco-promql
npm start
# Then modify manually the monaco-promql import :/ "monaco-promql" -> "monaco-promql/lib"
```

## Roadmap
- [x] More usage documentation.
- [x] Provide the auto-completion support.
- [ ] Versions mapping with PromQL.
- [ ] More automation on release version in npmjs and angular gh-pages update

## Credits
This repository is inspired by [monaco-languages](https://github.com/microsoft/monaco-languages) repository.
