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

## Examples

This repository includes examples demonstrating important synchronization patterns for validation queues after peer disconnection:

### SyncWithValidationInterfaceQueue Pattern

The `examples/` directory contains code demonstrating the pattern of calling `SyncWithValidationInterfaceQueue()` after disconnecting peers to prevent race conditions.

- **`examples/net_processing.cpp`** - C++ example showing the pattern (Bitcoin Core style)
- **`examples/network-manager.js`** - JavaScript/Node.js equivalent implementation
- **`examples/test-network-manager.js`** - Test suite demonstrating the pattern
- **`examples/README.md`** - Detailed documentation of the pattern

To run the JavaScript examples:

```bash
node examples/test-network-manager.js
```

### Key Concepts

The examples demonstrate:

1. ✅ **Correct Pattern**: Call sync after disconnecting to process all pending validations
2. ❌ **Incorrect Pattern**: Disconnecting without sync can cause race conditions
3. 🔄 **Efficient Pattern**: Batch disconnects with a single sync call
4. ⚠️ **Race Condition Prevention**: How sync prevents use-after-free errors

See [`examples/README.md`](examples/README.md) for detailed documentation.

## Configuration

- `.prettierrc`: Prettier configuration
- `.prettierignore`: Files to ignore from formatting
- `.husky`: Git hooks configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
