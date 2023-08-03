import Grammar from "../grammar/index.js";
import parser from "../parser/index.js";

export function reducer(state, action) {
  switch (action.type) {
  case "setSpec":
    {
      return { ...state, spec: action.spec };
    }

  case "analyze":
    {
      const { productions, error } = parser(state.spec);

      if (error) {
        return { ...state, error };
      } else if (productions.length == 0) {
        return { ...state, grammar: undefined, error: undefined };
      } else {
        try {
          return { ...state, grammar: new Grammar(productions), error: undefined };
        } catch (error) {
          return { ...state, error };
        }
      }
    }

  case "edit":
    {
      return { ...state, mode: "edit", transformStack: undefined, transformIndex: undefined };
    }

  case "transform":
    {
      const { productions, error } = parser(state.spec);

      if (error) {
        return { ...state, grammar: state.grammar, error };
      } else if (productions.length == 0) {
        return { ...state, grammar: undefined, error: undefined };
      } else {
        try {
          const grammar = new Grammar(productions);

          return {
            ...state,
            grammar,
            error: undefined,
            mode: "transform",
            transformStack: [{ grammar }],
            transformIndex: 0
          };
        } catch (error) {
          return { ...state, error };
        }
      }
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
    {
      if (state.transformIndex > 0) {
        const transformIndex = state.transformIndex - 1;
        const grammar = state.transformStack[transformIndex].grammar;
        const spec = state.transformStack[transformIndex].grammar.toString();

        return { ...state, transformIndex, grammar, spec };
      } else {
        return state;
      }
    }

  case "redoTransformation":
    {
      if (state.transformIndex < state.transformStack.length - 1) {
        const transformIndex = state.transformIndex + 1;
        const grammar = state.transformStack[transformIndex].grammar;
        const spec = state.transformStack[transformIndex].grammar.toString();

        return { ...state, transformIndex, grammar, spec };
      } else {
        return state;
      }
    }
  }

  throw `Unhandled action type ${action.type}`;
}

export function init(spec = "") {
  return reducer({ spec, mode: "edit" }, { type: "analyze" });
}
