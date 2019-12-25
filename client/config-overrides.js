const {
        override,
        addDecoratorsLegacy,
        useEslintRc
} = require("customize-cra");
module.exports = override(
        addDecoratorsLegacy(),
        useEslintRc('./.eslintrc')
)