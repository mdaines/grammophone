import PropTypes from "prop-types";
import EditComponent from "./edit_component.jsx";
import ErrorComponent from "./error_component.jsx";
import AnalysisComponent from "./analysis_component.jsx";
import ModeComponent from "./mode_component.jsx";
import TransformComponent from "./transform_component.jsx";
import { copySpecLink } from "../app/spec_links.js";

export default function EditorComponent({ spec, updateSpec, mode, edit, transform, analyze, error, grammar, transformStack, transformIndex, undoTransformation, redoTransformation, applyTransformation }) {
  return (
    <div id="editor">
      <ModeComponent
        mode={mode}
        edit={edit}
        transform={transform}
        analyze={analyze}
        copySpecLink={() => copySpecLink(spec)}
      />

      {error ? <ErrorComponent error={error} /> : []}

      {
        mode == "edit" ?
          <EditComponent spec={spec} specChanged={updateSpec} /> :
          <TransformComponent grammar={grammar} stack={transformStack} index={transformIndex} undo={undoTransformation} redo={redoTransformation} apply={applyTransformation} />
      }
    </div>
  );
}

EditorComponent.propTypes = {
  spec: PropTypes.string.isRequired,
  updateSpec: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired,
  transform: PropTypes.func.isRequired,
  analyze: PropTypes.func.isRequired,
  error: PropTypes.object,
  grammar: PropTypes.object,
  transformStack: PropTypes.array.isRequired,
  transformIndex: PropTypes.number.isRequired,
  undoTransformation: PropTypes.func.isRequired,
  redoTransformation: PropTypes.func.isRequired,
  applyTransformation: PropTypes.func.isRequired
};
