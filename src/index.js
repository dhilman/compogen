#! /usr/bin/env node

const {program} = require('commander');
const fs = require('fs');
const {
    mkDirPromise,
    readFilePromise,
    readFileRelativePromise,
    writeFilePromise,
} = require('./utils');

program
    .version('0.0.1')
    .arguments("<componentName>")
    .option("-c, --componentsDir <dir>", "Components directory", "src/components")
    .option("-d, --dir <dir>", "Directory to create component in (default: componentName)")
    .parse(process.argv);

const options = program.opts();
const componentName = program.args[0];
const Options = {
    compRootDir: options.componentsDir,
    compDir: options?.dir || componentName,
    extension: "tsx",
}

const Paths = {}
Paths.cwd = process.cwd();
Paths.compRoot = `${Paths.cwd}/${Options.compRootDir}`;
Paths.compDir = `${Paths.compRoot}/${Options.compDir}`;
Paths.compFile = `${Paths.compDir}/${componentName}.${Options.extension}`;
Paths.storyFile = `${Paths.compDir}/${componentName}.stories.${Options.extension}`;

if (!fs.existsSync(Paths.compRoot)) {
    console.error(`Components directory '${Options.compRootDir}' does not exist`);
    process.exit(1);
}

if (!fs.existsSync(Paths.compDir)) {
    fs.mkdirSync(Paths.compDir);
}

if (fs.existsSync(Paths.compFile)) {
    console.error(`Component file for '${componentName}' already exists`);
    process.exit(1);
}
if (fs.existsSync(Paths.storyFile)) {
    console.error(`Story file for '${componentName}' already exists`);
    process.exit(1);
}

readFileRelativePromise("./templates/component.tsx")
    .then((template) => template.replace(/COMPONENT_NAME/g, componentName))
    .then((template) => writeFilePromise(Paths.compFile, template))
    .then(() => readFileRelativePromise("./templates/component.story.tsx"))
    .then((template) => template.replace(/COMPONENT_NAME/g, componentName))
    .then((template) => writeFilePromise(Paths.storyFile, template))
    .then(() => console.log(`Created component '${componentName}'`))
    .catch((err) => console.error(err));

