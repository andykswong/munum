module.exports = api => {
  const isTest = api.env('test');

  const config = {
    "assumptions": {
      "setPublicClassFields": true
    },
    "presets": [
      [
        "@babel/preset-env",
        {
          "modules": false,
          "targets": {
            "node": true
          },
          "include": [
            "@babel/plugin-proposal-class-properties"
          ]
        }
      ],
      ["@babel/preset-typescript"]
    ],
    "plugins": [
      "./babel.transform.cjs"
    ],
    "ignore": ["node_modules"],
    "comments": false,
    "minified": true,
    "sourceMaps": "inline"
  };

  if (!isTest) {
    config.plugins.push(
      ["babel-plugin-add-import-extension", { "extension": "js" }]
    );
  }

  return config;
};
