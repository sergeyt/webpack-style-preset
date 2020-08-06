# webpack-style-preset
Easily add CSS, SASS to your webpack config

## Install

`npm install --save-dev webpack-style-preset`

for Yarn:

`yarn add --dev webpack-style-preset`

## Add to Webpack config

```javascript
const withSass = require("webpack-style-preset");

// your base webpack config goes here
const baseConfig = {
    /// ...
};

// extend webpack config
const config = withSass(baseConfig);

module.exports = config;
```
