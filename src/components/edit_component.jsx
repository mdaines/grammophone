import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function EditComponent({ spec, specChanged }) {
  const { t } = useTranslation();
  return (
    <div id="edit">
      <div className="spec-wrap">
        <textarea
          className="spec"
          onChange={e => {
            specChanged(e.target.value);
          }}
          value={spec}
          placeholder={t("editor.placeholder")}
        />
      </div>
    </div>
  );
}

EditComponent.propTypes = {
  spec: PropTypes.string.isRequired,
  specChanged: PropTypes.func.isRequired
};
