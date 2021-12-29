## Desert Palm API

E-commerce platform API

## Installation

```bash
# Install Yarn globally
$ npm install -g yarn

# Install project dependencies
$ cd desert-palm-api && yarn install
```

## Running the app

```bash
# Development
$ yarn start

# Watch mode
$ yarn start:dev

# Production mode
$ yarn start:prod
```

## Docker

```bash
# Builds and starts containers
$ docker-compose build && docker-compose up
```

## Test

```bash
# Unit tests
$ yarn test

# E2E tests
$ yarn test:e2e

# Test coverage
$ yarn test:cov
```

## Prettier and ESLint

```bash
# Enable pre-commit hook with Husky
$ npx husky install && npx husky add .husky/pre-commit "yarn lint-staged"
```
