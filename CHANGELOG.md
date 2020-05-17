# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.3.1](https://github.com/iirose-tools/iirose-bot-ts/compare/v2.3.0...v2.3.1) (2020-05-17)

## [2.3.0](https://github.com/iirose-tools/iirose-bot-ts/compare/v2.2.0...v2.3.0) (2020-05-09)


### Features

* Add connection retry attempts option to `BotOptions` ([c0b4015](https://github.com/iirose-tools/iirose-bot-ts/commit/c0b40155e2a5e85fc979f1834746465f7798488a))


### Bug Fixes

* Fix heartbeat protocol ([60aaad2](https://github.com/iirose-tools/iirose-bot-ts/commit/60aaad2bb7e668b54be2daafe9405049416f7d83))

## [2.2.0](https://github.com/iirose-tools/iirose-bot-ts/compare/v2.1.1...v2.2.0) (2019-10-24)


### Features

* Receive gold notification event and user profile retrieval ([a21ab70](https://github.com/iirose-tools/iirose-bot-ts/commit/a21ab708526a0ee6b203af1d42c8e48a28bab2b9))

### [2.1.1](https://github.com/iirose-tools/iirose-bot-ts/compare/v2.1.0...v2.1.1) (2019-10-17)

## [2.1.0](https://github.com/iirose-tools/iirose-bot-ts/compare/v2.0.0...v2.1.0) (2019-10-10)


### Features

* New private message events ([4d4036d](https://github.com/iirose-tools/iirose-bot-ts/commit/4d4036df54b7a95f7e8fe85ca4448712d15e89ef))


### Bug Fixes

* Fix bot restart handling ([78996e5](https://github.com/iirose-tools/iirose-bot-ts/commit/78996e5f60e8ec42a9a7a223ca50d56993872f62))

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
