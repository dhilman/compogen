
# Create Component CLI

A CLI tool for creating new React components with custom templates.

## Features

- Creates functional components with or without refs
- Allows custom templates via `template.js` file
- Optional storybook and index files (from template)

## Setup

### Installation

```bash
npm install --save-dev compogen
```

### Configuration

Add the following to your `package.json`:

```json
{
  "scripts": {
    "compogen": "compogen"
  }
}
```

Further configuration is done via a `template.js` file in the root directory of your project. This file should export an object with the following properties:
```typescript
interface Config {
  dir: string;
  ext: 'ts' | 'js';
  i: boolean;
  n: boolean;
  t: 'functional' | 'functionalWithRef';
  componentName: string;
  s: boolean;
  templates?: {
    functional?: string;
    functionalWithRef?: string;
    storybook?: string;
    index?: string;
  }
}
```

### Usage

```bash
# help
npm run compogen -- --help
```

```bash
npm run compogen -- [options] componentName
```

--- 

### Global Installation

You can install the CLI globally, so that you can use it for any project.

```bash
npm install -g compogen
```

#### Usage

```bash
compgen [options] componentName
```
