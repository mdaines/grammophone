import { useReducer, useEffect } from "react";
import { reducer, init } from "./reducer.js";
import ApplicationComponent from "../components/application_component.jsx";

export default function App({ initialSpec }) {
  const [state, dispatch] = useReducer(reducer, initialSpec, init);

  function onHashChange() {
    let path = window.location.hash.slice(1);
    if (path == "") {
      path = "/";
    }

    dispatch({ type: "setPath", path });
  }

  useEffect(() => {
    window.location.hash = state.path;
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
