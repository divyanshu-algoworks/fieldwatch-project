module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
              "targets": {
                "node": true
              }
            }
          ],
          "@babel/preset-react",
          "@babel/preset-flow"
        ],
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
  };
  