import PropTypes from "prop-types";
import { Fragment } from "react";

export default function PathComponent({ path }) {
  const segments = path.map((segment, index) => {
    if (segment.path) {
      return (
        <Fragment key={index}>
          <a href={"#" + segment.path}>{segment.title}</a>
          {" / "}
        </Fragment>
      );
    } else {
      return (
        <Fragment key={index}>
          <b key={segment.path}>{segment.title}</b>
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
