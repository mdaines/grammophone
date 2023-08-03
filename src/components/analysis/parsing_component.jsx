function formatClassification(cs, c, n) {
  if (cs[c].member) {
    return `The grammar is ${n}.`;
  } else {
    return <span className="conflict">{`Not ${n} — ${cs[c].reason}.`}</span>;
  }
}

import { Link } from "react-router-dom";

export const ID = "parsing";
export const TITLE = "Parsing Algorithms";

export default function({ grammar }) {
  const { classification } = grammar.calculations;

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <table className="parsing-algorithm-table">
        <tbody>
          <tr>
            <th scope="row">{"LL(1)"}</th>
            <td className="classification">{formatClassification(classification, "ll1", "LL(1)")}</td>
            <td>
              <Link to="ll1-table">{"Parsing table"}</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">{"LR(0)"}</th>
            <td className="classification">{formatClassification(classification, "lr0", "LR(0)")}</td>
            <td>
              <Link to="lr0-automaton">{"Automaton"}</Link>
              {", "}
              <Link to="lr0-table">{"Parsing table"}</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">{"SLR(1)"}</th>
            <td className="classification">{formatClassification(classification, "slr1", "SLR(1)")}</td>
            <td>
              <Link to="slr1-table">{"Parsing table"}</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">{"LR(1)"}</th>
            <td className="classification">{formatClassification(classification, "lr1", "LR(1)")}</td>
            <td>
              <Link to="lr1-automaton">{"Automaton"}</Link>
              {", "}
              <Link to="lr1-table">{"Parsing table"}</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">{"LALR(1)"}</th>
            <td className="classification">{formatClassification(classification, "lalr1", "LALR(1)")}</td>
            <td>
              <Link to="lalr1-automaton">{"Automaton"}</Link>
              {", "}
              <Link to="lalr1-table">{"Parsing table"}</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
