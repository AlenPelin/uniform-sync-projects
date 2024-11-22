import type { CLIConfiguration } from '@uniformdev/cli';

const config: CLIConfiguration = {
  serialization: {
    directory: './content',
    format: 'yaml',
    
    // 'create' is much faster if you don't need to update elements
    mode: 'createOrUpdate',
    
    entitiesConfig: {
      // ======================== Uniform Deploy =========================== //

      // system
      locale:               { },
      
      // models
      category:             { },
      component:            { },
      contentType:          { },
      dataType:             { },
      
      // patterns
      compositionPattern:   { publish: true },
      entryPattern:         { publish: true },
      pattern:              { publish: true },
      
      // content
      composition:          { publish: true },
      entry:                { publish: true },

      // project map
      projectMapDefinition: { },
      projectMapNode:       { },

      /* DISABLED BY DEFAULT !!! 
      // assets (may take a lot of time, consider disabling)
      asset:                { },
      */
      
      // optimize 
      // ======================= Uniform Optimize ========================== //

      /* DISABLED BY DEFAULT !!!    
      aggregate:            { },
      enrichment:           { },
      quirk:                { },
      redirect:             { },
      signal:               { },
      test:                 { },
      */
    },
    directory: './content',
    format: 'yaml',
  },
};

module.exports = config;
