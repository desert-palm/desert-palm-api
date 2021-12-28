## Desert Palm API

E-commerce platform API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Docker

```bash
# Builds, (re)creates, starts containers
$ docker-compose up
```

## Test

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Prettier and ESLint

```bash
# Enable pre-commit hook with Husky
$ npx husky install && npx husky add .husky/pre-commit "yarn lint-staged"
```
