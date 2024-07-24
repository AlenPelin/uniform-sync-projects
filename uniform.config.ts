import type { CLIConfiguration } from '@uniformdev/cli';

const config: CLIConfiguration = {
  serialization: {
    entitiesConfig: {
      // system
      locale: {},
      projectMapDefinition: {},
      
      // model
      category: {},
      component: {},
      contentType: {},
      dataType: {},
      
      // patterns
      compositionPattern: { publish: true },
      entryPattern: { publish: true },
      pattern: { publish: true },
      
      // content
      projectMapNode: {},
      composition: { publish: true },
      entry: { publish: true },

      // assets may take a lot of time
      asset: {},
      
      // optimize 

      // aggregate: {},
      // enrichment: {},
      // quirk: {},
      // redirect: {},
      // signal: {},
      // test: {},
    },
    directory: './content',
    format: 'yaml',
  },
};

module.exports = config;
