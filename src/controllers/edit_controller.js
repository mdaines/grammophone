const languageSupport = require("../parser/language_support");
const linter = require("../parser/linter");

const { EditorView, basicSetup } = require("codemirror");

module.exports = class EditController {
  constructor(element) {
    this._element = element;
    this._element.id = "edit";

    this._editor = new EditorView({
      doc: "",
      extensions: [
        basicSetup,
        languageSupport(),
        linter
      ],
      parent: this._element
    });
  }

  getSpec() {
    return this._editor.state.doc.sliceString(0);
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    this._editor.dispatch({
      changes: {
        from: 0,
        to: this._editor.state.doc.length,
        insert: this._delegate.getSpec()
      }
    });
  }
}
