<!-- Readme template from https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/catc0de1/nestjs-book-api">
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://www.meilisearch.com/" target="blank"><img src="https://cdn.simpleicons.org/meilisearch/FF5CAA" width="120" alt="Meilisearch Logo"/></a>
  </a>

<h3 align="center">Heavy Search Book API</h3>

  <p align="center">
    API for heavy search book library
    <br />
    <a href="https://github.com/catc0de1/nestjs-book-api"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/catc0de1/nestjs-book-api">View Demo</a>
    &middot;
    <a href="https://github.com/catc0de1/nestjs-book-api/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/catc0de1/nestjs-book-api/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#how-to-start">How To Start</a></li>
        <li><a href="#tests">Tests</a></li>
        <li><a href="#linter-and-formatter">Linter and Formatter</a></li>
        <li><a href="#automation">Automation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project is a **production-ready book library API** designed for handling heavy search operations on large book datasets.

It is built with a modern backend stack using NestJS and Fastify, and integrates Meilisearch as the search engine to provide fast and efficient full-text search capabilities.

The API focuses on performance, scalability, and developer experience while providing a simple system for managing books in a library.

Key features include:

- High-performance book search using Meilisearch
- A heavy endpoint for retrieving large book datasets
- Simple admin authentication for book management
- JWT authentication with rate limiting protection
- Schema validation using [zod](https://zod.dev/)
- Production-oriented architecture with caching and search indexing

The prototype version of this API is available here:  
[https://github.com/catc0de1/express-book-search-api](https://github.com/catc0de1/express-book-search-api)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![NestJS][NestJS]][NestJS-url]
* [![Fastify][Fastify]][Fastify-url]
* [![Meilisearch][Meilisearch]][Meilisearch-url]
* [![PrismaORM][Prisma]][Prisma-url]
* [![PostgreSQL][Postgres]][Postgres-url]
* [![Redis][Redis]][Redis-url]
* [![TypeScript][Typescript]][Typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is instructions to setting up project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is a list things needed to use the software.

* **Node.js**

  Use Node.js at least version 20, **better using version 22**

* **Pnpm**

  ```sh
  npm install -g pnpm@latest
  ```

* **Docker**

  Docker needed for database, API, production and test containers. There's an image needed for projects:

  * PostgreSQL
  * Meilisearch

* **VSCode extensions**
  
  Optional but recommended extensions for use if using VSCode as IDE:

  * **Prisma** by Prisma
  * **Biome** by biomejs
  * **Jest** by Orta

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/catc0de1/nestjs-book-api.git
   ```

2. Install dependencies

   ```sh
   pnpm install
   ```

3. **Setup environment variables**

   Create `.env.development`, `.env.production`, and `.env.test` files use template from `.env.example` in project root.

4. **Prisma init**

   ```sh
   # generate prisma client
   pnpm prisma:init

   # initial migration
   pnpm prisma:migrate:dev --name init

   # database seeding:
   pnpm prisma db seed
   ```

5. **Husky installation**

  ```sh
  pnpm prepare
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

There's how to use this project locally or production.

*For more usage, please refer to the [Documentation](https://github.com/catc0de1/nestjs-book-api)*

### How To Start

There are several ways to run the API:

- **Quick run**

  To quickly start the API without watch mode or debug mode, run:

  ```sh
  pnpm start
  ```

  Make sure `.env.development` is filled and the PostgreSQL database is connected to the API.

- **Development mode**

  There are two scripts for development mode, wathc mode and debug mode. Watch mode is usefull for hot reload and debug mode for debugging.

  ```sh
  # watch mode
  pnpm start:dev

  # debug mode
  pnpm start:debug
  ```

  Make sure `.env.development` is filled and the PostgreSQL database is connected to the API.

- **Build mode**

  Before run the app on build mode, API must built with:

  ```sh
  pnpm build
  ```

  *or*

  ```sh
  # build & typecheck
  pnpm build:check
  ```

  > note: `pnpm build:check` it's slower cause SWC will bottleneck againts TSC.

  After build successfully, migrate database with:
  
  ```sh
  pnpm prisma:migrate:prod
  ```

  After that, run the production API with:

  ```sh
  pnpm start:prod
  ```

  This mode uses `.env.production`, so make sure it filled and the PostgreSQL database connected to the API

While run the API, it will not type-check using TSC. Run this script for type checking:

```sh
# if no output, that's mean no type errors
pnpm check
```

*or*

```sh
# it will type checking in watch mode, checking every change on project
pnpm check:watch
```

There's a script to open Prisma studio to see GUI database management:

```sh
pnpm prisma studio
```

Prisma studio will run on `http://localhost:51212`.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Tests

This project uses [Jest](https://jestjs.io/) as unit testing and integration/e2e testing. There are 2 ways to run tests on project:

- **Jest extension**

  If Jest extension installed, tests can run from the VSCode sidebar or play icon on side of test function cases. **However, it only works for unit tests and not for integration/e2e tests.**.

- **NPM scripts**

  There's many option to run test via NPM scripts:

  - **Unit testing**

    ```sh
    # quick test
    pnpm test

    # test with sequetially
    pnpm test:band

    # test with watch mode. It will open Jest interface
    pnpm test:watch

    # test with coverage
    pnpm test:cov

    # test with debug mode
    pnpm test:debug
    ```

  - **Integration/e2e testing**

    Before running integration/e2e testing, make sure the testing database is running.

    These script will manage testing database container using docker. See `docker-compose.test.yml` in project root for more details and make sure `.env.test` filled.

    Scripts:

    ```sh
    # build the postgresql container and start it
    pnpm docker:test:up

    # start the container
    pnpm docker:test:start

    # stop the container
    pnpm docker:test:stop

    # delete the container and its volume
    pnpm docker:test:down
    ```

    If database the container running. Migrate database for testing with:

    ```sh
    pnpm prisma:migrate:test
    ```

    After that, run this script for integration/e2e test:

    ```sh
    pnpm test:e2e
    ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Linter and Formatter

This project uses [Biome](https://biomejs.dev/) as linter and formatter. It is configured to automatically fix formatting on save if using VSCode as IDE and Biome extension installed.

Run these scripts for use biome:

```sh
# lint
pnpm biome:lint

# format
pnpm biome:format

# lint & format
pnpm biome:check

# fix lint & format
pnpm biome:write
```

*See `biome.json` for detailed rules.*

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Automation

This project uses [husky](https://typicode.github.io/husky/) for `pre-commit` and `pre-push` hooks. On pre commit, it will fix lint, format using Biome & lint-staged. On pre push, it will type check and run unit testing. If type checking error or unit tests fail, the push will be rejected automatically.

GitHub workflows are configured for CI. For some branch like `main`, `feature/**`, and `release/**`, it will biome check, type checking, run unit/integration/e2e test, and build check. It trigger on push and pull request. See GitHub workflows for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Build prototype version using Express.js
- [ ] Rewrite the project for a production-ready version
    - [x] Rewrite using NestJS & Fastify
    - [ ] Implement search engine using Meilisearch
    - [ ] Build object storage with Rust
    - [ ] Implement Redis caching
- [ ] Develop the client application
    - [ ] Build the client with Qt and Rust
    - [ ] Configure API - client networking
- [ ] Deployment API and client
- [ ] Build projects documentation website

See the [open issues](https://github.com/catc0de1/nestjs-book-api/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

catc0de1 - catcode0101@gmail.com

Project Link: [https://github.com/catc0de1/nestjs-book-api](https://github.com/catc0de1/nestjs-book-api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- Shields.io badges: https://github.com/inttter/md-badges -->
[contributors-shield]: https://img.shields.io/github/contributors/catc0de1/nestjs-book-api.svg?style=for-the-badge
[contributors-url]: https://github.com/catc0de1/nestjs-book-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/catc0de1/nestjs-book-api.svg?style=for-the-badge
[forks-url]: https://github.com/catc0de1/nestjs-book-api/network/members
[stars-shield]: https://img.shields.io/github/stars/catc0de1/nestjs-book-api.svg?style=for-the-badge
[stars-url]: https://github.com/catc0de1/nestjs-book-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/catc0de1/nestjs-book-api.svg?style=for-the-badge
[issues-url]: https://github.com/catc0de1/nestjs-book-api/issues
[license-shield]: https://img.shields.io/github/license/catc0de1/nestjs-book-api.svg?style=for-the-badge
[license-url]: https://github.com/catc0de1/nestjs-book-api/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/iyan-zuli-armanda-8a1383296/

[NestJS]: https://img.shields.io/badge/Nest.js-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/
[Fastify]: https://img.shields.io/badge/-Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white
[Fastify-url]: https://fastify.dev/
[Meilisearch]: https://img.shields.io/badge/Meilisearch-FF5CAA?style=for-the-badge&logo=meilisearch&logoColor=white
[Meilisearch-url]: https://www.meilisearch.com/
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Postgres]: https://img.shields.io/badge/Postgres-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Redis]: https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff
[Typescript-url]: https://www.typescriptlang.org/