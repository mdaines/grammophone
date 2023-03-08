import HeaderComponent from "./header_component.jsx";
import EditorComponent from "./editor_component.jsx";
import AnalysisComponent from "./analysis_component.jsx";

export default function({ spec, updateSpec, mode, edit, transform, analyze, error, grammar, path, transformStack, transformIndex, undoTransformation, redoTransformation, applyTransformation }) {
  return (
    <>
      <HeaderComponent />

      <EditorComponent
        mode={mode}
        edit={edit}
        transform={transform}
        analyze={analyze}
        error={error}
        spec={spec}
        updateSpec={updateSpec}
        grammar={grammar}
        transformStack={transformStack}
        transformIndex={transformIndex}
        undoTransformation={undoTransformation}
        redoTransformation={redoTransformation}
        applyTransformation={applyTransformation} />

      <AnalysisComponent grammar={grammar} path={path} />
    </>
  );
}
