const { render } = require("preact");
const { useReducer, useEffect } = require("preact/hooks");
const { reducer, init } = require("./reducer.js");
const ApplicationComponent = require("../components/application_component.js");

function App() {
  const [state, dispatch] = useReducer(reducer, "# Type a grammar here:\n\n", init);

  function onHashChange() {
    let path = window.location.hash.slice(1);
    if (path == "") {
      path = "/";
    }

    dispatch({ type: "setPath", path });
  }

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <ApplicationComponent
      spec={state.spec}
      error={state.error}
      grammar={state.grammar}
      path={state.path}
      mode={state.mode}
      transformStack={state.transformStack}
      transformIndex={state.transformIndex}
      updateSpec={(newValue) => { dispatch({ type: "setSpec", spec: newValue }); }}
      edit={() => dispatch({ type: "edit" })}
      transform={() => dispatch({ type: "transform" })}
      analyze={() => dispatch({ type: "analyze" })}
      undoTransformation={() => { dispatch({ type: "undoTransformation" }); }}
      redoTransformation={() => { dispatch({ type: "redoTransformation" }); }}
      applyTransformation={(t) => { dispatch({ type: "applyTransformation", transformation: t }); }}
    />
  );
}

render(<App />, document.getElementById("app"));
