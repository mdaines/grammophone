import PropTypes from "prop-types";

export default function EditComponent({ spec, specChanged }) {
  return (
    <div id="edit">
      <div className="spec-wrap">
        <textarea
          className="spec"
          onChange={e => {
            specChanged(e.target.value);
          }}
          value={spec}
          placeholder="Type a grammar here..."
        />
      </div>
    </div>
  );
}

EditComponent.propTypes = {
  spec: PropTypes.string.isRequired,
  specChanged: PropTypes.func.isRequired
};
