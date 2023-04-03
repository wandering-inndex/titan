# Development

This documents how to start the development process.

## Chrome Extensions

Here are some chrome extensions that will improve your development experience:

- [Octotree - GitHub code tree](https://chrome.google.com/webstore/detail/octotree-github-code-tree/bkhaagjahfmjljalopjnoealnfndnagc)
- [Refined GitHub](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf)
- [Gitpod - Always ready to code](https://chrome.google.com/webstore/detail/gitpod-always-ready-to-co/dodmmooeoklaejobgleioelladacbeki)
- [JSONVue](https://chrome.google.com/webstore/detail/jsonvue/chklaanhfefbnpoihckbnefhakgolnmc)

## Code Editors

We recommend using [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:

- [`dbaeumer.vscode-eslint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [`stylelint.vscode-stylelint`](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [`esbenp.prettier-vscode`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [`editorconfig.editorconfig`](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
- [`redhat.vscode-yaml`](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
- [`aaron-bond.better-comments`](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [`eamodio.gitlens`](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [`davidanson.vscode-markdownlint`](https://marketplace.visualstudio.com/items?itemName=davidanson.vscode-markdownlint)

If you do not have access to a development machine, you can create a new [Gitpod](https://gitpod.io/) workspace by clicking the button below:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/wandering-inndex/titan)

## Node

This project requires [Node.js](https://nodejs.org/). It is recommended that you use a Node version manager for your operating system to install it:

- [Node Version Manager](https://github.com/nvm-sh/nvm) (Linux/macOS)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows) (Windows)

Afterwards, please install the version specified in the [`.nvmrc` file](./.nvmrc).

## pnpm

This project uses [pnpm](https://pnpm.io/) for its package manager. Please refer to their [Installation page](https://pnpm.io/installation) for more details.

## Commands

Install the project dependencies:

```bash
pnpm install
```

To start the development server, you can run:

```bash
pnpm dev
```

To run the tests, you can execute:

```bash
pnpm test
```
