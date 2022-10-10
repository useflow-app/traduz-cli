react-i18n-cli
==============

CLI to handle the React strings translations

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/useflow-app/react-i18n-cli/blob/main/package.json)

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
react-i18n-cli/0.1.0 linux-x64 node-v14.17.6
$ react-i18n-cli --help [COMMAND]
USAGE
  $ react-i18n-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`react-i18n-cli setup`](#react-i18n-cli-setup)
* [`react-i18n-cli update`](#react-i18n-cli-update-world)
* [`react-i18n-cli --help [COMMAND]`](#react-i18n-cli-help-commmand)

## `react-i18n-cli setup`

Setup i18n CLI

```
USAGE
  $ react-i18n-cli setup

DESCRIPTION
  Setup i18n CLI.
  You must run this command before update.
  The parameters are stored in the react-i18n-config.json file in the same path where this command is run.

EXAMPLES
  $ react-i18n-cli setup
  Let's setup this tool...
  I18n Host: http://localhost:8000  # ms-i18n host
  Application ID: 123456789         # ms-auth app id
  Application Key: abcdefghi        # ms-auth app key
  Translation path: i18n            # path to save translations
  Translation filename: language    # default name of translation files
```

_See code: [dist/commands/hello/index.ts](https://github.com/useflow-app/react-i18n-cli/blob/main/src/commands/setup.ts)_

## `react-i18n-cli update`

Update supported languages

```
USAGE
  $ react-i18n-cli update

DESCRIPTION
  Update supported languages and save in local storage.
  You must run setup before this command.

FLAGS
  -f, --force  force send all strings
  -r, --reset  reset local translations

EXAMPLES
  $ react-i18n-cli update
  parsing files *.js and *.jsx... done
  sending new strings... done
  retrieving languages available... done
  retrieving language en... done
  retrieving language es... done
  retrieving language pt-br... done
  retrieving language pt-pt... done
```

## `react-i18n-cli --help [COMMAND]`

Display help for react-i18n-cli.

```
USAGE
  $ react-i18n-cli --help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

DESCRIPTION
  Display help for react-i18n-cli.
```
<!-- commandsstop -->
