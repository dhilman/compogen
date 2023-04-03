#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs-extra';
import yargs from 'yargs';
import chalk from 'chalk';

interface Config {
  dir: string;
  ext: 'ts' | 'js';
  n: boolean;
  t: 'functional' | 'functionalWithRef';
  componentName: string;
  s: boolean;
  templates?: {
    functional?: string;
    functionalWithRef?: string;
    storybook?: string;
  }
}

const readTemplateConfig = (): Partial<Config> => {
  try {
    const templateConfigPath = path.resolve(process.cwd(), 'template.js');
    return require(templateConfigPath);
  } catch (error) {
    console.log(chalk.yellow('No template.js found or invalid format. Using default configuration.'));
    return {};
  }
};

const createComponent = (config: Config) => {
  const componentDir = config.n
    ? path.join(config.dir, config.componentName)
    : config.dir;

  const componentPath = path.join(componentDir, `${config.componentName}.${config.ext}`);

  if (fs.existsSync(componentPath)) {
    console.log(chalk.red('Component already exists. Aborting.'));
    return;
  }

  fs.ensureDirSync(componentDir);

  const componentTemplate = config.templates?.[config.t] || '';

  fs.writeFileSync(componentPath, componentTemplate, { encoding: 'utf-8' });
  console.log(chalk.green(`Component created successfully: ${componentPath}`));

  if (config.s) {
    const storybookTemplate = config.templates?.storybook || '';
    const storybookPath = path.join(componentDir, `${config.componentName}.stories.${config.ext}`);
    fs.writeFileSync(storybookPath, storybookTemplate, { encoding: 'utf-8' });
    console.log(chalk.green(`Storybook file created successfully: ${storybookPath}`));
  }
};

const argv = yargs(process.argv.slice(2))
  .options({
    dir: {
      alias: 'd',
      type: 'string',
      description: 'Path to directory for component',
      default: 'src/components',
    },
    ext: {
      alias: 'e',
      type: 'string',
      choices: ['ts', 'js'],
      description: 'File extension',
      default: 'ts',
    },
    n: {
      alias: 'nested',
      type: 'boolean',
      description: 'Create a component inside its own directory with component name',
      default: true,
    },
    t: {
      alias: 'type',
      type: 'string',
      choices: ['functional', 'functionalWithRef'],
      description: 'Type of component',
      default: 'functional',
    },
    componentName: {
      type: 'string',
      demandOption: true,
      description: 'Name of the component',
    },
    s: {
      alias: 'storybook',
      type: 'boolean',
      description: 'Create a Storybook file from template',
      default: false,
    },
  })
  .config(readTemplateConfig())
  .argv;

createComponent(argv as Config);
