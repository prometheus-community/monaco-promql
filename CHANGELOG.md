# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Renamed some variables to be more understandable.
  - ``def`` -> ``promLanguageDefinition``
  - ``conf`` -> ``languageConfiguration``

## [1.2.0] - 2019-09-16
### Added
- Auto-completions of all keywords under ``completionItemProvider`` variable.

## [1.1.0] - 2019-09-15
### Added
- Removed redundant escapes of characters in regexp.
- Comments tokenization : ``#`` starting lines are considered as ``comment``.

### Changed
- Improved the README.

### Fixed
- Fix way to display durations (``5m``, ``24h``, ``2d`` ...)

## [1.0.0] - 2019-09-14
### Added
- Continuous deployment with azure pipelines.
- Numbers tokenization : considered as ``number`` (taken from cpp language).
- Labels tokenization : considered as ``tag``.
- Strings tokenization : considered as ``string``.
- Keywords tokenization : all considered as ``type``.
- Created all PromQL keywords & operators : 
    - [Aggregation Operators](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators);
    - [Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/);
    - [Aggregations over time](https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time);
    - [Vector Matching](https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching);
    - ``by`` and ``without`` clauses;
    - [Operators](https://prometheus.io/docs/prometheus/latest/querying/operators/).
- Created two exported objects : ``conf: IRichLanguageConfiguration`` & ``language: ILanguage``.
- Created the repository (cloned from [monaco-languages](https://github.com/microsoft/monaco-languages/)).

[Unreleased]: https://github.com/celian-garcia/monaco-languages-promql/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/celian-garcia/monaco-languages-promql/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/celian-garcia/monaco-languages-promql/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/celian-garcia/monaco-languages-promql/releases/tag/v1.0.0
