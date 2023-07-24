import { writeFileSync, readdirSync, watch } from 'fs';

const barrels = (directories = ['utils'], language = 'ts') => {
  const isJavaScript = language?.toLowerCase() === 'javascript' || language?.toLowerCase() === 'js';
  const fileType = isJavaScript ? 'js' : 'ts';

  const createBarrel = (directory: string, contents: string[], isComponent: boolean) => {
    console.log(`🛢️  Updating ${directory}/index.${fileType}`);

    const importsArray: string[] = [];
    const exportsArray: string[] = [];

    contents.forEach((path) => {
      const moduleName = path.split('.')[0];

      if (moduleName === 'handleBarrels') return;
      if (moduleName === 'index') return;

      const importStatement = `import ${moduleName} from './${moduleName}';`;

      importsArray.push(importStatement);
      exportsArray.push(moduleName);
    });

    const importsString = importsArray.join('\n');
    const exportsString = `export${isComponent ? ' default' : ''} { ${exportsArray.join(', ')} }`;

    const fileContents = importsString + '\n\n' + exportsString;
    const filePath = `./${directory}/index.${fileType}`;

    writeFileSync(filePath, fileContents);
  };

  const handleBarrels = (directories: string[], affectedDirectory?: string) => {
    directories.forEach((directory) => {
      const contents = readdirSync(`./${directory}`);

      const skipDirectory = contents.some(
        (file) =>
          file?.includes('.tsx') ||
          file?.includes('.jsx') ||
          file?.includes('.css') ||
          file?.includes('.json') ||
          file?.includes('.md') ||
          file?.includes('.gitignore')
      );
      if (skipDirectory) return;

      const subDirectories = contents.filter((subDirectory) => !subDirectory.includes('.'));

      if (subDirectories.length > 0) {
        const subDirectoryPaths = subDirectories.map((subDirectory) => `${directory}/${subDirectory}`);
        handleBarrels(subDirectoryPaths, affectedDirectory);
      }

      if (directory === affectedDirectory || !affectedDirectory) {
        const directoryArray = directory.split('/');
        const isComponent = directoryArray[0] === 'components' && directoryArray.length > 1;

        createBarrel(directory, contents, isComponent);
      }
    });
  };

  const watchDirectory = (directories: string[]) => {
    const ac = new AbortController();

    const options = {
      persistent: true,
      recursive: true,
      signal: ac.signal
    };

    watch('./', options, (eventType, filename) => {
      if (filename?.includes('.next')) return;
      if (filename?.includes('handleBarrels')) return;
      if (filename?.includes('index')) return;

      console.log(`🛢️  Cooperage Noticed changes to ${filename}`);

      const pathArray = filename?.split('/') || [];
      pathArray.pop();

      const affectedDirectory = pathArray?.join('/');

      ac.abort();
      handleBarrels(directories, affectedDirectory);
      watchDirectory(directories);
    });
  };

  console.log();

  watchDirectory(directories);
  handleBarrels(directories);

  console.log();
  console.log(`🛢️  Cooperage is watching for file changes`);
  console.log();

  return `🛢️  Cooperage is watching for file changes`;
};

//
//
//
//
//
// accepts two arguments ( directories: string[], language: string )
//
// EX: barrels(['utils', 'components'], 'js')
//
//
// barrel files will be created and maintained
// in each directory and all relavent subdirectories
//
//////////////////////////////////////////////////////

barrels(['utils', 'components']);

//////////////////////////////////////////////////////

export default barrels;
