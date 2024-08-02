const fs = require('fs');
const yaml = require('js-yaml');
const { v4: uuidv4 } = require('uuid');

// generate 100 articles with category as content reference
for (let i=0; i < 100; i++) {
    const id = uuidv4();
    const obj = {
        entry: {
            _id: id,
            _name: 'A ' + i,
            _slug: 'a-' + i,
            type: 'article',
            fields: {
                category: {
                    type: 'contentReference',
                    value: '${#jptr:/ref-9a4f3f07-9f71-47c6-8498-4ee98fd1b35c-category/entries/0}'
                },
                articleTitle: {
                    type: 'text',
                    value: 'A ' + i
                }
            },
            _dataResources: {
              'ref-9a4f3f07-9f71-47c6-8498-4ee98fd1b35c-category': {
                type: 'uniformContentInternalReference',
                variables: {
                  entryIds: '0aa859b9-1d79-46b4-9757-2b5a8377560f'
                }
               }
            }
        }
    }
    const text = yaml.dump(obj);
  fs.writeFileSync('./content/entry/' + id + '.yaml', text);
}

return;