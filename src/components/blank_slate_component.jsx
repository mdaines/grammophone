const EXAMPLES = [
  ["Arithmetic Expressions", `exp -> exp "+" term | term .
term -> term "*" factor | factor .
factor -> "(" exp ")" | number .
`],
  ["Dangling Else", `statement -> if_stmt | other .
if_stmt -> if "(" cond ")" statement |
  if "(" cond ")" statement else statement .
cond -> true | false .
`]
];

function Example({ name, src, loadExample }) {
  return (
    <>
      <h3>{name}</h3>
      <pre><code>{src}</code></pre>
      <p><button onClick={() => loadExample(src)}>Analyze</button></p>
    </>
  );
}

export default function BlankSlateComponent({ loadExample }) {
  return (
    <main id="blank-slate">
      <div className="message">
        <p><b>Grammophone</b> is a tool for analyzing and transforming context-free grammars. To start, enter a grammar and click <i>Analyze</i> or <i>Transform</i>.</p>

        <h2>Example Grammars</h2>

        {EXAMPLES.map(([name, src]) => <Example name={name} src={src} key={name} loadExample={loadExample} />)}
      </div>
    </main>
  );
}
