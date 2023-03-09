export default function() {
  return (
    <section className="blank-slate">
      <div>
        <p><b>Grammophone</b> is a tool for analyzing and transforming context-free grammars. To start, type a grammar in the box to the left and click Analyze or Transform.</p>
        <p>Grammars are written like this:</p>
        <pre>S -&gt; a S b .{"\n"}S -&gt; .</pre>
        <p>This grammar generates the language a<sup>n</sup>&nbsp;b<sup>n</sup>, where n&nbsp;≥&nbsp;0.</p>
      </div>
    </section>
  );
}
