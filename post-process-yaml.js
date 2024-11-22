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

// Function to remove properties and sort keys
function removePropertiesAndSort(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        try {
            // Parse the YAML content
            let content = yaml.load(data);

            // Remove the "updated" and "created" properties if they exist
            delete content.updated;
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

            // Sort the keys of the object recursively
            const sortedContent = sortObjectKeys(content);

            // Convert the updated object back to YAML format
            const yamlContent = yaml.dump(sortedContent);

            // Write the modified content back to the file
            fs.writeFile(filePath, yamlContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file ${filePath}:`, err);
                } else {
                    // console.log(`File updated: ${filePath}`);
                }
            });
        } catch (e) {
            console.error(`Error parsing YAML file ${filePath}:`, e);
        }
    });
}

// Function to traverse directories and find .yaml files
function traverseDirectory(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // If it's a directory, recurse into it
                traverseDirectory(filePath);
            } else if (file.isFile() && path.extname(file.name) === '.yaml') {
                // If it's a .yaml file, process it
                removePropertiesAndSort(filePath);
            }
        });
    });
}

// Start traversing from the root directory
traverseDirectory(path.join(__dirname, 'content'));
