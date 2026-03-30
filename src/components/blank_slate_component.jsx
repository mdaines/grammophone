import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";

const EXAMPLES = [
  [
    "examples.arithmeticExpressions",
    `exp -> exp "+" term | term .
term -> term "*" factor | factor .
factor -> "(" exp ")" | number .
`
  ],
  [
    "examples.danglingElse",
    `statement -> if_stmt | other .
if_stmt -> if "(" cond ")" statement |
  if "(" cond ")" statement else statement .
cond -> true | false .
`
  ]
];

function Example({ name, src, loadExample }) {
  const { t } = useTranslation();
  return (
    <>
      <h3>{t(name)}</h3>
      <pre>
        <code>{src}</code>
      </pre>
      <p>
        <button onClick={() => loadExample(src)}>
          {t("blankSlate.analyze")}
        </button>
      </p>
    </>
  );
}

Example.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  loadExample: PropTypes.func.isRequired
};

export default function BlankSlateComponent({ loadExample }) {
  const { t } = useTranslation();
  return (
    <main id="blank-slate">
      <div className="message">
        <p>
          <Trans
            i18nKey="blankSlate.description"
            components={{ b: <b />, i: <i /> }}
          />
        </p>

        <h2>{t("blankSlate.exampleGrammars")}</h2>

        {EXAMPLES.map(([name, src]) => (
          <Example name={name} src={src} key={name} loadExample={loadExample} />
        ))}
      </div>
    </main>
  );
}

BlankSlateComponent.propTypes = {
  loadExample: PropTypes.func.isRequired
};
