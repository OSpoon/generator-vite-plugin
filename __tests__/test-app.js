'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('vite-plugin:app', () => {
    describe('with prompt inputs', () => {
        beforeAll((done) => {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({ skipInstall: true })
                .withPrompts({
                    name: 'transform',
                    description: 'A plug-in for Vite.',
                    githubUsername: 'OSpoon',
                    authorName: 'fe-xiaoxin',
                    authorEmail: '1825203636@qq.com',
                    keywords: 'transform'
                })
                .on('end', done);
        });

        it('creates files', () => {
            assert.file([
                '.vscode/launch.json',
                'src/index.ts',
                '.gitignore',
                'index.html',
                '.npmignore',
                'README.md',
                'tsconfig.json',
                'vite.config.ts',
                'package.json'
            ]);
        });

        it('populates package.json correctly', () => {
            assert.jsonFileContent('package.json', {
                name: 'vite-plugin-transform',
                version: '0.0.0',
                description: 'A plug-in for Vite.',
                repository: 'OSpoon/vite-plugin-transform',
                author: 'fe-xiaoxin <1825203636@qq.com>',
                keywords: ['transform', 'vite-plugin']
            });
        });
    });

    describe('without prompt inputs', () => {
        beforeAll((done) => {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({ skipInstall: true })
                .on('end', done);
        });

        it('populates package.json correctly', () => {
            assert.jsonFileContent('package.json', {
                version: '0.0.0',
                keywords: ['vite-plugin'],
            });
        });
    });

    describe('with only author name', () => {
        beforeAll((done) => {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({ skipInstall: true })
                .withPrompts({
                    authorName: 'fe-xiaoxin'
                })
                .on('end', done);
        });

        it('omits the email part in the package.json author field', () => {
            assert.jsonFileContent('package.json', {
                author: 'fe-xiaoxin',
            });
        });
    });
});