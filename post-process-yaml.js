const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Function to sort object keys recursively
function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return if not an object
    }

    if (Array.isArray(obj)) {
        // If it's an array, sort each element
        return obj.map(sortObjectKeys);
    }

    let keys = [...Object.keys(obj)];
    let keysFirst = [];
    let keysLast = [];

    const first = [
        '$schema',
        '_id',
        'id',
        '_name',
        'name',
        '_slug',
        'slug',
        '_source',
        'thumbnail',
        '_thumbnail',
        'localizable',
        'type',
        'typeConfig',
        'value',
        '_dataResources',
    ];

    const last = [
        'parameters',
        'fields',
        'slots',
        'defaults',
        'children',
    ];  
    
    // put 'id', 'name', ..., 'parameters' and then 'slots'
    first.forEach(k => {
        const pos = keys.indexOf(k);
        if (pos >= 0) {
            keysFirst.push(k);  
            keys.splice(pos, 1);
        }
    });

    last.forEach(k => {
        const pos = keys.indexOf(k);
        if (pos >= 0) {
            keysLast.push(k);  
            keys.splice(pos, 1);
        }
    });

    keys.sort();
    const keysSorted = [...keysFirst, ...keys, ...keysLast];

    // Sort the object keys and recursively sort each value
    return keysSorted.reduce((result, key) => {
        result[key] = sortObjectKeys(obj[key]);
        return result;
    }, {});
}

// Function to sort object keys recursively
function fixIntegers(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return if not an object
    }

    if (Array.isArray(obj)) {
        // If it's an array, sort each element
        return obj.map(fixIntegers);
    }

    let keys = [...Object.keys(obj)];
    
    keys.forEach(k => {
        const v = obj[k];
        if (typeof v === 'string') {            
            if (!isNaN(v)) {
                const i = parseInt(v);
                if (!isNaN(parseInt(v))) { 
                    obj[k] = i;
                }
            }
        } else {
            fixIntegers(obj[k]);
        }
    });
}

function getYamlContent(data, filePath) {  
    try {  
        // Parse the YAML content
        return yaml.load(data);
    } catch (e) {
        console.error(`Error parsing YAML file ${filePath}:`, e);

        return undefined;
    }
}

// Function to remove properties and sort keys
function removePropertiesAndSort(filePath) {
    // fs.readFile(filePath, 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(`Error reading file ${filePath}:`, err);
    //         return;
    //     }
    let data = fs.readFileSync(filePath, { encoding: 'utf8' });

        console.log('Post-processing file ' + filePath);
        const crLf = true;

        // remove createdAt: '{{timestamp}}'
        data = data.replace(/^\s*createdAt:.*$/gm, '');

        const content = getYamlContent(data, filePath);
        if (!content) {
            return;
        }

        try {
            // Remove the "updated" and "created" properties if they exist
            if (content.modified)  
                delete content.modified;

            if (content.updated)
                delete content.updated;

            if (content.created)
                delete content.created;

            if (content.parameters) {
                content.parameters.map(x => {
                    if (x?.typeConfig === null) {
                        delete x.typeConfig;
                    }
                });
            }

            if (content.fields) {
                content.fields.map(x => {
                    if (x?.typeConfig === null) {
                        delete x.typeConfig;
                    }
                });
            }

            // bug in platform prevents this
            // fixIntegers(content);

            // Sort the keys of the object recursively
            const sortedContent = sortObjectKeys(content);

            // Convert the updated object back to YAML format
            const yamlContent = yaml.dump(sortedContent);

            data = yamlContent;
            data = crLf ? data.replace(/\r?\n/g, '\r\n') : data;

            // Write the modified content back to the file
            fs.writeFile(filePath, data, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file ${filePath}:`, err);
                } else {
                    // console.log(`File updated: ${filePath}`);
                }
            });
        } catch (e) {
            console.error(`Failed to prost-process YAML file ${filePath}:`, e);
        }
    // });
}

// Function to traverse directories and find .yaml files
function traverseDirectory(dir, notFirstLevelDir) {
    // fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    //     if (err) {
    //         console.error(`Error reading directory ${dir}:`, err);
    //         return;
    //     }
    const files = fs.readdirSync(dir, { withFileTypes: true })
        files.forEach(file => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // If it's a directory, recurse into it
                traverseDirectory(filePath, true);
            } else if (notFirstLevelDir && file.isFile() && path.extname(file.name) === '.yaml') {
                // If it's a .yaml file, process it
                removePropertiesAndSort(filePath);
            }
        });
    });
    //});
}

// Start traversing from the root directory
traverseDirectory(path.join(__dirname, 'content'));
