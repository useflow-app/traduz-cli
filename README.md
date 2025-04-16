traduz-cli
==============

CLI to handle strings translations

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/useflow-app/traduz-cli/blob/main/package.json)

<!-- toc -->
* [Installation](#installation)
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
traduz-cli/v0.3.1 linux-x64 node-v22.12.0
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

## `traduz-cli setup`

setup i18n cli

```
USAGE
  $ traduz-cli setup

DESCRIPTION
  setup i18n cli

EXAMPLES
  $ traduz-cli setup
```

_See code: [dist/commands/setup.ts](https://github.com/useflow-app/traduz-cli/blob/vv0.3.1/dist/commands/setup.ts)_

## `traduz-cli update`

update supported languages

```
USAGE
  $ traduz-cli update [-f] [-r]

FLAGS
  -f, --force  force send all strings
  -r, --reset  reset local translations

DESCRIPTION
  update supported languages

EXAMPLES
  $ traduz-cli update
```

_See code: [dist/commands/update.ts](https://github.com/useflow-app/traduz-cli/blob/vv0.3.1/dist/commands/update.ts)_
<!-- commandsstop -->
