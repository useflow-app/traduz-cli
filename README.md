oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g react-i18n-cli
$ react-i18n-cli COMMAND
running command...
$ react-i18n-cli (--version)
react-i18n-cli/0.0.0 linux-x64 node-v14.17.6
$ react-i18n-cli --help [COMMAND]
USAGE
  $ react-i18n-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`react-i18n-cli hello PERSON`](#react-i18n-cli-hello-person)
* [`react-i18n-cli hello world`](#react-i18n-cli-hello-world)
* [`react-i18n-cli help [COMMAND]`](#react-i18n-cli-help-command)
* [`react-i18n-cli plugins`](#react-i18n-cli-plugins)
* [`react-i18n-cli plugins:install PLUGIN...`](#react-i18n-cli-pluginsinstall-plugin)
* [`react-i18n-cli plugins:inspect PLUGIN...`](#react-i18n-cli-pluginsinspect-plugin)
* [`react-i18n-cli plugins:install PLUGIN...`](#react-i18n-cli-pluginsinstall-plugin-1)
* [`react-i18n-cli plugins:link PLUGIN`](#react-i18n-cli-pluginslink-plugin)
* [`react-i18n-cli plugins:uninstall PLUGIN...`](#react-i18n-cli-pluginsuninstall-plugin)
* [`react-i18n-cli plugins:uninstall PLUGIN...`](#react-i18n-cli-pluginsuninstall-plugin-1)
* [`react-i18n-cli plugins:uninstall PLUGIN...`](#react-i18n-cli-pluginsuninstall-plugin-2)
* [`react-i18n-cli plugins update`](#react-i18n-cli-plugins-update)

## `react-i18n-cli hello PERSON`

Say hello

```
USAGE
  $ react-i18n-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/useflow-app/react-i18n-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `react-i18n-cli hello world`

Say hello world

```
USAGE
  $ react-i18n-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ react-i18n-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `react-i18n-cli help [COMMAND]`

Display help for react-i18n-cli.

```
USAGE
  $ react-i18n-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for react-i18n-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `react-i18n-cli plugins`

List installed plugins.

```
USAGE
  $ react-i18n-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ react-i18n-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.1/src/commands/plugins/index.ts)_

## `react-i18n-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ react-i18n-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ react-i18n-cli plugins add

EXAMPLES
  $ react-i18n-cli plugins:install myplugin 

  $ react-i18n-cli plugins:install https://github.com/someuser/someplugin

  $ react-i18n-cli plugins:install someuser/someplugin
```

## `react-i18n-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ react-i18n-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ react-i18n-cli plugins:inspect myplugin
```

## `react-i18n-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ react-i18n-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ react-i18n-cli plugins add

EXAMPLES
  $ react-i18n-cli plugins:install myplugin 

  $ react-i18n-cli plugins:install https://github.com/someuser/someplugin

  $ react-i18n-cli plugins:install someuser/someplugin
```

## `react-i18n-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ react-i18n-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ react-i18n-cli plugins:link myplugin
```

## `react-i18n-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ react-i18n-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ react-i18n-cli plugins unlink
  $ react-i18n-cli plugins remove
```

## `react-i18n-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ react-i18n-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ react-i18n-cli plugins unlink
  $ react-i18n-cli plugins remove
```

## `react-i18n-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ react-i18n-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ react-i18n-cli plugins unlink
  $ react-i18n-cli plugins remove
```

## `react-i18n-cli plugins update`

Update installed plugins.

```
USAGE
  $ react-i18n-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
