import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function parseError(error, t) {
  if (!error) {
    return "";
  }
  if (error.key) {
    return t(error.key, error.options);
  }
  return error.toString();
}

export default function ErrorComponent({ error }) {
  const { t } = useTranslation();
  return (
    <div id="error">
      <code>{parseError(error, t)}</code>
    </div>
  );
}

ErrorComponent.propTypes = {
  error: PropTypes.object
};
