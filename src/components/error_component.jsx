import PropTypes from "prop-types";

export default function ErrorComponent({ error }) {
  return (
    <div id="error">
      <code>{error ? error.toString() : ""}</code>
    </div>
  );
}

ErrorComponent.propTypes = {
  error: PropTypes.object
};
