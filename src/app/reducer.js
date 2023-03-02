const Grammar = require("../grammar");
const parser = require("../parser");

function reducer(state, action) {
  switch (action.type) {
  case "setSpec":
    return { ...state, spec: action.spec };

  case "setPath":
    return { ...state, path: action.path };

  case "analyze":
    try {
      const grammar = new Grammar(parser(state.spec));

      return { ...state, grammar, error: null };
    } catch (e) {
      return { ...state, error: e };
    }

  case "edit":
    return { ...state, mode: "edit" };

  case "transform":
    try {
      const grammar = new Grammar(parser(state.spec));

      return {
        ...state,
        grammar,
        error: null,
        mode: "transform",
        transformStack: [{ grammar }],
        transformIndex: 0
      };
    } catch (e) {
      return { ...state, error: e };
    }

  case "applyTransformation":
    {
      const item = {
        grammar: state.grammar.transform(action.transformation),
        transformation: action.transformation
      };

      const transformIndex = state.transformIndex + 1;
      const transformStack = state.transformStack.slice(0, transformIndex).concat(item);

      return {
        ...state,
        grammar: item.grammar,
        spec: item.grammar.toString(),
        transformIndex,
        transformStack
      }
    }

  case "undoTransformation":
    if (state.transformIndex > 0) {
      const transformIndex = state.transformIndex - 1;
      const grammar = state.transformStack[transformIndex].grammar;
      const spec = state.transformStack[transformIndex].grammar.toString();

      return { ...state, transformIndex, grammar, spec };
    } else {
      return state;
    }

  case "redoTransformation":
    if (state.transformIndex < state.transformStack.length - 1) {
      const transformIndex = state.transformIndex + 1;
      const grammar = state.transformStack[transformIndex].grammar;
      const spec = state.transformStack[transformIndex].grammar.toString();

      return { ...state, transformIndex, grammar, spec };
    } else {
      return state;
    }

  default:
    throw `Unhandled action type ${action.type}`;
  }
}

function init(spec = "") {
  return { spec: spec, path: "/", mode: "edit" };
}

module.exports.reducer = reducer;
module.exports.init = init;
