////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  checks if list of file names
//  includes a file that shouldn't be barrelled
//
//  accepts one argument ( array of file names )
//  returns true or false
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const invalidFileTypes = [
    // code
    '.css',
    '.json',
    '.jsx',
    '.md',
    '.spec',
    '.test',
    '.tsx',
    '.txt',

    // images
    '.gif',
    '.ico',
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',

    // misc
    '.config',
    '.gitignore',
    'node_modules'
];

const validateFiles = (contents: string[]) => {
    for (let i = 0; i < contents.length; i++) {
        const file = contents[i];

        for (let j = 0; j < invalidFileTypes.length; j++) {
            const invalidType = invalidFileTypes[j];

            if (file.includes(invalidType)) return false;
        }
    }

    return true;
};

export default validateFiles;
