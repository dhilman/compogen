#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs-extra';
import yargs from 'yargs';
// @ts-ignore
import chalk from 'chalk';
// @ts-ignore
import defaultConfig from './default-template';

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

const readTemplateConfig = (): Partial<Config> => {
  try {
    const templateConfigPath = path.resolve(process.cwd(), 'template.js');
    const userConfig = require(templateConfigPath);
    return { ...defaultConfig, ...userConfig }
  } catch (error) {
    console.log(chalk.yellow('No template.js found or invalid format. Using default configuration.'));
    return defaultConfig;
  }
};

const index = (config: Config) => {
  const componentDir = config.n
    ? path.join(config.dir, config.componentName)
    : config.dir;

  const componentPath = path.join(componentDir, `${config.componentName}.${config.ext}x`);

  if (fs.existsSync(componentPath)) {
    console.log(chalk.red('Component already exists. Aborting.'));
    return;
  }

  fs.ensureDirSync(componentDir);

  const componentTemplate = (config.templates?.[config.t] || '')
  createTemplate(componentPath, componentTemplate, config.componentName);

  if (config.s) {
    const storybookTemplate = (config.templates?.storybook || '');
    const storybookPath = path.join(componentDir, `${config.componentName}.stories.${config.ext}x`);
    createTemplate(storybookPath, storybookTemplate, config.componentName);
  }
  if (config.i) {
    const indexTemplate = (config.templates?.index || `export { default } from './${config.componentName}';`);
    const indexPath = path.join(componentDir, `index.${config.ext}`);
    createTemplate(indexPath, indexTemplate, config.componentName);
  }
};

const createTemplate = (fpath: string, template: string, componentName: string) => {
  const fname = path.basename(fpath);
  if (!template) {
    console.log(chalk.yellow(`No template found for ${fname}. Skipping.`));
  }
  const data = template.replace(/\$COMPONENT_NAME/g, componentName);
  fs.writeFileSync(fpath, data, {encoding: 'utf-8'});
  console.log(chalk.green(`File created successfully: ${fname}`));
}

const options: {
  [key: string]: yargs.Options;
} = {
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
  i: {
    alias: 'index',
    type: 'boolean',
    description: 'Create an index file for the component',
    default: false,
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
  s: {
    alias: 'storybook',
    type: 'boolean',
    description: 'Create a Storybook file from template',
    default: false,
  },
}

const argv = yargs(process.argv.slice(2))
  .options(options)
  .config(readTemplateConfig())
  .command('$0 <componentName>', 'Create a new component', (yargs) => {
    yargs.positional('componentName', {
      type: 'string',
      description: 'Name of the component',
      demandOption: true,
    });
  })
  .argv;

index(argv as unknown as Config);
