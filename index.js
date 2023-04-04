#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var yargs_1 = __importDefault(require("yargs"));
// @ts-ignore
var chalk_1 = __importDefault(require("chalk"));
// @ts-ignore
var default_template_1 = __importDefault(require("./default-template"));
var readTemplateConfig = function () {
    try {
        var templateConfigPath = path.resolve(process.cwd(), 'template.js');
        var userConfig = require(templateConfigPath);
        return __assign(__assign({}, default_template_1.default), userConfig);
    }
    catch (error) {
        console.log(chalk_1.default.yellow('No template.js found or invalid format. Using default configuration.'));
        return default_template_1.default;
    }
};
var index = function (config) {
    var _a, _b, _c;
    var componentDir = config.n
        ? path.join(config.dir, config.componentName)
        : config.dir;
    var componentPath = path.join(componentDir, "".concat(config.componentName, ".").concat(config.ext, "x"));
    if (fs.existsSync(componentPath)) {
        console.log(chalk_1.default.red('Component already exists. Aborting.'));
        return;
    }
    fs.ensureDirSync(componentDir);
    var componentTemplate = (((_a = config.templates) === null || _a === void 0 ? void 0 : _a[config.t]) || '');
    createTemplate(componentPath, componentTemplate, config.componentName);
    if (config.s) {
        var storybookTemplate = (((_b = config.templates) === null || _b === void 0 ? void 0 : _b.storybook) || '');
        var storybookPath = path.join(componentDir, "".concat(config.componentName, ".stories.").concat(config.ext, "x"));
        createTemplate(storybookPath, storybookTemplate, config.componentName);
    }
    if (config.i) {
        var indexTemplate = (((_c = config.templates) === null || _c === void 0 ? void 0 : _c.index) || "export { default } from './".concat(config.componentName, "';"));
        var indexPath = path.join(componentDir, "index.".concat(config.ext));
        createTemplate(indexPath, indexTemplate, config.componentName);
    }
};
var createTemplate = function (fpath, template, componentName) {
    var fname = path.basename(fpath);
    if (!template) {
        console.log(chalk_1.default.yellow("No template found for ".concat(fname, ". Skipping.")));
    }
    var data = template.replace(/\$COMPONENT_NAME/g, componentName);
    fs.writeFileSync(fpath, data, { encoding: 'utf-8' });
    console.log(chalk_1.default.green("File created successfully: ".concat(fname)));
};
var options = {
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
};
var argv = (0, yargs_1.default)(process.argv.slice(2))
    .options(options)
    .config(readTemplateConfig())
    .command('$0 <componentName>', 'Create a new component', function (yargs) {
    yargs.positional('componentName', {
        type: 'string',
        description: 'Name of the component',
        demandOption: true,
    });
})
    .argv;
index(argv);
