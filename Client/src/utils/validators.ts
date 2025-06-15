export const MAX_FILE_SIZE = 1024 * 1024;
export const VALID_FILE_EXTENSIONS = ['image/jpg', 'image/gif', 'image/png', 'image/jpeg', 'image/svg', 'image/webp', 'image/avif'];

export const phoneRegex = RegExp(
    /^[+]?[(]?[0-9]{0,2}[)]?[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{2,3}[-\s.]?[0-9]{2,4}[-\s.]?[0-9]{0,2}$/
);

export const isFileSizeValid = (files: Array<File>, maxSize: number): boolean => {
    let valid = true;
    if (files) {
        files.map(file => {
            const fileSize = file.size
            if (fileSize > maxSize) {
                valid = false
            }
            return file;
        });
    }
    return valid;
};

export function isFileTypesValid(files: Array<File>, authorizedExtensions: Array<string>): boolean {
    let valid = true;
    if (files) {
        files.map(file => {
            if (!authorizedExtensions.includes(file.type)) {
                valid = false;
            }
            return file;
        });
    }
    return valid;
}

export const validateFile = (file: File): boolean => {
    const isValidSize = file.size <= MAX_FILE_SIZE;
    const isValidType = VALID_FILE_EXTENSIONS.includes(file.type);
    return isValidSize && isValidType;
};
