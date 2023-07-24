////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  generates the contents of a barrel file
//
//  accepts two arguments ( a list of modules, boolean for using default export )
//  returns a formatted string with import and export statements
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const isReactComponent = (directory: string) => {
    const directoryArray = directory.split('/');
    const insideComponentFolder = directoryArray.includes('components');
    const notComponentFolder = directoryArray[directoryArray.length - 1] !== 'components';
    const isComponent = insideComponentFolder && notComponentFolder;

    return isComponent;
};

const createImportStatement = (module: string) => {
    return `import ${module.replace(/-/g, '_')} from './${module}';`;
};

const createExportStatement = (directory: string, modules: string[]) => {
    if (modules.length < 1) return '';

    const useDefault = isReactComponent(directory);
    const moduleString = modules.join(', ').replace(/\-/g, '_');

    if (useDefault) {
        return `export default { ${moduleString} };`;
    }

    return `export { ${moduleString} };`;
};

const buildBarrel = (directory: string, contents: string[]) => {
    const importsArray: string[] = [];
    const exportsArray: string[] = [];

    contents.forEach((path) => {
        const module = path.split('.')[0];

        if (module === 'index') return;

        const importStatement = createImportStatement(module);

        importsArray.push(importStatement);
        exportsArray.push(module);
    });

    const importString = importsArray.join('\n');
    const exportString = createExportStatement(directory, exportsArray);

    const fileContents = importString + '\n\n' + exportString;

    return fileContents;
};

export { isReactComponent, createImportStatement, createExportStatement, buildBarrel };
