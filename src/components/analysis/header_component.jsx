import { Fragment } from "react";

export default function({ path }) {
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

  return (
    <header className="header">
      <nav>{segments}</nav>
    </header>
  );
}
