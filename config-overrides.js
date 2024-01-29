const { resolve } = require("path")
const { override, useBabelRc, removeModuleScopePlugin, babelInclude } = require("customize-cra");

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([
    resolve("src"),
    resolve("/Common"),
  ])
);
