const render = require("mithril/render");
const template = require("../templates/sentences");

module.exports = class SentencesView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  setup() {
    this._element.addEventListener("click", function(e) {
      if (e.target.dataset.action === "more") {
        this.addSentences(20);
        this.reload();
      }
    }.bind(this));

    this._iterator = this._delegate.getSentencesIterator();
    this._sentences = [];
    this._more = true;

    this.addSentences(30);
  }

  addSentences(count) {
    for (let i = 0, j = 0; i < 1000 && j < count; i++) {
      let result = this._iterator.next();
      if (result.value) {
        this._sentences.push(result.value);
        j++;
      } else if (result.done) {
        this._more = false;
      }
    }
  }

  reload() {
    let vnode = template({
      sentences: this._sentences,
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      more: this._more
    });

    render(this._element, vnode);
  }
}
