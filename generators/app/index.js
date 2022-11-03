'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');

function stripVitePlugin(str) {
    return str.replace(/^vite-plugin-/, '');
}

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        this.props = {};
    }

    // 收集插件名称、描述、Github用户或组织、作者、作者邮件、关键字信息
    prompting() {
        const prompts = [{
            name: 'name',
            message: 'Plugin Name',
            default: stripVitePlugin(path.basename(process.cwd())),
            filter: function (name) {
                return _.kebabCase(stripVitePlugin(name));
            },
            validate: function (input) {
                return !!input.length;
            },
            when: !this.pkg.name
        }, {
            name: 'description',
            message: 'Description',
            default: '',
            when: !this.pkg.description
        }, {
            name: 'githubUsername',
            default: '',
            message: 'GitHub username or organization',
            when: !this.pkg.repository
        }, {
            name: 'authorName',
            default: '',
            message: 'Author\'s Name',
            when: !this.pkg.author,
            store: true
        }, {
            name: 'authorEmail',
            message: 'Author\'s Email',
            default: '',
            when: !this.pkg.author,
            store: true
        }, {
            name: 'keywords',
            default: '',
            message: 'Key your keywords (comma to split)',
            when: !this.pkg.keywords
        }];

        return this.prompt(prompts).then((props) => {
            this.props = _.extend(this.props, props);

            this.props.githubRepoName = 'vite-plugin-' + this.props.name;

            this.props.pluginName = _.camelCase(this.props.name);

            if (props.githubUsername) {
                this.props.repository = props.githubUsername + '/' + this.props.githubRepoName;
            }

            this.props.keywords = _.uniq(_.words(props.keywords).concat(['vite-plugin']));
        });
    }

    writing() {
        const pkgJsonFields = {
            name: this.props.githubRepoName,
            version: '0.0.0',
            description: this.props.description,
            repository: this.props.repository,
            license: this.props.license,
            author: this.getAuthor(),
            main: 'lib/index.js',
            type: 'module',
            devDependencies: {
                'rimraf': '^3.0.2',
                'tsup': '^6.3.0',
                'typescript': '^4.6.4',
                'vite': '^3.2.0'
            },
            scripts: {
                'dev': 'vite --host',
                'clean': 'rimraf ./lib',
                'build': 'tsup ./src/index.ts --outDir lib --dts --format cjs,esm',
                'prepublish': 'npm run clean && npm run build'
            },
            keywords: this.props.keywords
        };

        this.fs.writeJSON('package.json', _.merge(pkgJsonFields, this.pkg));

        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );

        this.fs.copy(
            this.templatePath('npmignore'),
            this.destinationPath('.npmignore')
        );

        this.fs.copy(
            this.templatePath('tsconfig.json'),
            this.destinationPath('tsconfig.json')
        );

        this.fs.copy(
            this.templatePath('.vscode/launch.json'),
            this.destinationPath('.vscode/launch.json')
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            this.props
        );

        this.fs.copyTpl(
            this.templatePath('vite.config.ts'),
            this.destinationPath('vite.config.ts'),
            this.props
        );

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('index.html'),
            this.props
        );

        this.fs.copyTpl(
            this.templatePath('src/index.ts'),
            this.destinationPath('src/index.ts'),
            this.props
        );
    }

    install() {
        this.addDevDependencies(
            {
                tsup: '^6.3.0',
                typescript: '^4.6.4',
                vite: '^3.2.0',
                rimraf: '^3.0.2',
                'release-it': '^15.5.0',
                'git-cz': '^4.9.0',
            }
        )
    }

    end() {
        this.log(yosay(`It's your showtime.`))
    }

    getAuthor() {
        if (this.props.authorName && this.props.authorEmail) {
            return `${this.props.authorName} <${this.props.authorEmail}>`;
        }

        if (this.props.authorName) {
            return this.props.authorName;
        }

        // author requires at least a name
        return undefined;
    }
};