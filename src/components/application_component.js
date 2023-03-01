const EditComponent = require("./edit_component.js");
const ErrorComponent = require("./error_component.js");
const AnalysisComponent = require("./analysis_component.js");
const ModeComponent = require("./mode_component.js");
const TransformComponent = require("./transform_component.js");

module.exports = function({ spec, updateSpec, mode, edit, transform, analyze, error, grammar, path, transformStack, transformIndex, undoTransformation, redoTransformation, applyTransformation }) {
  return (
    <>
      <div id="master">
        <ModeComponent mode={mode} edit={edit} transform={transform} analyze={analyze} />

        <ErrorComponent error={error} />

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
