## Desert Palm API

E-commerce platform API

Tech stack:

- NestJS
- TypeORM
- Docker

## Installation

```bash
# Install Yarn globally
$ npm install -g yarn

# Install project dependencies
$ cd desert-palm-api && yarn

# Add .env file and edit as needed
$ cp .env.example .env
```

## Running the app

```bash
# Development
$ yarn start

# Watch mode
$ yarn start:dev

# Production mode
$ yarn start:prod

# Go to http://localhost:3000/api to view and interact with the API
```

## Docker

```bash
# Build and start containers
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
