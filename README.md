# Prettier Ruleset Management

A Prettier configuration repository with ruleset management functionality. This project provides predefined Prettier configurations (rulesets) and tools to easily switch between them.

## Features

- 📦 Pre-configured rulesets (default, strict, relaxed)
- 🔧 Easy ruleset switching via CLI
- ✨ Create custom rulesets
- 📝 Well-documented configuration options

## Available Rulesets

### Default
Standard Prettier configuration with recommended defaults.

### Strict
Stricter formatting rules for teams that want maximum consistency.

### Relaxed
More flexible configuration for personal projects or less strict teams.

See [rulesets/README.md](rulesets/README.md) for detailed documentation of each ruleset.

## Usage

### List Available Rulesets

```bash
npm run ruleset:list
```

### Apply a Ruleset

```bash
npm run ruleset:apply default
npm run ruleset:apply strict
npm run ruleset:apply relaxed
```

### View Current Configuration

```bash
npm run ruleset:current
```

### Create a Custom Ruleset

```bash
npm run ruleset:create my-custom-ruleset
```

This creates a new ruleset file in `rulesets/my-custom-ruleset.json` based on your current `.prettierrc` configuration (or the default ruleset if no `.prettierrc` exists).

## Direct Script Usage

You can also use the ruleset manager script directly:

```bash
node scripts/ruleset-manager.js list
node scripts/ruleset-manager.js apply strict
node scripts/ruleset-manager.js current
node scripts/ruleset-manager.js create my-ruleset
```

## Project Structure

```
.
├── rulesets/           # Predefined Prettier configurations
│   ├── default.json    # Standard configuration
│   ├── strict.json     # Strict configuration
│   ├── relaxed.json    # Relaxed configuration
│   └── README.md       # Detailed ruleset documentation
├── scripts/
│   └── ruleset-manager.js  # CLI tool for managing rulesets
├── .prettierrc         # Active Prettier configuration
├── .prettierignore     # Files to ignore
└── package.json        # Project configuration
```

## Contributing

To add a new ruleset:

1. Create a new JSON file in the `rulesets/` directory
2. Define your Prettier configuration options
3. Document the ruleset in `rulesets/README.md`
4. Test the ruleset with `npm run ruleset:apply <name>`

## License

ISC
