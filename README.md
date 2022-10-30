traduz-cli
==============

CLI to handle strings translations

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/useflow-app/traduz-cli/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Installation

- Install minimum needed Node.JS version pointed on "engines" field on [package.json](https://github.com/useflow-app/traduz-cli/blob/main/package.json) in your system
- If you use `yarn` as package manager (recommended):
  - Run in your terminal the following command to install the package:
  ```shell
  yarn global add 'git+ssh://git@github.com/useflow-app/traduz-cli.git#main'
  ```
- Test if everything is working as intended, running the following command:
  ```shell
  traduz-cli
  ```
  - If your terminal can't find the command, make sure you are with yarn global binaries on your PATH:
  ```shell
  echo $PATH
  ```
  - To add yarn global binaries to your path:
    - If you use ZSH:
    ```shell
    echo -n 'export PATH="$(yarn global bin):$PATH"' >> ~/.zshrc && source ~/.zshrc
    ```
    - If you use BASH:
    ```shell
    echo -n 'export PATH="$(yarn global bin):$PATH"' >> ~/.bashrc && source ~/.bashrc
    ```
- If you use `npm` as package manager:
  - Make sure you are using an version <= 8.11.0, as newer versions have issues installing it.
    - If you're using an newer version, you can downgrade it by running:
    ```shell
    npm install -g npm@8.11.0
    ```
  - Run in your terminal the following command to install the package:
    ```shell
    npm install -g 'git+ssh://git@github.com/useflow-app/traduz-cli.git#main'
    ```
  - Test if everything is working as intended, running the following command:
    ```shell
    traduz-cli
    ```
- It should show you the "help" with available commands ready to use :D

# Usage
<!-- usage -->
```sh-session
$ npm install -g traduz-cli
$ traduz-cli COMMAND
running command...
$ traduz-cli (--version)
traduz-cli/0.1.0 linux-x64 node-v14.17.6
$ traduz-cli --help [COMMAND]
USAGE
  $ traduz-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`traduz-cli setup`](#traduz-cli-setup)
* [`traduz-cli update`](#traduz-cli-update)
* [`traduz-cli --help [COMMAND]`](#traduz-cli---help-command)

## `traduz-cli setup`

Setup i18n CLI

```
USAGE
  $ traduz-cli setup

DESCRIPTION
  Setup i18n CLI.
  You must run this command before update.
  The parameters are stored in the react-i18n-config.json file in the same path where this command is run.

EXAMPLES
  $ traduz-cli setup
  Let's setup this tool...
  I18n Host: http://localhost:8000  # ms-i18n host
  Application ID: 123456789         # ms-auth app id
  Application Key: abcdefghi        # ms-auth app key
  Translation path: i18n            # path to save translations
  Translation filename: language    # default name of translation files
```

_See code: [src/commands/setup.ts](https://github.com/useflow-app/traduz-cli/blob/main/src/commands/setup.ts)_

## `traduz-cli update`

Update supported languages

```
USAGE
  $ traduz-cli update

DESCRIPTION
  Update supported languages and save in local storage.
  You must run setup before this command.

FLAGS
  -f, --force  force send all strings
  -r, --reset  reset local translations

EXAMPLES
  $ traduz-cli update
  parsing files *.js and *.jsx... done
  sending new strings... done
  retrieving languages available... done
  retrieving language en... done
  retrieving language es... done
  retrieving language pt-br... done
  retrieving language pt-pt... done
```

_See code: [src/commands/update.ts](https://github.com/useflow-app/traduz-cli/blob/main/src/commands/update.ts)_

## `traduz-cli --help [COMMAND]`

Display help for traduz-cli.

```
USAGE
  $ traduz-cli --help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

DESCRIPTION
  Display help for traduz-cli.
```
<!-- commandsstop -->
