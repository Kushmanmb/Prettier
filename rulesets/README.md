# Prettier Rulesets

This directory contains predefined Prettier configuration rulesets that can be used to format code according to different style preferences.

## Available Rulesets

### Default (`default.json`)
The standard Prettier configuration with recommended defaults:
- Print width: 80 characters
- Tab width: 2 spaces
- Semicolons: Required
- Quotes: Double quotes
- Trailing commas: ES5 compatible
- Arrow function parentheses: Always included

### Strict (`strict.json`)
A stricter configuration for teams that want more consistent formatting:
- Print width: 100 characters
- Tab width: 2 spaces
- Semicolons: Required
- Quotes: Single quotes
- Quote properties: Consistent
- Trailing commas: All (including function arguments)
- Prose wrap: Always
- HTML whitespace sensitivity: Strict

### Relaxed (`relaxed.json`)
A more flexible configuration for personal projects or less strict teams:
- Print width: 120 characters
- Tab width: 4 spaces
- Semicolons: Not required
- Quotes: Single quotes
- Trailing commas: None
- Arrow function parentheses: Avoid when possible
- Bracket same line: Enabled
- Prose wrap: Never
- End of line: Auto

## Usage

To use a ruleset, copy the desired configuration file to `.prettierrc` in your project root:

```bash
cp rulesets/default.json .prettierrc
```

Or use the ruleset manager script:

```bash
npm run ruleset:apply default
```

## Creating Custom Rulesets

To create a custom ruleset:

1. Create a new JSON file in the `rulesets/` directory
2. Define your Prettier configuration options
3. Document the ruleset purpose in this README

See [Prettier Options](https://prettier.io/docs/en/options.html) for all available configuration options.
