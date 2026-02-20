#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const RULESETS_DIR = path.join(__dirname, '..', 'rulesets');
const PRETTIER_RC = path.join(__dirname, '..', '.prettierrc');

// Command line arguments
const command = process.argv[2];
const rulesetName = process.argv[3];

function listRulesets() {
  console.log('\nAvailable Prettier Rulesets:\n');
  
  const files = fs.readdirSync(RULESETS_DIR)
    .filter(file => file.endsWith('.json'));
  
  files.forEach(file => {
    const name = path.basename(file, '.json');
    const rulesetPath = path.join(RULESETS_DIR, file);
    const ruleset = JSON.parse(fs.readFileSync(rulesetPath, 'utf8'));
    
    console.log(`  ${name}`);
    console.log(`    Print Width: ${ruleset.printWidth}`);
    console.log(`    Tab Width: ${ruleset.tabWidth}`);
    console.log(`    Semicolons: ${ruleset.semi ? 'Required' : 'Not required'}`);
    console.log(`    Quotes: ${ruleset.singleQuote ? 'Single' : 'Double'}`);
    console.log('');
  });
}

function applyRuleset(name) {
  const rulesetPath = path.join(RULESETS_DIR, `${name}.json`);
  
  if (!fs.existsSync(rulesetPath)) {
    console.error(`Error: Ruleset '${name}' not found.`);
    console.log('\nAvailable rulesets:');
    const files = fs.readdirSync(RULESETS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => `  - ${path.basename(file, '.json')}`);
    console.log(files.join('\n'));
    process.exit(1);
  }
  
  const ruleset = fs.readFileSync(rulesetPath, 'utf8');
  fs.writeFileSync(PRETTIER_RC, ruleset);
  
  console.log(`✓ Applied '${name}' ruleset to .prettierrc`);
}

function showCurrentRuleset() {
  if (!fs.existsSync(PRETTIER_RC)) {
    console.log('No .prettierrc file found.');
    return;
  }
  
  const current = fs.readFileSync(PRETTIER_RC, 'utf8');
  console.log('\nCurrent Prettier Configuration:\n');
  console.log(current);
}

function createRuleset(name) {
  if (!name) {
    console.error('Error: Please provide a name for the new ruleset.');
    process.exit(1);
  }
  
  const rulesetPath = path.join(RULESETS_DIR, `${name}.json`);
  
  if (fs.existsSync(rulesetPath)) {
    console.error(`Error: Ruleset '${name}' already exists.`);
    process.exit(1);
  }
  
  // Copy from .prettierrc if it exists, otherwise use default
  let template;
  if (fs.existsSync(PRETTIER_RC)) {
    template = fs.readFileSync(PRETTIER_RC, 'utf8');
  } else {
    template = fs.readFileSync(path.join(RULESETS_DIR, 'default.json'), 'utf8');
  }
  
  fs.writeFileSync(rulesetPath, template);
  console.log(`✓ Created new ruleset '${name}' at ${rulesetPath}`);
  console.log('  Edit the file to customize your ruleset.');
}

function showHelp() {
  console.log(`
Prettier Ruleset Manager

Usage:
  node scripts/ruleset-manager.js <command> [options]

Commands:
  list                  List all available rulesets
  apply <name>          Apply a ruleset to .prettierrc
  current               Show current .prettierrc configuration
  create <name>         Create a new ruleset
  help                  Show this help message

Examples:
  node scripts/ruleset-manager.js list
  node scripts/ruleset-manager.js apply strict
  node scripts/ruleset-manager.js create my-custom-ruleset
`);
}

// Main execution
switch (command) {
  case 'list':
    listRulesets();
    break;
  case 'apply':
    if (!rulesetName) {
      console.error('Error: Please provide a ruleset name.');
      console.log('Usage: node scripts/ruleset-manager.js apply <name>');
      process.exit(1);
    }
    applyRuleset(rulesetName);
    break;
  case 'current':
    showCurrentRuleset();
    break;
  case 'create':
    createRuleset(rulesetName);
    break;
  case 'help':
  default:
    showHelp();
    break;
}
