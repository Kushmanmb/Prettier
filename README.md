# Prettier

A Node.js project configured with Prettier for code formatting and Husky for Git hooks.

## Features

- **Prettier**: Automatically formats code to ensure consistent style
- **Husky**: Pre-commit hooks to run Prettier before committing
- **Lint-staged**: Only formats files that are staged for commit

## Installation

```bash
npm install
```

## Usage

The project is configured to automatically format code on commit using Husky and lint-staged.

To manually format files:

```bash
npx prettier --write .
```

## Configuration

- `.prettierrc`: Prettier configuration
- `.prettierignore`: Files to ignore from formatting
- `.husky`: Git hooks configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
