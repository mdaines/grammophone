const ExternalTokenizer = require("@lezer/lr").ExternalTokenizer;
const symbolChars = require("./rules.terms").symbolChars;

const space = [
  9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196,
  8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288
];
const hyphen = 0x2D, gt = 0x3E, pipe = 0x7C, stop = 0x2E, hash = 0x23;

module.exports.getSymbolChars = new ExternalTokenizer(function(input) {
  for (let i = 0;; i++) {
    if (
      (input.next < 0) ||
      (space.indexOf(input.next) > -1) ||
      (input.next == hyphen && input.peek(1) == gt) ||
      (input.next == pipe) ||
      (input.next == stop) ||
      (input.next == hash)
    ) {
      if (i > 0) {
        input.acceptToken(symbolChars);
      }
      break;
    } else {
      input.advance();
    }
  }
});
