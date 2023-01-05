const { parser } = require("./rules");
const { LRLanguage, LanguageSupport } = require("@codemirror/language");
const { styleTags, tags } = require("@lezer/highlight");

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Symbol: tags.literal,
      QuotedSymbol: tags.string,
      LineComment: tags.lineComment
    })
  ]
});

const language = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { line: "#" }
  }
});

module.exports = function languageSupport() {
  return new LanguageSupport(language);
}
