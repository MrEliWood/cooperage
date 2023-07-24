////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  filters a list of file paths for directories only
//
//  accepts one argument ( a list of files )
//  returns array of directory names or null
//
////////////////////////////////////////////////////////////////////////////////////////////////////

const getDirectories = (directory: string, contents: string[]) => {
    const subDirectories = contents.filter((subDirectory) => !subDirectory.includes('.'));
    if (subDirectories.length < 1) return null;

    const subDirectoryPaths = subDirectories.map((subDirectory) => `${directory}/${subDirectory}`);
    return subDirectoryPaths;
};

export default getDirectories;
