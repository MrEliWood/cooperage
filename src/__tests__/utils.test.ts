import { describe, expect, test } from '@jest/globals';
import {
    isReactComponent,
    createImportStatement,
    createExportStatement,
    buildBarrel,
    getDirectories,
    removeFileFromPath,
    validateFiles
} from '../utils';

describe('utils', () => {
    describe('isReactComponent()', () => {
        const component = 'src/components/directory';
        const nonComponent = 'src/utils/directory';
        const componentsDirectory = 'src/components';

        test('returns TRUE for directories inside a components folder', () => {
            expect(isReactComponent(component)).toBe(true);
        });

        test('returns FALSE for directories not in a components folder', () => {
            expect(isReactComponent(nonComponent)).toBe(false);
        });

        test('returns FALSE for the components folder', () => {
            expect(isReactComponent(componentsDirectory)).toBe(false);
        });
    });

    describe('createImportStatement()', () => {
        const module = 'module';
        const dashedModule = 'dashed-module-name';
        const importStatement = `import module from './module';`;
        const dashedImportStatement = `import dashed_module_name from './dashed-module-name';`;

        test('returns a complete import statement as a string', () => {
            expect(createImportStatement(module)).toEqual(importStatement);
        });

        test('returns a complete import statement as a string, replacing dashes with underscores', () => {
            expect(createImportStatement(dashedModule)).toEqual(dashedImportStatement);
        });
    });

    describe('createExportStatement()', () => {
        const directory = 'src/utils/directory';
        const componentDirectory = 'src/components/directory';
        const modules = ['module', 'anotherModule', 'finalModule'];
        const dashedModules = ['dashed-module-name', 'anotherModule'];
        const exportStatement = `export { module, anotherModule, finalModule };`;
        const dashedExportStatement = `export { dashed_module_name, anotherModule };`;
        const defaultExportStatement = `export default { module, anotherModule, finalModule };`;

        test('returns a complete export statement as a string', () => {
            expect(createExportStatement(directory, modules)).toEqual(exportStatement);
        });

        test('if component, returns DEFAULT export statement as a string', () => {
            expect(createExportStatement(componentDirectory, modules)).toEqual(defaultExportStatement);
        });

        test('returns a complete export statement as a string, replacing dashes with underscores', () => {
            expect(createExportStatement(directory, dashedModules)).toEqual(dashedExportStatement);
        });
    });

    describe('buildBarrel()', () => {
        const directory = 'src/utils/directory';
        const componentDirectory = 'src/components/directory';
        const contents = ['file.ts', 'otherFile.ts', 'directory'];
        const barrel = `import file from './file';\nimport otherFile from './otherFile';\nimport directory from './directory';\n\nexport { file, otherFile, directory };`;
        const componentBarrel = `import file from './file';\nimport otherFile from './otherFile';\nimport directory from './directory';\n\nexport default { file, otherFile, directory };`;

        test('returns barrel file contents as a string', () => {
            expect(buildBarrel(directory, contents)).toEqual(barrel);
        });

        test('if component, returns barrel file contents as a string with DEFAULT export', () => {
            expect(buildBarrel(componentDirectory, contents)).toEqual(componentBarrel);
        });
    });

    describe('removeFileFromPath()', () => {
        const filepath = 'src/directory/file.ts';
        const pathWithoutFile = 'src/directory';

        test('returns path for parent directory', () => {
            expect(removeFileFromPath(filepath)).toEqual(pathWithoutFile);
        });
    });

    describe('getDirectories()', () => {
        const directory = 'src/utils';
        const contents = ['file.ts', 'directory'];
        const nullContents = ['file.ts', 'otherFile.ts'];
        const directoriesOnly = ['src/utils/directory'];

        test('returns array with only directory names', () => {
            expect(getDirectories(directory, contents)).toEqual(directoriesOnly);
        });

        test('if no directories, returns null', () => {
            expect(getDirectories(directory, nullContents)).toBe(null);
        });
    });

    describe('validateFiles()', () => {
        const valid = ['valid.ts', 'valid'];
        const inValid = ['invalid.ts', 'valid', 'node_modules'];

        test('returns TRUE for valid files', () => {
            expect(validateFiles(valid)).toBe(true);
        });

        test('returns FALSE for invalid files', () => {
            expect(validateFiles(inValid)).toBe(false);
        });
    });
});
