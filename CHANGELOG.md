# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/iirose-tools/iirose-bot-ts/compare/v1.0.1...v2.0.0) (2019-10-07)


### ⚠ BREAKING CHANGES

* String event types are replaced by event
classes.
`Bot#on` now takes an event class instead of a string event
type.
`Bot#awaitEvent` now takes an array of event classes instead of a
string event type.
* `publicMessage.mentions` changed to
`publicMessage.getMentions()`.
`user.mention` changed to
`user.getMention()`.
`user.isBot` field changed to `user.isBot()`
method.
* `iiroseBot` bot creator function is replaced by
`IIRoseBot` class

### Bug Fixes

* Fix retry connection and switch room handling ([79d9d6d](https://github.com/iirose-tools/iirose-bot-ts/commit/79d9d6d))
* Fix user.pm() ([45efeb5](https://github.com/iirose-tools/iirose-bot-ts/commit/45efeb5))


* Rewrite data models with classes ([651db28](https://github.com/iirose-tools/iirose-bot-ts/commit/651db28))
* Rewrite events with classes ([df4ba15](https://github.com/iirose-tools/iirose-bot-ts/commit/df4ba15))
* Rewrite main modules ([d9ea81a](https://github.com/iirose-tools/iirose-bot-ts/commit/d9ea81a))


### Features

* Create new client event types ([efc30fa](https://github.com/iirose-tools/iirose-bot-ts/commit/efc30fa)), closes [#1](https://github.com/iirose-tools/iirose-bot-ts/issues/1)

## [1.0.1](https://github.com/iirose-tools/iirose-bot-ts/compare/v1.0.0...v1.0.1) (2019-04-07)


### Bug Fixes

* Fix Bot API and type definitions ([cbaddf1](https://github.com/iirose-tools/iirose-bot-ts/commit/cbaddf1))



# 1.0.0 (2019-03-20)


### Features

* Create initial commit ([06b3192](https://github.com/iirose-tools/iirose-bot-ts/commit/06b3192))
