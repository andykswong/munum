module.exports = api => {
  const isTest = api.env('test');

  const config = {
    assumptions: {
      noDocumentAll: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      privateFieldsAsSymbols: true,
      setSpreadProperties: true,
      setPublicClassFields: true
    },
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            node: 20
          }
        }
      ],
      ['@babel/preset-typescript']
    ],
    plugins: [
      '@babel/plugin-proposal-explicit-resource-management',
      './babel.transform.cjs'
    ],
    ignore: ['node_modules'],
    comments: false,
    minified: true,
    sourceMaps: 'inline'
  };

  if (!isTest) {
    config.ignore.push('**/__tests__/**');
    config.plugins.push(
      ['babel-plugin-add-import-extension', { extension: 'js' }]
    );
  }

  return config;
};
