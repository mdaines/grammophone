import EditComponent from "./edit_component.js";
import ErrorComponent from "./error_component.js";
import AnalysisComponent from "./analysis_component.js";
import ModeComponent from "./mode_component.js";
import TransformComponent from "./transform_component.js";

export default function({ spec, updateSpec, mode, edit, transform, analyze, error, grammar, path, transformStack, transformIndex, undoTransformation, redoTransformation, applyTransformation }) {
  return (
    <>
      <div id="master">
        <ModeComponent mode={mode} edit={edit} transform={transform} analyze={analyze} />

        {error ? <ErrorComponent error={error} /> : []}

        {
          mode == "edit" ?
            <EditComponent spec={spec} specChanged={updateSpec} /> :
            <TransformComponent grammar={grammar} stack={transformStack} index={transformIndex} undo={undoTransformation} redo={redoTransformation} apply={applyTransformation} />
        }
      </div>

      <AnalysisComponent grammar={grammar} path={path} />
    </>
  );
}
