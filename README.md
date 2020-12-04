![uni-db](https://socialify.git.ci/yegorgunko/uni-db/image?description=1&font=Inter&issues=1&language=1&owner=1&pattern=Plus&pulls=1&theme=Dark)

This is a basic project that helps managing university database. It is a course project so only Russian localization for now (I doubt I will add more).

![GitHub repo size](https://img.shields.io/github/repo-size/yegorgunko/uni-db)

[![Home page](.github/assets/images/screenshots/home.png)](.github/assets/images/screenshots/home.png)
[![Adding](.github/assets/images/screenshots/adding.png)](.github/assets/images/screenshots/adding.png)
[![Filters](.github/assets/images/screenshots/filters.png)](.github/assets/images/screenshots/filters.png)

## Table of Contents

- [Features](#features)
- [Project setup](#project-setup)
- [Tests](#tests)
- [License](#license)

## Features

- Modern UI and SPA support.
- Easy server management right beside the website source code ([`server/index.ts`](server/index.ts) file).
- REST API with relative paths in code.
- Node.js + SQLite
- Filter by any of the parameters.
- Export data to .CSV format.
- Dynamic pages (means if you add another table, [`Table.vue`](src/views/Table.vue) page will automatically get the data from it).
- Easy UI cutomization thanks to [`Vuetify`](https://vuetifyjs.com/) components.

## Project setup

### Clone

```bash
git clone git@github.com:yegorgunko/uni-db.git
```

### Install dependencies

```
yarn install
```

### Runs Express server with hot-reloads for development

```
yarn express
```

### Runs Express server for production

```
yarn express:run
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Tests

There are only HTTP requests to the server tests that are located inside the `tests` directory. Easily add the ones you need. For VSCode I recommend [REST Client](https://github.com/Huachao/vscode-restclient) extension.

## License

[![GitHub](https://img.shields.io/github/license/yegorgunko/uni-db)](LICENSE)
