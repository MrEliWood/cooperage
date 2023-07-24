////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  removes file name from file path
//
//  accepts one argument ( a file path )
//  returns file path for the parent directory
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const removeFileFromPath = (filepath: string | null) => {
    // src/directory/file.ts
    if (!filepath) return undefined;

    const pathArray = filepath.split('/');
    // ['src', 'directory', 'file.ts']

    pathArray.pop();
    // ['src', 'directory']

    const parentDirectoryPath = '/' + pathArray.join('/');
    // src/directory

    return parentDirectoryPath;
};

export default removeFileFromPath;
