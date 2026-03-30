import PropTypes from "prop-types";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export default function PathComponent({ path }) {
  const { t } = useTranslation();
  const segments = path.map((segment, index) => {
    if (segment.path) {
      return (
        <Fragment key={index}>
          <a href={"#" + segment.path}>{t(segment.title)}</a>
          {" / "}
        </Fragment>
      );
    } else {
      return (
        <Fragment key={index}>
          <b key={segment.path}>{t(segment.title)}</b>
        </Fragment>
      );
    }
  });

  return <nav id="path">{segments}</nav>;
}

PathComponent.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};
