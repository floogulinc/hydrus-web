import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// @dynamic
export class FileValidators {
    static fileExtension(ext: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {

            const validExtensions = ext.map(e => e.trim().toLowerCase());
            const fileArray = (control.value as File[]);

            const invalidFiles = fileArray.map(file => file.name).filter(
                fname => {
                    const extension = fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
                    return !validExtensions.includes(extension);
                }).map(name => ({ name, ext: name.slice((name.lastIndexOf('.') - 1 >>> 0) + 2) }));



            return !invalidFiles.length
                ? null
                : {
                    fileExtension: {
                        requiredExtension: ext.toString(),
                        actualExtensions: invalidFiles
                    }
                };
        };
    }

    static uniqueFileNames(control: AbstractControl): ValidationErrors | null {

        const fileNameArray = (control.value as File[]).map(file => file.name);

        const duplicates = fileNameArray.reduce((acc, curr) => {
            acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
            return acc;
        }, {});



        const duplicatesArray: { name: string, count: number }[] = (Object.entries(duplicates) as [string, number][])
            .filter(arr => arr[1] > 1)
            .map(arr => ({ name: arr[0], count: arr[1] }));

        return !duplicatesArray.length
            ? null
            : {
                uniqueFileNames: { duplicatedFileNames: duplicatesArray }
            };
    }

    static fileType(types: string[] | RegExp): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {

            let regExp: RegExp;
            if (Array.isArray(types)) {
                const joinedTypes = types.join('$|^');
                regExp = new RegExp(`$${joinedTypes}^`, 'i');
            } else {
                regExp = types;
            }

            const fileArray = (control.value as File[]);



            const invalidFiles = fileArray.filter(
                file => !regExp.test(file.type)).map(file => ({ name: file.name, type: file.type }));

            return !invalidFiles.length
                ? null
                : {
                    fileType: {
                        requiredType: types.toString(),
                        actualTypes: invalidFiles
                    }
                };
        };
    }



    static maxFileCount(count: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const fileCount = control?.value ? (control.value as File[]).length : 0;
            const result = count >= fileCount;
            return result
                ? null
                : {
                    maxFileCount: {
                        maxCount: count,
                        actualCount: fileCount
                    }
                };
        };
    }

    static maxFileSize(bytes: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {


            const fileArray = (control.value as File[]);

            const invalidFiles = fileArray.filter(file => file.size > bytes).map(file => ({ name: file.name, size: file.size }));

            return !invalidFiles.length
                ? null
                : {
                    maxFileSize: {
                        maxSize: bytes,
                        actualSizes: invalidFiles
                    }
                };
        };
    }

    static maxTotalSize(bytes: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const size = control?.value ? (control.value as File[]).map(file => file.size).reduce((acc, i) => acc + i, 0) : 0;
            const result = bytes >= size;
            return result
                ? null
                : {
                    maxTotalSize: {
                        maxSize: bytes,
                        actualSize: size
                    }
                };
        };
    }
    static required(control: AbstractControl): ValidationErrors | null {
        const count = control?.value?.length;
        return count
            ? null
            : {
                required: true
            };
    }
}
