import PropTypes from "prop-types";
import EditorComponent from "./editor_component.jsx";
import ResizeComponent from "./resize_component.jsx";
import AnalysisComponent from "./analysis_component.jsx";
import BlankSlateComponent from "./blank_slate_component.jsx";

export default function ApplicationComponent({
  spec,
  updateSpec,
  mode,
  edit,
  transform,
  analyze,
  error,
  grammar,
  path,
  transformStack,
  transformIndex,
  undoTransformation,
  redoTransformation,
  applyTransformation,
  loadExample,
  onResize
}) {
  return (
    <>
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
        applyTransformation={applyTransformation}
      />

      <ResizeComponent onResize={onResize} />

      {grammar ? (
        <AnalysisComponent grammar={grammar} path={path} />
      ) : (
        <BlankSlateComponent loadExample={loadExample} />
      )}
    </>
  );
}

ApplicationComponent.propTypes = {
  spec: PropTypes.string.isRequired,
  updateSpec: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired,
  transform: PropTypes.func.isRequired,
  analyze: PropTypes.func.isRequired,
  error: PropTypes.object,
  grammar: PropTypes.object,
  path: PropTypes.string.isRequired,
  transformStack: PropTypes.array.isRequired,
  transformIndex: PropTypes.number.isRequired,
  undoTransformation: PropTypes.func.isRequired,
  redoTransformation: PropTypes.func.isRequired,
  applyTransformation: PropTypes.func.isRequired,
  loadExample: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired
};
