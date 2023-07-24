import { writeFileSync, readdirSync, rmSync, watch } from 'fs';
import { buildBarrel, getDirectories, removeFileFromPath, validateFiles } from './utils';

const barrels = (directories = [''], language?: string) => {
    const isJavaScript = language?.toLowerCase() === 'javascript' || language?.toLowerCase() === 'js';
    const fileType = isJavaScript ? 'js' : 'ts';

    const createBarrel = (directory: string, contents: string[]) => {
        console.log(`🛢️  Updating ${directory}/index.${fileType}`);

        const fileContents = buildBarrel(directory, contents);
        const filePath = `.${directory}/index.${fileType}`;

        writeFileSync(filePath, fileContents);
    };

    const generateBarrels = (directories: string[], affectedDirectory?: string) => {
        directories.forEach((directory) => {
            if (directory.includes('node_modules')) return;
            if (directory.includes('.next')) return;

            const contents = readdirSync(`.${directory}`);
            if (contents.length < 1) return;

            const subDirectories = getDirectories(directory, contents);
            if (subDirectories) generateBarrels(subDirectories, affectedDirectory);

            const hasValidFiles = validateFiles(contents);
            if (!hasValidFiles) return;

            const updateDirectory = directory === affectedDirectory || !affectedDirectory;
            if (updateDirectory) createBarrel(directory, contents);
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
            if (filename?.includes('node_modules')) return;
            if (filename?.includes('.next')) return;
            if (filename?.includes('index')) return;

            console.log(`🛢️  Cooperage noticed changes to ${filename}`);

            const affectedDirectory = removeFileFromPath(filename);

            ac.abort();
            generateBarrels(directories, affectedDirectory);
            watchDirectory(directories);
        });
    };

    console.log(); // line break

    watchDirectory(directories);
    generateBarrels(directories);

    console.log(); // line break
    console.log(`🛢️  Cooperage is watching for file changes`);
    console.log(); // line break
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

// barrels(['utils', 'components']);

//////////////////////////////////////////////////////

export default barrels;
