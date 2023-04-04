import EditComponent from "./edit_component.jsx";
import ErrorComponent from "./error_component.jsx";
import AnalysisComponent from "./analysis_component.jsx";
import ModeComponent from "./mode_component.jsx";
import TransformComponent from "./transform_component.jsx";
import { copySpecLink } from "../app/spec_links.js";

export default function({ spec, updateSpec, mode, edit, transform, analyze, error, grammar, transformStack, transformIndex, undoTransformation, redoTransformation, applyTransformation }) {
  return (
    <div id="editor">
      <ModeComponent
        mode={mode}
        edit={edit}
        transform={transform}
        analyze={analyze}
        copySpecLink={() => copySpecLink(spec).catch(error => console.log(error))}
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
