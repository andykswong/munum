module.exports = api => {
  const isTest = api.env('test');

  const config = {
    "presets": [
      ["@babel/preset-env", { "modules": false, "targets": { "node": true } }],
      ["@babel/preset-typescript"]
    ],
    "plugins": [
      "./babel.transform.cjs"
    ],
    "ignore": ["node_modules"],
    "comments": false,
    "minified": true
  };

  if (!isTest) {
    config.plugins.push(
      ["babel-plugin-add-import-extension", { "extension": "mjs" }]
    );
  }

  return config;
};
